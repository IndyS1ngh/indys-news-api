const express = require("express");
const { getTopics, getEndpoints, getArticleById } = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "internal server error" });
  }
});

module.exports = app;
