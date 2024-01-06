const express = require("express");
const cors = require("cors");
const { generateResponse } = require('./services/chatgptService');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.post('/chatgpt', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await generateResponse(prompt);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});