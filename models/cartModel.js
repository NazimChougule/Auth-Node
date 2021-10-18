module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("carts", {
    qty: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    productId: {
      type: Sequelize.INTEGER,
    },
  });

  Cart.associate = function(models) {
    Cart.belongsTo(models.products, { foreignKey: 'productId', as: 'product'});
  }

  return Cart;
};
