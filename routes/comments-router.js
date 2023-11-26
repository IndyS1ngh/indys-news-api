const { deleteComment } = require("../controllers/controllers");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteComment);

module.exports = commentRouter;
