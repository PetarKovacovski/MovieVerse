import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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

describe("/api/users", () => {
  const endpoint = "/api/users";

  describe("POST /", () => {
    it("should return 400 if fields are missing", async () => {
      const res = await request(app).post(endpoint).send({});
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is already registered", async () => {
      await request(app)
        .post(endpoint)
        .send({ name: "Petar", email: "a@b.com", password: "123456" });

      const res = await request(app)
        .post(endpoint)
        .send({ name: "Other", email: "a@b.com", password: "654321" });

      expect(res.status).toBe(400);
    });

    it("should return 201 and token in header if user is created", async () => {
      const res = await request(app)
        .post(endpoint)
        .send({ name: "Petar", email: "user@me.com", password: "123456" });

      expect(res.status).toBe(201);
      expect(res.header).toHaveProperty("x-auth-token");
      expect(res.body).toHaveProperty("email", "user@me.com");
      expect(res.body).not.toHaveProperty("password");
    });
  });

  describe("GET /me", () => {
    it("should return 401 if no token provided", async () => {
      const res = await request(app).get(`${endpoint}/me`);
      expect(res.status).toBe(401);
    });

    it("should return user data if valid token is sent", async () => {
      const user = new User({ name: "Petar", email: "me@me.com", password: "123456" });
      await user.save();

      const token = user.generateJWTToken();

      const res = await request(app)
        .get(`${endpoint}/me`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", "me@me.com");
      expect(res.body).not.toHaveProperty("password");
    });
  });

  describe("GET / (admin only)", () => {
    it("should return 403 if non-admin tries to access", async () => {
      const user = new User({ name: "NonAdmin", email: "non@admin.com", password: "123456", isAdmin: false });
      await user.save();
      const token = user.generateJWTToken();

      const res = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it("should return 401 if no token", async () => {
      const res = await request(app).get(endpoint);
      expect(res.status).toBe(401);
    });

    it("should return all users if admin", async () => {
      const admin = new User({ name: "Admin", email: "admin@site.com", password: "admin123", isAdmin: true });
      const user = new User({ name: "User", email: "user@site.com", password: "user123" });
      await admin.save();
      await user.save();

      const token = admin.generateJWTToken();

      const res = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.email === "admin@site.com")).toBe(true);
      expect(res.body.some(u => u.email === "user@site.com")).toBe(true);
    });
  });
});
