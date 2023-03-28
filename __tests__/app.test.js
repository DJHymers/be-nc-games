const connection = require(`${__dirname}/../db/connection.js`);
const app = require(`${__dirname}/../app.js`);
const Data = require(`${__dirname}/../db/data/test-data/index.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const request = require("supertest");

beforeEach(() => {
  return seed(Data);
});

afterAll(() => connection.end());

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
