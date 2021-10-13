const express = require('express');
const userController = require('../controllers/userController');
const { authJwt } = require('../middleware');

const router = express.Router();

router.route('/user').get([authJwt.verifyToken], userController.userBoard);
router
  .route('/mod')
  .get(
    [authJwt.verifyToken, authJwt.isModerator],
    userController.moderatorBoard
  );
router
  .route('/admin')
  .get([authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);

module.exports = router;
