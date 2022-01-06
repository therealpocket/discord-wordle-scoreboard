import { Client, Guild, Message, TextChannel, User, MessageEmbed } from "discord.js";
import wordleScoreboardSchema from "../models/wordle-scoreboard-schema";

// const wordleScoreboardData = {} as {
//     // guildID: [channel, timezone, rule, job]
//     [key: string]: [TextChannel, string, any, any]
// }



export default async (client: Client) => {
    // listen for posted wordle score
    client.on('messageCreate', (message) => {

        if (!message.guild) return;
        const wordleRegex = /Wordle \d{3} ([123456X])\/6\n{0,2}[⬛🟩🟨⬜]{5}/;
        const wordleMessage = message.content.match(wordleRegex);

        if (!wordleMessage) return;

        // Determine number of points
        let wordlePoints: Number;
        if (wordleMessage[1] == 'X') {
            wordlePoints = 0;
        } else {
            wordlePoints = 7 - parseInt(wordleMessage[1]);
        }

        // Find existing scores 
        wordleScoreboardSchema.find({
            userId: message.author.id,
            guildId: message.guild.id
        }, (err, data) => {

            let totalScore: Number;
            let totalPlays: Number;

            // no existing score for user (create new document)
            if (!data.length) {
                totalScore = wordlePoints;
                totalPlays = 1;
            } else {
                totalScore = data[0].score + wordlePoints;
                totalPlays = data[0].plays + 1;
            }

            updateScoreboardScore(message.guild?.id, message.author?.id, totalScore, totalPlays);

            message.reply({
                content: `${wordlePoints} for ${message.author}! (${totalScore} pts, ${totalPlays} plays)`
            })

            console.log(`New score detected by ${message.author}: ${wordlePoints} pts.`)
        })
    })
}

export const updateScoreboardScore = async (guildId: any, userId: String, totalScore: Number, totalPlays: Number) => {
    await wordleScoreboardSchema.findOneAndUpdate({
        userId: userId,
        guildId: guildId
    }, {
        userId: userId,
        guildId: guildId,
        score: totalScore,
        plays: totalPlays
    }, {
        upsert: true
    })
}

export const generateScoreboardEmbed = (client: Client, guildScores: any, title: String) => {


    const sortedGuildScores = guildScores.sort((a: any, b: any) => (a.score < b.score ? 1 : -1))

    const embedPlayerColumn = [];
    const embedScoreColumn = [];
    const embedAvgColumn = [];

    for (const score of sortedGuildScores) {
        client.users.fetch(score.userId);
        embedPlayerColumn.push(client.users.cache.get(score.userId));
        embedScoreColumn.push(score.score);

        embedAvgColumn.push(Math.abs((parseFloat(score.score) / parseFloat(score.plays)) - 7).toFixed(1).replace('.0', '') + '/6')
    }

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`:green_square: :green_square: :green_square: ${title} :green_square: :green_square: :green_square:`)
        .setURL('https://www.powerlanguage.co.uk/wordle/')
        .setDescription('https://www.powerlanguage.co.uk/wordle/')
        .addFields(
            { name: 'Player', value: embedPlayerColumn.join('\n'), inline: true },
            { name: 'Score', value: embedScoreColumn.join('\n'), inline: true },
            { name: 'Avg', value: `${embedAvgColumn.join('\n')}`, inline: true }
        );

    return {
        embed: embed,
        players: embedPlayerColumn
    }
}



// specific to WOKcommands
export const config = {
    displayName: 'Wordle Scoreboard',
    dbName: 'WORDLE_SCOREBOARD'
}