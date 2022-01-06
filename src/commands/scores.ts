import { ICommand } from "wokcommands";
import wordleScoreboard, { generateScoreboardEmbed } from "../features/wordle-scoreboard";
import wordleScoreboardSchema from "../models/wordle-scoreboard-schema";


export default {
    category: 'Scoreboard',
    description: 'Wordle Scoreboard',
    slash: true,
    // testOnly: true,
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
            embeds: [guildScoresEmbed.embed]
        });

    }
} as ICommand