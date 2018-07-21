/**
 * Created by harshawijendra on 7/20/18.
 */
var express = require('express');
var router = express.Router();
var dao = require('./dao');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var flash=require("connect-flash");

router.get('/', function(req,res){
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
})
});

module.exports = router;