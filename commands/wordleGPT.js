const { SlashCommandBuilder } = require('discord.js');

const path = require('path');
const fs = require('fs');
const chatCompletion = require("../chatCompletion");
//openai setup
const { Configuration, OpenAIApi } = require("openai");

OPENAI_API_KEY = process.env.OPENAI_API_KEY;
PROMPT_HEADER = process.env.PROMPT_HEADER;

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//This command only BEGINS a conversation with the wordlebot
//The wordlebot will continue the conversation when you reply to the wordlebot's message
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
            console.log(interaction);
            const question = interaction.options.getString('question');
            let threadName;
            let incompleteName = false;
            if (question.length > 100) {
                threadName = question.substring(0, 95) + "...";
                incompleteName = true;
            } else {
                threadName = question;
            }
            await interaction.deferReply({ephemeral: true});
            const channel = interaction.channel;
            const thread = await channel.threads.create({
                name: threadName,
                autoArchiveDuration: 60,
                reason: 'Thread created for WordleBot chat',
            });

            thread.send("Question by <@" + interaction.user.id + ">: " + question);
            
            const completion = await chatCompletion.chatCompletion(
                {"role": "user", "content": question});
            console.log(PROMPT_HEADER);
            console.log(completion.data.choices);
            // await interaction.editReply(completion.data.choices[0].message.content);
            await interaction.editReply({content: "Check the thread!", ephemeral: true});
            // console.log("USERID")
            // console.log(interaction.user.id);
            // thread.send("Question by <@" + interaction.user.id + ">: " + question);
            
            await thread.send(completion.data.choices[0].message.content);
        } catch (error) {
            await interaction.editReply({ content: `There was an error while executing this command: ${error}`, ephemeral: true});
        }
    }
    
};