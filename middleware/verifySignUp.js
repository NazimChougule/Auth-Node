const models = require('../models');
const Role = models.roles;
const User = models.users;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Email
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    res.status(400).send({
      message: 'Failed! Email is already in use!',
    });
    return;
  }

  // Number
  const userNumber = await User.findOne({
    where: {
      number: req.body.number,
    },
  });
  if (userNumber) {
    res.status(400).send({
      message: 'Failed! Number is already in use!',
    });
    return;
  }

  next();
};

checkRolesExisted = async (req, res, next) => {
  if (req.body.roles) {
    const role = await Role.findOne({
        where: {
            name: req.body.roles
        },
        attributes: ['id']
    });
    if (!role) {
      res.status(400).send({
        message: 'Failed! Role does not exist = ' + req.body.roles,
      });
      return;
    } else {
        req.body.roleId = role.id;
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
