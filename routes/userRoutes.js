const express = require("express");
const userController = require("../controllers/userController");
const invoiceController = require("../controllers/invoiceController");
const { authJwt } = require("../middleware");

const router = express.Router();

router
  .route("/cart")
  .get([authJwt.verifyToken], userController.getUserCart)
  .post([authJwt.verifyToken], userController.addToUserCart);

router
  .route("/cart/:id")
  .delete([authJwt.verifyToken], userController.deleteCartItem)

router
.route('/orders')
.get([authJwt.verifyToken], userController.getUserOrders)
.post([authJwt.verifyToken], userController.placeOrder);

router
.route('/invoice/:invoiceNumber')
.get([authJwt.verifyToken], invoiceController.createInvoice)

module.exports = router;
