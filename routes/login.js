var express = require('express');
var router = express.Router();
var dao = require('./dao');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var flash=require("connect-flash");

router.get('/', function (req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('login');
});



router.post('/loginUser', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: "Invalid Username or Password"
}));

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

module.exports = router;