import { ICommand } from "wokcommands";
import wordleScoreboard, { generateScoreboardEmbed } from "../features/wordle-scoreboard";
import wordleScoreboardSchema from "../models/wordle-scoreboard-schema";
import fetch from 'node-fetch';


export default {
    category: 'Scoreboard',
    description: 'Just praise me',
    slash: true,
    callback: async ({ client, guild, interaction }) => {
        await interaction.deferReply();

        if (!guild) {
            return interaction.reply({
                content: `Please use this command within a server`,
                ephemeral: true
            })
        }

        const guildScores = await wordleScoreboardSchema.find({
            guildId: guild.id
        })

        const guildScoresEmbed = generateScoreboardEmbed(client, guildScores, 'SCOREBOARD');



        const response = await fetch('https://complimentr.com/api');
        const data = await response.json();

        console.log(data);

        await interaction.editReply({
            content: `👑 BOW DOWN TO ${interaction.member}. ${data.compliment.toUpperCase()} 👑`
        });

    }
} as ICommand