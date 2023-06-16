const { ButtonBuilder, ButtonStyle} = require("discord.js");

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