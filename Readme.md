# MOLO BACKEND

Simple backend for the MOLO project — an Express + Prisma API.

## Overview

This repository contains the server-side code for MOLO, including Prisma schema and migrations, Express controllers, and middleware.

## Requirements

- Node.js (16+)
- npm or yarn
- PostgreSQL (or another database supported by Prisma)

## Quick Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with at least the `DATABASE_URL` value.

3. Apply Prisma migrations:

```bash
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

## Notes

- See the `prisma/` folder for schema and migration history.
- Adjust environment variables and scripts as needed for your workflow.

## Contributing

Feel free to open issues or PRs. Keep changes small and focused.

