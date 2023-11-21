const db = require("../db/connection");
const { createLookupObject } = require("../db/seeds/utils");
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
  const lookupObjPromise = db
    .query(
      `SELECT article_id, COUNT(article_id) as comment_count FROM comments GROUP BY article_id;`
    )
    .then(({ rows }) => {
      const lookupObj = createLookupObject(rows, "article_id", "comment_count");
      return lookupObj;
    });
  const articlesPromise = db
    .query(`SELECT * FROM articles ORDER BY created_at DESC;`)
    .then(({ rows }) => {
      return rows;
    });
  return Promise.all([articlesPromise, lookupObjPromise]).then((values) => {
    const articles = values[0];
    const lookupObj = values[1];
    for (let i = 0; i < articles.length; i++) {
      if (lookupObj.hasOwnProperty(articles[i].article_id)) {
        articles[i].comment_count = +lookupObj[articles[i].article_id];
      } else {
        articles[i].comment_count = 0;
      }
      delete articles[i].body;
    }
    return articles;
  });
};
