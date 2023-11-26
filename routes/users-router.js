const { getUsers } = require("../controllers/controllers");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
