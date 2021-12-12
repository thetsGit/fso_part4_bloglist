require("express-async-errors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./utils/loggers");
const blogsRouter = require("./controllers/blogs");
const MONGODB_URL = require("./utils/config").MONGODB_URL;
const unknownEndPoint = require("./utils/middleware").unknownEndPoint;
const errorHandler = require("./utils/middleware").errorHandler;
const tokenExtractor = require("./utils/middleware").tokenExtractor;
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    logger.info("Connected to mongodatabase");
  })
  .catch((err) =>
    logger.error(`Failed to connect to mongodb. Error: ${err.message}`)
  );

app.use(cors());
app.use(express.json());
morgan.token("resData", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :resData"
  )
);
app.use("/api/blogs", tokenExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(unknownEndPoint);
app.use(errorHandler);

module.exports = app;
