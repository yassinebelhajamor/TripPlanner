
var express = require('express');
var router = express.Router();
var Stations = require('../models/Stations');
var Means = require('../models/Means');
var request = require('request');
var async = require('async');
var array =[];
/***************** ****************** */


var result = new Array();



router.get('/Trains', function(req, res) {
    return res.status(200).send([
        {Ref:13,Station :"ARRET DU STADE"},
        {Ref:16,Station :"BIR EL BEY"},
        {Ref:17,Station :"BORJ CEDRIA"},
        {Ref:11,Station :"BOUKORNINE"},
        {Ref:18,Station :"ERRIADH"},
        {Ref:9,Station :"EZZAHRA"},
        {Ref:15,Station :"HAMMAM CHATT"},
        {Ref:12,Station :"HAMMAM LIF"},
        {Ref:2,Station :"JBEL JELLOUD"},
        {Ref:10,Station : "LYCEE EZZAHRA"},
        {Ref:6,Station :"LYCEE RADES"},
        {Ref:4,Station :"MEGRINE"},
        {Ref:3,Station :"MEGRINE RIADH"},
        {Ref:7,Station :"RADES"},
        {Ref:8,Station :"RADES MELIANE"},
        {Ref:5,Station :"SIDI REZIG"},
        {Ref:14,Station :"TAHAR SFAR"},
        {Ref:1,Station :"TUNIS"}
    ]);
});


router.get('/', function(req, res) {
    Stations.find(function (err, stations) {
        if (err)
            res.json(err);
        return res.status(200).send(stations);
    });
});

router.get('/test/:station1/:station2', function(req, res) {
    Means.find({$and : [{stations : {$in : [req.params.station1]}},{stations : {$in : [req.params.station2]}}]})
        .exec(function(err,data){
            data.forEach(function(element) {
                //console.log(element.stations);
                res.json(element.stations);
            });

        })
});
router.get('/FindStation/:lat/:long', function(req, res) {
    Stations.find(function (err, stations) {
        if (err)
            return res.status(404).send();
        var station;
        stations.forEach(function(element) {
            //console.log(element.stations);
            if(element.loc[0]==req.params.lat&&element.loc[1]==req.params.long){
                station = element;
            }
        });
        if(station)
            return res.status(302).send(station);
        else
            return res.status(404).send();
    });
});
/***************** ****************** */

// les stations les plus proches d'un pt défini dans rayon donné en param
router.get('/near/:lat/:long/:distance', function(req, res) {
    Stations.find( {
        loc: {
            $near: {
                $geometry: {
                    type: "Point" ,
                    coordinates: [ req.params.lat,req.params.long]
                },
                $maxDistance: req.params.distance,
                $minDistance: 0
            }
        }
    } ).exec(function(err,data){
        res.json(data);
    });

});

// determiner tous les moyens de transport qui passent par la station 1 et station 2

router.get('/combinaison/:station1/:station2', function(req, res) {

    var array1=[];
    var means1;
    var means2;
    var depart;
    var arrivee;
    var transit;
    Stations.find({"id" :req.params.station1}).
    exec(function(err,data){

        depart = data;

        Stations.find({"id" :req.params.station2}).
        exec(function(err,data){

            arrivee = data;
            Means.find({stations: req.params.station1}).exec(function (err, data) {

                means1 = data;
                Means.find({stations: req.params.station2}).exec(function (err, data) {


                    means2 = data;

                    async.each(means1, function (element, callback) {

                        async.each(element.stations, function (element1, callback) {

                            async.each(means2, function (element2, callback) {


                                async.each(element2.stations, function (element3, callback) {

                                    if (element1 == element3) {

                                        console.log("++Prends transport " + element.name + " de l'arret de départ : " + req.params.station1 + " descend Arret :" + element3 + " et Prend " + element2.name + " pour arriver à " + req.params.station2);
                                        array1.push({
                                            depart: depart[0].name,
                                            arrivee: arrivee[0].name,
                                            transit: element1,
                                            transport_depart: element.name,
                                            arret_depart: req.params.station1,
                                            arret_transit: element1,
                                            transport_transit: element2.name,
                                            arret_arrivee: req.params.station2,
                                            moyens: [{type: element.type, ref: element.name}, {
                                                type: element2.type,
                                                ref: element2.name
                                            }]

                                        });
                                    }
                                }, function (err) {

                                });

                            }, function (err) {

                            });


                        }, function (err) {


                        });

                        callback();
                    }, function (err) {

                        res.json(array1);
                    });

                });

            });

        });
    });
});

router.get('/:reference', function(req, res) {
    Stations.find({"id" :req.params.reference}).
    exec(function(err,station){

        if(err){
            res.json(err);
        }

        res.json(station);
    });
});

module.exports = router;

