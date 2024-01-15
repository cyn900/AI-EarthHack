const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require('fs');
const path = require('path');
const { spamFilter, problemPopularEval, problemGrowingEval, problemUrgentEval, problemExpenseEval, problemFrequentEval, solutionCompletenessEval, solutionTargetEval, solutionNoveltyEval, solutionFinImpactEval, solutionImplementabilityEval, generateName, generateTags, generateSummary } = require('./services/chatgptService');

const app = express();
const port = process.env.PORT || 4000;

let evaluationGoal = null;
let storedRows = null;
let userRatings = null;
let apiStatus = 'ok';
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const generateScore = () => {
    if (!storedRows || !userRatings) {
        return;
    }

    storedRows.forEach((row) => {
        if (row.relevance === 'Valid') {
            const problemSum = userRatings['Popularity'] + userRatings['Growing'] + userRatings['Urgent'] + userRatings['Expensive'] + userRatings['Frequent'];
            const solutionSum = userRatings['Completeness'] + userRatings['Targeted'] + userRatings['Novelty'] + userRatings['Financial Impact'] + userRatings['Implementability'];
            const totalSum = problemSum + solutionSum;

            const problemScore =
                parseFloat(row.problemPopularityScore) * userRatings['Popularity'] +
                parseFloat(row.problemGrowingScore) * userRatings['Growing'] +
                parseFloat(row.problemUrgentScore) * userRatings['Urgent'] +
                parseFloat(row.problemExpenseScore) * userRatings['Expensive'] +
                parseFloat(row.problemFrequentScore) * userRatings['Frequent'];

            const solutionScore =
                parseFloat(row.solutionCompletenessScore) * userRatings['Completeness'] +
                parseFloat(row.solutionTargetScore) * userRatings['Targeted'] +
                parseFloat(row.solutionNoveltyScore) * userRatings['Novelty'] +
                parseFloat(row.solutionFinImpactScore) * userRatings['Financial Impact'] +
                parseFloat(row.solutionImplementabilityScore) * userRatings['Implementability'];

            const score = (problemScore + solutionScore) / totalSum * 10;
            row.score = score.toFixed(2);
        } else {
            row.score = 0;
        }
    });
}

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('/get-api-status', (req, res) => {
    res.status(200).json({ apiStatus: apiStatus });
});

