
function PaymentControllerFN($scope,$http,$timeout,$route){

    var stationsRef = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12","T13","T14","T15","T16","T17","T18"];


    $scope.depart = ''
    $scope.tarif = ''
    $scope.destination = ''
    $scope.dateTicket = ''
    $scope.prix = ''
    $scope.tabRef = []

    $scope.tarifs = [
        {id:1,type :"Tarif Adulte"},
        {id:0,type :"Tarif Enfant"}
    ]



    $http.get("http://localhost:3000/stations/Trains")
        .then(function(response) {
            $scope.stationTrain1 = response.data
        })

    $http.get("http://localhost:3000/stations/Trains")
        .then(function(response) {
            $scope.stationTrain2 = response.data
        })


    $scope.changePrice = function (dep,des,t) {
        var elementPos1 = 0
        var elementPos2 = 0

        if(dep) {

            $http.get("http://localhost:3000/stations/Trains")
                .then(function(response) {
                    $scope.stationTrain2 = response.data
                    for (var i = 0; i < $scope.stationTrain2.length; i++) {
                        if ($scope.stationTrain2[i].Ref == dep){
                            elementPos1 = i
                        }
                    }
                    $scope.stationTrain2.splice(elementPos1,1);
                })
        }

        if(des) {

            $http.get("http://localhost:3000/stations/Trains")
                .then(function(response) {
                    $scope.stationTrain1 = response.data
                    for (var i = 0; i < $scope.stationTrain1.length; i++) {
                        if ($scope.stationTrain1[i].Ref == des){
                            elementPos2 = i
                        }
                    }

                    $scope.stationTrain1.splice(elementPos2,1);
                })
        }

        var diff = Math.abs(parseInt(dep)-parseInt(des));
        if(diff <= 7){
            if( parseInt(t) == 0)
                $scope.price = 400;
            else if( parseInt(t) == 1)
                $scope.price = 500;
        }
        else if ( diff > 7 && diff <= 13) {
            if (parseInt(t) == 0)
                $scope.price = 450;
            else if (parseInt(t) == 1)
                $scope.price = 650;
        }else if ( diff > 13 && diff <= 18) {
            if (parseInt(t) == 0)
                $scope.price = 500;
            else if (parseInt(t) == 1)
                $scope.price = 850;
        }
    }

    $scope.pay = function (dt,pc,nm,des,dep) {
        //console.log("donnees "+dt+" "+pc +" "+nm+" "+t+" "+des+" "+dep)
        $http.get("http://localhost:3000/payment/elhenimariem@gmail.com/"+nm+"/"+pc)
            .then(function(response) {
                if(response.data.id == 1)
                {
                    $http.put("http://localhost:3000/payment/elhenimariem@gmail.com/"+response.data.amount)
                        .then(function(response) {
                            if(response.data.id == 1) {
                                var date = dt.replace(/\//g, "-");
                                $http.post("http://localhost:3000/payment/ticket/elhenimariem@gmail.com/" + pc + "/" + date + "/" + dep + "/" + des)
                                    .then(function (response) {
                                        $scope.idMsg = response.data.id;
                                        $scope.msg = response.data.message;
                                    });
                            }
                        });
                }
                else{
                    $scope.idMsg = response.data.id;
                    $scope.msg = response.data.message;
                }
            });

    }


    $('#dp3').datepicker({
        inline: true,
        //nextText: '&rarr;',
        //prevText: '&larr;',
        showOtherMonths: true,
        //dateFormat: 'dd MM yy',
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        //showOn: "button",
        //buttonImage: "img/calendar-blue.png",
        //buttonImageOnly: true,);
    })

}
PaymentControllerFN.$inject=["$scope","$http","$timeout","$route"];
angular
    .module("mean-stack")
    .controller("PaymentController",PaymentControllerFN);



