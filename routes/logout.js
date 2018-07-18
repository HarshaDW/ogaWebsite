/**
 * Created by harshawijendra on 7/17/18.
 */
var express = require('express');
var router = express.Router();
var dao = require('./dao');

var passport = require('passport');

router.get('/   ', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/')
    console.log(req);
})

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

module.exports = router;