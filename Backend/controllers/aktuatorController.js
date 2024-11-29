const { Pool } = require("pg");
require("dotenv").config();

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

const aktuatorControllers = {
  // Add temperature sensor data
  addTemperature: async (req, res) => {
    const { value, status = "active" } = req.body;
    const timestamp = new Date().toISOString();
    try {
      await pool.query("INSERT INTO sensor_suhu (value, status, timestamp) VALUES ($1, $2, $3)", [value, status, timestamp]);
      res.status(201).send("Temperature data added successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Add humidity sensor data
  addHumidity: async (req, res) => {
    const { value, status = "active" } = req.body;
    const timestamp = new Date().toISOString();
    try {
      await pool.query("INSERT INTO sensor_humidity (value, status, timestamp) VALUES ($1, $2, $3)", [value, status, timestamp]);
      res.status(201).send("Humidity data added successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Add LDR sensor data
  addLDR: async (req, res) => {
    const { value, status = "active" } = req.body;
    const timestamp = new Date().toISOString();
    try {
      await pool.query("INSERT INTO sensor_ldr (value, status, timestamp) VALUES ($1, $2, $3)", [value, status, timestamp]);
      res.status(201).send("LDR data added successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Add relay data
  addRelay: async (req, res) => {
    const { device, status = false } = req.body;
    const timestamp = new Date().toISOString();
    try {
      await pool.query("INSERT INTO relay (device, status, timestamp) VALUES ($1, $2, $3)", [device, status, timestamp]);
      res.status(201).send("Relay added successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Update relay status
  updateRelayStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const timestamp = new Date().toISOString();
    try {
      await pool.query("UPDATE relay SET status = $1, timestamp = $2 WHERE id = $3", [status, timestamp, id]);
      res.status(200).send("Relay status updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Get temperature sensor data
  getTemperature: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM sensor_suhu");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Get humidity sensor data
  getHumidity: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM sensor_humidity");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Get LDR sensor data
  getLDR: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM sensor_ldr");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = aktuatorControllers;
