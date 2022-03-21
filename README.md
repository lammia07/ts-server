# Weather Monitoring System

## About

### Authors/Contributors

-   [Martin Guevara-Kunerth](mailto:martin.guevara-kunerth@edu.fh-joanneum.at)
-   [Michael Lamprecht](mailto:michael.lamprecht@edu.fh-joanneum.at)
-   [Samuel Angerer](mailto:samuel.angerer@edu.fh-joanneum.at)

### Description

Last semester our group wrote a python script for measuring temperature and humidity data with a Raspberry PI and visualized it via PDF as a plot.
In this project we want to expand and rewrit
e our last project to add these functions:

-   Rasperry PI does indoor measumerement like before but sends the data to a nodejs REST API
-   The REST API has an interface for measurement data with all CRUD functions
-   All data of the REST API will be stored in an MySQL database.
-   The REST API will be tested with [jest](https://www.npmjs.com/package/jest) and [supertest](https://www.npmjs.com/package/supertest)
-   On the server a nodejs cronjob will get outdoor measurement data from an api called OpenWeatherAPI and send the data to the REST API.
-   Calls to the REST API must be authenticated with an JSON web token (JWT)
-   The measurement will be modeled like this:
    -   id: int
    -   timestamp: long
    -   temperature: double
    -   humidity: double
    -   measurementType: Enum(indoor/outdoor)
    -   createdBy: string
    -   createdOn: datetime

## Development

Our recommended tools for developing are the following:

-   [HeidiSQL](https://www.heidisql.com/) (Windows) or [dbeaver](https://dbeaver.io/) (Mac)
-   [VisualStudioCode](https://code.visualstudio.com/) with the plugins:
    -   [Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles)
    -   [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
    -   [EditorConfig for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
    -   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

# Checklist

-   [x] mysql
    -   [x] Add to project (typescript/promises)
    -   [x] create file for db access (db is saved in file) (CRUD)
    -   [x] file for init (create db/tables/init data)
    -   [x] measurement-data
        -   id: int
        -   timestamp: long
        -   temperature: double
        -   humidity: double
        -   measurementType: Enum(indoor/outdoor)
        -   createdBy: string
        -   createdOn: datetime
    -   [x] user-data
        -   id: int
        -   username: string (Unique)
        -   passwordHash: string (hashed)
        -   role: string
-   [x] REST interface
    -   [x] expressjs server (typescript/promises)
    -   [x] error handling (500(Internal Server Error)/404(Not Found))
    -   [x] CRUD (GET/POST/PUT/DELETE) (/api/measurement)
        -   [x] Featuere folder measurement with own router and service files
-   [ ] raspberry
    -   edit pdf generation file to send data to our api
    -   if possible use our REST interface
-   [ ] client
    -   [x] display all measurement-data
    -   [x] display one measurement-data
    -   [ ] edit measurement-data
    -   [ ] add measurement-data
    -   [ ] delete measurement-data
-   [x] authentication
    -   [x] Service file for reading and accessing user data (include hashing)

We decided to not yet implement the raspberry and client functionality as it would exceed our timeframe for this project in this semester.

## Installation/Prerequisites for this repository

### To run this project, you need

-   [Nodejs](https://nodejs.org/en/) in version 16.1.0 or above
-   a [MySQL-Database](https://www.mysql.com/) instance (check [configuration](#database-configuration))
-   selfsigned certificate

#### Database Configuration

1. Create a MySQL-Database instance.
1. Execute the statements in the file [database-create.sql](./server/db_scripts/database-create.sql).
1. Add in the /server/config folder a <b>default.json</b> file based on the [template file](./server/db_scripts/database-create.sql).
1. Configure your database connection in the <b>MySqlConnectionPool</b> config section.
1. Add all users you want to use later into the <b>defaultUsers</b> config section.
1. The last step is to execute the following statement which will create the hashed password database users based on the "defaultUsers" config section:

```bash
cd server
npm generateUsers
```

#### Server Configuration

1. Execute Step 3 in the [db config section](#database-configuration)
2. Create a [self signed certificate](#useful-links)
3. Configure the <b>server</b> config section for your needs
4. Configure the <b>authOptions</b> config section. The accessTokenSecret and refreshTokenSecret should be an automatically generated string.

#### Test Configuration

For correct testing execution a test.json config file is needed. JEST executes the tests in an own testing environment. It will still work with the default.json, but a warning message will be shown. Simplest step would be to copy the default.json.

## Run/Execute

### Server

```bash
cd server
npm start
```

The following Endpoints are available:

```
-   GET     /                     ->  Home
-   POST    /token                ->  route for refreshing the access token
-   POST    /login                ->  route for log in user and requesting access and refresh token
-   GET     /secure               ->  route for testing if authorized

-   GET     /api/measurements     ->  Read all measurement-data
-   GET     /api/measurements/id  ->  Read one measurement
-   POST    /api/measurements     ->  Create new measurement
-   PUT     /api/measurements/id  ->  Update one measurement
-   DELETE  /api/measurements/id  ->  Delete one measurement
```

## Documentation

### Used Technology

#### [TypeScript](https://www.typescriptlang.org/)

The open-source language TypeScript is a superset of JavaScript, that adds many additional functionality to it. One of the main points are adding types to javascript, so developer can declare which types their variables and functions desire. This behavior makes working in groups easier.

#### [NodeJS](https://nodejs.org/en/)

Node is a event-driven runtime for developing web applications written in JavaScript. Because we mainly used NodeJS in our studies we decided to use NodeJS.

#### [ExpressJS](https://expressjs.com/)

ExpressJS or express is a nodejs framework for developing webapplications. It's minimalistic, easy to use and flexible. It's the standard market practice and so we decided to use it for our REST API.

#### [MySQL](https://www.mysql.com/)

MySQL is a relational database and free to use. We already implementated an interface for MySQL so we decided to use our interface and adapted it for TypeScript

#### [JEST](https://jestjs.io/)

Last but not least we needed a framework for testing our API. We decided on JEST because it is a Javascript Testing Framework with a focus on simplicity and has typescript support.

### Lecture Criteria Catalog

#### REST methods (20%)

-   Read all => GET /api/measurements
-   Read single => GET /api/measurements/{id}
-   Update => PUT /api/measurements/{id}
-   Delete => DELETE /api/measurements/{id}
-   Create => POST /api/measurements

#### Access to Database (8%)

-   [dbConnection.ts](./server/src/infrastructure/dbConnection.ts) contains all CRUD operation as easy to use function.
-   [measurementService.ts](./server/src/features/measurement/measurementService.ts) supplies all CRUD operations for the measurement table and uses the dbConnection.ts for the execution

#### Authentication (8%)

All API endpoints, but /, /token and /login, are secured and can only be access via an JWT authorization header. Through the /login endpoint a user an get an access- and refreshtoken with whom the user can access the other endpoints. Through the /refresh endpoint a user can get a new access token, with just the refresh token.

#### Testing (8%)

Last but not least we strived for a 100% line coverage in our tests. We didn't get a complete coverage because jest didn't notice the callbacks of our express server, but they were mainly logs, so we ignored it (80/20 principal)
![Coverage from the jest test](./img/jest-test-coverage.jpg 'Coverage from the jest test')

#### Reason for choosen criteria

We choose these points of the catalog because we wanted to make a whole system. Starting from the REST endpoint to the authentication next to the database and then the testing of this functionality is a whole system in our eyes.

### Graphical Overview

![Graphical Overview](./img/webservice-graphical-overview.jpg 'Graphical Overview')

### Development Process

We started with writing our database scripts to create a solid foundation for our application. The next step was to set up a node express server with promises and typescript. We already had similar requirements in another project so we copied the infrastructure from this project and tweaked it for our needs. We also realized we would need some shared code formatting configurations because everyone was writing their code in different styles, so we decided on a combination of [EditorConfig](https://editorconfig.org/) and [Prettier](https://prettier.io/). At first, we tried to build our app with the dependency injection pattern but the generated overhead was too big. Our next step was to integrate our Database into the code with the [dbConnection.ts](./server/src/infrastructure/dbConnection.ts) class. Here we used the singleton pattern because we want to use the same connection pool throughout the whole application. Using this class as our base we implemented the interface for our measurement data. We create our measurement service where all CRUD operations run with the help of our DB connection object. This service is called the measurement route who provides the HTTP methods for interaction from the outside. Here we realized that we would need global error handling. so we implemented in our express server the error handling and create our own HTTP exception error classes. ([error.ts](./server/src/infrastructure/error.ts)) After the implementation of our main logic, we checked the functionality with jest integration tests. The next step was to secure our API with the help of JWT for authentication and RequestHandler for authorization.

## Known Issues

-   Testing express with jest => memory leak
    <br />https://github.com/visionmedia/supertest/issues/520
-   missing client implementation
-   missing raspberry implementation

## Useful links

-   https://www.typescriptlang.org/docs/
-   https://expressjs.com/
-   https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
-   https://egghead.io/lessons/express-create-local-ssl-certificates-for-an-express-app-on-windows
-   https://egghead.io/lessons/express-create-local-ssl-certificates-for-an-express-app-on-windows
-   https://reactjs.org/docs/create-a-new-react-app.html
#   t s - s e r v e r  
 