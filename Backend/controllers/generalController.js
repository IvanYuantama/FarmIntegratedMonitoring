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
  addNotification: async (req, res) => {
    const { isi, from } = req.body; // Mengambil data dari body request
    const timestamp = new Date().toISOString();
    try {
      await pool.query('INSERT INTO notifikasi (isi, "from", timestamp) VALUES ($1, $2, $3)', [isi, from, timestamp]);
      res.status(201).send("Notifikasi berhasil ditambahkan");
    } catch (error) {
      console.error("Error saat menambahkan notifikasi:", error);
      res.status(500).send("Terjadi kesalahan saat menambahkan notifikasi");
    }
  },

  // Menghapus notifikasi berdasarkan ID
  deleteNotification: async (req, res) => {
    const { id } = req.params; // Mendapatkan ID dari parameter URL
    try {
      const result = await pool.query("UPDATE notifikasi SET status = 'unsent' WHERE id = $1", [id]);
      if (result.rowCount > 0) {
        res.status(200).send("Notifikasi berhasil dihapus");
      } else {
        res.status(404).send("Notifikasi tidak ditemukan");
      }
    } catch (error) {
      console.error("Error saat menghapus notifikasi:", error);
      res.status(500).send("Terjadi kesalahan saat menghapus notifikasi");
    }
  },

  getAllNotifications: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM notifikasi WHERE status = 'sent' ORDER BY timestamp DESC");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error saat mendapatkan notifikasi:", error);
      res.status(500).send("Terjadi kesalahan saat mendapatkan notifikasi");
    }
  },

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

  addAutomation: async (req, res) => {
    const { time, device, status } = req.body; // Menambahkan status
    const timestamp = new Date().toISOString();
    try {
      // Query untuk menambahkan data automisasi dengan status
      await pool.query(
        "INSERT INTO automisasi (time, device, status, timestamp) VALUES ($1, $2, $3, $4)",
        [time, device, status || "on", timestamp] // Gunakan 'on' sebagai default jika status tidak diberikan
      );
      res.status(201).send("Automisasi berhasil ditambahkan");
    } catch (error) {
      console.error("Error saat menambahkan automisasi:", error);
      res.status(500).send("Terjadi kesalahan saat menambahkan automisasi");
    }
  },

  getAllAutomations: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM automisasi ORDER BY timestamp DESC");
      res.status(200).json(result.rows); // Mengembalikan data termasuk kolom status
    } catch (error) {
      console.error("Error saat mendapatkan semua automisasi:", error);
      res.status(500).send("Terjadi kesalahan saat mendapatkan data automisasi");
    }
  },

  // Start scheduler to check automation every minute
  startAutomationScheduler: () => {
    setInterval(generalController.checkAndAutomateRelay, 60000); // Check every minute
  },

  checkAndAutomateRelay: async () => {
    const currentTime = new Date().toTimeString().split(" ")[0]; // Get current time in HH:MM:SS format
    try {
      const result = await pool.query("SELECT * FROM automisasi WHERE time = $1", [currentTime]);
      if (result.rows.length > 0) {
        result.rows.forEach(async (automation) => {
          // Ambil status untuk menentukan tindakan
          if (automation.status === "on") {
            console.log(`Turning ON device ${automation.device} at ${currentTime}.`);
            // Kode untuk menyalakan perangkat
          } else if (automation.status === "off") {
            console.log(`Turning OFF device ${automation.device} at ${currentTime}.`);
            // Kode untuk mematikan perangkat
          }
        });
      }
    } catch (error) {
      console.error("Error in automation:", error);
    }
  },
};

module.exports = generalController;
