const express = require("express");
const userRouter = require("./userRoute.js");
const aktuatorRouter = require("./aktuatorRoute.js");
const generalRouter = require("./generalRoute.js");
const uploadRoute = require("../cloudinary/routeUpload.js");

const router = express.Router();

router.use("/user", userRouter);
router.use("/aktuator", aktuatorRouter);
router.use("/general", generalRouter);
router.use("/cloudinary", uploadRoute);

module.exports = router;
