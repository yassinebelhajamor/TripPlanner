function UserControllerFN($scope,$http,$location,$localStorage,$compile) {


    function Login(email, password, callback) {
        $http.post('http://localhost:3000/authentification/login/' + email + '/' + password)
            .success(function (response) {
                // login successful if there's a token in the response
                if (response.token) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    $localStorage.currentUser = {email: email, token: response.token};

                    // add jwt token to auth header for all requests made by the $http service
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;

                    // execute callback with true to indicate successful login
                    callback(true);
                } else {
                    // execute callback with false to indicate failed login
                    callback(false);
                }
            });


    }





    $scope.x = function() {

       Login($scope.userlogin.email, $scope.userlogin.password, function (result) {
     if (result === true) {
     console.log("success")
         $("#loginlogout").html("<p><a>logout</a></p>");
     $location.path('/');
     } else {
     $scope.error = 'Email or password is incorrect';
     $scope.loading = false;
     console.log("failed")
     }
     });


    }


    $scope.register = function () {



        user1 =JSON.stringify($scope.user);
        $http.post('http://localhost:3000/authentification/register/',user1)
            .success(function (response) {
                if(response.data) {
                    $scope.message = 1
                    console.log(response.data);
                }
                console.log(":(");

            });

    }















}


UserControllerFN.$inject=["$scope","$http","$location","$localStorage","$compile"];
angular.module('mean-stack').controller("UserController",UserControllerFN);


