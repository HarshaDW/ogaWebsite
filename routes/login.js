var express = require('express');
var router = express.Router();
var dao = require('./dao');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var flash=require("connect-flash");
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

router.get('/', function (req, res, next) {
    let errorLoginx = req.flash('error');
    res.render('login', {errorLogin: errorLoginx});
});

router.post('/loginUser', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash : true
    }), (req, res) => {
        if (req.user.user_id === 'admin') {
            console.log(req)
            res.redirect('/adminPage');
        }
        else {
            console.log(req);
            res.redirect('/');
        }
    });


passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

module.exports = router;