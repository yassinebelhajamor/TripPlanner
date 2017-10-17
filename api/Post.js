var express = require('express');
var router = express.Router();
var Post = require('../models/Posts');
var request = require('request');

// Return All Posts
router.get('/', function(req, res, next) {

    Post.find({},function(err, posts){
        if(err)return next(err)
        res.json(posts);
    });
});

// Create a post
router.post('/', function(req, res, next){
    var post = new Post(req.body);
    post.save(function(err, post){
        if(err) return next(err);
        return res.json(post);
    });

});

// Get a single Post
router.get('/:post', function(req, res, next) {
    Post.findById(req.params.post,function (err,mypost) {
        if(!mypost)
            return res.status(404).send();

        mypost.addview(function(err, post){
            if (err) { return next(err); }
        });
        console.log(mypost)
        return res.json(mypost);
     });
});
// Upvote a post
router.put('/upvote/:post', function(req, res, next) {
    Post.findById(req.params.post,function (err,mypost) {
        if(!mypost)
            return res.status(404).send();
        mypost.upvote(function(err, post){
            if (err) { return next(err); }
        });
        return res.json(mypost);
    });
});

// Downvote a post
router.put('/downvote/:post', function(req, res, next) {
    Post.findById(req.params.post,function (err,mypost) {
        if(!mypost)
            return res.status(404).send();
        mypost.downvote(function(err, post){
            if (err) { return next(err); }
        });
        return res.json(mypost);
    });

});

// Close a post
router.put('/close/:post', function(req, res, next) {
    Post.findById(req.params.post,function (err,mypost) {
        if(!mypost)
            return res.status(404).send();
        mypost.close(function(err, post){
            if (err) { return next(err); }
        });
        return res.json(mypost);
    });

});

// Open a post
router.put('/open/:post', function(req, res, next) {

    Post.findById(req.params.post,function (err,mypost) {
        if(!mypost)
            return res.status(404).send();
        mypost.open(function(err, post){
            if (err) { return next(err); }
        });
        return res.json(mypost);
    });
});

// Delete a post
router.delete('/delete/:post', function(req, res) {
    console.log("Deleting Post with ID: " + req.params.post);
    Post.findById(req.params.post)
        .exec(function(err, doc) {
        if (err || !doc) {
            res.statusCode = 404;
            res.send({});
        } else {
            doc.remove(function(err) {
                if (err) {
                    res.statusCode = 403;
                    res.send(err);
                } else {
                    res.send({});
                }
            });
        }
    });
});

// Edit a post
router.put('/edit/:post', function(req, res, next){

    var conditions = { _id: req.params.post };
    var options = {new: true};
    var update = {
        title: req.body.title,
        postcontent: req.body.postcontent,
        category:  req.body.category
    };
    Post.findOneAndUpdate(conditions, update, options, function(err, doc){
        if (err){return err;}
    });
    res.send("succesfully saved");
});

module.exports = router;