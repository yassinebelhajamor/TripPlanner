var mongoose = require('mongoose');
mongoose.connect('mongodb://hech:4TWIN2@ds133450.mlab.com:33450/tripplanner');
module.exports = mongoose;