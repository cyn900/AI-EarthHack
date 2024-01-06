const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const { problemPopularEval, problemGrowingEval, problemUrgentEval, problemExpenseEval, problemFrequentEval, solutionCompletenessEval, solutionTargetEval, solutionNoveltyEval, solutionFinImpactEval, solutionImplementabilityEval, generateName } = require('./services/chatgptService');

const app = express();
const port = process.env.PORT || 4000;

let storedRows = null; // Global variable to store the rows data
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

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileBuffer = req.file.buffer;
        const fileContent = fileBuffer.toString('utf-8');

        // Parse CSV content (using csv-parser as an example)

        csv({ headers: false })
            .on('data', (row) => {
                if (!headers) {
                    // First row is the header
                    headers = Object.values(row);
                } else {
                    // Subsequent rows are the data
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index];
                    });
                    const prompt = req
                    const problemPopularityReply = problemPopularEval(prompt);
                    const problemGrowingReply = problemGrowingEval(prompt);
                    const problemUrgentReply = problemUrgentEval(prompt);
                    const problemExpenseReply= problemExpenseEval(prompt);
                    const problemFrequentReply  = problemFrequentEval(prompt);
                    const solutionCompletenessReply = solutionCompletenessEval(prompt);
                    const solutionTargetReply = solutionTargetEval(prompt);
                    const solutionNoveltyReply = solutionNoveltyEval(prompt);
                    const solutionFinImpactReply = solutionFinImpactEval(prompt);
                    const solutionImplementabilityReply = solutionImplementabilityEval(prompt);
                    const generateNameReply = generateName(promt);

                    rowData['problemPopularityScore'] = problemPopularityReply[0];
                    rowData['problemPopularityExplaination'] = problemPopularityReply[1];

                    rowData['problemGrowingScore'] = problemGrowingReply[0];
                    rowData['problemGrowingExplaination'] = problemGrowingReply[1];

                    rowData['problemUrgentScore'] = problemUrgentReply[0];
                    rowData['problemUrgentExplaination'] = problemUrgentReply[1];

                    rowData['problemExpenseScore'] = problemExpenseReply[0];
                    rowData['problemExpenseExplaination'] = problemExpenseReply[1];

                    rowData['problemFrequentScore'] = problemFrequentReply[0];
                    rowData['problemFrequentExplaination'] = problemFrequentReply[1];

                    rowData['solutionCompletenessScore'] = solutionCompletenessReply[0];
                    rowData['solutionCompletenessExplaination'] = solutionCompletenessReply[1];

                    rowData['solutionTargetScore'] = solutionTargetReply[0];
                    rowData['solutionTargetExplaination'] = solutionTargetReply[1];

                    rowData['solutionNoveltyScore'] = solutionNoveltyReply[0];
                    rowData['solutionNoveltyExplaination'] = solutionNoveltyReply[1];

                    rowData['solutionTargetScore'] = solutionTargetReply[0];
                    rowData['solutionTargetExplaination'] = solutionTargetReply[1];

                    rowData['solutionFinImpactScore'] = solutionFinImpactReply[0];
                    rowData['solutionFinImpactExplaination'] = solutionFinImpactReply[1];

                    rowData['solutionImplementabilityScore'] = solutionImplementabilityReply[0];
                    rowData['solutionImplementabilityExplaination'] = solutionImplementabilityReply[1];

                    rowData['name'] = generateNameReply;

                    rows.push(rowData);
                }
            })
            .write(fileContent);
    } catch (error) {
console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    storedRows = rows;
    res.json({ csvData: rows });
    // res.status(200).json({ status: 'OK' });
});

app.get('/get-stored-rows', (req, res) => {
    res.json({ storedRows });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});