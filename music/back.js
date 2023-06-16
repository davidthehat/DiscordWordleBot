const { ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
	data: button = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('⏮')
        .setCustomId('music_back'),

    async execute(interaction) {
        const guild = interaction.guild;
        const queue = player.nodes.get(guild);
        queue.history.back();
        await interaction.deferUpdate();
    }
};