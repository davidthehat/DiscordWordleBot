const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordleGPT')
		.setDescription('Answers your question AS the wordlebot!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your prompt for the wordlebot')
                .setRequired(true)),


	async execute(interaction) {
        
    }
    
};