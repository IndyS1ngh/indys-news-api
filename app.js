const express = require("express");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
