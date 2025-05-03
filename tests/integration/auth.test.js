import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import argon2 from "argon2";

import app from "../../src/app.js";
import User from "../../src/user/userModel.js";
import { connectDB } from "../../src/config/connectDB.js";

let tempDb;

beforeAll(async () => {
  tempDb = await MongoMemoryServer.create();
  const uri = tempDb.getUri();
  await connectDB(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await tempDb.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("POST /api/auth", () => {
  const endpoint = "/api/auth";

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app).post(endpoint).send({});
    expect(res.status).toBe(400);
  });

  it("should return 400 if user does not exist", async () => {
    const res = await request(app).post(endpoint).send({
      email: "notfound@example.com",
      password: "test1234"
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is invalid", async () => {
    const email = "user@example.com";

    await User.create({
      name: "Test User",
      email,
      password: "password123",
      isAdmin: false
    });

    const res = await request(app).post(endpoint).send({
      email,
      password: "wrongPassword"
    });

    expect(res.status).toBe(400);
  });

  it("should return 200 and JWT token if credentials are valid", async () => {
    const email = "user@example.com";
    const password = "correctPassword";

    const user = await User.create({
      name: "Test User",
      email,
      password: password,
      isAdmin: false
    });

    const res = await request(app).post(endpoint).send({ email, password });

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/^eyJ/); // crude check for JWT format
  });
});
