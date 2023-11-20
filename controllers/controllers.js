const { selectTopics, selectEndpoints, selectArticleById } = require("../models/models")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
    const endpoints = selectEndpoints();
    res.status(200).send({ endpoints: endpoints });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    }).catch(next);
};