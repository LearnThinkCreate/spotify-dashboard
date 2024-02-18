import pg from "pg";
var types = require("pg").types;
require("dotenv").config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const query = (text: string, values?: any[]): Promise<pg.Result> => {
  return pool.query(text, values);
};
