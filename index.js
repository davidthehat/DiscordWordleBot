const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const config = require('./env-var');
const token = config.getConfig().token;
const clientId = config.getConfig().clientId;

const chatCompletion = require('./chatCompletion');

const client = new Client({ intents: [GatewayIntentBits.Guilds, "MessageContent", "GuildMessages"] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const args = process.argv.slice(2);
const env_state = args[0];

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
    console.log('Environment state: ' + env_state);
	console.log('Ready!');
});

// on client message
client.on(Events.MessageCreate, async message => {
	console.log("message received");
	console.log(message);
	// if message is from bot, ignore
	if (message.author.id == clientId) return;

	
	//get channel id
	const channel = message.channelId;
	//get channel name
	client.channels.fetch(channel).then( channel => {
		if (channel.isThread()) {
			if (channel.ownerId == clientId) {
				//log all messages
				console.log("botthread");
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

					const completion = await chatCompletion.chatCompletion(list);
					console.log(completion.data.choices[0].message.content);
					channel.send(completion.data.choices[0].message.content);
				});
			}
		}
	});
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) {
		console.log(interaction);
		return
	}

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
});



client.login(token);