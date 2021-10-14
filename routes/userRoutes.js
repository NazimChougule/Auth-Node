const express = require("express");
const userController = require("../controllers/userController");
const { authJwt } = require("../middleware");

const router = express.Router();

router
  .route("/cart")
  .get([authJwt.verifyToken], userController.getUserCart)
  .post([authJwt.verifyToken], userController.addToUserCart);

// router
//   .route("/cart/:id")
//   .patch([authJwt.verifyToken], userController.updateCart)

module.exports = router;
