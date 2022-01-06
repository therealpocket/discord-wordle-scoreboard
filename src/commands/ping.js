"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    category: 'testing',
    description: 'replies w pong',
    slash: true,
    testOnly: true,
    callback: ({ interaction }) => {
        interaction.reply('Pong');
    }
};
