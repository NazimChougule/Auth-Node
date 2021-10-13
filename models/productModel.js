module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('products', {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    imageType: {
      type: Sequelize.STRING,
    },
    imageName: {
      type: Sequelize.STRING,
    },
    imageData: {
      type: Sequelize.BLOB('long'),
    },
    categoryId: {
      type: Sequelize.STRING,
    },
    categoryName: {
        type: Sequelize.STRING,
    },
    createdBy: {
      type: Sequelize.STRING,
    },
  });

  Product.associate = function (models) {
    Product.belongsTo(models.categories, {
      through: 'product_categories',
      foreignKey: 'productId',
      other: 'categoryId',
    });
  };

  return Product;
};
