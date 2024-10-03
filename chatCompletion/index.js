const { OpenAI } = require('openai');


OPENAI_API_KEY = process.env.OPENAI_API_KEY;
PROMPT_HEADER = process.env.PROMPT_HEADER;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function chatCompletion(messages) {
    //gpt turbo

    model = "gpt-4o-mini";
    // model = "gpt-4";
    messages = [{role: 'system', content: PROMPT_HEADER}].concat(messages);
    console.log(messages);
    const completion = await openai.chat.completions.create({
        model: model,
        messages: messages
    });
    return completion;
}

module.exports = {
    chatCompletion
}