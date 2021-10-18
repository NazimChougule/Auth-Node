const models = require('../models');
const Cart = models.carts;

exports.getUserCart = async (req, res) => {
  try {
    const count = await Cart.count({
      where: {
        userId: req.userId,
      },
    });
    const cart = await Cart.findAll({
      where: {
        userId: req.userId,
      },
      include: [
        {
          model: models.products,
          as: 'product',
          attributes: { exclude: ['createdBy', 'createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['productId'] },
    });
    return res.status(200).json({
      message: 'success',
      count,
      data: {
        cart,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

exports.addToUserCart = async (req, res) => {
  try {
    if (req.body.productId) {
      const cartItem = req.body.id
        ? await Cart.findOne({ where: { id: req.body.id } })
        : null;
      var cart = null;
      if (!cartItem) {
        cart = await Cart.create({
          qty: req.body.quantity,
          userId: req.userId,
          productId: req.body.productId,
        });
      } else {
        cart = await Cart.update(
          {
            qty: req.body.quantity,
            userId: req.userId,
            productId: req.body.productId,
          },
          {
            where: {
              id: req.body.id,
            },
            returning: true
          },
        );
      }
      res.status(201).json({
        message: 'success',
        data: {
          cart,
        },
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Please select a product',
        err: err,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Bad Request',
      err: err,
    });
  }
};

// exports.updateCart = async (req, res) => {
//   try {

//   } catch (err) {

//   }
// };
