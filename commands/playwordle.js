const { SlashCommandBuilder } = require('discord.js');
const wordle = require('../wordle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playwordle')
		.setDescription("Plays todays wordle and replies with the bot's results!")
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The mode to play the wordle in')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to play the wordle with')
                .setRequired(false)),

	async execute(interaction) {
        if (interaction.options.getString('mode') == null) {
            var mode = " :robot:";
        } else {
            var mode = interaction.options.getString('mode');
        }
        if (interaction.options.getString('word') == null) {
            var word = undefined;
        } else {
            var word = interaction.options.getString('word');
        }
        try {
            var x = await wordle.playWordle(mode, word);
        }
        catch (error) {
            await interaction.reply("Error: " + error.message);
            return;
        }
        await interaction.reply(x);
	},
};