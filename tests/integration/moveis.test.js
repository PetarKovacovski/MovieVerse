import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../../src/app.js";
import Movie from "../../src/movie/movieModel.js";
import Genre from "../../src/genre/genreModel.js";
import { connectDB } from "../../src/config/connectDB.js";

import jwt from "jsonwebtoken";
import config from "../../src/config/index.js";

import { generateToken } from "../utils/testUtils.js";

let tempDb;
let existingGenre;

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
  await Movie.deleteMany({});
  await Genre.deleteMany({});

  existingGenre = await Genre.create({ name: "Sci-Fi" });

  await Movie.insertMany([
    {
      title: "Inception",
      genre: { _id: existingGenre._id, name: existingGenre.name },
      numberInStock: 5,
      dailyRentalRate: 3.5
    },
    {
      title: "Interstellar",
      genre: { _id: existingGenre._id, name: existingGenre.name },
      numberInStock: 7,
      dailyRentalRate: 4.0
    }
  ]);
});

describe("/api/movies", () => {
  describe("GET /", () => {
    it("should return all movies", async () => {
      const res = await request(app).get("/api/movies");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(m => m.title === "Inception")).toBe(true);
      expect(res.body.some(m => m.title === "Interstellar")).toBe(true);
    });

    it("should return 404 for invalid ID", async () => {
      const res = await request(app).get("/api/movies/invalidid");
      expect(res.status).toBe(400);
    });

    it("should return 404 if movie not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/movies/${id}`);
      expect(res.status).toBe(404);
    });

    it("should return movie if valid ID", async () => {
      const movie = await Movie.findOne({ title: "Inception" });
      const res = await request(app).get(`/api/movies/${movie._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", "Inception");
    });
  });

  describe("POST /", () => {
    it("should return 401 if not logged in", async () => {
      const res = await request(app).post("/api/movies").send({
        title: "Tenet",
        genreId: existingGenre._id,
        numberInStock: 5,
        dailyRentalRate: 3
      });

      expect(res.status).toBe(401);
    });

    it("should return 403 if not admin", async () => {
      const token = generateToken(false);
      const res = await request(app)
        .post("/api/movies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Tenet",
          genreId: existingGenre._id,
          numberInStock: 5,
          dailyRentalRate: 3
        });

      expect(res.status).toBe(403);
    });

    it("should return 400 if invalid data", async () => {
      const token = generateToken(true);
      const res = await request(app)
        .post("/api/movies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "",
          genreId: "",
          numberInStock: -1,
          dailyRentalRate: "bad"
        });

      expect(res.status).toBe(400);
    });

    it("should return 201 and save movie if valid", async () => {
      const token = generateToken(true);
      const res = await request(app)
        .post("/api/movies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Tenet",
          genreId: existingGenre._id,
          numberInStock: 5,
          dailyRentalRate: 3
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", "Tenet");
    });
  });

  describe("PUT /:id", () => {
    it("should return 401 if not logged in", async () => {
      const movie = await Movie.findOne({});
      const res = await request(app).put(`/api/movies/${movie._id}`).send({
        title: "Updated",
        genreId: existingGenre._id,
        numberInStock: 10,
        dailyRentalRate: 5
      });

      expect(res.status).toBe(401);
    });

    it("should return 403 if not admin", async () => {
      const movie = await Movie.findOne({});
      const token = generateToken(false);
      const res = await request(app)
        .put(`/api/movies/${movie._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated",
          genreId: existingGenre._id,
          numberInStock: 10,
          dailyRentalRate: 5
        });

      expect(res.status).toBe(403);
    });

    it("should return 400 if validation fails", async () => {
      const movie = await Movie.findOne({});
      const token = generateToken(true);
      const res = await request(app)
        .put(`/api/movies/${movie._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "",
          genreId: "",
          numberInStock: -5,
          dailyRentalRate: ""
        });

      expect(res.status).toBe(400);
    });

    it("should update movie if valid", async () => {
      const movie = await Movie.findOne({});
      const token = generateToken(true);
      const res = await request(app)
        .put(`/api/movies/${movie._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated",
          genreId: existingGenre._id,
          numberInStock: 10,
          dailyRentalRate: 5
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", "Updated");
    });
  });

  describe("DELETE /:id", () => {
    it("should return 401 if not logged in", async () => {
      const movie = await Movie.findOne({});
      const res = await request(app).delete(`/api/movies/${movie._id}`);
      expect(res.status).toBe(401);
    });

    it("should return 403 if not admin", async () => {
      const movie = await Movie.findOne({});
      const token = generateToken(false);
      const res = await request(app)
        .delete(`/api/movies/${movie._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 if not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const token = generateToken(true);
      const res = await request(app)
        .delete(`/api/movies/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should delete movie if valid", async () => {
      const movie = await Movie.findOne({});
      const token = generateToken(true);
      const res = await request(app)
        .delete(`/api/movies/${movie._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", movie.title);
    });
  });
});
