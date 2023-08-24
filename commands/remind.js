const { SlashCommandBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remind')
		.setDescription('Reminder command')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message you want to be reminded of')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The time you want to be reminded at')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('dm')
                .setDescription('Should the reminder be sent in the server or to your dms? Defaults to true (dm).')
                .setRequired(false)),
        


	async execute(interaction) {
        var dmBool = interaction.options.getBoolean('dm');
        var formattedReminder, formattedReply;
        if (dmBool == null) {
            dmBool = true;
        }
        
        await interaction.deferReply();
        var reply = await interaction.fetchReply();

        if (dmBool) {
            formattedReply = `I will DM you at ${interaction.options.getString('date')} with the message: ${interaction.options.getString('message')}`;
            formattedReminder = `Reminder: ${interaction.options.getString('message')} Context: ${reply.url}`;
            schedule.scheduleJob(interaction.options.getString('date'), function() {
                interaction.user.send(formattedReminder);
            });
        } else {
            formattedReply = `I will reply at ${interaction.options.getString('date')} with the message: ${interaction.options.getString('message')}`;
            formattedReminder = `Reminder: ${interaction.options.getString('message')}`;
            schedule.scheduleJob(interaction.options.getString('date'), function() {
                reply.reply(formattedReminder);
            });
        }
        
        await interaction.editReply({content:formattedReply});

    }
    
};