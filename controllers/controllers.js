const { retrieveTopics } = require("../models/models")

exports.getTopics = (req, res, next) => {
  retrieveTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};