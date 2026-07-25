import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool, types } = pkg;

types.setTypeParser(1082, (val: unknown) => val);

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

db.on("connect", () => {
    console.log("Connected to Neon PostgreSQL");
});

db.on("error", (err: unknown) => {
  console.error("Unexpected Neon Postgres error:", err);
  process.exit(-1);
});