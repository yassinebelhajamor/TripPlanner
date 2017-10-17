var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeansSchema = new Schema({
    name: String,
    type:String,
    stations : []
},{collection:"Means"});
module.exports = mongoose.model('Means', MeansSchema);