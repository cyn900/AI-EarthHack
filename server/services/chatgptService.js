// // chatgptService.js
const { response } = require("express");
const OpenAI = require("openai");

const openai = new OpenAI();
// if API key is not set up in the project
// const openai = new OpenAI("YOUR_API_KEY");
gptModel = "gpt-4";
const problemRegex = /Problem:\s*([^]+?)\.\s*Solution:/;
const scoreRegex = /Score:\s*(\d+(?:\.\d+)?)/;
const explanationRegex = /Explanation:\s*([^\.]+\.)/;
const background = 'You are a very strict critic who knows a lot about circular economy and sustainability. Your mark things very harsh. You rarely give marks that is above 80.'
const inputFormat = 'When evaluating user submissions, focus on the text immediately following "Problem:" and before "Solution:" for the problem statement. For the solution assessment, concentrate on the text that comes after "Solution:".'
const replyFormat = 'To evaluate the ideas presented, a score will be provided alongside a brief explanation. The score will reflect the quality and potential impact of the idea, ranging from 0.0 for ideas with little to no potential, up to 10.0 for groundbreaking ideas. The explanation will comment concisely on the strengths and weaknesses of the users presentation without reiterating their content. For example: Score: 7.5 (A score here reflects the idea creativity, potential impact, and how well it is explained. Marks are deducted for lack of detail.) Explanation: The idea scope is promising, but the explanation lacks the specificity needed to fully grasp its potential impact and feasibility. (This is a concise sentence that highlights what was done well and what was lacking.)';

// spam Filter
async function spamFilter(prompt) { 
    rolePlay =  'As a judge, your task is to evaluate each submission critically. A submission will be deemed "Valid" if the proposed solution aptly addresses the presented problem, demonstrates a thoughtful approach, and reflects a diligent effort. Conversely, a submission will be considered "Invalid" if the solution bears no clear relevance to the problem, is incoherent, or exhibits low effort — indicated by an incomplete development or a nonsensical proposition. Your judgment should categorically state whether the submission is "Valid" or "Invalid" based on these criteria.';
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
    // console.log([score,explanation]);
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
    // console.log([score, explanation]);
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

    // ([score, explanation]);
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
    
    // console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

// problem frequent evaluation
async function problemFrequentEval(prompt) {
    rolePlay = background + 'Your task is to assess the frequency of a given problem, specifically focusing on issues that are recurrent and not one-time events. Evaluate the problems frequency on a scale from 0 to 10. Allocate half of the score based on the overall significance of the problem and the other half based on the users detailed explanation of its frequency. Generous scores should be given to detailed and specific descriptions, while vague or overly general explanations warrant lower scores. Remember, your assessment should solely focus on the frequency of the problem without considering any potential solutions. Highlight in your explanation whether the problem occurs frequently. Use measurable metrics such as the number of occurrences or frequency within a defined period (e.g., daily, monthly, yearly) to guide your scoring. Provide a score that reflects both the severity of the recurring issue and the clarity of the users explanation, with scores ranging from 0 to 10.' + replyFormat
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
    rolePlay = background + 'You are tasked with assessing the completeness of a solution in relation to a stated problem. Focus on whether the solution thoroughly addresses the problem detailed after "Problem:" and before "Solution:" in the users description. Examine if there is a coherent and relevant connection between the problem and the solution presented. The solution should be evaluated based on how effectively it solves the problem mentioned and its alignment with the problems context. Your assessment should consider the extent to which the solution completes the circular economy loop, a key measurable metric. This involves evaluating how well the solution contributes to a sustainable, closed-loop system where resources are reused, recycled, and conserved. Provide a score between 0 to 10, reflecting the degree of completeness and relevance of the solution to the problem. High scores should indicate a solution that fully addresses the problem and effectively contributes to the circular economy, while low scores suggest incomplete or irrelevant solutions.' + replyFormat;
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
    rolePlay = background + inputFormat + 'Your role is to evaluate a given concepts alignment with the seven pillars of the circular economy, as depicted in the provided framework. Analyze whether the idea adheres to the principles of maintaining continuous high-value material cycles, utilizing renewable energy sources, ensuring sustainable water extraction and resource maximization, supporting biodiversity, preserving society and culture through social governance, contributing to human and species health and well-being, and creating diverse values beyond financial metrics. You will provide a score from 0 to 10, where 0 indicates no alignment and 10 signifies complete alignment with the circular economys principles. Your assessment should consider the life cycles of materials used, energy sustainability, impacts on biodiversity, cultural preservation, health implications, value generation, and overall system resilience. A thorough explanation of the score should reflect the extent to which the proposed concept integrates these seven foundational elements of the circular economy.' + replyFormat;
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
    //console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution novelty evaluation
async function solutionNoveltyEval(prompt) { 
    rolePlay = background + inputFormat + 'Your task is to assess the creativity and novelty of a proposed solution. Determine if the solution is already in existence and evaluate its uniqueness. Measure the level of innovation by examining how the solution differs from existing alternatives. Focus on various aspects of innovation, including programmatic, technical, organizational, managerial, and methodological categories. Highlight the unique aspects of the solution and their potential to influence current practices or products. You will provide a score between 0 to 10, with 0 indicating no novelty and 10 indicating a highly creative and unprecedented solution. Your evaluation should reflect the distinctiveness of the solutions approach and its ability to introduce a new value proposition that could significantly impact the status quo.' + replyFormat;
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
    //console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution financial impact evaluation
async function solutionFinImpactEval(prompt) { 
    rolePlay = background + inputFormat + 'Your role is to evaluate the financial impact of a proposed solution. Analyze its potential to generate monetary value and contribute to economic growth or savings. Consider the direct financial benefits, cost savings, revenue generation, and long-term financial sustainability of the solution.Provide a score from 0 to 10 based on the solutions capacity to create monetary value. A score of 0 would indicate no financial impact, while a score of 10 would signify a solution with significant potential for financial returns or savings. Your assessment should reflect the economic viability and potential profitability of the solution in question.' + replyFormat;
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
    //console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

//solution Implementability evaluation
async function solutionImplementabilityEval(prompt) { 
    rolePlay = background + inputFormat + 'Your role is to evaluate the implementability of a proposed solution, focusing specifically on its feasibility and scalability. You should consider the solutions alignment with market size indicators including Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM). Analyze the provided financial projections, such as initial and ongoing costs, revenue forecasts, projected profit margins, the break-even point, and Return on Investment (ROI).Provide a rating between 0 to 10 based on these factors, where 0 indicates a solution with low feasibility and scalability, and 10 represents a highly feasible and scalable solution with strong financial prospects. Your score should comprehensively reflect the practicality of the solution and its potential for market success.' + replyFormat;
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
    //console.log([score, explanation]);
    return [score, explanation];
    // return completion.choices[0].message.content;
}

// creative name
async function generateName(prompt) { 
    rolePlay = 'You possess a knack for creativity! Your challenge is to concoct a name consisting of 1 to 4 words that encapsulates the essence of the provided information. Your response should exclusively contain the name you have crafted, devoid of any additional commentary or explanation. Let your imagination lead the way to a succinct and resonant title.';
    
    n = null;
    attempts = 0;
    const maxAttempts = 3;

    while (n === null && attempts < maxAttempts) {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: rolePlay }, { role: 'user', content: prompt}],
            // model: "gpt-4",
            model: "gpt-3.5-turbo",
            max_tokens: 10,
            temperature: 0.0,
        });
        // console.log(completion.choices[0].message.content);
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
        // model: "gpt-3.5-turbo",
        model: gptModel,
        max_tokens: 10,
        temperature: 0.0,
    });
    // console.log(completion.choices[0].message.content);
    const aiResponse = completion.choices[0].message.content;
    tags = categorize(aiResponse)
    
    // console.log(categorize('Design for Longevity and Durability, Recycle and Recover'));
    // console.log(aiResponse);
    //console.log(categorize(aiResponse));
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
    rolePlay = 'Your task is to distill the essence of the given information into a concise, one-sentence summary. The structure of your response should be as follows: "Summary: [insert your succinct, clear, and comprehensive summary here in one sentence]." This summary should capture the key points or the central theme of the provided information, presented in a brief and coherent manner.';

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
    //console.log(sentence);
    return sentence;
    // return completion.choices[0].message.content;
}

