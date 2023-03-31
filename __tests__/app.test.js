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
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment.review_id).toBe(2);
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
    it("404: non-existent id provided, should provide bad path message", () => {
      return request(app)
        .get("/api/reviews/1010101010101/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
        });
    });
    it("200: GET /api/reviews/:review_id/comments if review_id returned has no comments, should inform the client", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBe("User has not made any comments");
        });
    });
  });
  describe("/api/reviews/:review_id/comments to post", () => {
    it("201: POST /api/reviews/:review_id/comments should return a new comment", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({
          username: "mallionaire",
          body: "I love hosting",
        })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            review_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
    });
    it("400: malformed body/ missing required fields should return err message", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("400: failing schema validation", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({ username: 123, body: 654 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("400: invalid id type provided, should provide bad request message", () => {
      return request(app)
        .post("/api/reviews/bananas/comments")
        .send({
          username: "mallionaire",
          body: "I love hosting",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("404: non-existent id provided, should provide bad path message", () => {
      return request(app)
        .post("/api/reviews/1010101010101/comments")
        .send({
          username: "mallionaire",
          body: "I love hosting",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
        });
    });
    it("404: invalid username provided, should provide bad path message", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "newReqWhoDis",
          body: "I am not hosting",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
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
  describe("/api/reviews/:review_id Patch", () => {
    it("200: PATCH /api/reviews/:review_id should update votes by specified amount and return updated object.", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({
          inc_votes: 6,
        })
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toMatchObject({
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            votes: 11,
          });
        });
    });
    it("400: invalid id type provided, should provide bad request message", () => {
      return request(app)
        .patch("/api/reviews/bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("400: malformed body / missing required fields should return err message", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("400: failing schema validation", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: "hello" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    it("404: Should respond with invalid path error if input is invalid", () => {
      return request(app)
        .patch("/api/reviews/212121221")
        .send({ inc_votes: 5 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("204: DELETE /api/comments/:comment_id", () => {
      return request(app).delete("/api/comments/5").expect(204);
    });
    it("404: DELETE should return a 404 response if the comment id is not found", () => {
      return request(app)
        .delete("/api/comments/99999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
        });
    });
    it("400: DELETE should return a 400 response if a valid integer id is not provided", () => {
      return request(app)
        .delete("/api/comments/xyz")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});