app.post('/load-csv', upload.single('csvFile'), (req, res) => {
    const rows = [];
    let headers = null;
    let num = 0;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!req.body.evaluationGoal) {
            return res.status(400).json({ error: 'No evaluation goal provided' });
        }

        apiStatus = 'processing file';

        evaluationGoal = req.body.evaluationGoal;  // do something with evaluation goal
        const fileBuffer = req.file.buffer;
        const fileContent = fileBuffer.toString('utf-8');

        const outputCsvPath = path.join(__dirname, 'output.csv');
        const writableStream = fs.createWriteStream(outputCsvPath, { flags: 'w' });

        const newHeader = 'problem;solution;relevance;problemPopularityScore;problemPopularityExplaination;problemGrowingScore;problemGrowingExplaination;problemUrgentScore;problemUrgentExplaination;problemExpenseScore;problemExpenseExplaination;problemFrequentScore;problemFrequentExplaination;solutionCompletenessScore;solutionCompletenessExplaination;solutionTargetScore;solutionTargetExplaination;solutionNoveltyScore;solutionNoveltyExplaination;solutionFinImpactScore;solutionFinImpactExplaination;solutionImplementabilityScore;solutionImplementabilityExplaination;newName;tags;summary\n';
        writableStream.write(newHeader);

        // Example function to write a row

        function writeRow(rowData) {
            const rowString = `${rowData.problem};${rowData.solution};${rowData.relevance};${rowData.problemPopularityScore};${rowData.problemPopularityExplaination};${rowData.problemGrowingScore};${rowData.problemGrowingExplaination};${rowData.problemUrgentScore};${rowData.problemUrgentExplaination};${rowData.problemExpenseScore};${rowData.problemExpenseExplaination};${rowData.problemFrequentScore};${rowData.problemFrequentExplaination};${rowData.solutionCompletenessScore};${rowData.solutionCompletenessExplaination};${rowData.solutionTargetScore};${rowData.solutionTargetExplaination};${rowData.solutionNoveltyScore};${rowData.solutionNoveltyExplaination};${rowData.solutionFinImpactScore};${rowData.solutionFinImpactExplaination};${rowData.solutionImplementabilityScore};${rowData.solutionImplementabilityExplaination};${rowData.newName};${rowData.tags};${rowData.summary}\n`;
            writableStream.write(rowString);
        }
        // Parse CSV content (using csv-parser as an example)
        // const tempFilePath = path.join(__dirname, 'tempFile.csv');
        
        // // Write the uploaded content to the temporary file
        // fs.writeFileSync(tempFilePath, fileContent);
        // // Append an empty line to the temporary file
        // fs.appendFileSync(tempFilePath, '\n');
        // // Now read and process the temporary file
        // fs.createReadStream(tempFilePath)
        //     .pipe(csv({ headers: false }))
        problemPopularEvalHistory = [];
        problemGrowingEvalHistory = [];
        problemUrgentEvalHistory = [];
        problemExpenseEvalHistory = [];
        problemFrequentEvalHistory = [];

        solutionCompletenessEvalHistory = [];
        solutionTargetEvalHistory = [];
        solutionNoveltyEvalHistory = [];
        solutionFinImpactEvalHistory = [];
        solutionImplementabilityEvalHistory = [];

        generateNameHistory = [];
        
        csv({ headers: false })
            .on('data', async(row) => {
                if (!headers) {
                    // First row is the header
                    headers = Object.values(row);
                } else {
                    // Subsequent rows are the data
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index];
                    });
                    let prob = rowData['problem'];
                    // const solu = rowData['solution']
                    const prompt = 'Problem: ' + rowData['problem'] + 'Solution:' + rowData['solution'];
                    if (prob == null) {
                        prob = 'Failed to read.'; // or handle it as per your application's logic
                    }
                    // const problemRegex = /Problem:\s*([^]+?)\.\s*Solution:/;
                    // const problemMactch = prompt.match(problemRegex);
                    // const problemDescription = problemMactch ? problemMactch[1].trim() : null;
                    //console.log(problemDescription);

                    num += 1;
                    //console.log(prompt);
                    const spamFilterReply = await spamFilter(prompt);
                    //console.log("reply" + spamFilterReply);
                    const problemPopularityReply = await problemPopularEval(prob, problemPopularEvalHistory, evaluationGoal);
                    const problemGrowingReply = await problemGrowingEval(prob, problemGrowingEvalHistory, evaluationGoal);
                    const problemUrgentReply = await problemUrgentEval(prob, problemUrgentEvalHistory, evaluationGoal);
                    const problemExpenseReply = await problemExpenseEval(prob, problemExpenseEvalHistory, evaluationGoal);
                    const problemFrequentReply = await problemFrequentEval(prob, problemFrequentEvalHistory, evaluationGoal);
                    const solutionCompletenessReply = await solutionCompletenessEval(prompt, solutionCompletenessEvalHistory, evaluationGoal);
                    const solutionTargetReply = await solutionTargetEval(prompt, solutionTargetEvalHistory, evaluationGoal);
                    const solutionNoveltyReply = await solutionNoveltyEval(prompt, solutionNoveltyEvalHistory, evaluationGoal);
                    const solutionFinImpactReply = await solutionFinImpactEval(prompt, solutionFinImpactEvalHistory, evaluationGoal);
                    const solutionImplementabilityReply = await solutionImplementabilityEval(prompt, solutionImplementabilityEvalHistory, evaluationGoal);
                    const generateNameReply = await generateName(prompt, generateNameHistory);
                    const generateTagsReply = await generateTags(prompt);
                    const generateSummaryReply = await generateSummary(prompt);
                    rowData.relevance = spamFilterReply; // "valid" or "invalid" where "valid means it is relevant, "invalid means it is a spam
                    //console.log(spamFilterReply);

                    rowData.problemPopularityScore = problemPopularityReply[0];
                    rowData.problemPopularityExplaination = problemPopularityReply[1];
                    problemPopularEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemPopularityReply[0] + '\n Explaination: ' + problemPopularityReply[1]}]);

                    rowData.problemGrowingScore = problemGrowingReply[0];
                    rowData.problemGrowingExplaination = problemGrowingReply[1];
                    problemGrowingEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemGrowingReply[0] + '\n Explaination: ' + problemGrowingReply[1]}]);

                    rowData.problemUrgentScore = problemUrgentReply[0];
                    rowData.problemUrgentExplaination = problemUrgentReply[1];
                    problemUrgentEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemUrgentReply[0] + '\n Explaination: ' + problemUrgentReply[1]}]);

                    rowData.problemExpenseScore = problemExpenseReply[0];
                    rowData.problemExpenseExplaination = problemExpenseReply[1];
                    problemExpenseEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemExpenseReply[0] + '\n Explaination: ' + problemExpenseReply[1]}]);

                    rowData.problemFrequentScore = problemFrequentReply[0];
                    rowData.problemFrequentExplaination = problemFrequentReply[1];
                    problemFrequentEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemFrequentReply[0] + '\n Explaination: ' + problemFrequentReply[1]}]);

                    rowData.solutionCompletenessScore = solutionCompletenessReply[0];
                    rowData.solutionCompletenessExplaination = solutionCompletenessReply[1];
                    solutionCompletenessEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionCompletenessReply[0] + '\n Explaination: ' + solutionCompletenessReply[1]}]);

                    rowData.solutionTargetScore = solutionTargetReply[0];
                    rowData.solutionTargetExplaination = solutionTargetReply[1];
                    solutionTargetEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionTargetReply[0] + '\n Explaination: ' + solutionTargetReply[1]}]);

                    rowData.solutionNoveltyScore = solutionNoveltyReply[0];
                    rowData.solutionNoveltyExplaination = solutionNoveltyReply[1];
                    solutionNoveltyEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionNoveltyReply[0] + '\n Explaination: ' + solutionNoveltyReply[1]}]);

                    rowData.solutionFinImpactScore = solutionFinImpactReply[0];
                    rowData.solutionFinImpactExplaination = solutionFinImpactReply[1];
                    solutionFinImpactEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionFinImpactReply[0] + '\n Explaination: ' + solutionFinImpactReply[1]}]);

                    rowData.solutionImplementabilityScore = solutionImplementabilityReply[0];
                    rowData.solutionImplementabilityExplaination = solutionImplementabilityReply[1];
                    solutionImplementabilityEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionImplementabilityReply[0] + '\n Explaination: ' + solutionImplementabilityReply[1]}]);

                    rowData.newName = generateNameReply;
                    generateNameHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: generateNameReply}]);

                    rowData.tags = generateTagsReply; // a list of tags ex: ['Water', 'Value'] 0<len(list)<=2
                    rowData.summary = generateSummaryReply;
                    // rows.push(rowData);
                    // console.log('rowData: ' + rowData['problem']);
                    rows.push(rowData);
                    writeRow(rowData);
                    
                    // writeRow({problem: "\""+rowData['problem']+"\"", solution: "\""+rowData['solution']+"\"", relevance: rowData['relevance'], problemPopularityScore: rowData['problemPopularityScore'],problemPopularityExplaination: "\""+rowData['problemPopularityExplaination']+"\"", problemGrowingScore: rowData['problemGrowingScore'], problemGrowingExplaination: "\""+rowData['problemGrowingExplaination']+"\"", problemUrgentScore: rowData['problemUrgentScore'], problemUrgentExplaination: "\""+rowData['problemUrgentExplaination']+"\"", problemExpenseScore: rowData['problemExpenseScore'], problemExpenseExplaination: "\""+rowData['problemExpenseExplaination']+"\"", problemFrequentScore: rowData['problemFrequentScore'], problemFrequentExplaination: "\""+rowData['problemFrequentExplaination']+"\"", solutionCompletenessScore: rowData['solutionCompletenessScore'], solutionCompletenessExplaination: "\""+rowData['solutionCompletenessExplaination']+"\"", solutionTargetScore: rowData['solutionTargetScore'], solutionTargetExplaination: "\""+rowData['solutionTargetExplaination']+"\"", solutionNoveltyScore: rowData['solutionNoveltyScore'], solutionNoveltyScore: "\""+rowData['solutionNoveltyScore'], solutionNoveltyExplaination: "\""+rowData['solutionNoveltyExplaination']+"\"", solutionFinImpactScore: rowData['solutionFinImpactScore'], solutionFinImpactExplaination: "\""+rowData['solutionFinImpactExplaination']+"\"", solutionImplementabilityScore: rowData['solutionImplementabilityScore'], solutionImplementabilityExplaination: "\""+rowData['solutionImplementabilityExplaination']+"\"", newName: rowData['newName'], tags: rowData['tags'], summary: "\""+rowData['summary']+"\""});
                }
            })
            .write(fileContent);

        storedRows = rows;
        // res.json({ csvData: rows });
        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        apiStatus = 'done';
    }
});

