var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./config/db');
var request = require('request');
var nodemailer = require("nodemailer");
var index = require('./routes/index');
var CrudComment = require('./models/Comments');
var stations = require('./api/Stations');
var means = require('./api/Means');
var payment = require('./api/Payment');
var experience = require('./api/UserExperience');
var posts = require('./api/Post');
var commentforum = require('./api/Commentforum');
var Comments = require('./api/Comments');
var Users = require('./api/User');
var Authentifiation = require('./api/Authentification')

var app = express();
var http = require("http");
var server=http.createServer(app);
var io = require('socket.io')(server);
server.listen(3000);


var Clients = [];


io.on('connection', function(socket) {


    console.log('Client connected...');
    socket.on("client",function(client){
        client.id=socket.id;
        Clients.push(client);
        console.log(client);
    });


    socket.on("newComment" ,function(mean){

        CrudComment.find({"mean" : mean}).exec(function(err,data){

            for (i=0; i<Clients.length ;i++)
            {
                    if(Clients[i].mean == mean ) {

                        console.log(socket.id);
                        io.sockets.connected[Clients[i].id].emit("listcomments", data);
                    }

            }
        });



    });


    socket.on("delete",function (mean) {

        for (i=0; i<Clients.length ;i++)
        {
            if(Clients[i].mean == mean ) {

                console.log(Clients[i].id);
                io.sockets.connected[Clients[i].id].emit("listcomments", mean);
            }

        }


    });


    socket.on("update",function (mean) {

        for (i=0; i<Clients.length ;i++)
        {
            if(Clients[i].mean == mean ) {

                console.log(Clients[i].id);
                io.sockets.connected[Clients[i].id].emit("listcomments", mean);
            }

        }


    });



    socket.on("like",function (mean) {

        for (i=0; i<Clients.length ;i++)
        {
            if(Clients[i].mean == mean ) {

                console.log(Clients[i].id);
                io.sockets.connected[Clients[i].id].emit("listcomments", mean);
            }

        }


    });





socket.on("preview" , function (object) {

    for (i=0; i<Clients.length ;i++)
    {
        if(Clients[i].mean == object.mean && Clients[i].id != socket.id ) {

            console.log(Clients[i].id);
            io.sockets.connected[Clients[i].id].emit("preview1",object.value);
        }

    }


});


    socket.on("disconnect",function (socket) {

        var  x =-1;

        for(i=0;i<Clients.length;i++)
        {
            if(Clients[i].id == socket.id)
            {
                x = i;
                break;
            }
        }

        Clients.splice(x,1);
    });








});





// view engine setup
app.set('public', path.join(__dirname, 'public'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/stations', stations);
app.use('/means', means);
app.use('/payment', payment);
app.use('/userExp', experience);
app.use('/api/posts', posts);
app.use('/Comments', Comments);
app.use('/User',Users);
app.use('/api/commentforum', commentforum);
app.use('/authentification',Authentifiation);






/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //next(err);
    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
