const db = require(`${__dirname}/../db/connection.js`);

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    // if (result.rows.length === 0) {
    //   return Promise.reject({ status: 404, msg: "404 path not found" });
    // }
    return result.rows;
  });
};
