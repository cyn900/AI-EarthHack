const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require('fs');
const path = require('path');
const { spamFilter, problemPopularEval, problemGrowingEval, problemUrgentEval, problemExpenseEval, problemFrequentEval, solutionCompletenessEval, solutionTargetEval, solutionNoveltyEval, solutionFinImpactEval, solutionImplementabilityEval, generateName, generateTags, generateSummary } = require('./services/chatgptService');

const app = express();
const port = process.env.PORT || 4000;

let evaluationGoal = "Evaluate real-life use cases on how companies can implement the circular economy in their businesses. New ideas are also welcome, even if they are 'moonshots'.";
let storedRows = null;
let userRatings = null;
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
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

        evaluationGoal = req.body.evaluationGoal;  // do something with evaluation goal
        const fileBuffer = req.file.buffer;
        const fileContent = fileBuffer.toString('utf-8');

        const outputCsvPath = path.join(__dirname, 'output.csv');
        const writableStream = fs.createWriteStream(outputCsvPath, { flags: 'w' });

         const newHeader = 'problem;solution;relevance;problemPopularityScore;problemPopularityExplaination;problemGrowingScore;problemGrowingExplaination;problemUrgentScore;problemUrgentExplaination;problemExpenseScore;problemExpenseExplaination;problemFrequentScore;problemFrequentExplaination;solutionCompletenessScore;solutionCompletenessExplaination;solutionCompletenessScore;solutionCompletenessExplaination;solutionTargetScore;solutionTargetExplaination;solutionNoveltyScore;solutionNoveltyExplaination;solutionFinImpactScore;solutionFinImpactExplaination;solutionImplementabilityScore;solutionImplementabilityExplaination;newName;tags;summary\n';
         writableStream.write(newHeader);

         // Example function to write a row

        function writeRow(rowData) {
            const rowString = `${rowData.problem};${rowData.solution};${rowData.relevance};${rowData.problemPopularityScore};${rowData.problemPopularityExplaination};${rowData.problemGrowingScore};${rowData.problemGrowingExplaination};${rowData.problemUrgentScore};${rowData.problemUrgentExplaination};${rowData.problemExpenseScore};${rowData.problemExpenseExplaination};${rowData.problemFrequentScore};${rowData.problemFrequentExplaination};${rowData.solutionCompletenessScore};${rowData.solutionCompletenessExplaination};${rowData.solutionTargetScore};${rowData.solutionTargetExplaination};${rowData.solutionNoveltyScore};${rowData.solutionNoveltyExplaination};${rowData.solutionFinImpactScore};${rowData.solutionFinImpactExplaination};${rowData.solutionImplementabilityScore},${rowData.solutionImplementabilityExplaination};${rowData.newName};${rowData.tags};${rowData.summary}\n`;
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
        csv({ headers: false })
            .on('data', async(row) => {
                console.log(row);
                if (!headers) {
                    // First row is the header
                    headers = Object.values(row);
                } else {
                    // Subsequent rows are the data
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index];
                    });
                    const prob = rowData['problem'];
                    // const solu = rowData['solution']
                    const prompt = 'Problem: ' + rowData['problem'] + 'Solution:' + rowData['solution'];
                    if (prob == null) {
                        return "None"; // or handle it as per your application's logic
                    }
                    const problemRegex = /Problem:\s*([^]+?)\.\s*Solution:/;
                    const problemMactch = prompt.match(problemRegex);
                    const problemDescription = problemMactch ? problemMactch[1].trim() : null;
                    //console.log(problemDescription);
                    num += 1;
                    console.log("num"+num);
                    //console.log(prompt);
                    const spamFilterReply = await spamFilter(prompt);
                    //console.log("reply" + spamFilterReply);
                    const problemPopularityReply = await problemPopularEval(prob);
                    const problemGrowingReply = await problemGrowingEval(prob);
                    const problemUrgentReply = await problemUrgentEval(prob);
                    const problemExpenseReply = await problemExpenseEval(prob);
                    const problemFrequentReply = await problemFrequentEval(prob);
                    const solutionCompletenessReply = await solutionCompletenessEval(prompt);
                    const solutionTargetReply = await solutionTargetEval(prompt);
                    const solutionNoveltyReply = await solutionNoveltyEval(prompt);
                    const solutionFinImpactReply = await solutionFinImpactEval(prompt);
                    const solutionImplementabilityReply = await solutionImplementabilityEval(prompt);
                    const generateNameReply = await generateName(prompt);
                    const generateTagsReply = await generateTags(prompt);
                    const generateSummaryReply = await generateSummary(prompt);
                    rowData.relevance = spamFilterReply; // "valid" or "invalid" where "valid means it is relevant, "invalid means it is a spam
                    //console.log(spamFilterReply);
                    rowData.problemPopularityScore = problemPopularityReply[0];
                    
                    //console.log("pop score: " + rowData['problemPopularityScore']);
                    rowData.problemPopularityExplaination = problemPopularityReply[1];

                    rowData.problemGrowingScore = problemGrowingReply[0];
                    rowData.problemGrowingExplaination = problemGrowingReply[1];

                    rowData.problemUrgentScore = problemUrgentReply[0];
                    rowData.problemUrgentExplaination = problemUrgentReply[1];

                    rowData.problemExpenseScore = problemExpenseReply[0];
                    rowData.problemExpenseExplaination = problemExpenseReply[1];

                    rowData.problemFrequentScore = problemFrequentReply[0];
                    rowData.problemFrequentExplaination = problemFrequentReply[1];

                    rowData.solutionCompletenessScore = solutionCompletenessReply[0];
                    rowData.solutionCompletenessExplaination = solutionCompletenessReply[1];

                    rowData.solutionTargetScore = solutionTargetReply[0];
                    rowData.solutionTargetExplaination = solutionTargetReply[1];

                    rowData.solutionNoveltyScore = solutionNoveltyReply[0];
                    rowData.solutionNoveltyExplaination = solutionNoveltyReply[1];

                    rowData.solutionFinImpactScore = solutionFinImpactReply[0];
                    rowData.solutionFinImpactExplaination = solutionFinImpactReply[1];

                    rowData.solutionImplementabilityScore = solutionImplementabilityReply[0];
                    rowData.solutionImplementabilityExplaination = solutionImplementabilityReply[1];

                    rowData.name = generateNameReply;
                    rowData.tags = generateTagsReply; // a list of tags ex: ['Water', 'Value'] 0<len(list)<=2
                    rowData.summary = generateSummaryReply;
                    // rows.push(rowData);
                    // console.log('rowData: ' + rowData['problem']);
                    rows.push(rowData)
                    writeRow(rowData);
                    
                    // writeRow({problem: "\""+rowData['problem']+"\"", solution: "\""+rowData['solution']+"\"", relevance: rowData['relevance'], problemPopularityScore: rowData['problemPopularityScore'],problemPopularityExplaination: "\""+rowData['problemPopularityExplaination']+"\"", problemGrowingScore: rowData['problemGrowingScore'], problemGrowingExplaination: "\""+rowData['problemGrowingExplaination']+"\"", problemUrgentScore: rowData['problemUrgentScore'], problemUrgentExplaination: "\""+rowData['problemUrgentExplaination']+"\"", problemExpenseScore: rowData['problemExpenseScore'], problemExpenseExplaination: "\""+rowData['problemExpenseExplaination']+"\"", problemFrequentScore: rowData['problemFrequentScore'], problemFrequentExplaination: "\""+rowData['problemFrequentExplaination']+"\"", solutionCompletenessScore: rowData['solutionCompletenessScore'], solutionCompletenessExplaination: "\""+rowData['solutionCompletenessExplaination']+"\"", solutionTargetScore: rowData['solutionTargetScore'], solutionTargetExplaination: "\""+rowData['solutionTargetExplaination']+"\"", solutionNoveltyScore: rowData['solutionNoveltyScore'], solutionNoveltyScore: "\""+rowData['solutionNoveltyScore'], solutionNoveltyExplaination: "\""+rowData['solutionNoveltyExplaination']+"\"", solutionFinImpactScore: rowData['solutionFinImpactScore'], solutionFinImpactExplaination: "\""+rowData['solutionFinImpactExplaination']+"\"", solutionImplementabilityScore: rowData['solutionImplementabilityScore'], solutionImplementabilityExplaination: "\""+rowData['solutionImplementabilityExplaination']+"\"", newName: rowData['newName'], tags: rowData['tags'], summary: "\""+rowData['summary']+"\""});
                }
            })
            .write(fileContent);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    storedRows = rows;
    res.json({ csvData: rows });
    console.log(storedRows);
    // res.status(200).json({ status: 'OK' });
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
    storedRows.forEach((row) => {
        if (row.relevance === 'valid') {

            const problemScore =
                row.problemPopularityScore * userRatings['Popularity'] +
                row.problemGrowingScore * userRatings['Growing'] +
                row.problemUrgentScore * userRatings['Urgent'] +
                row.problemExpenseScore * userRatings['Expense'] +
                row.problemFrequentScore * userRatings['Frequent'];

            const solutionScore =
                row.solutionCompletenessScore * userRatings['Completeness'] +
                row.solutionTargetScore * userRatings['Target'] +
                row.solutionNoveltyScore * userRatings['Novelty'] +
                row.solutionFinImpactScore * userRatings['Financial Impact'] +
                row.solutionImplementabilityScore * userRatings['Implementability'];

            row.score = problemScore + solutionScore;
        } else {
            row.score = 0;
        }
    });

    res.status(200).json({ status: 'OK' });
});

