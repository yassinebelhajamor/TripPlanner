var mongoose = require('mongoose');

var CommentforumSchema = new mongoose.Schema({
    body: String,
    author: {type: String, default: 'Anonymous'},
    upvotes: {type: Number, default: 0},
    downvotes:{type: Number, default: 0},
    created: {type: Date, default: Date.now},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

CommentforumSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};
CommentforumSchema.methods.downvote = function(cb) {
    this.downvotes += 1;
    this.save(cb);
};
module.exports = mongoose.model('Commentforum', CommentforumSchema);