const db = require(`${__dirname}/../db/connection.js`);

exports.deleteComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 path not found" });
      }
      return result.rows[0];
    });
};