p = "Problem: The majority of the materials used in producing electronic goods are not being utilized optimally. Numerous electronic devices are replaced before their lifespan ends, often due to minor malfunctioning or outdated components, resulting in significant production of electronic waste and underutilization of natural resources.  Solution: An innovative concept would be a modular electronic device model where users are able to upgrade or swap components, rather than replacing the entire device, thus promoting a circular economy. This goes beyond just restoration but rather the idea of creating an electronic gadget that thrives on reuse and modifications, maximising the life and value of each part.   Manufacturers need to design gadgets with modules for core components, allowing for easy upgrades or replacements. For instance, a smartphone could have individually upgradeable components: camera, battery, CPU, etc. When a module fails or becomes outdated, only that module needs to be replaced.  This idea promotes resource use efficiency and significantly cuts waste, under the 'reduce, reuse, repair' mantra. The replaced modules should be sent back to manufacturers for refurbishment or extraction of critical raw materials.   For businesses it opens a new market space, enabled by sale of modules and recycled components, providing long term value capture. It also increases customer loyalty as they continually engage with the manufacturers in the lifecycle of their device. The model is scalable as it allows for the continuous incorporation of technological advancements within the same core device.   This modular approach is not only novel but it clearly addresses the broader picture of how electronic devices should be designed for a circular economy, considering environmental protection, resource efficiency, economic viability, and customer value."
p1 = 'The majority of the materials used in producing electronic goods are not being utilized optimally'
// problemPopularEval(p1)
// problemGrowingEval(p1)
// problemUrgentEval(p1)
// problemExpenseEval(p1)
// problemFrequentEval(p1)
// solutionCompletenessEval(p)
// solutionTargetEval(p)
// solutionNoveltyEval(p)
// solutionFinImpactEval(p)
// console.log(solutionImplementabilityEval(p))
// generateName(p)
// generateTags(p)
// generateSummary(p);
// spamFilter(p)

module.exports = {spamFilter, problemPopularEval, problemGrowingEval, problemUrgentEval, problemExpenseEval, problemFrequentEval, solutionCompletenessEval, solutionTargetEval, solutionNoveltyEval, solutionFinImpactEval, solutionImplementabilityEval, generateName, generateTags, generateSummary};

