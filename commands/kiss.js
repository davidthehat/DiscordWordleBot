const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Requests that wordlebot kiss a user')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user to kiss')
                .setRequired(false)),


	async execute(interaction) {
        
        let user = interaction.options.getString('user');

        //if user is not provided, kiss the user who requested the kiss
        if (user == null) {
            console.log(interaction);
            user = `<@${interaction.user.id}>`;
        }
        
        //hack
        //if user does not contain any digits, append 1
        if (!user.match(/\d/)) {
            user = user + "1";
        }
        

        //if user is not a valid user, send error message
        //a valid user is the guild
        let guild = interaction.guild;
        try {

            member = await guild.members.fetch(user.replace(/\D/g,''));
            console.log(member);
            await interaction.reply(`Mwah! :kiss: ${user}`);

        } catch (error) {

            await interaction.reply(":cry: I don't know who that is...");

        }

        

    }
    
};