const userController = require("../controllers/userController");
const express = require("express");
const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/:id", userController.getUserById);
userRouter.get("/getId/:username", userController.getUserByUsername);
// userRouter.put("/profile/:id", userController.updateProfile);

module.exports = userRouter;
