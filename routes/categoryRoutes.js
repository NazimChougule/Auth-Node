const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authJwt, categoryCheck } = require('../middleware');
const { check } = require('express-validator/check');

const router = express.Router();

router
  .route('/')
  .get(
    [authJwt.verifyToken, authJwt.isAdmin],
    categoryController.getAllCategories
  )
  .post(
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      categoryCheck.checkDuplicateCategory,
      categoryCheck.validation,
      categoryCheck.checkCategoryLength,
    ],
    categoryController.createCategory
  );

router
  .route('/:id')
  .get([authJwt.verifyToken, authJwt.isAdmin], categoryController.getCategory)
  .patch(
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      categoryCheck.checkDuplicateCategory,
      categoryCheck.validation,
      categoryCheck.checkCategoryLength,
    ],
    categoryController.updateCategory
  )
  .delete(
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
    ],
    categoryController.deleteCategory
  );

module.exports = router;
