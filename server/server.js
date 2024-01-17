const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require('fs');
const path = require('path');
const { spamFilter, problemPopularEval, problemGrowingEval, problemUrgentEval, problemExpenseEval, problemFrequentEval, solutionCompletenessEval, solutionTargetEval, solutionNoveltyEval, solutionFinImpactEval, solutionImplementabilityEval, generateName, generateTags, generateSummary } = require('./services/chatgptService');

const app = express();
const port = process.env.PORT || 4000;
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const API_READY = 'ready';
const API_READING = 'reading';
const API_PROCESSING = 'processing';
const API_CALCULATING = 'calculating';

let EVALUATION_GOAL = null;
let PROCESSED_ROWS = null;
let TOTAL_ROWS = null;
let USER_RATINGS = null;
let API_STATUS = API_READY;

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('/get-api-status', (req, res) => {
    res.status(200).json({ apiStatus: API_STATUS });
});

app.post('/load-csv', upload.single('csvFile'), (req, res) => {
    const rows = [];
    let headers = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!req.body.evaluationGoal) {
            return res.status(400).json({ error: 'No evaluation goal provided' });
        }

        API_STATUS = API_READING;
        EVALUATION_GOAL = req.body.evaluationGoal;  // do something with evaluation goal
        const fileBuffer = req.file.buffer;
        const fileContent = fileBuffer.toString('utf-8');

        const outputCsvPath = path.join(__dirname, 'output.csv');
        const writableStream = fs.createWriteStream(outputCsvPath, { flags: 'w' });

        const newHeader = 'problem;solution;relevance;problemPopularityScore;problemPopularityExplanation;problemGrowingScore;problemGrowingExplanation;problemUrgentScore;problemUrgentExplanation;problemExpenseScore;problemExpenseExplanation;problemFrequentScore;problemFrequentExplanation;solutionCompletenessScore;solutionCompletenessExplanation;solutionTargetScore;solutionTargetExplanation;solutionNoveltyScore;solutionNoveltyExplanation;solutionFinImpactScore;solutionFinImpactExplanation;solutionImplementabilityScore;solutionImplementabilityExplanation;newName;tags;summary\n';
        writableStream.write(newHeader);

        // Example function to write a row

        function writeRow(rowData) {
            const rowString = `${rowData.problem};${rowData.solution};${rowData.relevance};${rowData.problemPopularityScore};${rowData.problemPopularityExplanation};${rowData.problemGrowingScore};${rowData.problemGrowingExplanation};${rowData.problemUrgentScore};${rowData.problemUrgentExplanation};${rowData.problemExpenseScore};${rowData.problemExpenseExplanation};${rowData.problemFrequentScore};${rowData.problemFrequentExplanation};${rowData.solutionCompletenessScore};${rowData.solutionCompletenessExplanation};${rowData.solutionTargetScore};${rowData.solutionTargetExplanation};${rowData.solutionNoveltyScore};${rowData.solutionNoveltyExplanation};${rowData.solutionFinImpactScore};${rowData.solutionFinImpactExplanation};${rowData.solutionImplementabilityScore};${rowData.solutionImplementabilityExplanation};${rowData.newName};${rowData.tags};${rowData.summary}\n`;
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
        let problemPopularEvalHistory = [];
        let problemGrowingEvalHistory = [];
        let problemUrgentEvalHistory = [];
        let problemExpenseEvalHistory = [];
        let problemFrequentEvalHistory = [];

        let solutionCompletenessEvalHistory = [];
        let solutionTargetEvalHistory = [];
        let solutionNoveltyEvalHistory = [];
        let solutionFinImpactEvalHistory = [];
        let solutionImplementabilityEvalHistory = [];

        let generateNameHistory = [];

        csv({ headers: false })
            .on('data', (row) => {
                return new Promise((resolve) => {
                    if (!headers) {
                        // First row is the header
                        headers = Object.values(row);
                        resolve();
                    } else {
                        const rowData = {};
                        headers.forEach((header, index) => {
                            rowData[header] = row[index];
                        });
                        rows.push(rowData);
                        resolve();
                    }
                });
            })
            .write(fileContent)

        TOTAL_ROWS = rows.length;
        API_STATUS = API_PROCESSING;

        rows.forEach(rowData => {
            let prob = rowData['problem'], sol = rowData['solution'];
            if (prob === null) {
                prob = 'Failed to read problem.';
            }
            if (sol === null) {
                sol = 'Failed to read solution.';
            }

            const prompt = 'Problem: ' + prob + 'Solution:' + sol;
            // const problemRegex = /Problem:\s*([^]+?)\.\s*Solution:/;
            // const problemMatch = prompt.match(problemRegex);
            // const problemDescription = problemMatch ? problemMatch[1].trim() : null;

            const spamFilterReply = spamFilter(prompt);
            const generateTagsReply = generateTags(prompt);
            const problemPopularityReply = problemPopularEval(prob, problemPopularEvalHistory, EVALUATION_GOAL);
            const problemGrowingReply = problemGrowingEval(prob, problemGrowingEvalHistory, EVALUATION_GOAL);
            const problemUrgentReply = problemUrgentEval(prob, problemUrgentEvalHistory, EVALUATION_GOAL);
            const problemExpenseReply = problemExpenseEval(prob, problemExpenseEvalHistory, EVALUATION_GOAL);
            const problemFrequentReply = problemFrequentEval(prob, problemFrequentEvalHistory, EVALUATION_GOAL);
            const solutionCompletenessReply = solutionCompletenessEval(prompt, solutionCompletenessEvalHistory, EVALUATION_GOAL);
            const solutionTargetReply = solutionTargetEval(prompt, solutionTargetEvalHistory, EVALUATION_GOAL, generateTagsReply);
            const solutionNoveltyReply = solutionNoveltyEval(prompt, solutionNoveltyEvalHistory, EVALUATION_GOAL);
            const solutionFinImpactReply = solutionFinImpactEval(prompt, solutionFinImpactEvalHistory, EVALUATION_GOAL);
            const solutionImplementabilityReply = solutionImplementabilityEval(prompt, solutionImplementabilityEvalHistory, EVALUATION_GOAL);
            const generateNameReply = generateName(prompt, generateNameHistory);
            const generateSummaryReply = generateSummary(prompt);
            rowData.relevance = spamFilterReply; // "valid" or "invalid" where "valid means it is relevant, "invalid means it is a spam

            rowData.problemPopularityScore = problemPopularityReply[0];
            rowData.problemPopularityExplanation = problemPopularityReply[1];
            problemPopularEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemPopularityReply[0] + '\n Explanation: ' + problemPopularityReply[1]}]);

            rowData.problemGrowingScore = problemGrowingReply[0];
            rowData.problemGrowingExplanation = problemGrowingReply[1];
            problemGrowingEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemGrowingReply[0] + '\n Explanation: ' + problemGrowingReply[1]}]);

            rowData.problemUrgentScore = problemUrgentReply[0];
            rowData.problemUrgentExplanation = problemUrgentReply[1];
            problemUrgentEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemUrgentReply[0] + '\n Explanation: ' + problemUrgentReply[1]}]);

            rowData.problemExpenseScore = problemExpenseReply[0];
            rowData.problemExpenseExplanation = problemExpenseReply[1];
            problemExpenseEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemExpenseReply[0] + '\n Explanation: ' + problemExpenseReply[1]}]);

            rowData.problemFrequentScore = problemFrequentReply[0];
            rowData.problemFrequentExplanation = problemFrequentReply[1];
            problemFrequentEvalHistory.concat([{ role: 'user', content: prob},{ role: 'system', content: 'Score: ' + problemFrequentReply[0] + '\n Explanation: ' + problemFrequentReply[1]}]);

            rowData.solutionCompletenessScore = solutionCompletenessReply[0];
            rowData.solutionCompletenessExplanation = solutionCompletenessReply[1];
            solutionCompletenessEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionCompletenessReply[0] + '\n Explanation: ' + solutionCompletenessReply[1]}]);

            rowData.solutionTargetScore = solutionTargetReply[0];
            rowData.solutionTargetExplanation = solutionTargetReply[1];
            solutionTargetEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionTargetReply[0] + '\n Explanation: ' + solutionTargetReply[1]}]);

            rowData.solutionNoveltyScore = solutionNoveltyReply[0];
            rowData.solutionNoveltyExplanation = solutionNoveltyReply[1];
            solutionNoveltyEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionNoveltyReply[0] + '\n Explanation: ' + solutionNoveltyReply[1]}]);

            rowData.solutionFinImpactScore = solutionFinImpactReply[0];
            rowData.solutionFinImpactExplanation = solutionFinImpactReply[1];
            solutionFinImpactEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionFinImpactReply[0] + '\n Explanation: ' + solutionFinImpactReply[1]}]);

            rowData.solutionImplementabilityScore = solutionImplementabilityReply[0];
            rowData.solutionImplementabilityExplanation = solutionImplementabilityReply[1];
            solutionImplementabilityEvalHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: 'Score: ' + solutionImplementabilityReply[0] + '\n Explanation: ' + solutionImplementabilityReply[1]}]);

            rowData.newName = generateNameReply;
            generateNameHistory.concat([{ role: 'user', content: prompt},{ role: 'system', content: generateNameReply}]);

            rowData.tags = generateTagsReply; // a list of tags ex: ['Water', 'Value'] 0<len(list)<=2
            rowData.summary = generateSummaryReply;
            rows.push(rowData);
            writeRow(rowData);
        });

        PROCESSED_ROWS = rows;
        // res.json({ csvData: rows });
        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        API_STATUS = API_READY;
    }
});

