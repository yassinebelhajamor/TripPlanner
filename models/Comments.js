var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    user : String,
    mean: String,
    message: String,
    rate: String,
    likes :[]
},{collection:"Comments"});
module.exports = mongoose.model('Comments', CommentsSchema);
