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
    const response = await axios(
      `https://api.openai.com/v1/completions`,
      {
        model: `text-davinci-003`,
        prompt,
        max_tokens: 50,
      },
      {
        headers: {
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

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
