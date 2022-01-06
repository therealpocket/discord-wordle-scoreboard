import { Client, Guild, TextChannel } from "discord.js";
import wordleChannelConfigSchema from "../models/wordle-channel-config-schema";

const wordleChannelData = {} as {
    // guildID: [channel, timezone, rule, job]
    [key: string]: [TextChannel, string, any, any]
}

// once wordle channel config written to db, load it into memeory
export const loadWordleChannelConfig = async (clint: Client, guild: Guild) => {
    console.log(`Loading config for ${guild.id} from DB`)
    const schedule = require('node-schedule');
    const results = await wordleChannelConfigSchema.findById(guild.id);
    // no config data for server
    if (!results) {
        return
    }

    const { channelId, timezone } = results;
    const channel = guild.channels.cache.get(channelId) as TextChannel;

    // check for existing schedule rule and jobs
    let rule: any;
    let job: any;
    if (wordleChannelData[guild.id]) {
        rule = wordleChannelData[guild.id][2];
        // cancel any existing jobs
        wordleChannelData[guild.id][3].cancel();
    }
    else {
        // set rules
        rule = new schedule.RecurrenceRule();
        rule.hour = 11;
        rule.minute = 25;
        rule.tz = timezone;
    }

    job = schedule.scheduleJob(rule, () => {
        channel.send({
            content: 'msg'
        })
    })

    let data = wordleChannelData[guild.id] = [channel, timezone, rule, job]
}


export default async (client: Client) => {

    const scanGuilds = () => {
        const connectedGuildList = client.guilds.cache.map(guild => guild);
        // for every connected guild, load any config from db
        for (const connectedGuild of connectedGuildList) {
            loadWordleChannelConfig(client, connectedGuild);
        }
    }

    scanGuilds(); // scan guilds at startup to grab any config from db
    setInterval(scanGuilds, 1000 * 60 * 30);
}

// specific to WOKcommands
export const config = {
    displayName: 'Wordle Channel Alert',
    dbName: 'WORDLE_CHANNEL_ALERT'
}