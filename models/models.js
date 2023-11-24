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
    .query(
      `SELECT articles.*, (COUNT(comments.article_id) :: INTEGER) AS comment_count FROM comments RIGHT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortCriteria = [
    "created_at",
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrderCriteria = ["asc", "desc"];
  if (!validSortCriteria.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (!validOrderCriteria.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, (COUNT(comments.article_id) :: INTEGER) AS comment_count FROM comments RIGHT JOIN articles ON articles.article_id = comments.article_id `;
  const queryValues = [];
  if (topic) {
    queryValues.push(topic);
    queryString += `WHERE topic = $1 `;
  }
  if (sort_by === "comment_count") {
    queryString += `GROUP BY articles.article_id, articles.created_at ORDER BY ${sort_by} `;
  } else {
    queryString += `GROUP BY articles.article_id, articles.created_at ORDER BY articles.${sort_by} `;
  }
  queryString += `${order};`;
  return db.query(queryString, queryValues).then(({ rows }) => {
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

  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (article_id, newVote) => {
  const { inc_votes } = newVote;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return;
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
