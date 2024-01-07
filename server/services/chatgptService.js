// // chatgptService.js
const { response } = require("express");
const OpenAI = require("openai");

const openai = new OpenAI();
// if API key is not set up in the project
// const openai = new OpenAI("YOUR_API_KEY");
gptModel = "gpt-3.5-turbo";
const problemRegex = /Problem:\s*([^]+?)\.\s*Solution:/;
const scoreRegex = /Score:\s*(\d+(?:\.\d+)?)/;
const explanationRegex = /Explanation:\s*([^\.]+\.)/;
const background = 'You are a very strict critic who knows a lot about circular economy and sustainability.'
const inputFormat = 'The format of the user input is yhat problem is after Problem: and before Solution:. Solution is everything after Solution:'
const replyFormat = 'The format of your reply must be Score: (number with one digit after the decimal from 0.0 to 10.0 where 10 means it is the best idea on the planet, 50 is just an average idea. Marks will be detucted if the given information is not descriptive enough. For example, if the problem description is just 5 words, it is probably too general so the mark should be realy low.). Explaination: (only one concise senetnce to comment on what does the user did well on and what does the user did bad on. you must not repeat what the user said)';

// spam Filter
async function spamFilter(prompt) { 
    rolePlay =  'You are a judge assessing a competition submission. Each submission consists of a problem and its corresponding solution. A submission is "Valid" if the solution directly addresses the problem, is well thought out, and shows effort. It is "Invalid" if the solution is unrelated to the problem, lacks coherence, or shows signs of low effort, such as being incomplete or nonsensical. Based on this, judge the submission as either "Valid" or "Invalid".';
    // const problemMactch = prompt.match(problemRegex);
    // const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: 'Problem: Plastic bottle. Solution: Encourage save energy'}, { role: 'system', content: 'Invalid'}, { role: 'user', content: 'Problem: Plastic bottle. Solution: Encourage recycle plastic bottle'}, { role: 'system', content: 'Valid'},{ role: 'user', content: prompt}],
        // model: "gpt-4",
        model: gptModel,
        max_tokens: 5,
        temperature: 0.0,
    });
    relevance = completion.choices[0].message.content;
    // console.log(relevance);
    return relevance;
}

