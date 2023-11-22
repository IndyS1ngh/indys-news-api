const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const topicData = require("../db/data/test-data/topics");
const userData = require("../db/data/test-data/users");
const articleData = require("../db/data/test-data/articles");
const commentData = require("../db/data/test-data/comments");

const endpoints = require("../endpoints.json");

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

describe("GET /api", () => {
  test("GET:200 provides a description of all other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 sends an article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET:404 sends an err msg when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an err msg when given an invalid id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 sends an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBe(13);
        expect(res.body.articles).toBeSortedBy("created_at", { descending: true });
        expect(res.body.articles[0]).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
        res.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments for an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments.length).toBe(11);
        expect(res.body.comments).toBeSortedBy("created_at", { descending: true });
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET:200 sends an empty array if article exists but has no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([]);
      });
  });
  test("GET:404 sends an err msg when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an err msg when given an invalid id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
