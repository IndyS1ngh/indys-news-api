const articles = require("../db/data/test-data/articles");
const { checkExists } = require("../db/seeds/utils");
const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectArticles,
  selectCommentsByArticle,
  insertComment,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  const endpoints = selectEndpoints();
  res.status(200).send({ endpoints });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;

  const articlePromises = [selectCommentsByArticle(article_id)];

  if (article_id) {
    articlePromises.push(checkExists("articles", "article_id", article_id));
  }

  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  const articlePromises = [insertComment(article_id, newComment)];

  if (article_id) {
    articlePromises.push(checkExists("articles", "article_id", article_id));
  }

  Promise.all(articlePromises).then((resolvedPromises) => { 
    const comment = resolvedPromises[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};
