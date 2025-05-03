import request from "supertest";
import app from "../../src/app.js"; // no .listen() called

test("GET /api/genres", async () => {
  const res = await request(app).get("/api/genres");
  expect(res.status).toBe(200);
});
