const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const mongoose = require("mongoose");
const { initialUsers, usersInDb } = require("../utils/user_api_test_helpers");

beforeEach(async () => {
  await User.deleteMany({});
  const userObjects = initialUsers.map((user) => new User(user));
  const userPromises = userObjects.map((user) => user.save());
  await Promise.all(userPromises);
});

describe("Invalid users cannot be added", () => {
  test("username shorter than 3 chars is not allowed", async () => {
    const user = {
      username: "ab",
      name: "thetlinhan",
      password: "1234",
    };
    const { body } = await api.post("/api/users").send(user).expect(400);
    expect(body).toEqual({
      error:
        "User validation failed: username: Path `username` (`ab`) is shorter than the minimum allowed length (3).",
    });
    const totalUsers = await usersInDb();
    expect(totalUsers.length).toEqual(initialUsers.length);
  }, 100000);
  test("password shorter than 3 chars is not allowed", async () => {
    const user = {
      username: "abcd",
      name: "something",
      password: "12",
    };
    const { body } = await api.post("/api/users").send(user).expect(400);
    expect(body).toEqual({
      error: "your password needs to be at least 3 charactors long",
    });
    const totalUsers = await usersInDb();
    expect(totalUsers.length).toEqual(initialUsers.length);
  }, 100000);
  test("username is required", async () => {
    const user = {
      name: "thetlinhan",
      password: "1234",
    };
    const { body } = await api.post("/api/users").send(user).expect(400);
    expect(body).toEqual({
      error: "User validation failed: username: Path `username` is required.",
    });
    const totalUsers = await usersInDb();
    expect(totalUsers.length).toEqual(initialUsers.length);
  }, 100000);
  test("password is required", async () => {
    const user = {
      username: "abcde",
      name: "thetlinhan",
    };
    const { body } = await api.post("/api/users").send(user).expect(400);
    expect(body).toEqual({
      error: "password is required",
    });
    const totalUsers = await usersInDb();
    expect(totalUsers.length).toEqual(initialUsers.length);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
