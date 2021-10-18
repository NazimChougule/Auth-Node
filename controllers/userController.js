const models = require('../models');
const Cart = models.carts;
const Order = models.orders;

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
        if (parseInt(req.body.quantity) == 0) {
          cart = await Cart.destroy({
            where: {
              id: req.body.id,
            },
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
              returning: true,
            }
          );
        }
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

exports.deleteCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      await Cart.destroy({
        where: { id: id },
      });
      res.status(200).json({
        message: 'Product removed from cart successfully',
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Bad Request',
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

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        userId: req.userId,
      },
      raw: true,
    });

    let productIDS = [],
      set = new Set();
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++)
        set.add(orders[i].products[j].id);
    }
    productIDS = [...set];
    let products = await models.products.findAll({
      raw: true,
      where: { id: productIDS },
    });

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        let pID = orders[i].products[j].id;
        let index = productIDS.indexOf(pID);
        let obj = { ...orders[i].products[j] };
        orders[i].products[j] = { ...obj, ...products[index] };
      }
    }

    return res.status(200).json({
      message: 'success',
      data: {
        orders,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Bad Request',
      err: err,
    });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const invoiceNumber =
      Math.floor(Math.random() * (99999999999 - 10000000000)) + 10000000000;
    const orders = await Order.create({
      userId: req.userId,
      products: req.body.products,
      total_price: req.body.totalPrice,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
      invoice_number: invoiceNumber,
    });

    let productIDS = [],
      set = new Set();
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++)
        set.add(orders[i].products[j].id);
    }
    productIDS = [...set];
    let products = await models.products.findAll({
      raw: true,
      where: { id: productIDS },
    });

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        let pID = orders[i].products[j].id;
        let index = productIDS.indexOf(pID);
        let obj = { ...orders[i].products[j] };
        orders[i].products[j] = { ...obj, ...products[index] };
      }
    }

    return res.status(201).json({
      message: 'Order Placed Successfully',
      orders,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Bad Request',
      err: err,
    });
  }
};