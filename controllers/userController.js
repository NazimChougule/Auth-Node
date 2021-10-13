const models = require('../models');
const config = require('../config/authConfig');
const User = models.users;
const Role = models.roles;

exports.allAccess = async (req, res) => {
  const users = 
  res.status(200).send('Public Content.');
};

exports.userBoard = (req, res) => {
  res.status(200).send('User Content.');
};

exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send('Moderator Content.');
};
