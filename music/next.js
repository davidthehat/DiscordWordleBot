const { ButtonBuilder, ButtonStyle} = require("discord.js");
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();
module.exports = {
	data: button = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('⏭')
        .setCustomId('music_next'),

    async execute(interaction) {
        const guild = interaction.guild;
        const queue = player.nodes.get(guild);
        queue.node.skip();
        await interaction.deferUpdate();
    }
};