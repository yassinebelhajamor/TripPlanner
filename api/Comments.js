var express = require('express');
var router = express.Router();
var Comments = require('../models/Comments');
var request = require('request');
var mongoose = require('mongoose');

router.get('/:mean', function(req, res) {

    Comments.find({"mean" :req.params.mean},function (err, Comments) {
        if (err)
            res.json(err);
        res.json(Comments);
    });
});

router.post('/', function (req,res) {

    Comment = new Comments(req.body);
    Comment.save(function (err,comment) {
        if(err)
            return res.json(err);
        res.json(comment);
    })
});

router.put('/:id', function(req, res) {

  Comments.findByIdAndUpdate(new mongoose.mongo.ObjectId(req.params.id),req.body,function (err,data) {

      if(err)
          res.json(err)
      res.json(data);
  });

});

router.delete('/:id', function(req, res) {
    Comments.findByIdAndRemove(req.params.id,function (err,comment) {
        res.json(comment);
    })
});

//Add Comments

module.exports = router;


