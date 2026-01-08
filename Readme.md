# SVSC BACKEND

Express + Prisma backend for the SVSC project.

## Overview

This repository contains the server-side API implementation using Express, Prisma ORM, and PostgreSQL (see `prisma/schema.prisma`). It includes controllers, middleware, migration history under `prisma/migrations`, and tests under `tests/`.

## Requirements

- Node.js (16+)
- npm or yarn
- PostgreSQL (recommended) or another Prisma-supported database

## Quick Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with at least the `DATABASE_URL` value (see `prisma/.env.example` if present).

3. Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

4. Start the server (development):

```bash
npm run dev
```

## Useful Scripts

- `npm run dev` — start dev server
- `npm start` — start production server
- `npx prisma migrate deploy` — apply DB migrations
- `npx prisma generate` — generate Prisma client

## Continuous Integration

This repository uses GitHub Actions for CI. The workflow runs on push and pull requests and exercises the project across multiple OSes and Node versions (Ubuntu, macOS, Windows; Node 18/20/22). CI performs:
- install (`npm ci`)
- Prisma client generation (`npx prisma generate`)
- linting (`npm run lint`)
- format check (`npx prettier --check .`)
- tests (`npm test`)
- optional build (`npm run build --if-present`)
- dependency review and CodeQL analysis

You can run the same checks locally to reproduce CI failures.

Local commands (copy/paste):

```bash
# install exact deps used by CI
npm ci

# generate prisma client
npx prisma generate

# run lint and format check
npm run lint
npx prettier --check .

# run tests
npm test

# build (if project has a build step)
npm run build --if-present
```

## Notes

- See the `prisma/` folder for schema and migrations.
- Keep environment variables out of source control; use `.env`.

## Contributing

Open issues or PRs with focused changes. Run tests and linters before submitting.
