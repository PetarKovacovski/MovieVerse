// tests/integration/errorHandling.test.js
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../../src/app.js";
import User from "../../src/user/userModel.js";
import Genre from "../../src/genre/genreModel.js";
import Movie from "../../src/movie/movieModel.js";
import { connectDB } from "../../src/config/connectDB.js";
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

describe("Simulated DB failures", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return 500 if User.find throws in GET /api/users", async () => {
        const token = generateToken(true);
        jest.spyOn(User, "find").mockImplementation(() => {
            throw new Error("DB failure");
        });

        const res = await request(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/internal server error/i);
    });

    it("should return 500 if User.save throws in POST /api/users", async () => {
        jest.spyOn(User.prototype, "save").mockImplementation(() => {
            throw new Error("Save failed");
        });

        const res = await request(app)
            .post("/api/users")
            .send({ name: "Error", email: "err@fail.com", password: "pass" });

        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/internal server error/i);
    });

    it("should return 500 if Genre.find throws in GET /api/genres", async () => {
        jest.spyOn(Genre, "find").mockImplementation(() => {
            throw new Error("Genre DB error");
        });

        const res = await request(app).get("/api/genres");
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/internal server error/i);
    });

    it("should return 500 if Movie.findById throws in GET /api/movies/:id", async () => {
        const id = new mongoose.Types.ObjectId();
        jest.spyOn(Movie, "findById").mockImplementation(() => {
            throw new Error("Movie DB fail");
        });

        const res = await request(app).get(`/api/movies/${id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/internal server error/i);
    });
});
