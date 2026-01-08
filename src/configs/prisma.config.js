import { PrismaClient } from '@prisma/client/extension';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(Pool);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
