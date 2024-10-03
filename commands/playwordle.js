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
                .setDescription('The word to play the wordle with (overrides date options)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year to solve the wordle for')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('The month to solve the wordle for')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('The day to solve the wordle for')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('revealed')
                .setDescription('Whether the wordle is revealed or not. Defaults to false.')
                .setRequired(false)),

        

	async execute(interaction) {
        await interaction.deferReply();
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

        if (word == undefined) {
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
            try {
                var wordleData = await wordle.fetchWordleData(date);
                word = wordleData.solution;
            } catch (error) {
                if (error.response.status == 404) {
                    await interaction.editReply(`No wordle found for ${date.toDateString()}`);
                    return;
                }
                await interaction.editReply("Error");
                console.log(error);
                return;
            }

        }

        if (interaction.options.getBoolean('revealed') == null) {
            var revealed = false;
        } else {
            var revealed = interaction.options.getBoolean('revealed');
        }

        try {
            var x = await wordle.playWordle(mode, wordleData, word, revealed);
        }
        catch (error) {
            await interaction.editReply("Error");
            console.log(error);
            console.log(error.message);
            return;
        }
        await interaction.editReply(x);
	},
};