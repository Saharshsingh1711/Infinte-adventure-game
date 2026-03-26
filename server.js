const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve your frontend files (index.html, style.css, etc.)
app.use(express.static('.'));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Secure API route that your frontend will call
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        // The backend makes the call to Groq, keeping the API key hidden from the browser
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Use the latest supported Groq model
                messages: messages,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("\n🚨 GROQ ERROR PARSING:");
            console.error(errorText);
            throw new Error(`Groq API error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // Send the generated text back to the frontend
        res.json(data);
    } catch (error) {
        console.error("\n❌ Error calling Groq API:", error.message);
        res.status(500).json({ error: "Failed to fetch response" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Game Server is running!`);
    console.log(`👉 Open http://localhost:${PORT} in your browser to play.\n`);
});
