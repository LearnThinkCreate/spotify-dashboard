import pg from "pg";
// import { unstable_noStore as noStore } from 'next/cache';
var types = require("pg").types;
require("dotenv").config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const query = (text: string, values?: any[]): Promise<pg.Result> => {
  return pool.query(text, values);
};

export default query;
