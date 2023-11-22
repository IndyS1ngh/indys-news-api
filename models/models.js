const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");
const endpoints = require("../endpoints.json");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectEndpoints = () => {
  return endpoints;
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM comments RIGHT JOIN articles ON articles.article_id = comments.article_id GROUP BY articles.article_id, articles.created_at ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      for (let i = 0; i < rows.length; i++) {
        rows[i].comment_count = +rows[i].comment_count;
      }
      return rows;
    });
};

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, newComment) => {
  const { body, username } = newComment;
  const created_at = Date.now();
  const dateObject = convertTimestampToDate({ created_at });
  const date = dateObject.created_at;

  return db
    .query(
      `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [body, username, article_id, (votes = 0), date]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
