import { Client, Guild, Message, TextChannel, User, MessageEmbed } from "discord.js";
import wordleScoreboardSchema from "../models/wordle-scoreboard-schema";

import fetch from 'node-fetch';


// const wordleScoreboardData = {} as {
//     // guildID: [channel, timezone, rule, job]
//     [key: string]: [TextChannel, string, any, any]
// }



export default async (client: Client) => {
    // listen for posted wordle score
    client.on('messageCreate', async (message) => {

        const response = await fetch('https://complimentr.com/api');
        const compliment = await response.json();

        if (!message.guild) return;
        const wordleRegex = /Wordle \d{3} ([123456X])\/6\**\n{0,2}[⬛🟩🟨⬜]{5}/;
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

            // custom code for my server sorry

            let date2: any = new Date();
            let date1: any = new Date('01/03/2022');

            var diff = Math.abs(date1.getTime() - date2.getTime());
            var diffDays = Math.ceil(diff / (1000 * 3600 * 24));




            // no existing score for user (create new document)
            if (!data.length) {
                totalScore = wordlePoints;
                totalPlays = 1;
            } else {
                totalScore = data[0].score + wordlePoints;
                totalPlays = data[0].plays + 1;
            }


            if (totalPlays >= diffDays) {
                message.reply({ content: `🚨 Error - there should only be ${diffDays - 1} attempts today (You are at ${totalPlays} attempts).` })
            } else {

                updateScoreboardScore(message.guild?.id, message.author?.id, totalScore, totalPlays);

                let golf;

                switch (parseInt(wordleMessage[1])) {
                    case 6:
                        golf = 'DOUBLE BOGEY!';
                        break;
                    case 5:
                        golf = 'BOGEY!';
                        break;
                    case 4:
                        golf = 'PAR!';
                        break;
                    case 3:
                        golf = 'BIRDIE!';
                        break;
                    case 2:
                        golf = 'EAGLE!';
                        break;
                    case 1:
                        golf = 'HOLE IN ONE!';
                        break;
                }


                message.reply({
                    content: `${message.author} ${compliment.compliment}. ${wordlePoints} pts! (${totalScore} pts, ${totalPlays} plays)`
                })
                console.log(`New score detected by ${message.author}: ${wordlePoints} pts.`)
            }

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

    let topScore = 0;
    let topPlayers = [];

    for (const score of sortedGuildScores) {
        client.users.fetch(score.userId);
        embedPlayerColumn.push(client.users.cache.get(score.userId));
        embedScoreColumn.push(score.score);

        if (score.score >= topScore) {
            topScore = score.score;
            topPlayers.push(client.users.cache.get(score.userId));
        }

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


    function shuffleArray(array: any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(topPlayers);

    return {
        embed: embed,
        players: embedPlayerColumn,
        topPlayers: topPlayers
    }
}



// specific to WOKcommands
export const config = {
    displayName: 'Wordle Scoreboard',
    dbName: 'WORDLE_SCOREBOARD'
}