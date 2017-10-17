var express = require('express');
var router = express.Router();
var Users = require('../models/User');
var jwt = require("jsonwebtoken");
var bcrypt=require('bcrypt-nodejs');
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res) {
    Users.find(function (err,users) {  //userlist :model  //userlist:resultat
        if(err)
            return res.json(err);
        res.json(users);
    })
});

router.post('/register/', function (req,res) {

    password=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    req.body.password = password;
    user1 = {

        FirstName : req.body.FirstName,
        LastName : req.body.LastName,
        email: req.body.email,
        password: req.body.password,
        compte : {
            numero:"123456",
            amount : 20
        },
        experience : {
            bus : 0,
            "train" : 0,
            "metro" : 0,
            "temps" : 0,
            "prix" : 0
        }


    }

    console.log(req.body);
    var User = new Users(user1);
    User.save(function (err,users) {
        if(err)
            return res.json(err);
        res.json(users);
    });
});




router.post('/login/:email/:password', function (req,res) {
    Users.findOne({email:req.params.email},function (err,users) {
        if(err){
            res.send("erreur");
        }
        //user not found
        if(!users)
            return res.status(404).send("not found");
        //user found
        //cas 1:autorisé

        if(bcrypt.compareSync(req.params.password, users.password)) {
            //generate token jwt

            var token=jwt.sign(req.params.email,"secret");

            return res.json({
                "message":"authorized",
                "token":token
            })
            //return res.send("authorized");

        }
        else {

            return res.status(401).send("non authorized");
        }


    })


});







module.exports = router;