// problem popularity evaluation
async function problemPopularEval(prompt) { 
    rolePlay =  background + 'You only care about popularity (how many people are/will be impacted). You will rate on the popularity of the given information out of 10. Assign up to half of the points based on the sheer scale of the impact, considering factors such as the number of affected individuals, organizations, or communities. The remaining points should be awarded based on the depth and specificity of the users explanation about its popularity. General or vague explanations should receive minimal points. When scoring, provide a number between 0-10, taking into account both the quantitative reach and the quality of the explanation provided. Your assessment should be grounded in measurable metrics like the quantitative count of impacted stakeholders.' + replyFormat
    // const problemMactch = prompt.match(problemRegex);
    // const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    // if (problemDescription == null){ problemDescription = prompt};
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: 'Plastic Bottle'}, { role: 'system', content: "Score: 1.2. Explaination: This is a very popular topic but there is no explaination." },{role: 'user', content: 'The construction industry is indubitably one of the significant contributors to global waste, contributing approximately 1.3 billion tons of waste annually, exerting significant pressure on our landfills and natural resources. Traditional construction methods entail single-use designs that require frequent demolitions, leading to resource depletion and wastage.'}, { role: 'system', content: 'Score: 7.2. Explanation: The issue is a well-known issue globally, and it is very descriptive.'},{ role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 50,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        score = scoreMatch ? scoreMatch[1] : null;
        // console.log("1")
    }   
    
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    // console.log([score, explanation]);
    console.log([score,explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

// problem growing evaluation
async function problemGrowingEval(prompt) { 
    rolePlay = background + 'Your task is to assess the future potential and growth of a given problem, focusing on whether it will escalate over time and impact more people. You are to rate the problems potential on a scale of 0 to 10. Allocate half of the points based on the magnitude of the problem and the other half on the depth and clarity of the users explanation regarding the problems potential growth and increasing impact. Detailed explanations should be rewarded, while generic or vague descriptions should receive minimal points. Your assessment should not include any consideration of potential solutions, but it should highlight whether the problem is expected to grow over time. Base your evaluation on measurable metrics, such as the projected percentage increase in the frequency or incidence of the problem. Ultimately, your score should reflect an assessment of both the current scale and the potential expansion of the problem, with a number between 0-10.' + replyFormat
    // const problemMactch = prompt.match(problemRegex);
    // const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    // if (problemDescription == null){ problemDescription = prompt};
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay },{ role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
    
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        score = scoreMatch ? scoreMatch[1] : null;
    }
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

// problem urgent evaluation
async function problemUrgentEval(prompt) { 
    rolePlay = background + 'Your role is to evaluate the urgency of a presented problem, focusing exclusively on its immediate significance and the need for swift action. Rate the urgency on a scale of 0 to 10. Divide the scoring criteria equally between the overall severity of the problem and the detail in the users explanation about why the problem requires immediate attention. Generous scores should be assigned to well-explained, specific descriptions, whereas vague or overly general explanations should receive low scores. Remember, your evaluation should not consider any potential solutions but should strictly assess the urgency of the problem as described. Highlight the urgency in your explanation, basing your judgment on measurable metrics like time sensitivity and the speed at which the problem demands resolution. Your final score should reflect a balanced assessment of the problems current criticality and the users effectiveness in conveying this urgency, with a score ranging from 0 to 10.' + replyFormat
    // const problemMactch = prompt.match(problemRegex);
    // const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    // if (problemDescription == null){ problemDescription = prompt};
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay },{role: 'user', content: 'The construction industry is indubitably one of the significant contributors to global waste, contributing approximately 1.3 billion tons of waste annually, exerting significant pressure on our landfills and natural resources. Traditional construction methods entail single-use designs that require frequent demolitions, leading to resource depletion and wastage.'}, { role: 'system', content: 'Score: 7.8. Explanation: the problem is undoubtedly urgent, and the provided details emphasize the need for prompt solutions to mitigate further harm.'},{ role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        score = scoreMatch ? scoreMatch[1] : null;
    }
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;

    console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

// problem expense evaluation
async function problemExpenseEval(prompt) {
    rolePlay = background + 'Your focus is on evaluating the economic impact of a problem, particularly on problems that are escalating over time and affecting more people. Rate the financial significance of the problem on a scale from 0 to 10. Allocate half of the points based on the magnitude of the problem and the other half on the users detailed explanation of its economic implications. Generous scores should be given to well-articulated, specific explanations, while vague or general descriptions should receive minimal scores. Remember, your evaluation should not include any potential solutions but should strictly assess the financial impact of the problem as described. Your explanation should underscore the economic urgency of the problem, focusing on measurable metrics such as the financial costs incurred due to inefficiencies, resource wastage, and other economic burdens. Provide a balanced score that reflects both the scale of the economic issue and the effectiveness of the users explanation, with a score ranging from 0 to 10.' + replyFormat
    // const problemMactch = prompt.match(problemRegex);
    // const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    // if (problemDescription == null){ problemDescription = prompt};
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        score = scoreMatch ? scoreMatch[1] : null;
    }
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

// problem frequent evaluation
async function problemFrequentEval(prompt) {
    rolePlay = background + 'You only about how frequesnt the problem happen, ex is it a daily issue. You only like a problem that is not a one-time problem, people come across the problem frequently. A problem desciption is given to you. You will rate on the urgency of the problem out of . Half of the points should given on the big problem is, and half of the points should given on how detailed the user explain why the problem is api. If the user only give a general idea, no or very little marks will be given. No solution is required for the problem so do not talk about missing one in the explaination. Mention if the problem is frequently happen in the explaination. Measurable Metric: Number of occurrences or frequency within a defined period (e.g., monthly, yearly). For score, return a number between 0-10.' + replyFormat
    // const problemMactch = prompt.match(problemRegex);
    // const problemDescription = problemMactch ? problemMactch[1].trim() : null;
    // if (problemDescription == null){ problemDescription = prompt};
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        score = scoreMatch ? scoreMatch[1] : null;
    }
    
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;

    // console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution completeness evaluation
async function solutionCompletenessEval(prompt) { 
    rolePlay = background + 'Is the solution complete? Can it solve the problem described after Problem:? Are the problem and soluation even related? Note that problem is after Problem: and before Solution: and solution is everything after Solution:. Measurable Metric: Percentage completion of the circular economy loop within the proposed solution.For score, return a number between 0-10' + replyFormat;
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);

        score = scoreMatch ? scoreMatch[1] : null;
    }
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    // console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution target evaluation
async function solutionTargetEval(prompt) { 
    rolePlay = background + inputFormat + 'Does it fit the 7 pillars of circular econ. Measurable Metric: Evaluate the extent of adherence to the principles of circular economy through a comprehensive analysis of materials life cycles, energy sources, biodiversity impact, societal preservation, health considerations, diverse value creation, and system resilience. For score, return a number between 0-10' + replyFormat;
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        
        score = scoreMatch ? scoreMatch[1] : null;
    }   

    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    // console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution novelty evaluation
async function solutionNoveltyEval(prompt) { 
    rolePlay = background + inputFormat + 'How creative is the solution? Does it exist already? Measurable Metric: Measure the level of novelty by analyzing the degree of differentiation from existing solutions across various innovation categories (programmatic, technical, organizational, managerial, and methodological), emphasizing the unique value proposition introduced and its impact on current practices or products. For score, return a number between 0-10' + replyFormat;
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);

        score = scoreMatch ? scoreMatch[1] : null;
    }
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    // console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution financial impact evaluation
async function solutionFinImpactEval(prompt) { 
    rolePlay = background + inputFormat + 'What is the financial impact? Does it create monetary value? For score, return a number between 0-10' + replyFormat;
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        score = scoreMatch ? scoreMatch[1] : null;
    }

    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    // console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution Implementability evaluation
