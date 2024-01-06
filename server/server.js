const express = require("express");
const app = express();
const cors = require("cors");
const { generateResponse } = require('./services/chatgptService');

require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

app.post('/chatgpt', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await generateResponse(prompt);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get driver connection
const dbo = require("./db/conn");
app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});