const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticle,
  postComment,
} = require("./controllers/controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
