module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("roles", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Role.associate = function(models) {
        Role.belongsToMany(models.users, {
          through: "user_roles",
          foreignKey: "roleId",
          otherKey: "userId"
        });
    }
  
    return Role;
  };
  