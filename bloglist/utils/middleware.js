const logger = require("../utils/loggers");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }
  next(err);
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("Authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
    const decodedToken = await jwt.verify(req.token, process.env.SECRET);
    req.user = await User.findById(decodedToken.id);
    logger.error(req.user, authorization);
  }
  next();
};

module.exports = {
  unknownEndPoint,
  errorHandler,
  tokenExtractor,
};
