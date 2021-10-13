const express = require('express');
const authController = require('../controllers/authController');
const { verifySignUp } = require('../middleware')

const router = express.Router();

router
  .route('/signup')
  .post(
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    authController.signup
  );

router.route('/signin').post(authController.signin);

module.exports = router;