app.post('/load-user-rating', (req, res) => {
    if (!PROCESSED_ROWS) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    if (!req.body.rating) {
        return res.status(400).json({ error: 'No problem provided' });
    }

    API_STATUS = API_CALCULATING;

    USER_RATINGS = req.body.rating;
    PROCESSED_ROWS.forEach((row) => {
        if (row.relevance === 'Valid') {
            const problemSum = USER_RATINGS['Popularity'] + USER_RATINGS['Growing'] + USER_RATINGS['Urgent'] + USER_RATINGS['Expensive'] + USER_RATINGS['Frequent'];
            const solutionSum = USER_RATINGS['Completeness'] + USER_RATINGS['Targeted'] + USER_RATINGS['Novelty'] + USER_RATINGS['Financial Impact'] + USER_RATINGS['Implementability'];
            const totalSum = problemSum + solutionSum;

            const problemScore =
                parseFloat(row.problemPopularityScore) * USER_RATINGS['Popularity'] +
                parseFloat(row.problemGrowingScore) * USER_RATINGS['Growing'] +
                parseFloat(row.problemUrgentScore) * USER_RATINGS['Urgent'] +
                parseFloat(row.problemExpenseScore) * USER_RATINGS['Expensive'] +
                parseFloat(row.problemFrequentScore) * USER_RATINGS['Frequent'];

            const solutionScore =
                parseFloat(row.solutionCompletenessScore) * USER_RATINGS['Completeness'] +
                parseFloat(row.solutionTargetScore) * USER_RATINGS['Targeted'] +
                parseFloat(row.solutionNoveltyScore) * USER_RATINGS['Novelty'] +
                parseFloat(row.solutionFinImpactScore) * USER_RATINGS['Financial Impact'] +
                parseFloat(row.solutionImplementabilityScore) * USER_RATINGS['Implementability'];

            const score = (problemScore + solutionScore) / totalSum * 10;
            row.score = score.toFixed(2);
        } else {
            row.score = 0;
        }
    });

    API_STATUS = API_READY;
    res.status(200).json({ status: 'OK' });
});

