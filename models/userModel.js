module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      }
    });

    User.associate = function(models) {
        User.belongsToMany(models.roles, {
            through: "user_roles",
            foreignKey: "userId",
            otherKey: "roleId"
          });
    }
  
    return User;
  };