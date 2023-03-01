const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('question')
		.setDescription('Answers your question about the wordlebot!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question about the wordlebot you want answered')
                .setRequired(true)),


	async execute(interaction) {
        await interaction.reply("WordleBot is open source! You can find the source code here: https://github.com/davidthehat/DiscordWordleBot. All possible questions about the bot can be answered by reading the source code.");
    }
    
};