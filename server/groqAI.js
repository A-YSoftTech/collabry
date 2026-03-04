
require('dotenv').config();
const Groq = require("groq-sdk");

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const sendToGroq = async (message) => {
    const chat = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: message }],
    });

    return chat.choices[0].message.content;
};

module.exports = sendToGroq;
