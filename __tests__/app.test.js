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
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
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
        expect(res.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
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

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 sends a posted comment for an article", () => {
    const newComment = {
      body: "I love bananas.",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment.comment_id).toBe(19);
        expect(res.body.comment.body).toBe("I love bananas.");
        expect(res.body.comment.votes).toBe(0);
        expect(res.body.comment.author).toBe("butter_bridge");
        expect(res.body.comment.article_id).toBe(2);
        expect(res.body.comment.created_at).toBeString();
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (no username)", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "I love bananas.",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided with a username that doesn't exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "I love bananas.",
        username: "bananaguy",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("POST:404 sends an err msg when given a valid but non-existent article id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        body: "I love bananas.",
        username: "butter_bridge",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("POST:400 sends an err msg when given an invalid article id", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({
        body: "I love bananas.",
        username: "butter_bridge",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 updates an articles votes by id and sends the updated article back", () => {
    const input = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:400 responds with an appropriate status and error message when provided with a bad vote (no inc_votes)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("PATCH:404 returns an err msg if article id is valid but not found", () => {
    return request(app)
      .patch("/api/articles/99")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("PATCH:400 returns an err msg if article id is invalid", () => {
    return request(app)
      .patch("/api/articles/banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE:204 returns relevant status code", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 returns an err msg if comment id is valid but not found", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("DELETE:400 returns an err msg if comment id is invalid", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET:200 sends an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(4);
        expect(res.body.users[0]).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles?topic", () => {
  test("GET:200 sends an array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBe(1);
        res.body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET:404 sends an err msg if topic is invalid", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
});
