# LightBnB

LightBnB is a single-page, AirBnB-type web application.
The learning objectives for the project are as follows:

  * Design the database and create an ERD for the tables.
  * Create the database and the tables using the ERD.
  * Add fake data to the database to make testing queries easier.
  * Write SQL queries.
  * Connect the database to a JavaScript application in order to interact with the data from a web page.


## Purpose

This project is part of my learnings at Lighthouse Labs.


## Final Product

- This submission has been tested with Chrome, while the database has been tested directly with Node-Postgres and should fulfill all of the functional requirements of the assignment as well as the stretch features.


## Project Structure

```
├── 1_queries
│   ├── 1_user_login.sql
│   ├── 2_avg_reservation_length.sql
│   ├── 3_properties_by_city.sql
│   ├── 4_most_viewed_cities.sql
│   └── 5_reservations_by_user.sql
│
├── LightBnB_WebApp-master
│   ├── public
│   │   ├── ERD
│   │   │   ├── lightBnB_ERD_challenge.png
│   │   │   ├── lightBnBComnpass.png
│   │   │   └── lightBnBStretchComnpass.png
│   │   │
│   │   ├── javascript
│   │   │   ├── components 
│   │   │   │   ├── header.js
│   │   │   │   ├── login_form.js
│   │   │   │   ├── new_property_form.js
│   │   │   │   ├── property_listing.js
│   │   │   │   ├── property_listings.js
│   │   │   │   ├── search_form.js
│   │   │   │   └── signup_form.js
│   │   │   │
│   │   │   ├── libraries
│   │   │   ├── index.js
│   │   │   ├── network.js
│   │   │   └── views_manager.js
│   │   │
│   │   ├── styles
│   │   └── index.html
│   ├── sass
│   └── server
│     ├── db
│     │   └── index.js
│     ├── json
│     ├── queries
│     │   ├── properties.js
│     │   ├── reservations.js
│     │   └── users.js
│     │
│     ├── apiRoutes.js
│     ├── database.js
│     ├── server.js
│     └── userRoutes.js
│
├── .env
│
├── migrations
│   ├── 01_schema.sql
│   └── 02_stretch.sql
│
└── seeds
    ├── 01_seeds.sql
    └── 02_seeds.sql
```

## Getting Started

1. [Create](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) a new repository using this repository as a template.
2. Clone your repository onto your local device.
3. Install dependencies using the `npm install` command.
4. Create the database and tables in node-postgres:
  - if this is the first time installing the project, remove the comments from the first two lines of code from the file `migrations/01_schema.sql`:
    -- CREATE DATABASE lightbnb;
    -- \c lightbnb
  - cd into the root folder of the project (LightBnB), then run the following node-postgres commands:
    ```
    \i migrations/01_schema.sql
    \i migrations/02_stretch.sql
    ```
  - then add the sample data in the same way:
    ```
    \i seeds/01_seeds.sql
    \i seeds/02_seeds.sql
    ```
5. Back in node js, cd into the `LightBnB_WebApp-master` folder and start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
6. Go to <http://localhost:3000/> in your browser.


## Dependencies

- express
- node 5.10.x or above
- body-parser
- bcrypt
- cookie-session
- dotenv
- pg

## Dev Dependencies

- nodemon


## Documentation

* `public` contains all of the HTML, CSS, and client side JavaScript in addition to the ERD diagrams for the project at various stages, `lightBnB_ERD_challenge.png` being student-drawn. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `sass` contains all of the sass files.
* `server` contains all of the server side and database code.
  * `server.js` is the entry point to the application. This connects the routes to the database.
  * `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`. 
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. The queries have been modularized by entity and are imported from the `queries` folder.
  * `db > index.js` is a database adapter file to handle connections to the database.
* `.env` is a file that would be used to 'hide' sensitive information within the project.  I have installed `dotenv` and set-up the file for practice, although the actual data is repeated in the `database.js` file, so there is no actual security benefit in the current form.