const express = require("express");
const productController = require("../controllers/productController");
const { authJwt, productCheck } = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(
    [authJwt.verifyToken, authJwt.isModeratorOrUser],
    productController.getAllProducts
  )
  .post(
    [
      authJwt.verifyToken,
      authJwt.isModerator,
      productCheck.checkDuplicateProduct,
      productCheck.checkCategoryExist,
      productCheck.validation,
      productCheck.checkProductLength,
    ],
    productController.createProduct
  );

router
  .route("/:id")
  .get([authJwt.verifyToken, authJwt.isModeratorOrUser], productController.getProduct)
  .patch(
    [
      authJwt.verifyToken,
      authJwt.isModerator,
      productCheck.checkDuplicateProduct,
      productCheck.validation,
      productCheck.checkProductLength,
    ],
    productController.updateProduct
  )
  .delete(
    [authJwt.verifyToken, authJwt.isModerator],
    productController.deleteProduct
  );

module.exports = router;
