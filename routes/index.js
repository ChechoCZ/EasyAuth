var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var Sequelize = require('sequelize');
var Request = require('request');
var User = require('../models/user');

//create a sequelize instance with our local database information.
const sequelize = new Sequelize('sqlite:./db.sqlite');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    res.render('index', { title: 'EasyAuth' });
  } else {
    res.redirect('login');
  }
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* POST login page. */
router.post('/login', function(req, res) {
  User.findOne({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  }).then(function (user) {
    if (!user) {
      console.log('Not user found');
      res.redirect('login');
    } else {
      req.session.user = user.dataValues;
      res.redirect('/');
    }
  });
});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  }
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect('setup');
    } else {
      res.redirect('login');
    }
};

module.exports = router;
