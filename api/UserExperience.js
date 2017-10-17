var express = require('express');
var router = express.Router();
var User = require('../models/User');
var request = require('request');


router.put('/SearchByBus/:username', function(req, res) {

    User.update({username:req.params.username},{$inc: {"experience.bus":1}})
        .exec(function(err,data){
            //console.log(err);
            res.json("done");
        });
});
router.put('/SearchByTrain/:username', function(req, res) {

    User.update({username:req.params.username},{$inc: {"experience.train":1}})
        .exec(function(err,data){
            //console.log(err);
            res.json("done");
        });
});
router.put('/SearchByMetro/:username', function(req, res) {

    User.update({username:req.params.username},{$inc: {"experience.metro":1}})
        .exec(function(err,data){
            //console.log(err);
            res.json("done");
        });
});


module.exports = router;