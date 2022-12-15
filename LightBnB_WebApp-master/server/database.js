// The SQL queries have been modularized by entity in the 'queries' folder

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
