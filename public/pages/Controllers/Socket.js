function SocketFn () {

    var socket  = io();
    return socket;
};


angular.module("mean-stack").factory("Socket",SocketFn);