async function solutionImplementabilityEval(prompt) { 
    rolePlay = background + inputFormat + 'What is the implementability? How feasible is the solution? How scalabale is the solution? Measurable Metric: Market size (TAM, SAM, SOM) and projected revenue streams (quantitative financial projections), Initial and ongoing costs, revenue projections, projected profit margins, break-even point, ROI (quantitative financial analysis).    . For score, return a number between 0-10.' + replyFormat;
    score = -1;
    while (score < 0 || score > 10 || score === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
        aiResponse = completion.choices[0].message.content;
        scoreMatch = aiResponse.match(scoreRegex);
        
        score = scoreMatch ? scoreMatch[1] : null;
    }
    explanationMatch = aiResponse.match(explanationRegex);
    explanation = explanationMatch ? explanationMatch[1].trim() : null;
    // console.log("score: " + [score, explanation][0]);
    console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

// creative name
async function generateName(prompt) { 
    rolePlay = "You are a creative thinker! Make up a name with only 1 to 4 words for the given info. Just give me the name, nothing else!";
    
    n = null;
    attempts = 0;
    const maxAttempts = 3;

    while (n === null && attempts < maxAttempts) {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: gptModel,
            max_tokens: 10,
            temperature: 0.0,
        });
        console.log(completion.choices[0].message.content);
        const nameRegex = /^(\b\w+\b(?:\s+\b\w+\b){0,3})/;
        const aiResponse = completion.choices[0].message.content;
        const nameMatch = aiResponse.match(nameRegex);
        n = nameMatch ? nameMatch[1].trim() : null;
        attempts++;
    }
        if (n === null || n === 'undefined') {
            n = "Default Name"; // Fallback name if none is generated
        }
    // console.log('name' + n);
    return n;
    // return completion.choices[0].message.content;
}

