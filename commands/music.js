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
        //dirty
        try {

            //defer reply
            await interaction.deferReply();


            console.log("getting channel");
            //get voice channel of user
            const channel = interaction.member.voice.channel;
            console.log(channel)
            if (!channel) {
                await interaction.reply("You must be in a voice channel to use this command!");
                return;
            }
            console.log("joining channel");
            //join voice channel
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            // await entersState(connection, VoiceConnectionStatus.Ready, 30e3);

            console.log("playing music");
            //play music
            const player = createAudioPlayer();

            console.log("creating resource");
            //use ytdl to get audio resource from youtube url
            const name = interaction.options.getString('name');
            
            const data = await yts.GetListByKeyword(name,false,1,[{type:'video'}]);
            yts.GetListByKeyword()
            console.log(data['items']);
            let vidId = data['items'][0]['id'];
            const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${vidId}`)

            console.log(songInfo);

            const stream = ytdl(`https://www.youtube.com/watch?v=${vidId}`, {filter: 'audioonly'});
            console.log(stream);
            const resouce = createAudioResource(stream, {inputType: StreamType.Arbitrary});

            const subscription = connection.subscribe(player);

            //playing
            console.log("playing");
            player.play(resouce);

            await entersState(player, AudioPlayerStatus.Playing, 5_000);
            console.log("playing music");
            

            if (!process.stdout) {
                await interaction.editReply("Error playing music!");
                return;
            }

            console.log("replying");
            //reply
            let title = songInfo['videoDetails']['title'];
            await interaction.editReply("Now playing: **" + title + "**");

            console.log("waiting for music to play");
            let entered = await entersState(player, AudioPlayerStatus.Playing, 5_000);
            console.log("entered");

            await entersState(player, AudioPlayerStatus.Idle, 5_000);
        }
        catch (error) {
            console.log(error);
            await interaction.editReply("Now playing: **" + title + "** (error)");
            return;
        }
    }
    
};