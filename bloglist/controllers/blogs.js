const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("../utils/loggers");

blogsRouter.get("/", async (req, res, next) => {
  const dbRes = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(dbRes);
});

blogsRouter.post("/", async (req, res, next) => {
  if (!req.body.title || !req.body.url) {
    res.status(400).send({ error: "title or url is missing" });
    return;
  }
  if (!req.token) {
    res.status(401).send({ error: "authorization header is missing" });
  }
  const decodedToken = await jwt.verify(req.token, process.env.SECRET);
  if (!(req.token || decodedToken)) {
    res.status(401).send({ error: "token is missing or invalid" });
    return;
  }
  const blog = req.body.likes
    ? new Blog({ ...req.body, user: decodedToken.id })
    : new Blog({ ...req.body, user: decodedToken.id, likes: 0 });
  console.log(blog);
  const dbRes = await blog.save();
  const creator = req.user;
  creator.blogs = creator.blogs.concat(dbRes._id.toString());
  console.log(creator);
  console.log(dbRes._id.toString());
  await User.findByIdAndUpdate(decodedToken.id, creator);
  res.status(201).json(dbRes);
});

blogsRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const dbRes = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(dbRes);
});

blogsRouter.delete("/:id", async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!(req.token || decodedToken)) {
    res.status(401).send({ error: "token is missing or invalid" });
    return;
  }
  const id = req.params.id;
  const dbRes = await Blog.findById(id);
  logger.error(dbRes, decodedToken);
  if (dbRes.user.toString() !== req.user.id.toString()) {
    res
      .status(401)
      .send({ error: "you are not authorized to delete this blog" });
    return;
  }
  await Blog.findByIdAndDelete(id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const dbRes = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  res.json(dbRes);
});

module.exports = blogsRouter;
