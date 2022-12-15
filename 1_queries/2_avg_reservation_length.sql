/*
Get the average duration of all reservations.

The approximate expected result is below. Note that depending on how much of your own data you added, 
your result may differ slightly (but unless you added a ton of your own data, 
it should still be around 14.6...).

  average_duration
---------------------
 14.6636000000000000
(1 row)
*/

SELECT AVG(end_date - start_date) as average_durartion
FROM reservations;
