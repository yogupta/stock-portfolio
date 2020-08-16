The app contains boiler plate code from https://github.com/hagopj13/node-express-mongoose-boilerplate

## Getting Started

### Installation

Clone the repo:

```bash
git clone https://github.com/yogupta/stock-portfolio.git
cd stock-porfolio
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

### Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

##### A swagger doc is live at `/v1/docs`

While calculating returns value in security table(document) is used.
The default value is `100`.

### Design decision

- Two mongo documents are created. `Securities` and `Trades`.
  - Trades is simple denormalised table which stores all the trades done by a user.
- Portfolio is calculated on the fly whenever user queries their portfolio.
  - checkout [this](https://stackoverflow.com/questions/4373968/database-design-calculating-the-account-balance) and [this](https://stackoverflow.com/a/41400500) stackoverflow links.
  - This makes code simplier to write and easy to debug and prevents error which may arise because of multi-threading(if many transactions are performed).
  - Because we're allowing trades to be mutable i.e they can be updated in history, this also makes difficult to store portfolio of a user in database.
- similarly returns is also calculated on the fly.
- [Joi](https://www.npmjs.com/package/joi) is used for data validation.
- A in-memory moongoDB instance is spin on local when running tests.
- For prod the database is hosted on mLab.
- EsLint and prettier is used for linting.