app.post('/read-csv', (req, res) => {
    const data = [];
    const csvFilePath = path.join(__dirname, 'output.csv');

    const processData = () => {
        const data = [];

        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(csvFilePath, 'utf-8');

            stream.pipe(csv({ separator: ';' }))
                .on('data', (row) => {
                    data.push(row);
                })
                .on('end', () => {
                    resolve(data);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    };

    processData()
        .then((data) => {
            PROCESSED_ROWS = data;
            res.json(data);
        })
        .catch((error) => {
            console.error('Error parsing CSV:', error);
        });
});

app.get('/get-evaluation-goal', (req, res) => {
    if (!EVALUATION_GOAL) {
        return res.status(400).json({ error: 'No evaluation goal provided' });
    }

    res.json({ evaluationGoal: EVALUATION_GOAL });
});

app.get('/get-relevant-ideas-number', (req, res) => {
    if (!PROCESSED_ROWS) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const relevantRows = PROCESSED_ROWS.filter((row) => row.relevance === 'Valid');
    res.json({ relevantIdeasNumber: relevantRows.length, totalIdeasNumber: TOTAL_ROWS });
});

app.get('/get-average-idea-score', (req, res) => {
    if (!PROCESSED_ROWS) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const relevantRows = PROCESSED_ROWS.filter((row) => row.relevance === 'Valid');
    const sum = relevantRows.reduce((acc, row) => acc + parseFloat(row.score), 0);
    const average = sum / relevantRows.length;
    res.json({ averageIdeaScore: average.toFixed(2) });
});

app.get('/get-top-5-ideas-by-category', (req, res) => {
    if (!PROCESSED_ROWS) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    let relevantRows = null;
    if (req.query.category === 'All') {
        relevantRows = PROCESSED_ROWS.filter((row) => row.relevance === 'Valid');
    } else {
        relevantRows = PROCESSED_ROWS.filter((row) => row.relevance === 'Valid' && req.query.category === row.tags);
    }
    relevantRows.sort((a, b) => b.score - a.score);

    const top5Rows = relevantRows.slice(0, 5);
    res.json({ top5Rows: top5Rows });
});

app.get('/get-tag-frequency', (req, res) => {
    if (!PROCESSED_ROWS) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const tagFreq = {};
    for (const row of PROCESSED_ROWS) {
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

app.get('/get-idea-by-pagination', (req, res) => {
    if (!PROCESSED_ROWS) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const relevantRows = PROCESSED_ROWS.filter((row) => row.relevance === 'Valid');
    relevantRows.sort((a, b) => b.score - a.score);

    const total = relevantRows.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const rows = relevantRows.slice(start, end);

    res.json({ ideas: rows, totalPages: totalPages });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});