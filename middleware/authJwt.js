const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');
const models = require('../models');
const User = models.users;

verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({
      message: 'Unauthorized!',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    req.userName = decoded.name;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  user.getRoles().then((roles) => {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === 'admin') {
        next();
        return;
      }
    }

    res.status(403).send({
      message: 'Require Admin Role!',
    });
    return;
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'moderator') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Moderator Role!',
      });
    });
  });
};

isModeratorOrUser = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'moderator') {
          next();
          return;
        }

        if (roles[i].name === 'user') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Moderator or User Role!',
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrUser: isModeratorOrUser,
};
module.exports = authJwt;
