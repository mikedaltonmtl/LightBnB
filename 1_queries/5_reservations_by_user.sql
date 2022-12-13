/*
Show all reservations for a user.

Select the reservation id, property title, reservation start_date, property cost_per_night 
and the average rating of the property. You'll need data from both the reservations and properties 
tables.
The reservations will be for a single user, so just use 1 for the user_id.
Order the results from the earliest start_date to the most recent start_date.
Limit the results to 10.

    id   |      title      | cost_per_night | start_date |   average_rating   
---------+-----------------+----------------+------------+--------------------
 1017016 | Apple barn      |          79787 | 2014-05-17 | 4.1666666666666667
 1010127 | Piano principle |          16669 | 2014-08-17 | 3.7777777777777778
 1012625 | Bow forest      |          13562 | 2015-07-30 | 4.2727272727272727
 1013921 | Down observe    |          36117 | 2016-05-11 | 4.2857142857142857
 1010623 | Like arrow      |          92451 | 2016-07-08 | 4.1666666666666667
 1011691 | You weight      |          11459 | 2017-07-01 | 3.8333333333333333
 1015180 | Bank rest       |          32800 | 2019-07-23 | 4.0000000000000000
 1019776 | Also additional |          44391 | 2019-12-20 | 4.4666666666666667
 1014540 | Boat list       |          75355 | 2020-11-28 | 3.4285714285714286
 1016099 | Series cow      |          13497 | 2021-02-22 | 3.3333333333333333
(10 rows)

SELECT  reservations.id,
        properties.title,
        properties.cost_per_night,
        reservations.start_date,
        AVG(property_reviews.rating) as average_rating
FROM reservations
  INNER JOIN users ON users.id = reservations.guest_id
  INNER JOIN properties ON properties.id = reservations.property_id
  INNER JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE users.id = 1
GROUP BY reservations.id, properties.title, properties.cost_per_night
ORDER BY reservations.start_date ASC
LIMIT 10;
*/
-- answer from Compass, gives same output as my answer above:
SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;
