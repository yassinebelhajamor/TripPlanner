var express = require('express');
var router = express.Router();
var Users = require('../models/User');
var request = require('request');
var mongoose = require('mongoose');



router.get('/', function(req, res) {

    Users.find(function (err, users) {
        if (err)
            res.json(err);
        res.json(users);
    });
});



module.exports = router;