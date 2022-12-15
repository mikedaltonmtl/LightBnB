// Database queries on properties

// Use database adapter file to interact with PostgreSQL DB.
const db = require('../db/index');

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {result.rows}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // Setup an array to hold any parameters that may be available for the query.
  const queryParams = [];
  // Use a boolean to track whether this is the first WHERE clause.
  let multipleWheres = false;
  // Start the query with all information that comes before the WHERE clause.
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;
  // Check if a city has been passed in as an option.
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
  // Check for minimum & maximum cost parameters... here, both are passed.
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryString += multipleWheres ? `AND ` : 'WHERE ';
    multipleWheres = true;
    queryParams.push(options.minimum_price_per_night, options.maximum_price_per_night);
    queryString += `cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
  }
  // Only by minimum price per night.
  if (options.minimum_price_per_night && !options.maximum_price_per_night) {
    queryString += multipleWheres ? `AND ` : 'WHERE ';
    multipleWheres = true;
    queryParams.push(options.minimum_price_per_night);
    queryString += `cost_per_night >= $${queryParams.length} `;
  }
  // Only by maximum price per night.
  if (!options.minimum_price_per_night && options.maximum_price_per_night) {
    queryString += multipleWheres ? `AND ` : 'WHERE ';
    multipleWheres = true;
    queryParams.push(options.maximum_price_per_night);
    queryString += `cost_per_night <= $${queryParams.length} `;
  }
  // Continue with the query following the WHERE clause.
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
  // Run the query.
  return db
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

  return db
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