module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("carts", {
    qty: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    userId: {
      type: Sequelize.STRING,
    },
    productId: {
      type: Sequelize.STRING,
    },
  });

  return Cart;
};
