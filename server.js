const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Generate article
app.post('/generate-article', async (req, res) => {
    const { title } = req.body;
    try {
        const response = await axios.post(
            `${API_URL}?key=${process.env.AI_API_KEY}`,
            {
                contents: [{ parts: [{ text: `Write a detailed article about: ${title}` }] }]
            }
        );
        const article = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate content";
        res.json({ article });
    } catch (error) {
        console.error('Error generating article:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate article' });
    }
});

// Optimize article
app.post('/optimize-article', async (req, res) => {
    const { content } = req.body; // Use 'content' instead of 'title'
    try {
        const response = await axios.post(
            `${API_URL}?key=${process.env.AI_API_KEY}`,
            {
                contents: [{ parts: [{ text: `Optimize this article: ${content}` }] }],
            }
        );

        console.log("Full API Response:", JSON.stringify(response.data, null, 2));

        // Verify response structure before accessing
        if (!response.data || !response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content || !response.data.candidates[0].content.parts) {
            throw new Error("Unexpected API response format");
        }

        const optimizedArticle = response.data.candidates[0].content.parts[0].text || "No content generated";
        
        console.log("Extracted Optimized Article:", optimizedArticle);

        res.json({ optimizedArticle });
    } catch (error) {
        console.error("Error optimizing article:", error.message);
        res.status(500).json({ error: "Failed to optimize article" });
    }
});

app.listen(8080, () => console.log('Server running on http://localhost:8080'));