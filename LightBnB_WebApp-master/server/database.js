// Use database adapter file (index.js) to interact with PostgreSQL DB.
const db = require('./db/index');

/// Users
const { getUserWithEmail, getUserWithId, addUser } = require('./queries/users');
exports.getUserWithEmail = getUserWithEmail;
exports.getUserWithId = getUserWithId;
exports.addUser = addUser;

/// Reservations
const { getAllReservations} = require('./queries/reservations');
exports.getAllReservations = getAllReservations;

/// Properties
const { getAllProperties, addProperty } = require('./queries/properties');
exports.getAllProperties = getAllProperties;
exports.addProperty = addProperty;