app.post('/load-user-rating', (req, res) => {
    if (!storedRows) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    if (!req.body.rating) {
        return res.status(400).json({ error: 'No problem provided' });
    }
    userRatings = req.body.rating;

    // generate scores for each row
    generateScore();
    res.status(200).json({ status: 'OK' });
});

app.post('/read-csv', (req, res) => {
    const data = [];
    const csvFilePath = path.join(__dirname, 'output.csv');

    const processData = async () => {
        try {
            const data = [];
            await new Promise((resolve, reject) => {
                fs.createReadStream(csvFilePath, 'utf-8')
                    .pipe(csv({ separator: ';' }))
                    .on('data', (row) => {
                        data.push(row);
                    })
                    .on('end', () => {
                        resolve();
                    })
                    .on('error', (error) => {
                        reject(error);
                    });
            });

            // Now `data` is available here
            storedRows = data;
            res.json(data);
        } catch (error) {
            console.error('Error parsing CSV:', error);
        }
    };

    processData();
});


app.get('/get-evaluation-goal', (req, res) => {
    if (!evaluationGoal) {
        return res.status(400).json({ error: 'No evaluation goal provided' });
    }

    res.json({ evaluationGoal: evaluationGoal });
});

app.get('/get-relevant-ideas-number', (req, res) => {
    if (!storedRows) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const relevantRows = storedRows.filter((row) => row.relevance === 'Valid');
    res.json({ relevantIdeasNumber: relevantRows.length });
});

