const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverstatus')
		.setDescription('Gets server status of a specified Minecraft server!')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The server you want to get the status of')
                .setRequired(true)),


	async execute(interaction) {
        // await interaction.deferReply();
        const apiurl = "https://api.mcsrvstat.us/2/";
        const imgurl = "https://api.mcsrvstat.us/icon/"
        var server = interaction.options.getString('server');
    
        // use axios to get the server status
        const axios = require('axios');
        let serverStatus = await axios.get(apiurl + server);
        console.log("server status:");
        console.log(serverStatus);
        let online = serverStatus.data.online;
        if (online == false) {
            await interaction.reply("[" + server + "] is offline (or doesn't exist)!");
            return;
        }
        let playerCount = serverStatus.data.players.online;
        let playerList = serverStatus.data.players.list;
        let serverName = serverStatus.data.motd.clean[0];
    
        console.log(serverStatus.data);

        

        // create embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(serverName)
            .setDescription(server)
            .setThumbnail(imgurl + server)
            
            .setTimestamp();

       
        embed.addFields(
            { name: 'Player Count', value: playerCount.toString(), inline: true },
        )
        if (playerCount <= 10 && playerCount !== undefined && playerList !== undefined) {
            playerList = playerList.join("\n");
            embed.addFields(
                { name: 'Players', value: playerList, inline: false }
            );
        }

        await interaction.reply({ embeds: [embed] });
    }
    
};