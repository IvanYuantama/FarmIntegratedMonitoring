const generalController = require("../controllers/generalController");
const express = require("express");
const generalRoute = express.Router();

// generalRoute.post("/add", generalController.add);
generalRoute.post("/addNotif", generalController.addNotification);
generalRoute.delete("/deleteNotif:id", generalController.deleteNotification);
generalRoute.get("/notifications", generalController.getAllNotifications);
generalRoute.post("/automation", generalController.addAutomation);
generalRoute.get("/automation", generalController.getAllAutomations);

// generalRoute.put("/edit/:id", generalController.edit);
// generalRoute.delete("/delete/:id", generalController.delete);
// generalRoute.get("/:id", generalController.getChatById);

module.exports = generalRoute;