// generate tags
async function generateTags(prompt) { 
    rolePlay = "Categorize the given problem and solution into ONLY ONE of the following 7 pillars of circular economy (choose the best fit one). If they do not clearly fit into any of these categories, categorize them as 'Other'. The categories are: 1. Materials; 2.Energy; 3.Water; 4.Biodiversity; 5.Society and Culture; 6.Health and Wellbeing; 7. Value."    
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
        // model: "gpt-4",
        model: gptModel,
        max_tokens: 10,
        temperature: 0.0,
    });
    // console.log(completion.choices[0].message.content);
    const aiResponse = completion.choices[0].message.content;
    tags = categorize(aiResponse)
    
    // console.log(categorize('Design for Longevity and Durability, Recycle and Recover'));
    // console.log(aiResponse);
    console.log(categorize(aiResponse));
    return categorize(aiResponse);
    // return completion.choices[0].message.content;
}

function categorize(input) {
    const categories = [
        { name: "Materials", regex: /Materials/i },
        { name: "Energy", regex: /Energy/i },
        { name: "Water", regex: /Water/i },
        { name: "Biodiversity", regex: /Biodiversity/i },
        { name: "Soceity & Culture", regex: /Society and Culture/i },
        { name: "Health & Wellbeing", regex: /Health and Wellbeing/i },
        { name: "Value", regex: /Value/i }
    ];
    cate = [];

    for (const category of categories) {
        if (category.regex.test(input)) {
            return category.name;
        }
    }
    return 'Other';
    
}

// overall summary
async function generateSummary(prompt) { 
    rolePlay = "write a one sentence summary. The structure of your response should be Summary:(following a one sentence summary)";

    sentence = null;
    while (sentence === null){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            model: gptModel,
            max_tokens: 60,
            temperature: 0.0,
        });

        const firstSentenceRegex = /Summary:\s*([^\.]+\.)/;
        const aiResponse = completion.choices[0].message.content;
        const sentenceMatch = aiResponse.match(firstSentenceRegex);
        sentence = sentenceMatch? sentenceMatch[1].trim() : null;
    }
    console.log(sentence);
    return sentence;
    // return completion.choices[0].message.content;
}

p = "Problem: The majority of the materials used in producing electronic goods are not being utilized optimally. Numerous electronic devices are replaced before their lifespan ends, often due to minor malfunctioning or outdated components, resulting in significant production of electronic waste and underutilization of natural resources.  Solution: An innovative concept would be a modular electronic device model where users are able to upgrade or swap components, rather than replacing the entire device, thus promoting a circular economy. This goes beyond just restoration but rather the idea of creating an electronic gadget that thrives on reuse and modifications, maximising the life and value of each part.   Manufacturers need to design gadgets with modules for core components, allowing for easy upgrades or replacements. For instance, a smartphone could have individually upgradeable components: camera, battery, CPU, etc. When a module fails or becomes outdated, only that module needs to be replaced.  This idea promotes resource use efficiency and significantly cuts waste, under the 'reduce, reuse, repair' mantra. The replaced modules should be sent back to manufacturers for refurbishment or extraction of critical raw materials.   For businesses it opens a new market space, enabled by sale of modules and recycled components, providing long term value capture. It also increases customer loyalty as they continually engage with the manufacturers in the lifecycle of their device. The model is scalable as it allows for the continuous incorporation of technological advancements within the same core device.   This modular approach is not only novel but it clearly addresses the broader picture of how electronic devices should be designed for a circular economy, considering environmental protection, resource efficiency, economic viability, and customer value."
p1 = 'The majority of the materials used in producing electronic goods are not being utilized optimally'
// problemPopularEval(p1)
// problemGrowingEval(p1)
// problemUrgentEval(p1)
problemExpenseEval(p1)
// problemFrequentEval(p1)
// solutionCompletenessEval(p)
// solutionTargetEval(p)
// solutionNoveltyEval(p)
// solutionFinImpactEval(p)
//solutionImplementabilityEval(p)
// generateName(p)
// generateTags(p)
// generateSummary(p);
// spamFilter(p)

module.exports = {spamFilter, problemPopularEval, problemGrowingEval, problemUrgentEval, problemExpenseEval, problemFrequentEval, solutionCompletenessEval, solutionTargetEval, solutionNoveltyEval, solutionFinImpactEval, solutionImplementabilityEval, generateName, generateTags, generateSummary};

