const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
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

//music
const { BackButton, NextButton, PlayPauseButton } = require('../music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Plays music! (Very WIP. Expect bugs and missing features.)')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the song to play. Omit to open options panel.')
                .setRequired(false)),


    async execute(interaction) {
        //check if name is provided
        if (interaction.options.getString('name') == null) {
            //get queue for this guild
            const guild = interaction.guild;
            const queue = player.nodes.get(guild);
            const tracks = queue.tracks.data;

            //get first 20 tracks
            const tracks20 = tracks.slice(0,20);

            //send GUI embed

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Options Panel')
                .setDescription('WIP Music Player')
                .setTimestamp()
                //for each track, add a field
                .addFields(
                    tracks20.map((track, index) => {
                        console.log(track);
                        return {
                            name: `${index + 1}. ${track.title}`,
                            value: `Duration: ${track.duration}\nRequested by: ${track.requestedBy}`,
                            inline: false
                        }
                    })
                );
                            
            //create action row with link button
            const actionRow = new ActionRowBuilder()
                .addComponents(BackButton.data)
                .addComponents(PlayPauseButton.data)
                .addComponents(NextButton.data);
            //send embed with action row
                
            

            await interaction.reply({ 
                embeds: [embed],
                components: [actionRow]
            });
            return;
        }

        const channel = interaction.member.voice.channel; // get the voice channel of the user who sent the interaction
        const user = interaction.user; // get the user who sent the interaction
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
            track.requestedBy = user.tag; // let's add who requested this track
            //remove #0 if it ends user tag
            if (track.requestedBy.endsWith('#0')) {
                track.requestedBy = track.requestedBy.slice(0, -2);
            }
            
    
            return interaction.followUp(`**${track.title}** wordled!`);
        } catch (e) {
            // let's return error if something failed
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
    
};