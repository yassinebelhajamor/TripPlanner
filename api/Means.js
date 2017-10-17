var express = require('express');
var router = express.Router();
var Means = require('../models/Means');
var request = require('request');

router.get('/', function(req, res) {

    Means.find(function (err, means) {
        if (err)
            res.json(err);
        res.json(means);
    });
});

module.exports = router;