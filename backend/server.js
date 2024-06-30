const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the social media posts app!" });
});

app.post("/api/generate-post", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://api.openai.com/v1/completions`,
      {
        model: `gpt-3.5-turbo-0125`,
        prompt: prompt,
        max_tokens: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const post = response.data.choices[0].text.trim();
    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(400).json({ err: "Error generating posts!", error });
  }
});

app.post("/api/save-post", async (req, res) => {
  const { prompt, post } = req.body;

  try {
    const response = await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/A1:append`,
      {
        values: [[new Date().toISOString(), prompt, post]],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
        },
        params: {
          valueInputOption: "USER_ENTERED",
        },
      }
    );

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ err: "Error saving post!", error });
  }
});

app.get("/api/get-posts", async (req, res) => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreasheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
        },
      }
    );

    res.status(200).json(response.data.value);
  } catch (error) {
    console.error(error);
    res.status(400).json({ err: "Error fetching posts", error });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
