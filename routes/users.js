const express = require('express');
const router = express.Router();
const passport = require('passport');

const users = require('../controllers/users');
const wrapAsync = require('../utility/wrapAsync');

router
  .route('/register')
  .get(users.renderRegister)
  .post(wrapAsync(users.registerUser));

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    wrapAsync(users.loginUser)
  );

router.get('/logout', users.logoutUser);

module.exports = router;
