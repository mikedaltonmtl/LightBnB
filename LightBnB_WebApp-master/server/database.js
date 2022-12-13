// original code using hard-coded objects as data
// const properties = require('./json/properties.json');
// const users = require('./json/users.json');

// Create pool to connect to lightbnb database
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// test connection
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {result.rows[0]} As a promise to the user (or null if email does not exist).
 */
const getUserWithEmail = function(email) {
  return pool
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
  return pool
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

  return pool
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

/// Reservations

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

  return pool
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

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {result.rows}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // Check the options object that has been passed
  console.log('options', options);
  // Setup an array to hold any parameters that may be available for the query.
  const queryParams = [];
  // Use a boolean to track whether this is the first WHERE clause
  let multipleWheres = false;
  // Start the query with all information that comes before the WHERE clause.
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  /*
  Check if a city has been passed in as an option.
  Add the city to the params array and create a WHERE clause for the city.
  We can use the length of the array to dynamically get the $n placeholder number.
  Since this is the first parameter, it will be $1.
  The % syntax for the LIKE clause must be part of the parameter, not the query.
  */
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    multipleWheres = true;
  }
  // If an owner_id is passed in, only return properties belonging to that owner.
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += multipleWheres ? `AND ` : 'WHERE ';
    multipleWheres = true;
    queryString += `owner_id = $${queryParams.length} `;
  }
  // Check for minimum & maximum cost parameters... here, both are passed
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryString += multipleWheres ? `AND ` : 'WHERE ';
    multipleWheres = true;
    queryParams.push(options.minimum_price_per_night, options.maximum_price_per_night);
    queryString += `cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
  }
  // Only by minimum price per night
  if (options.minimum_price_per_night && !options.maximum_price_per_night) {
    queryString += multipleWheres ? `AND ` : 'WHERE ';
    multipleWheres = true;
    queryParams.push(options.minimum_price_per_night);
    queryString += `cost_per_night >= $${queryParams.length} `;
  }
  // Only by maximum price per night
  if (!options.minimum_price_per_night && options.maximum_price_per_night) {
    queryString += multipleWheres ? `AND ` : 'WHERE ';
    multipleWheres = true;
    queryParams.push(options.maximum_price_per_night);
    queryString += `cost_per_night <= $${queryParams.length} `;
  }

  // Add any query that comes after the WHERE clause.
  queryString += `
  GROUP BY properties.id 
  `;
  // If a minimum_rating is passed in, only return properties with a rating equal to or higher than that.
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }
  // Lastly, set the limit for the number of results to be returned
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night 
  LIMIT $${queryParams.length};
  `;

  // Console log everything just to make sure we've done it right.
  console.log(queryString, queryParams);

  // Run the query.
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {result.rows[0]} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (
    owner_id, 
    title, 
    description, 
    thumbnail_photo_url, 
    cover_photo_url, 
    cost_per_night, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms, 
    country, 
    street, 
    city, 
    province, 
    post_code, 
    active
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
  RETURNING *;
`;

  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
  ];

  // Console log everything just to make sure we've done it right.
  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
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
exports.addProperty = addProperty;