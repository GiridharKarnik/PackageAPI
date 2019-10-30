## Rest API to add, delete and update packages.

### Steps to run

1. Clone the project
2. Install dependencies.
3. Start the API using the command `yarn dev`.

### Postman collection

https://www.getpostman.com/collections/224fd6a3d5c0cc43ab72

### Features

* API contains two routes at `/package` and `/user`.
* All resource endpoints are protected using `jwt` token.
* Can add and authenticate users.
* DB is mocked using `.json` files for storing `user` and `package` data.
* Support for product prices in multiple currencies supported by [exchange rates API]("https://api.exchangeratesapi.io/latest).
