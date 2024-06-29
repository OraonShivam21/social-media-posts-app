const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the social media posts app!" });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
