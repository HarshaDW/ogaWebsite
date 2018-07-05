var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conco = require("express");


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Tammy20130707',
    database : 'ogaDatabase'
});


function queryForPermissions (connection) {
    return connection.query('SELECT * FROM PERMISSION', function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
    })
}

exports.viewEvents  = {
    select: function (callback) {
        var sql = "SELECT * FROM EVENT ";
        connection.query(sql, function (err, result , fields) {
            if (err) {
                callback("error", err)
            } else {
                callback("success", result)
            }
        });
    }
}

exports.insertEvent  = {
    insert: function (callback) {
        var sql = "INSERT INTO ogaDatabase.event(`Name`,`Image`,`Description`,`Date`) VALUES (?,?,?,?);";
        connection.query(sql, function (err, result , fields) {
            if (err) {
                callback("error", err)
            } else {
                callback("success", result)
            }
        });
    }
}

exports.getPhoneNumbers  = {
    getPhone: function (callback) {
        var sql = "Select * from User";
        connection.query(sql, function (err, result , fields) {
            if (err) {
                callback("error", err)
            } else {
                callback("success", result)
            }
        });
    }
}

exports.queryForPermissions = queryForPermissions;
exports.connection = connection;