module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
    categoryId: {
      type: Sequelize.INTEGER,
    },
    categoryName: {
      type: Sequelize.STRING,
    },
    createdBy: {
      type: Sequelize.STRING,
    },
  });

  Product.associate = function (models) {
    Product.belongsToMany(models.categories, {
      through: "product_categories",
      foreignKey: "productId",
      other: "categoryId",
    });
  };

  return Product;
};
