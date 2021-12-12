const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const { initialBlogs, blogsInDb } = require("../utils/blog_api_test_helpers");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjs = initialBlogs.map((blog) => new Blog(blog));
  const blogPromises = blogObjs.map((blog) => blog.save());
  await Promise.all(blogPromises);
}, 100000);

describe("blog api testing", () => {
  test("All blogs are returned", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const res = await blogsInDb();
    expect(res).toHaveLength(initialBlogs.length);
    expect(res[0].id).toBeDefined();
  }, 100000);
  test("post request without title and/or url is responsed with 400", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  }, 100000);
  test("adding without authorization header is cancelled", async () => {
    const newBlog = {
      title: "Canonical",
      author: "Edsger Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 13,
    };
    const serverRes = await api.post("/api/blogs").send(newBlog).expect(401);
    expect(serverRes.body).toEqual({
      error: "authorization header is missing",
    });
  });
  test("A valid blog can be added", async () => {
    const newBlog = {
      title: "Canonical",
      author: "Edsger Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 13,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set(
        "authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxYjVlYjA4NTNhNWNiOWJmYzM3OWQ4ZSIsImlhdCI6MTYzOTMxMjI1M30.3igvCY2_rsyHajgfA1uu4_qKHyTTPh734YsyxOoGdUs"
      )
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const res = await blogsInDb();
    const titles = res.map((blog) => blog.title);
    expect(res).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain("Canonical");
  }, 100000);
  test("added blog without likes property is set to likes 0 automatically", async () => {
    const newBlog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set(
        "authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxYjVlYjA4NTNhNWNiOWJmYzM3OWQ4ZSIsImlhdCI6MTYzOTMxMjI1M30.3igvCY2_rsyHajgfA1uu4_qKHyTTPh734YsyxOoGdUs"
      )
      .set("content-type", "application/json")

      .expect(201)
      .expect("Content-Type", /application\/json/);
    const res = await blogsInDb();
    expect(res[res.length - 1].likes).toEqual(0);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
