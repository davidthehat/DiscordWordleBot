const { Configuration, OpenAIApi } = require("openai");

OPENAI_API_KEY = process.env.OPENAI_API_KEY;
PROMPT_HEADER = process.env.PROMPT_HEADER;

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function chatCompletion(messages) {
    //gpt turbo

    model = "gpt-3.5-turbo-0301";
    // model = "gpt-4";
    messages = [{role: 'system', content: PROMPT_HEADER}].concat(messages);
    console.log(messages);
    const completion = await openai.createChatCompletion({
        model: model,
        messages: messages
    });
    return completion;
}

module.exports = {
    chatCompletion
}