const { check, validationResult } = require('express-validator/check');
const models = require('../models');

checkDuplicateCategory = async (req, res, next) => {
  const category = await models.categories.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (category) {
    res.status(400).send({
      message: 'Failed! Category already exists!',
    });
    return;
  }
  next();
};

checkCategoryLength = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } else {
    next();
  }
};

validation = [
    check('name')
    .isLength({ max: 20 })
    .withMessage('Category Name must be less than 20 characters')
]

const categoryCheck = {
  checkDuplicateCategory: checkDuplicateCategory,
  validation:validation,
  checkCategoryLength: checkCategoryLength
};

module.exports = categoryCheck;
