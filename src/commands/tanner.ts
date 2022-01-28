import { ICommand } from "wokcommands";
import wordleScoreboard, { generateScoreboardEmbed } from "../features/wordle-scoreboard";
import wordleScoreboardSchema from "../models/wordle-scoreboard-schema";


export default {
    category: 'Scoreboard',
    description: 'Just praise tanner',
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

        await interaction.editReply({
            content: `👑 BOW DOWN TO ${client.users.cache.get('329439633647730691')} NOT BECAUSE HE HAS THE HIGHEST SCORE BUT BECAUSE HE'S JUST A GOOD GUY 👑`
        });

    }
} as ICommand