import supertest from "supertest";
import app from "../../src/app";
import { __createData, __resetDb } from "../factories/databaseFactory";
import { __createRecommendationInsertData } from "../factories/recommendationFactory";

describe("integrations tests suite", () => {
  beforeEach(() => __resetDb());
  describe("POST /recommendations", () => {
    it("given a valid body should return 201", async () => {
      const recommendation = __createRecommendationInsertData();
      const result = await supertest(app)
        .post("/recommendations")
        .send(recommendation);
      expect(result.statusCode).toEqual(201);
    });

    it("given a invalid body should return 422", async () => {
      const recommendation = __createRecommendationInsertData().name;
      const result = await supertest(app)
        .post("/recommendations")
        .send(recommendation);
      expect(result.statusCode).toEqual(422);
    });
  });

  describe("GET /recommendations", () => {
    it("should return 200 and an array", async () => {
      await __createData();
      const result = await supertest(app).get("/recommendations");
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /recommendations/random", () => {
    it("given that there are recommendation should return 200 and an object", async () => {
      await __createData();
      const result = await supertest(app).get("/recommendations/random");
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeInstanceOf(Object);
    });

    it("given that there aren't recommendations should return 404", async () => {
      const result = await supertest(app).get("/recommendations/random");
      expect(result.statusCode).toEqual(404);
    });
  });

  describe("GET /recommendations/top/:amount", () => {
    it("should return 200 and an array", async () => {
      await __createData();
      const result = await supertest(app).get("/recommendations/top/2");
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /recommendations/:id", () => {
    it("given a existing id return 200 and an object", async () => {
      await __createData();
      const result = await supertest(app).get("/recommendations/1");
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeInstanceOf(Object);
    });

    it("given a non existing id should return 404", async () => {
      await __createData();
      const result = await supertest(app).get("/recommendations/4");
      expect(result.statusCode).toEqual(404);
      expect(result.body).toBeInstanceOf(Object);
    });
  });

  describe("POST /recommendations/:id/upvote", () => {
    it("given a existing id return 200", async () => {
      await __createData();
      const result = await supertest(app).get("/recommendations/1/upvote");
      expect(result.statusCode).toEqual(200);
    });

    it("given a non existing id should return 404", async () => {
      const result = await supertest(app).get("/recommendations/1/upvote");
      expect(result.statusCode).toEqual(404);
    });
  });

  describe("POST /recommendations/:id/downvote", () => {
    it("given a existing id return 200", async () => {
      await __createData();
      const result = await supertest(app).get("/recommendations/1/downvote");
      expect(result.statusCode).toEqual(200);
    });

    it("given a non existing id should return 404", async () => {
      const result = await supertest(app).get("/recommendations/1/downvote");
      expect(result.statusCode).toEqual(404);
    });
  });
});
