import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../../src/app.js";
import Genre from "../../src/genre/genreModel.js";
import { connectDB } from "../../src/config/connectDB.js";

import jwt from "jsonwebtoken";
import config from "../../src/config/index.js";

import { generateToken } from "../utils/testUtils.js";


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
    await Genre.deleteMany({});
    await Genre.insertMany([
        { name: "Action" },
        { name: "Comedy" }
    ]);
});

describe("/api/genres", () => {
    describe("GET /", () => {
        it("GET / should return all genres", async () => {
            const res = await request(app).get("/api/genres");

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === "Action")).toBe(true);
            expect(res.body.some(g => g.name === "Comedy")).toBe(true);
        });

        it("GET /:id should return 404 for invalid ID", async () => {
            const res = await request(app).get("/api/genres/invalidid");
            expect(res.status).toBe(400); // assuming validateObjectId middleware handles this
        });

        it("GET /:id should return 404 if genre not found", async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/genres/${id}`);
            expect(res.status).toBe(404);
        });

        it("GET /:id should return genre if valid", async () => {
            const genre = await Genre.findOne({ name: "Action" });
            const res = await request(app).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "Action");
        });


    });
    describe("PUT /:id", () => {
        it("should return 401 if not logged in", async () => {
            const genre = await Genre.findOne({});
            const res = await request(app)
                .put(`/api/genres/${genre._id}`)
                .send({ name: "Updated" });

            expect(res.status).toBe(401);
        });

        it("should return 403 if not admin", async () => {
            const genre = await Genre.findOne({});
            const token = generateToken(false);

            const res = await request(app)
                .put(`/api/genres/${genre._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Updated" });

            expect(res.status).toBe(403);
        });

        it("should return 400 if validation fails", async () => {
            const genre = await Genre.findOne({});
            const token = generateToken(true);

            const res = await request(app)
                .put(`/api/genres/${genre._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "" }); // invalid

            expect(res.status).toBe(400);
        });

        it("should update genre if valid", async () => {
            const genre = await Genre.findOne({});
            const token = generateToken(true);

            const res = await request(app)
                .put(`/api/genres/${genre._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Drama" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "Drama");
        });
    });

    describe("DELETE /:id", () => {
        it("should return 401 if not logged in", async () => {
            const genre = await Genre.findOne({});
            const res = await request(app).delete(`/api/genres/${genre._id}`);
            expect(res.status).toBe(401);
        });

        it("should return 403 if not admin", async () => {
            const genre = await Genre.findOne({});
            const token = generateToken(false);

            const res = await request(app)
                .delete(`/api/genres/${genre._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(403);
        });

        it("should return 404 if genre not found", async () => {
            const token = generateToken(true);
            const id = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/genres/${id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
        });

        it("should delete genre if valid", async () => {
            const genre = await Genre.findOne({});
            const token = generateToken(true);

            const res = await request(app)
                .delete(`/api/genres/${genre._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
    });
    describe("POST /", () => {
        it("should return 401 if not logged in", async () => {
            const res = await request(app)
                .post("/api/genres")
                .send({ name: "Thriller" });

            expect(res.status).toBe(401);
        });

        it("should return 403 if not admin", async () => {
            const token = generateToken(false);
            const res = await request(app)
                .post("/api/genres")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Thriller" });

            expect(res.status).toBe(403);
        });

        it("should return 400 if validation fails", async () => {
            const token = generateToken(true);
            const res = await request(app)
                .post("/api/genres")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "" });

            expect(res.status).toBe(400);
        });

        it("should create genre if valid", async () => {
            const token = generateToken(true);
            const res = await request(app)
                .post("/api/genres")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Thriller" });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "Thriller");

            // Optional: confirm it's in the DB
            const inDb = await Genre.findOne({ name: "Thriller" });
            expect(inDb).not.toBeNull();
        });
    });

});
