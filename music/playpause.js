const { ButtonBuilder, ButtonStyle} = require("discord.js");
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();
module.exports = {
	data: button = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel('⏯')
        .setCustomId('music_playpause'),

    async execute(interaction) {
        const guild = interaction.guild;
        const queue = player.nodes.get(guild);
		queue.node.setPaused(!queue.node.isPaused());
        console.log(queue.node.isPaused() ? "Paused" : "Resumed");
        await interaction.deferUpdate();
    }
};