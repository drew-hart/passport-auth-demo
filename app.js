const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

// Setup application
const app = express();
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/test');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
const sessionInfo = {
  secret: 'Drew Hart',
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionInfo));
// User.serializeUser is a method that's imported through passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// **************************
//   Auth Routes
// **************************

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/secret', (req, res) => {
  // check if the user is logged in
  res.render('secret');
});

// Register routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.render('register');
    }
    // TODO: Look into the parentheses that seem to bump up next to one another without a delimiter
    passport.authenticate('local')(req, res, () => {
      res.redirect('/secret');
    });
  });
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login',
}), (req, res) => {
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.
};
app.listen(8080, () => {
  console.log('Auth Demo server running...');
});
