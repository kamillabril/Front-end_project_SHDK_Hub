const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",        
  host: "localhost",
  database: "shdk_hub",  
  password: "22222222",
  port: 5433,
});

module.exports = pool;
