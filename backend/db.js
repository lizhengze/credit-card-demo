// require("dotenv").config();
require("dotenv").config({ path: __dirname + "/../.env" });

console.log("Postgres config:", {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE
});

const { Pool } = require("pg");


const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

// PGUSER=postgres
// PGHOST=localhost
// PGDATABASE=credit_demo
// PGPASSWORD=Shjkmm@2025
// PGPORT=5432