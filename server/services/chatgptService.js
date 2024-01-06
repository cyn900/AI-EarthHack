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

// generate a novelty point
async function noveltyPoint(prompt) {
    rolePlay = 'You are a seasoned venture capital expert known for your sharp evaluation skills. Your role is to assess the novelty of the idea presented by the user on a scale from 1 to 10, with 10 being the highest level of novelty. You can should consider how the problem solution is different from existing solutions. Please only provide your expert rating as a number from 1 to 10.'
    try {
        const response = await chatGPTAPI.post('/', {
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt }],
            max_tokens: 1,
            temperature: 0.0,
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('ChatGPT API request failed', error);
        throw error;
    }
}

module.exports = {generateResponse, noveltyPoint};
