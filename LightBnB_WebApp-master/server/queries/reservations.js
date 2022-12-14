// Database queries on reservations

// Use database adapter file to interact with PostgreSQL DB.
const db = require('../db/index');

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @param {*} limit The number of results to return.
 * @return {result.rows} As a promise to the reservations (or null if no reservations returned for the given guest_id).
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
    SELECT properties.*, reservations.*, AVG(property_reviews.rating)
    FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;
  const data = [guest_id, limit];

  return db
    .query(queryString, data)
    .then((result) => {
      if (result.rows) {
        return result.rows;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;