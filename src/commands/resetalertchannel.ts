import DiscordJS, { Client, CommandInteraction } from 'discord.js'
import { ICommand } from "wokcommands";
import wordleChannelConfigSchema from '../models/wordle-channel-config-schema';
import wordleChannelAlert, { loadWordleChannelConfig } from '../features/wordle-channel-alert';


export default {
    category: 'Configuration',
    description: 'Resets the Wordle channel',

    permissions: ['ADMINISTRATOR'],
    slash: true,

    callback: async ({ guild, interaction, client, member }) => {
        if (!guild) {
            return interaction.reply({
                content: `Please use this command within a server`,
                ephemeral: true
            })
        }

        await wordleChannelConfigSchema.findByIdAndDelete({
            _id: guild.id
        })

        loadWordleChannelConfig(client, guild);

        return interaction.reply({
            content: `Wordle alert channel reset`,
            ephemeral: true
        })
    }
} as ICommand