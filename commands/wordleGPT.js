const { SlashCommandBuilder } = require('discord.js');

//openai setup
const { Configuration, OpenAIApi } = require("openai");

OPENAI_API_KEY = process.env.OPENAI_API_KEY;
PROMPT_HEADER = process.env.PROMPT_HEADER;
// const { OPENAI_API_KEY, PROMPT_HEADER } = require('../openai/config.json')

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordlegpt')
		.setDescription('Answers your question AS the wordlebot!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your prompt for the wordlebot')
                .setRequired(true)),


	async execute(interaction) {
        try {
            await interaction.deferReply();
            const completion = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: PROMPT_HEADER + "\n\n" + interaction.options.getString('question'),
              max_tokens: 100
            });
            console.log(completion.data.choices)
            await interaction.editReply(completion.data.choices[0].text);
        } catch (error) {
            await interaction.editReply(`There was an error while executing this command: ${error}`);
        }
    }
    
};