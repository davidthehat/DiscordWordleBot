const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const config = require('./env-var');
const token = config.getConfig().token;
const clientId = config.getConfig().clientId;

const chatCompletion = require('./chatCompletion');
const movieQuote = require('popular-movie-quotes');
const splitText = require('split-text');

const client = new Client({ intents: [GatewayIntentBits.Guilds, "MessageContent", "GuildMessages", "GuildVoiceStates"] });

const { Player } = require("discord-player");
const music = require('./commands/music');

global.player = new Player(client);

player.extractors.loadDefault();

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.musicButtons = new Collection();
const musicPath = path.join(__dirname, 'music');
const musicFiles = fs.readdirSync(musicPath).filter(file => file.endsWith('.js') && file != 'index.js');

const args = process.argv.slice(2);
const env_state = args[0];

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

for (const file of musicFiles) {
	const filePath = path.join(musicPath, file);
	const button = require(filePath);
	client.musicButtons.set(button.data.data.custom_id, button);
	console.log("registered button: " + button.data.data.custom_id);
}
client.once(Events.ClientReady, () => {
    console.log('Environment state: ' + env_state);
	console.log('Ready!');
});

// on client message
client.on(Events.MessageCreate, async message => {
	// if message is from bot, ignore
	if (message.author.id == clientId) return;

	// if message contains League (ignore case) in humps server, reply with message
	if (message.content.toLowerCase().includes("league") && message.guildId == "687382250563698821") {
		
		//if in #gifs-only, reply with https://tenor.com/view/andrew-capro-the-office-wordle-michael-michael-scott-gif-25175786
		let channelId = message.channelId;
		let channelName = client.channels.cache.get(channelId).name;
		console.log(channelName);
		if (channelId == "897883769850179584" || channelName == "gifs-only") {
			return await message.reply("https://tenor.com/view/andrew-capro-the-office-wordle-michael-michael-scott-gif-25175786");
		} else {
			await message.reply("Lol, League is such a trash tier game. What kind of loser ever plays that stupid game? Now perish");
		}
	}
	
	//get channel id
	const channel = message.channelId;
	//get channel name
	client.channels.fetch(channel).then( channel => {
		if (channel.isThread()) {
			if (channel.ownerId == clientId) {
				//log all messages
				console.log("botthread");
				// if message contains [IGNORE], ignore
				if (message.content.includes("[IGNORE]")) return;
				if (message.content == "") return;
				// if message is from throttled user, reply with movie quote
				throttledUsers = []; //disables throttling feature
				if (throttledUsers.includes(message.author.id) && !message.content.toLowerCase().includes("please")) {
					channel.send(movieQuote.getRandomQuote());
					return;
				}
				channel.messages.fetch().then(async messages => {
					list = [];
					for (const [id, message] of messages) {
						if (message.author.id == clientId) {
							list = list.concat({role: "assistant", "content": message.content});
						} else {
							list = list.concat({role: "user", "content": message.content});
						}
					}
					list.reverse();
					//remove "question: <Username>" from first message
					list[0].content = list[0].content.substring(list[0].content.indexOf(":") + 2);
					console.log(list[0]);
					//change first message to "user"
					list[0].role = "user";

					//remove messages with [IGNORE]
					list = list.filter(message => !message.content.includes("[IGNORE]"));
					
					let completion;
					try {
						completion = await chatCompletion.chatCompletion(list);
					} catch (error) {
						
						console.log("Error: " + error);
					}
					
					if (completion == undefined) {
						await channel.send("[IGNORE] There was a problem with the request. Try again or try creating a new thread.");
						return;
					}
					output = completion.data.choices[0]?.message?.content;
					
					//split output into multiple messages if too long
					const splitOutput = splitText(output, 1900);
					for (const message of splitOutput) {
						await channel.send(message);
					}
					
				});
			}
		}
	});
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		return;
	}

	if (interaction.isButton()) {
		console.log(interaction.customId)
		const button = client.musicButtons.get(interaction.customId);
		console.log(button);
		if (!button) return;

		try {
			await button.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this button!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
			}
		}
		return;
	}
		
	// If interaction is not handled above, log and ignore.
	console.log(interaction);
	return;
});

player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
});


client.login(token);