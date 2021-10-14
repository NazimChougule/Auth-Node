const { check, validationResult } = require("express-validator");
const models = require("../models");

checkDuplicateProduct = async (req, res, next) => {
  const product = await models.products.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (product) {
    res.status(400).send({
      message: "Failed! Product already exists!",
    });
    return;
  }
  next();
};

checkCategoryExist = async (req, res, next) => {
  const category = models.categories.findOne({
    where: {
      id: req.body.categoryId,
    },
  });
  if (!category) {
    res.status(400).send({
      message: "Failed! Category does not exist!",
    });
    return;
  }
  next();
};

checkProductLength = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } else {
    next();
  }
};

validation = [
  check("name")
    .isLength({ max: 20 })
    .withMessage("Product Name must be less than 20 characters"),
];

const productCheck = {
  checkDuplicateProduct: checkDuplicateProduct,
  validation: validation,
  checkCategoryExist: checkCategoryExist,
  checkProductLength: checkProductLength,
};

module.exports = productCheck;
