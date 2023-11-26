const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  patchArticle,
  postComment,
} = require("../controllers/controllers");

const articleRouter = require("express").Router();

articleRouter.get("/", getArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = articleRouter;
