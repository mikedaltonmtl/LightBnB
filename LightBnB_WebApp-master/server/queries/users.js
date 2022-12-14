// Database queries on users

// Use database adapter file to interact with PostgreSQL DB.
const db = require('../db/index');

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {result.rows[0]} As a promise to the user (or null if email does not exist).
 */
const getUserWithEmail = function(email) {
  return db
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {result.rows[0]} As a promise to the user (or null if the id does not exist).
 */
const getUserWithId = function(id) {
  return db
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {result.rows[0]} As a promise to the user (or null if the insert did not complete).
 */
const addUser = function(user) {
  const queryString = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const data = [user.name, user.email, user.password];

  return db
    .query(queryString, data)
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;