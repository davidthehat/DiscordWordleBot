const { SlashCommandBuilder } = require('discord.js');
const wordle = require('../wordle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playwordle')
		.setDescription("Plays todays wordle and replies with the bot's results!"),
	async execute(interaction) {
        x = await wordle.playWordle(" :robot:");
        await interaction.reply(x);
	},
};