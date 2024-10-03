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
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();
//yt-dl
// const ytdl = require('ytdl-core')

// youtube search api
// const yts = require('youtube-search-api');

//music
const { BackButton, NextButton, PlayPauseButton } = require('../music');
const { QueryType } = require('discord-player/dist');

const args = process.argv.slice(2);
const env_state = args[0];

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
            // if in dev mode and queue is empty, populate queue with test tracks
            // if (env_state === "dev" && player.nodes.get(interaction.guild)?.tracks.size == 0) {
            //     console.log("DEV MODE: Populating queue with test tracks");
            //     let testTracks = [ 'rY-FJvRqK0E', 'mQsI_HEcrbI', 'unaSEpEaIkU' ];
            //     const channel = interaction.member.voice.channel;
            //     const vidId = testTracks[0];
                    
            //     const { track } = await player.play(channel, vidId, {
            //         nodeOptions: {
            //             // nodeOptions are the options for guild node (aka your queue in simple word)
            //             metadata: interaction // we can access this metadata object using queue.metadata later on
            //         }
            //     });
            //     track.requestedBy = "DEBUG";
            // }


            //get queue for this guild
            const guild = interaction.guild;
            const queue = player.nodes.get(guild);
            const tracks = queue?.tracks?.data;

            //if queue is empty, send error message
            if (queue == null || queue.currentTrack == null) {
                await interaction.reply("Queue is empty!");
                return;
            }

            //get current track
            const currentTrack = queue.currentTrack;

            //get first 20 tracks
            const tracks20 = tracks.slice(0,20);

            //create list of current track and first 20 tracks
            const trackList = [currentTrack, ...tracks20];


            //send GUI embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Options Panel')
                .setDescription('Music Player')
                .setTimestamp()
                //for each track, add a field
                .addFields(
                    //then add the rest of the tracks
                    trackList.map((track, index) => {
                        // console.log(track);
                        return {
                            name: `${index + 1}. ${track.title}`,
                            value: `Duration: ${track.duration}\nRequested by: ${track.requestedBy}`,
                            inline: false
                        }
                    })
                )
                .setImage(currentTrack.thumbnail)
                .setThumbnail(currentTrack.thumbnail);
                            
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
        // const data = await yts.GetListByKeyword(query,false,1,[{type:'video'}]);
        // let vidId = data['items'][0]['id'];
        vidId = query;
        try {
            const { track } = await player.play(channel, vidId, {
                nodeOptions: {
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: interaction, // we can access this metadata object using queue.metadata later on
                    ytdlOptions: {
                        // filter: 'audioonly',
                        // quality: 'highestaudio',
                        highWaterMark: 1 << 25,
                        dlChunkSize: 0
                    }
                }   
            });
            track.requestedBy = user.tag; // let's add who requested this track
            //remove #0 if it ends user tag
            if (track.requestedBy.endsWith('#0')) {
                track.requestedBy = track.requestedBy.slice(0, -2);
            }

            return interaction.followUp(`**[${track.title}](<${track.url}>)** wordled!`);
        } catch (e) {
            // let's return error if something failed
            console.error(e);
            return interaction.followUp(`Something went wrong.`);
            
        }
    }
    
};