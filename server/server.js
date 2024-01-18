const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const Papa = require('papaparse');
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
let RESOLVED_CALLS = null;
let TOTAL_CALLS = null;
let USER_RATINGS = null;
let USER_PROBLEM_SIGNIFICANCE = null;
let USER_SOLUTION_SIGNIFICANCE = null;
let API_STATUS = API_READY;

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('/get-api-status', (req, res) => {
    res.status(200).json({ apiStatus: API_STATUS, resolvedCalls: RESOLVED_CALLS, totalCalls: TOTAL_CALLS });
});

app.post('/load-csv', upload.single('csvFile'), (req, res) => {
    const rows = [];
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!req.body.evaluationGoal) {
            return res.status(400).json({ error: 'No evaluation goal provided' });
        }

        API_STATUS = API_READING;
        EVALUATION_GOAL = req.body.evaluationGoal;  // do something with evaluation goal
        const csvData = req.file.buffer.toString();

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

        RESOLVED_CALLS = 0;
        TOTAL_CALLS = rows.length * 14;
        API_STATUS = API_PROCESSING;

        const allPromises = [];
        Papa.parse(csvData, {
            header: true, // Assumes the first row is the header
            dynamicTyping: true,
            skipEmptyLines: true,
            step: (result) => {
                TOTAL_CALLS += 14;

                let rowData = {'problem': result.data['problem'], 'solution': result.data['solution']};
                let prob = rowData['problem'], sol = rowData['solution'];
                if (prob === null) {
                    prob = 'Failed to read problem.';
                }
                if (sol === null) {
                    sol = 'Failed to read solution.';
                }

                const prompt = 'Problem: ' + prob + 'Solution:' + sol;
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

                const promises = [];
                promises.push(spamFilterReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.relevance = reply;
                }));

                promises.push(problemPopularityReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.problemPopularityScore = reply[0];
                    rowData.problemPopularityExplanation = reply[1];
                    problemPopularEvalHistory = problemPopularEvalHistory.concat([{
                        role: 'user',
                        content: prob
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(problemGrowingReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.problemGrowingScore = reply[0];
                    rowData.problemGrowingExplanation = reply[1];
                    problemGrowingEvalHistory = problemGrowingEvalHistory.concat([{
                        role: 'user',
                        content: prob
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(problemUrgentReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.problemUrgentScore = reply[0];
                    rowData.problemUrgentExplanation = reply[1];
                    problemUrgentEvalHistory = problemUrgentEvalHistory.concat([{
                        role: 'user',
                        content: prob
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(problemExpenseReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.problemExpenseScore = reply[0];
                    rowData.problemExpenseExplanation = reply[1];
                    problemExpenseEvalHistory = problemExpenseEvalHistory.concat([{
                        role: 'user',
                        content: prob
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(problemFrequentReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.problemFrequentScore = reply[0];
                    rowData.problemFrequentExplanation = reply[1];
                    problemFrequentEvalHistory = problemFrequentEvalHistory.concat([{
                        role: 'user',
                        content: prob
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(solutionCompletenessReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.solutionCompletenessScore = reply[0];
                    rowData.solutionCompletenessExplanation = reply[1];
                    solutionCompletenessEvalHistory = solutionCompletenessEvalHistory.concat([{
                        role: 'user',
                        content: prompt
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(solutionTargetReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.solutionTargetScore = reply[0];
                    rowData.solutionTargetExplanation = reply[1];
                    solutionTargetEvalHistory = solutionTargetEvalHistory.concat([{
                        role: 'user',
                        content: prompt
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(solutionNoveltyReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.solutionNoveltyScore = reply[0];
                    rowData.solutionNoveltyExplanation = reply[1];
                    solutionNoveltyEvalHistory = solutionNoveltyEvalHistory.concat([{
                        role: 'user',
                        content: prompt
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(solutionFinImpactReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.solutionFinImpactScore = reply[0];
                    rowData.solutionFinImpactExplanation = reply[1];
                    solutionFinImpactEvalHistory = solutionFinImpactEvalHistory.concat([{
                        role: 'user',
                        content: prompt
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(solutionImplementabilityReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.solutionImplementabilityScore = reply[0];
                    rowData.solutionImplementabilityExplanation = reply[1];
                    solutionImplementabilityEvalHistory = solutionImplementabilityEvalHistory.concat([{
                        role: 'user',
                        content: prompt
                    }, {role: 'system', content: 'Score: ' + reply[0] + '\n Explanation: ' + reply[1]}]);
                }));

                promises.push(generateNameReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.newName = reply;
                    generateNameHistory = generateNameHistory.concat([{
                        role: 'user',
                        content: prompt
                    }, {role: 'system', content: reply}]);
                }));

                promises.push(generateTagsReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.tags = reply;
                }));

                promises.push(generateSummaryReply.then((reply) => {
                    RESOLVED_CALLS += 1;
                    rowData.summary = reply;
                }));

                allPromises.push(promises);
                Promise.all(promises).then(() => {
                    rows.push(rowData);
                });
            },
            complete: () => {
                const flattenedPromises = allPromises.flat();
                Promise.all(flattenedPromises)
                    .then(() => {
                        PROCESSED_ROWS = rows;

                        const outputCsvPath = path.join(__dirname, 'output.csv');
                        const outputCsvData = Papa.unparse(rows, { delimiter: ';' });
                        fs.writeFileSync(outputCsvPath, outputCsvData);

                        res.status(200).json({ status: 'OK' });
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: 'Internal Server Error' });
                    })
                    .finally(() => {
                        API_STATUS = API_READY;
                    });
            },
            error: (err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
    USER_PROBLEM_SIGNIFICANCE = req.body.problemSignificance;
    USER_SOLUTION_SIGNIFICANCE = req.body.solutionSignificance;

    if (!(USER_PROBLEM_SIGNIFICANCE >= 0 && USER_SOLUTION_SIGNIFICANCE >= 0 && USER_PROBLEM_SIGNIFICANCE + USER_SOLUTION_SIGNIFICANCE === 100)) {
        return res.status(400).json({ error: 'Invalid problem and solution significance' });
    }

    PROCESSED_ROWS.forEach((row) => {
        if (row.relevance === 'Valid') {
            const problemSum = USER_RATINGS['Popularity'] + USER_RATINGS['Growing'] + USER_RATINGS['Urgent'] + USER_RATINGS['Expensive'] + USER_RATINGS['Frequent'];
            const solutionSum = USER_RATINGS['Completeness'] + USER_RATINGS['Targeted'] + USER_RATINGS['Novelty'] + USER_RATINGS['Financial Impact'] + USER_RATINGS['Implementability'];

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

            const score = problemScore / (10 * problemSum) * USER_PROBLEM_SIGNIFICANCE
                + solutionScore / (10 * solutionSum) * USER_SOLUTION_SIGNIFICANCE
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
    res.json({ relevantIdeasNumber: relevantRows.length, totalIdeasNumber: PROCESSED_ROWS.length });
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