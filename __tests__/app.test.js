const connection = require(`${__dirname}/../db/connection.js`);
const app = require(`${__dirname}/../app.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("nc_games_test", () => {
  describe("/api/categories", () => {
    it("200: GET /api/categories should respond with array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories).toBeInstanceOf(Array);
          categories.forEach((category) => {
            expect(category).toBeInstanceOf(Object);
          });
        });
    });
    it("200: GET /api/categories should have expected shape", () => {
      return request(app)
        .get("/api/categories")
        .then(({ body }) => {
          const { categories } = body;
          expect(categories.length).toBe(4);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("/api/reviews/:review_id", () => {
    it("200: GET /api/reviews/:review_id should return relevant review_id data", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Object);
          expect(reviews).toEqual({
            review_id: 3,
            title: "Ultimate Werewolf",
            review_body: "We couldn't find the werewolf!",
            designer: "Akihisa Okui",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
            votes: 5,
            category: "social deduction",
            owner: "bainesface",
            created_at: "2021-01-18T10:01:41.251Z",
          });
        });
    });
    it("400: invalid id type provided, should provide bad request message", () => {
      return request(app)
        .get("/api/reviews/bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
  describe("/api/reviews", () => {
    it("200: GET /api/reviews should return array of objects.", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach((review) => {
            expect(review).toBeInstanceOf(Object);
          });
        });
    });
    it("200: GET /api/reviews should have expected shape with added column for comment count", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews.length).toBe(13);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("review_id", expect.any(Number)),
              expect(review).toHaveProperty("title", expect.any(String)),
              expect(review).toHaveProperty("review_body", expect.any(String)),
              expect(review).toHaveProperty("designer", expect.any(String)),
              expect(review).toHaveProperty(
                "review_img_url",
                expect.any(String)
              );
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
              expect(review).toHaveProperty("votes", expect.any(Number)),
              expect(review).toHaveProperty("category", expect.any(String)),
              expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(String));
          });
        });
    });
    it("200: GET /api/reviews should be sorted by date in descending order ", () => {
      return request(app)
        .get("/api/reviews?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews.length).toBe(13);
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("400: Should respond Invalid Query when any other sorts are attempted", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Query");
        });
    });
    it("400: should only accept asc/desc as order query", () => {
      return request(app)
        .get("/api/reviews?order=sausages")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Query");
        });
    });
  });
  describe("/api/reviews/:review_id/comments", () => {
    it("200: GET /api/reviews/:review_id/comments should return an array of comments", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(3);
          expect(comments).toBeInstanceOf(Array);
          comments.forEach((comment) => {
            expect(comment).toBeInstanceOf(Object);
          });
        });
    });
    it("200: GET /api/reviews/:review_id/comments should have an expected shape", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(3);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("review_id", expect.any(Number));
          });
        });
    });
    it("200: GET /api/reviews/2/comments?sort_by=created_at should respond with comments sorted by most recent first", () => {
      return request(app)
        .get("/api/reviews/2/comments?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("400: Should respond Invalid Query when any other sorts are attempted", () => {
      return request(app)
        .get("/api/reviews/3/comments?sort_by=body")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Query");
        });
    });
    it("400: should only accept asc/desc as order query", () => {
      return request(app)
        .get("/api/reviews/2/comments?order=hotdogs")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Query");
        });
    });
    it("400: invalid id type provided, should provide bad request message", () => {
      return request(app)
        .get("/api/reviews/bananas/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("400: non-existent id provided, should provide bad request message", () => {
      return request(app)
        .get("/api/reviews/1010101010101/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("200: GET /api/reviews/:review_id/comments if user has no comments should return a message", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toEqual("User has not made any comments");
        });
    });
  });
  describe("404 Bad Path Errors", () => {
    it("404: Should respond with invalid path error if input is invalid", () => {
      return request(app)
        .get("/api/reviews/212121221")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
        });
    });
  });
});
