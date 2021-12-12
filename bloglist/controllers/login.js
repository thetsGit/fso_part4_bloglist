const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(400).send({ error: "username and/or password is missing." });
  }
  const user = await User.findOne({ username: username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    res.status(401).send({ error: "invalid username and/or password" });
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET);
  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
