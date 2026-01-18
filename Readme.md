# MOLO — Backend (Express + Mongoose + MongoDB)

Express API backend for the SVSC project's MOLO service.

## Overview

This repository contains the server-side API implementation built with **Express** and **Mongoose** (MongoDB). It includes controllers, middleware, Mongoose models, and Jest tests.

## Requirements

- Node.js 16+
- npm
- MongoDB (local or Atlas)

## Quick Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with at least the following values (example):

```dotenv
MONGODB_URI=
MONGODB_DB=DATABASE_MOLO
PORT=6000
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CORS=*
```

Notes:

- `MONGODB_URI` must start with `mongodb://` or `mongodb+srv://`.
- If `MONGODB_URI` already contains a database name (e.g. `mongodb://host:27017/mydb`), the app will use that DB name. Otherwise `MONGODB_DB` is used.

3. Start the development server:

```bash
npm run dev
```

## Scripts

- `npm run dev` — start dev server with `nodemon` (auto-reload)
- `npm test` — run the Jest test suite
- `npm run lint` — run ESLint
- `npm run format` — run Prettier to format files

## Testing

Unit tests use **Jest** (configured for ESM). Run the test suite with:

```bash
npm test
```

Or use watch mode for development:

```bash
npm run test:watch
```

### Test Coverage

The test suite includes comprehensive coverage for:

- **Controllers**:
  - `user.controller.test.js` — User registration, login, validation
  - `order.controller.test.js` — Order creation, validation, seat availability
  - `admin.controller.test.js` — Event creation/management, ticket category creation
  - `start.controller.test.js` — Server startup endpoint

- **Middleware**:
  - `auth.middleware.test.js` — Authentication token validation
  - `authorize.middleware.test.js` — Role-based access control (RBAC)

- **Models**:
  - `user.model.test.js` — User schema validation
  - `order.model.test.js` — Order schema validation
  - `ticket.model.test.js` — Ticket schema validation
  - `event.model.test.js` — Event schema validation
  - `ticketcat.model.test.js` — TicketCategory schema validation

- **Utilities**:
  - `apiError.test.js` — Custom error handling
  - `apiResponse.test.js` — Standard API response format
  - `asyncHandler.test.js` — Async middleware wrapper

**Test Examples:**

Controller tests validate:

- Input validation and missing parameter handling
- Database operation success scenarios
- Error handling via the `next()` callback
- Proper HTTP status codes and response structure

**Notes:**

- Tests mock Mongoose methods where appropriate
- For integration tests, you can use an in-memory MongoDB (e.g., `mongodb-memory-server`)
- All tests use dynamic imports to support ES modules
- All async route handlers are wrapped with `asyncHandler` which properly handles promise rejection

## Debugging DB connections

If you see errors like `Invalid namespace specified` or `Invalid scheme`, check:

- `MONGODB_URI` starts with `mongodb://` or `mongodb+srv://` and has no accidental leading characters
- Avoid adding a trailing slash after the host (the app strips trailing slashes safely, but malformed URIs can still cause issues)

The app logs a masked URI during startup to help debug connection strings (credentials are hidden).

## Project Structure (high level)

- `src/` — application source code
  - `configs/` — DB connection and config
  - `controllers/` — request handlers
  - `models/` — Mongoose schemas & models
  - `routes/` — Express routes
  - `middleware/` — Express middleware
  - `utils/` — helpers, error types
- `test/` — Jest unit tests

## Contributing

- Open issues or PRs with focused changes
- Run tests and linters before submitting changes

