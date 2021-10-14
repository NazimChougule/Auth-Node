const express = require("express");
const { authJwt, multerHelper } = require("../middleware");
const fileUploadController = require("../controllers/fileUploadController");

const router = express.Router();

router
  .route("/")
  .post(
    [authJwt.verifyToken, authJwt.isModerator, multerHelper.uploadFile],
    fileUploadController.uploadFiles
  );

module.exports = router;
