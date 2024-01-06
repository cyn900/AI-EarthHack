// chatgptService.js
const axios = require('axios');

const chatGPTAPI = axios.create({
    baseURL: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
    },
});

async function generateResponse(prompt) {
    try {
        const response = await chatGPTAPI.post('/', {
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('ChatGPT API request failed', error);
        throw error;
    }
}

module.exports = { generateResponse };
