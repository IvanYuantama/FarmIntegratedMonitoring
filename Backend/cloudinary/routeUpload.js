const express = require("express");
const router = express.Router();
const cloudinary = require("./cloudinary");
const upload = require("./multer");

router.post("/upload", upload.single("image"), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.status(200).json(result.url);
  });
});

module.exports = router;
