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
    it("404: Should respond with invalid path message if given invalid path input", () => {
      return request(app)
        .get("/api/bananas")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
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
    it("404: Should respond with invalid path error if input is invalid id number", () => {
      return request(app)
        .get("/api/reviews/212121221")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 path not found");
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
});
