const models = require("../models");
const Cart = models.carts;

exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({
      where: {
        id: req.userId,
      },
    });
    return res.status(200).json({
      message: "success",
      data: {
        cart,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

exports.addToUserCart = async (req, res) => {
  try {
    const cart = await Cart.create({
      qty: req.body.quantity,
      userId: req.userId,
      productId: req.body.productId,
    });
    res.status(201).json({
      message: "success",
      data: {
        cart,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Bad Request",
      err: err,
    });
  }
};

// exports.updateCart = async (req, res) => {
//   try {

//   } catch (err) {

//   }
// };
