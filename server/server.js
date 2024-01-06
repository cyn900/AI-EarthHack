const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const { problemPopularEval, problemGrowingEval, problemUrgentEval } = require('./services/chatgptService');

const app = express();
const port = process.env.PORT || 4000;

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
                    rows.push(rowData);
                }
            })
            .write(fileContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(rows);
    res.status(200).json({ status: 'OK' });
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});