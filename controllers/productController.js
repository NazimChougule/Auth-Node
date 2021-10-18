const models = require('../models');
var Sequelize = require('sequelize');

var Op = Sequelize.Op;

exports.getAllProducts = async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.pageSize) || 10,
      searchText: req.query.searchText || '',
      category: parseInt(req.query.category) || null,
      priceFrom: parseInt(req.query.priceFrom) || null,
      priceTo: parseInt(req.query.priceTo) || null,
    };
    var query = {
      offset: pageOptions.page * pageOptions.limit,
      limit: pageOptions.limit,
      where: {
        name: {
          [Op.iLike]: `%${pageOptions.searchText}%`,
        },
      },
      order: [['createdAt', 'ASC']]
    };
    if (pageOptions.category) {
      Object.assign(query.where, {
        [Op.and]: [{ categoryId: pageOptions.category }],
      });
    }
    if (pageOptions.priceFrom && pageOptions.priceTo) {
      Object.assign(query.where, {
        [Op.and]: [
          {
            price: {
              [Op.between]: [pageOptions.priceFrom, pageOptions.priceTo],
            },
          },
        ],
      });
    }
    const count = await models.products.count({...query});
    const products = await models.products.findAll({...query});
    res.status(200).json({
      status: 'success',
      count,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await models.products.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['categoryId'],
      },
    });
    res.status(200).json({
      status: 'success',
      data: {
        products: product,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Not found',
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (req.body.categoryId) {
      const product = await models.products.create({
        name: req.body.name,
        createdBy: req.userName.toTitleCase(),
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        categoryName: req.body.categoryName,
      });
      if (product) {
        await product.setCategories([req.body.categoryId]);
        res.status(201).json({
          status: 'success',
          data: {
            product,
          },
        });
      }
    } else {
      return res.status(400).json({
        status: 'failed',
        message: 'Please select category',
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Bad request',
      err: err,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await models.products.update(req.body, {
      where: {
        id: [id],
      },
    });
    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Not found',
      err: err,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await models.products.destroy({
      where: {
        id: [id],
      },
    });
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Not found',
    });
  }
};

String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
