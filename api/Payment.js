var express = require('express');
var router = express.Router();
var Users = require('../models/User');
var Ticket = require('../models/Ticket');
var request = require('request');
var nodemailer = require("nodemailer");


router.get('/users', function(req, res) {
    Users.find(function (err, users) {
        if (err)
            return res.status(404).send();
        return res.status(200).send(users);
    });
});


router.get('/:email/:num/:price', function(req, res) {

    Users.find({email: req.params.email},{'compte.numero':req.params.num,'compte.amount':true})
        .exec(function (err, data) {
            if (!data)
                return res.status(404).send();
            if(data[0].compte.numero == req.params.num) {

                var prix = parseInt(req.params.price);

                if (data[0].compte.amount >= prix) {

                    var m = data[0].compte.amount - prix;
                    return res.status(200).send({id : 1 ,message: "Vous avez du solde", amount: m});
                }
                else
                    return res.status(200).send({id : 0 ,message: "You have no money"});
            }else
                return res.status(200).send({id : 0 ,message: "Check your account number"});
        });

});

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "mariem.elheni@esprit.tn",
        pass: "mariem321"
    }
});

router.post('/ticket/:email/:price/:date/:dep/:des', function (req,res) {
    Ticket= new Ticket({
        email : req.params.email,
        price : req.params.price,
        date : req.params.date,
        depart : req.params.dep,
        destination : req.params.des
    });
    Ticket.save(function (err) {
        if(err)
            return res.json(err);
        var mailOptions={
            to : req.params.email,
            subject : "Ticket",
            text : "Your mail is "+req.params.email + "\n Date of reservation : "+req.params.date+ "\n Depart : "+req.params.dep +
            "\n Destination : "+req.params.des + "\n Price of Ticket : "+req.params.price
        }
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                res.end("error");
            }else{
                console.log("Message sent: " + response.message);
                res.end("sent");
            }
        });
        return res.status(201).send({id : 1 ,message : "You have reserved your seat, check your mail to get your ticket"});
    })
});


router.put('/:email/:amount', function(req, res) {
    Users.update({email: req.params.email},{$set:{'compte.amount':req.params.amount}})
        .exec(function(err,data){
            if (!data)
                return res.status(404).send();
            return res.status(202).send({id : 1 ,message : "Successful payment"});
        });
});

module.exports = router;