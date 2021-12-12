const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const logger = require("../utils/loggers");

usersRouter.get("/", async (req, res) => {
  const dbRes = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  res.json(dbRes);
});

usersRouter.post("/", async (req, res) => {
  const { username, password, name } = req.body;
  const saltRounds = 9;
  if (!password) {
    res.status(400).send({ error: "password is required" });
    logger.error("password not found");
    return;
  }
  if (password.length < 3) {
    res
      .status(400)
      .send({ error: "your password needs to be at least 3 charactors long" });
    logger.error("password is shorter than it's supposed to be");
    return;
  }
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
  });
  const savedUser = await newUser.save();
  res.json(savedUser);
});

module.exports = usersRouter;
