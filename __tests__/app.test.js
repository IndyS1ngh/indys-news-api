const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const topicData = require("../db/data/test-data/topics");
const userData = require("../db/data/test-data/users");
const articleData = require("../db/data/test-data/articles");
const commentData = require("../db/data/test-data/comments");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("GET:200 sends an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBe(3);
        expect(res.body.topics[0]).toMatchObject({
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        });
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("ANY /api/banana", () => {
  test("GET:404 sends an error message when path is invalid", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
});
