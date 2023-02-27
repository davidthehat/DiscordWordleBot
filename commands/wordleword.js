const { SlashCommandBuilder } = require('discord.js');
//include wordle module
const wordle = require('../wordle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordleword')
		.setDescription('Replies with todays wordle word!'),
	async execute(interaction) {
        //fetch wordle word
        try {
            var wordleWord = await wordle.fetchWordleWord();
        }
        catch (error) {
            await interaction.reply("Error: " + error.message);
            return;
        }
        //reply with wordle word in spolier tag
        await interaction.reply("Today's Wordle word is: ||" + wordleWord + "||");
	},
};