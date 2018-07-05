var express = require('express');
var router = express.Router();
var dao = require('./dao');
var mysql = require('mysql');
var path = require('path');
//var config = require('/twilioConfig.json');

router.get('/newEvent', function(req, res){

    // now past the request through
    console.log(res);

});

module.exports = router;