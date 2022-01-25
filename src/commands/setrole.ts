import DiscordJS, { Client, CommandInteraction } from 'discord.js'
import { ICommand } from "wokcommands";
import wordleChannelConfigSchema from '../models/wordle-channel-config-schema';
import wordleChannelAlert, { loadWordleChannelConfig } from '../features/wordle-channel-alert';


export default {
    category: 'Configuration',
    description: 'Sets the Wordle role',

    permissions: ['ADMINISTRATOR'],

    minArgs: 1,
    expectedArgs: '<role>',

    slash: true,
    testOnly: true,

    options: [
        {
            name: 'role',
            description: 'Target Role',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.CHANNEL
        }
    ],

    callback: async ({ guild, interaction, client, member }) => {
        if (!guild) {
            return interaction.reply({
                content: `Please use this command within a server`,
                ephemeral: true
            })
        }
        const targetChannel = interaction.options.getChannel('channel')

        if (!targetChannel || targetChannel.type !== 'GUILD_TEXT') {
            return interaction.reply({
                content: `Please tag a text channel`,
                ephemeral: true
            })
        }

        let timezone = interaction?.options.getString('timezone')

        // TODO: check if valid timezone

        await wordleChannelConfigSchema.findByIdAndUpdate({
            _id: guild.id
        }, {
            _id: guild.id,
            timezone,
            channelId: targetChannel.id
        }, {
            upsert: true
        })

        loadWordleChannelConfig(client, guild);

        return interaction.reply({
            content: `New challenges will be posted in ${targetChannel} at 00:00 ${timezone}`,
            ephemeral: true
        })
    }
} as ICommand