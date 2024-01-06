// // chatgptService.js
const { response } = require("express");
const OpenAI = require("openai");

const openai = new OpenAI();
// if API key is not set up in the project
// const openai = new OpenAI("YOUR_API_KEY");

const problemRegex = /Problem:\s*([^]+?)\.\s*Solution:/;
const scoreRegex = /Score:\s*(\d+(?:\.\d+)?)/;
const explanationRegex = /Explanation:\s*([^\.]+\.)/;
const background = 'You are a very strict critic who knows a lot about circular economy and sustainability.'
const replyFormat = 'The format of your reply must be Score: (number with one digit after the decimal from 0.0 to 10.0 where 10 means it is the best idea on the planet, 50 is just an average idea. Marks will be detucted if the given information is not descriptive enough. For example, if the problem description is just 5 words, it is probably too general so the mark should be realy low.). Explaination: (only one concise senetnce to comment on what does the user did well on and what does the user did bad on. you must not repeat what the user said)';

// problem popularity evaluation
async function problemPopularEval(prompt) { 
    rolePlay =  background + 'You only care about popularity (how many people are/will be impacted). You will rate on the popularity of the given information out of 100. Half of the points should given on the big idea of the given information, and half of the points should given on how detailed the user explain its popularity. If the user only give a gneral idea, no or very little marks will be given.' + replyFormat
    const problemMactch = prompt.match(problemRegex);
    const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: problemDescription}],
        model: "gpt-3.5-turbo",
        max_tokens: 50,
        temperature: 0.0,
    });
    console.log(completion.choices[0].message.content);
    const aiResponse = completion.choices[0].message.content;
    const scoreMatch = aiResponse.match(scoreRegex);
    const explanationMatch = aiResponse.match(explanationRegex);

    const score = scoreMatch ? scoreMatch[1] : null;
    const explanation = explanationMatch ? explanationMatch[1].trim() : null;
    console.log(problemDescription);
    console.log([score, explanation]);
    return [score, explanation]
    // return completion.choices[0].message.content;
}

// problem growing evaluation
async function problemGrowingEval(prompt) { 
    rolePlay = background + 'You only care about the future/ potential (will the issue grow with the time and impact more people). A problem desciption is given to you. You will rate on the potential of the problem out of 100. Half of the points should given on the big problem is, and half of the points should given on how detailed the user explain popularity of the problem. If the user only give a general idea, no or very little marks will be given. No solution is required for the problem so do not talk about missing one in the explaination. Mention if the problem is/will be growing in the explaination.' + replyFormat
    const problemMactch = prompt.match(problemRegex);
    const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: problemDescription}],
        model: "gpt-3.5-turbo",
        max_tokens: 60,
        temperature: 0.0,
    });
    console.log(completion.choices[0].message.content);
    const aiResponse = completion.choices[0].message.content;
    const scoreMatch = aiResponse.match(scoreRegex);
    const explanationMatch = aiResponse.match(explanationRegex);

    const score = scoreMatch ? scoreMatch[1] : null;
    const explanation = explanationMatch ? explanationMatch[1].trim() : null;
    console.log(problemDescription);
    console.log([score, explanation]);
    return [score, explanation]
    // return completion.choices[0].message.content;
}

// problem gent evaluation
async function problemUrgentEval(prompt) { 
    rolePlay = background + 'You only care about the urgency (it is a really big issue that we must pay attention right now). A problem desciption is given to you. You will rate on the urgency of the problem out of 100. Half of the points should given on the big problem is, and half of the points should given on how detailed the user explain popularity of the problem. If the user only give a general idea, no or very little marks will be given. No solution is required for the problem so do not talk about missing one in the explaination. Mention if the problem is/will be growing in the explaination.' + replyFormat
    const problemMactch = prompt.match(problemRegex);
    const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: problemDescription}],
        model: "gpt-3.5-turbo",
        max_tokens: 60,
        temperature: 0.0,
    });
    console.log(completion.choices[0].message.content);
    const aiResponse = completion.choices[0].message.content;
    const scoreMatch = aiResponse.match(scoreRegex);
    const explanationMatch = aiResponse.match(explanationRegex);

    const score = scoreMatch ? scoreMatch[1] : null;
    const explanation = explanationMatch ? explanationMatch[1].trim() : null;
    console.log(problemDescription);
    console.log([score, explanation]);
    return [score, explanation]
    // return completion.choices[0].message.content;
}


p = 'Problem: Create Awareness of the propensity of Reduce, Reuse, Brick building. Solution: Our solution to this is to transform the way we consume fashion through the creation of a shared fashion platform â€“ a fashion library. The fashion library will function on the concept of lending versus owning'
// problemPopularEval(p)
// problemGrowingEval(p)
problemUrgentEval(p)

module.exports = {problemPopularEval, problemGrowingEval, problemUrgentEval};

