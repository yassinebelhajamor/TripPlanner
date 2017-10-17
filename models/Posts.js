var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    postcontent: String,
    author: {type: String, required: true ,default: 'Anonymous'},
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    created: {type: Date, default: Date.now},
    views: {type: Number, default:0},
    active: {type: Boolean, default: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Commentforum'}],
    category: {type: String, default:"Divers"}
});

PostSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};
PostSchema.methods.downvote = function(cb) {
    this.downvotes += 1;
    this.save(cb);
};
PostSchema.methods.addview = function(cb) {
    this.views += 1;
    this.save(cb);
};
PostSchema.methods.close = function(cb) {
    this.active = false;
    this.save(cb);
};
PostSchema.methods.open = function(cb) {
    this.active = true;
    this.save(cb);
};

PostSchema.pre('remove', function(next) {
    // Remove all the comments associated with the removed post
    this.model('Commentforum').remove( { post: this._id }, next )

    // Middleware Remove all the category references to the removed post
});

PostSchema.methods.removeComment = function (comment) {
    var index = this.comments.indexOf(comment);
    this.comments.splice(index, 1);
    this.save();
}


module.exports = mongoose.model('Post', PostSchema);