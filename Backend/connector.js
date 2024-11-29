const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

connectDB = async function () {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false, // This disables certificate verification (not recommended for production)
    },
  });

  pool
    .connect()
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
    });
};

module.exports = {
  connectDB,
};
