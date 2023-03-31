const db = require(`${__dirname}/../db/connection.js`);

exports.fetchReviewById = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 path not found" });
      }
      return result.rows[0];
    });
};

exports.fetchReviews = (sort_by = "created_at", order = "desc") => {
  const allowedSorts = ["created_at"];

  const allowedOrder = ["asc", "desc"];

  if (!allowedSorts.includes(sort_by) || !allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 path not found" });
      }
      return result.rows;
    });
};

exports.fetchCommentsByReviewId = (
  review_id,
  sort_by = "created_at",
  order = "desc"
) => {
  const allowedSorts = ["created_at"];

  const allowedOrder = ["asc", "desc"];

  if (!allowedSorts.includes(sort_by) || !allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY ${sort_by} ${order};`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return "User has not made any comments";
      }
      return result.rows;
    });
};

exports.insertCommentByReviewId = (review_id, username, body) => {
  if (!isNaN(username) || username === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return db
    .query(
      `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [review_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateVoteByReviewId = (review_id, updatedVote) => {
  if (isNaN(updatedVote) || updatedVote === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return db
    .query(
      `UPDATE reviews SET votes = votes + ${updatedVote} WHERE review_id = ${review_id} RETURNING *`
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 path not found" });
      }
      return result.rows[0];
    });
};
