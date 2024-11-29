const aktuatorController = require("../controllers/aktuatorController");
const express = require("express");
const aktuatorRoute = express.Router();

// // Routes for adding sensor data
// aktuatorRoute.post("/temperature", aktuatorController.addTemperature);
// aktuatorRoute.post("/humidity", aktuatorController.addHumidity);
// aktuatorRoute.post("/ldr", aktuatorController.addLDR);

// Routes for adding and updating relay data
aktuatorRoute.post("/temperature", aktuatorController.addTemperature);
aktuatorRoute.post("/humidity", aktuatorController.addHumidity);
aktuatorRoute.post("/ldr", aktuatorController.addLDR);
aktuatorRoute.post("/relay", aktuatorController.addRelay);
aktuatorRoute.put("/relay/:id", aktuatorController.updateRelayStatus);
aktuatorRoute.get("/temperature", aktuatorController.getTemperature);
aktuatorRoute.get("/humidity", aktuatorController.getHumidity);
aktuatorRoute.get("/ldr", aktuatorController.getLDR);

module.exports = aktuatorRoute;
