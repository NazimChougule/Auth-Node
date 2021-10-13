const models = require('../models');
const config = require('../config/authConfig');
const User = models.users;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    if (user) {
      if (req.body.roleId) {
        await user.setRoles([req.body.roleId]);
        res.status(201).send({ message: 'User was registered successfully!' });
      } else {
        await user.setRoles([1]);
        res.status(201).send({ message: 'User was registered successfully!' });
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: 'User Not Found!' });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }

    var token = jwt.sign({ id: user.id, name: user.name }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    var authorities = [];
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push('ROLE_' + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        message: 'success',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        },
      });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
