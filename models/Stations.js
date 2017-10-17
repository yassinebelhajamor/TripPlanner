var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StationsSchema = new Schema({
    id: String,
    name: String,
    address:String,
    loc : []
},{collection:"Stations"});
module.exports = mongoose.model('Stations', StationsSchema);