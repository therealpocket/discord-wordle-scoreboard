import { ICommand } from 'wokcommands'

export default {
    category: 'Scoreboard',
    description: 'Replies with pong', // Required for slash commands

    slash: true,
    testOnly: true, // Only register a slash command for the testing guilds

    callback: ({ message, interaction }) => {
        let reply = 'Pong!'

        interaction.reply({
            content: reply,
            ephemeral: true
        })
    },
} as ICommand