const { getEndpoints } = require("../controllers/controllers");

const apiRouter = require("express").Router();
const topicRouter = require("./topics-router");
const articleRouter = require("./articles-router");
const userRouter = require("./users-router");
const commentRouter = require("./comments-router");

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
