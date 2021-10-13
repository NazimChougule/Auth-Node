module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
     createdBy: {
         type: Sequelize.STRING,
     }
    });

    Category.associate = function(models) {
        Category.belongsToMany(models.products, {
            through: "product_categories",
            foreignKey: "categoryId",
            other: "productId"
        })
    }
  
    return Category;
  };