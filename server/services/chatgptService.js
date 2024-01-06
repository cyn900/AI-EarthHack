// // chatgptService.js
const { response } = require("express");
const OpenAI = require("openai");

const openai = new OpenAI();
// if API key is not set up in the project
// const openai = new OpenAI("YOUR_API_KEY");

const problemRegex = /Problem:\s*([^]+?)\.\s*Solution:/;
const scoreRegex = /Score:\s*(\d+)/;
const explanationRegex = /Explanation:\s*([^\.]+\.)/;
const replyFormat = 'The format of your reply must be Score: (number from 0 to 100 where 100 means it is the best idea on the planet, 50 is just an average idea. Marks will be detucted if the given information is not descriptive enough. For example, if the problem description is just 5 words, it is probably too general so the mark should be realy low (around 50).). Explaination: (only one senetnce to comment on the problem description)';

// problem evaluation
async function problemEval(prompt) { 
    rolePlay = 'You are a very strict critic who knows a lot about circular economy and sustainability. The problem the idea should include these things in order to have a mark higher than 60: how popular it is(many people have the problem) - rank the number of people impacted from highest to lowest from all the projects; how much growing (Problem that will grow with the time and more people will have the problem); how urgent (People need you to solve it now); how expensive (Solving the problem will save your client lots of money, otherwise you do not have a business); Frequent (It is not a one-time problem, people come across the problem frequently) - rank by number of searches related to solving the problem.' + replyFormat
    const problemMactch = prompt.match(problemRegex);
    const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay }, {role:'user', content:'The usage of plastic bottles is a big issue'}, { role: 'system', content: 'Score: 30 \n Explaination: The problem of plastic bottle usage is briefly mentioned, but it lacks specific details or statistics to fully describe the problem.' },{ role: 'user', content: problemDescription}],
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

// evaluating Circular economy
async function circularEcoEval(prompt) { 
    rolePlay = 'You are a very strict critic who knows a lot about circular economy and sustainability. The The problem the idea should include these things in order to have a mark higher than 60: how popular it is(many people have the problem) - rank the number of people impacted from highest to lowest from all the projects; how much growing (Problem that will grow with the time and more people will have the problem); how urgent (People need you to solve it now); how expensive (Solving the problem will save your client lots of money, otherwise you do not have a business); Frequent (It is not a one-time problem, people come across the problem frequently) - rank by number of searches related to solving the problem.' + replyFormat
    const problemMactch = prompt.match(problemRegex);
    const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay },{ role: 'user', content: problemDescription}],
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

p = 'Problem: Create Awareness of the propensity of Reduce, Reuse, Brick building. Solution: Our solution to this is to transform the way we consume fashion through the creation of a shared fashion platform â€“ a fashion library. The fashion library will function on the concept of lending versus owning'
problemEval(p)

module.exports = {problemEval};

