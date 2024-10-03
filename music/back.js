const { ButtonBuilder, ButtonStyle} = require("discord.js");
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();
module.exports = {
	data: button = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('⏮')
        .setCustomId('music_back'),

    async execute(interaction) {
        const guild = interaction.guild;
        const queue = player.nodes.get(guild);
        const history = queue.history;
        if (history.isEmpty()) {
            // await interaction.reply("There is no previous song!");
            return;
        }
        history.back();
        await interaction.deferUpdate();
    }
};