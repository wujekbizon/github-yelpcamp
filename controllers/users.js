const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/register');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.loginUser = async (req, res) => {
  req.flash('success', `Welcome back! ${req.body.username}`);
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  const { username } = req.user;
  req.logout();
  req.flash('success', `Goodbye! ${username}`);
  res.redirect('/campgrounds');
};
