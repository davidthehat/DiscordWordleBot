const { SlashCommandBuilder } = require('discord.js');
//include wordle module
const wordle = require('../wordle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordleword')
		.setDescription('Replies with todays wordle word!')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year to get the wordle word for')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('The month to get the wordle word for')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('The day to get the wordle word for')
                .setRequired(false)),


	async execute(interaction) {
        //fetch wordle word
        try {
            interaction.options.getInteger("year") == null ? year = undefined : year = interaction.options.getInteger("year");
            interaction.options.getInteger("month") == null ? month = undefined : month = interaction.options.getInteger("month");
            interaction.options.getInteger("day") == null ? day = undefined : day = interaction.options.getInteger("day");
            var date = new Date();
            if (year != undefined) {
                date.setFullYear(year);
            }
            if (month != undefined) {
                date.setMonth(month - 1);
            }
            if (day != undefined) {
                date.setDate(day);
            }
            var wordleData = await wordle.fetchWordleData(date);
        }
        catch (error) {
            if (error.response.status == 404) {
                await interaction.reply(`No wordle found for ${date.toDateString()}`);
                return;
            }
            await interaction.reply("Error: " + error.message);
            return;
        }
        //reply with wordle word in spolier tag
        await interaction.reply(`The word for Wordle ${wordleData.days_since_launch} is: ||${wordleData.solution.toUpperCase()}||`);
	},
};