var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("its working" );
   res.render('index', { title: 'Express' });
});


router.get('/metros',function (req,res,next) {

  res.json();
});
module.exports = router;