app.get('/get-average-idea-score', (req, res) => {
    if (!storedRows) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const relevantRows = storedRows.filter((row) => row.relevance === 'Valid');
    const sum = relevantRows.reduce((acc, row) => acc + parseFloat(row.score), 0);
    const average = sum / relevantRows.length;

    console.log(sum, relevantRows.length, average)
    res.json({ averageIdeaScore: average.toFixed(2) });
});

// app.get('/get-top-5-ideas', (req, res) => {
//     if (!storedRows) {
//         return res.status(400).json({ error: 'No CSV file loaded' });
//     }
//
//     const relevantRows = storedRows.filter((row) => row.relevance === 'Valid');
//     relevantRows.sort((a, b) => b.score - a.score);
//
//     const top5Rows = relevantRows.slice(0, 5);
//     res.json({ top5Rows: top5Rows });
// });

app.get('/get-top-5-ideas-by-category', (req, res) => {
    if (!storedRows) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    let relevantRows = null;
    if (req.query.category === 'All') {
        relevantRows = storedRows.filter((row) => row.relevance === 'Valid');
    } else {
        relevantRows = storedRows.filter((row) => row.relevance === 'Valid' && req.query.category === row.tags);
    }
    relevantRows.sort((a, b) => b.score - a.score);

    const top5Rows = relevantRows.slice(0, 5);
    res.json({ top5Rows: top5Rows });
});

app.get('/get-tag-frequency', (req, res) => {
    if (!storedRows) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const tagFreq = {};
    for (const row of storedRows) {
        if (row.relevance === 'Valid') {
            if (row.tags in tagFreq) {
                tagFreq[row.tags] += 1;
            } else {
                tagFreq[row.tags] = 1;
            }
        }
    }

    res.json({ tagFreq: tagFreq });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});