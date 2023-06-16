const { ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
	data: button = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel('⏯')
        .setCustomId('music_playpause'),

    async execute(interaction) {
        const guild = interaction.guild;
        const queue = player.nodes.get(guild);
		queue.node.setPaused(!queue.node.isPaused());
        await interaction.deferUpdate();
    }
};