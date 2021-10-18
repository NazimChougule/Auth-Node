module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('orders', {
    userId: {
      type: Sequelize.INTEGER,
    },
    products: {
      type: Sequelize.JSONB,
    },
    total_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    pincode: {
      type: Sequelize.STRING,
    },
    invoice_number: {
      type: Sequelize.BIGINT,
    },
  });

  return Order;
};
