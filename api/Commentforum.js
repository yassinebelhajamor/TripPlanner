var express = require('express');
var router = express.Router();
var Comment = require('../models/Commentforum');
var Post = require('../models/Posts');
var request = require('request');

// Add a new comment
router.post('/comments/:post',function(req, res, next) {
    Post.findById(req.params.post,function (err,mypost) {
        if(!mypost)
            return res.status(404).send();
        var comment = new Comment(req.body);
        comment.post = mypost;
        if(mypost.active && comment.body != null){

            // save the new comment
            comment.save(function(err, comment){
                if(err){ return next(err); }

                mypost.comments.push(comment);
                mypost.save(function(err, post) {
                    if(err){ return next(err); }

                    res.json(comment);
                });
            });
        }
        else{
            var err = ("Failed. The Post Is Inactive.")
            res.send(err);
            return next(err);
        }
    });
});
// Update a comment
router.put('/update/:comment/:post', function (req, res) {
     console.log("Updating comment with ID: ",+req.params.comment);

     Post.findById(req.params.post).exec(function(err, doc) {
        if (err || !doc) {
            res.statusCode = 404;
            res.send({});
        } else {
            var index = doc.comments.indexOf(req.params.comment);
            doc.save();
        }
     });

    Comment.findByIdAndUpdate(req.params.comment,req.body,function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Comment updated!' });
    });
});

// Delete a comment
router.delete('/delete/:comment/:post', function(req, res) {
    console.log("Deleting comment with ID: " + req.params.comment);

    var mPost = Post.findById(req.params.post).exec(function(err, doc) {
        if (err || !doc) {
            res.statusCode = 404;
            res.send({});
        } else {
            var index = doc.comments.indexOf(req.params.comment);
            doc.comments.splice(index, 1);
            doc.save();
        }
    });

    Comment.findByIdAndRemove(req.params.comment, function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Comment removed from the post!' });
    });
});

// Upvote a Comment
router.put('/upvote/:comment', function(req, res, next) {
    Comment.findById(req.params.comment,function (err,comment) {
        if(!comment)
            return res.status(404).send();
        comment.upvote(function(err, comment){
            if (err) { return next(err); }
        });
        return res.json(comment);
    });
});

// Downvote a Comment
router.put('/downvote/:comment',function(req, res, next) {
    Comment.findById(req.params.comment,function (err,comment) {
        if(!comment)
            return res.status(404).send();
        comment.downvote(function(err, comment){
            if (err) { return next(err); }
        });
        return res.json(comment);
    });
});

// Get a single Comment
router.get('/:comment', function(req, res, next) {
    Comment.findById(req.params.comment,function (err,mypost) {
        if(!mypost)
            return res.status(404).send();
        return res.json(mypost);
    });
});


module.exports = router;