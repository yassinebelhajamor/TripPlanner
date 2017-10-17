var mongoose = require('mongoose');
var validator = require('validator');
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
    name: String,
    depart : {type:String,default:null},
    destination : {type:String,default:null},
    price: Number
},{collection:"Ticket"});
module.exports = mongoose.model('Ticket', TicketSchema);