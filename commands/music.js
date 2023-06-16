const { SlashCommandBuilder } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    demuxProbe
} = require('@discordjs/voice');

//yt-dl
const ytdl = require('ytdl-core')

// youtube search api
const yts = require('youtube-search-api');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Plays music! (Very WIP. Expect bugs and missing features.)')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the song to play')
                .setRequired(true)),


    async execute(interaction) {
        const channel = interaction.member.voice.channel; // get the voice channel of the user who sent the interaction
        if (!channel) return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        const query = interaction.options.getString('name', true); // we need input/query to play
    
        // let's defer the interaction as things can take time to process
        await interaction.deferReply();
        const data = await yts.GetListByKeyword(query,false,1,[{type:'video'}]);
        let vidId = data['items'][0]['id'];
        try {
            const { track } = await player.play(channel, vidId, {
                nodeOptions: {
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: interaction // we can access this metadata object using queue.metadata later on
                }
            });
    
            return interaction.followUp(`**${track.title}** enqueued!`);
        } catch (e) {
            // let's return error if something failed
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
    
};