app.post('/read-csv', (req, res) => {
    const data = [];

    const csvFilePath = path.join(__dirname, 'output.csv');

    fs.createReadStream(csvFilePath, 'utf-8')
        .pipe(csv({ separator: ';' })) // Adjust the delimiter based on your CSV
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            res.json(data);
        })
        .on('error', (error) => {
            res.status(500).json({ error: 'Error parsing CSV' });
        });

    storedRows = data;
    console.log(storedRows);
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

    const relevantRows = storedRows.filter((row) => row.relevance === 'valid');
    res.json({ relevantIdeasNumber: relevantRows.length });
});

app.get('/get-average-idea-score', (req, res) => {
    if (!storedRows) {
        return res.status(400).json({ error: 'No CSV file loaded' });
    }

    const relevantRows = storedRows.filter((row) => row.relevance === 'valid');
    const sum = relevantRows.reduce((acc, row) => acc + row.score, 0);
    const average = sum / relevantRows.length;
    res.json({ averageIdeaScore: average });
});

// app.get('/get-top-5-ideas', (req, res) => {
//     if (!storedRows) {
//         return res.status(400).json({ error: 'No CSV file loaded' });
//     }
//
//     const relevantRows = storedRows.filter((row) => row.relevance === 'valid');
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
        relevantRows = storedRows.filter((row) => row.relevance === 'valid');
    } else {
        relevantRows = storedRows.filter((row) => row.relevance === 'valid' && req.query.category in row.tags);
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
    storedRows.forEach((row) => {
        if (row.relevance === 'valid') {
            const tags = row.tags;
            tags.forEach((tag) => {
                if (!tagFreq[tag]) {
                    tagFreq[tag] = 0;
                }
                tagFreq[tag] += 1;
            });
        }
    });

    res.json({ tagFreq: tagFreq });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});