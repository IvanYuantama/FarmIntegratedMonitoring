const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

const generalController = {
  // Add automation schedule
  addAutomation: async (req, res) => {
    const { time, device } = req.body;
    const timestamp = new Date().toISOString();
    try {
      await pool.query("INSERT INTO automisasi (time, device, timestamp) VALUES ($1, $2, $3)", [time, device, timestamp]);
      res.status(201).send("Automation schedule added successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Check and automate relay based on the schedule
  checkAndAutomateRelay: async () => {
    const currentTime = new Date().toTimeString().split(" ")[0]; // Get current time in HH:MM:SS format
    try {
      const result = await pool.query("SELECT * FROM automisasi WHERE time = $1", [currentTime]);
      if (result.rows.length > 0) {
        result.rows.forEach(async (automation) => {
          // Here, you would add code to activate the relay for the specified device
          console.log(`Relay for device ${automation.device} automated at ${currentTime}.`);
        });
      }
    } catch (error) {
      console.error("Error in automation:", error);
    }
  },

  // Start scheduler to check automation every minute
  startAutomationScheduler: () => {
    setInterval(generalController.checkAndAutomateRelay, 60000); // Check every minute
  },
};

module.exports = generalController;
