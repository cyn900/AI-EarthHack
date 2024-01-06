// // chatgptService.js
const OpenAI = require("openai");

const openai = new OpenAI();
// if API key is not set up in the project
// const openai = new OpenAI("YOUR_API_KEY");

async function noveltyPt(prompt) { 
    rolePlay = 'You are a seasoned venture capital expert known for your sharp evaluation skills. Your role is to assess the novelty of the idea presented by the user on a scale from 1 to 10, with 10 being the highest level of novelty. You can should consider how the problem solution is different from existing solutions. Please only provide your expert rating as a number from 1 to 10.'
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
        model: "gpt-3.5-turbo",
        max_tokens: 1,
        temperature: 0.0,
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

// p = 'prblem: The usage of plastic bottles. solution: Our solution to this is to transform the way we consume fashion through the creation of a shared fashion platform â€“ a fashion library. The fashion library will function on the concept of lending versus owning'
// noveltyPt(p);


module.exports = {noveltyPt};

