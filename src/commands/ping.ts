import { ICommand } from "wokcommands";

export default {
    category: 'testing',
    description: 'replies w pong',
    slash: true,
    testOnly: true,
    callback: ({ interaction }) => {
        interaction.reply('Pong')
    }
} as ICommand