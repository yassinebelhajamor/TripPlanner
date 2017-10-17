angular.module('mean-stack')

    .controller('PostsListController', ['$scope','$http','$routeParams','$location', function ($scope, $http, $routeParams,$location) {
        $http({
            method : "GET",
            url : "/api/posts/"
        }).then(function mySucces(response) {
            $scope.posts = response.data;
            console.log($scope.posts);
        }, function myError(response) {
            console.log(response.statusText);
        });

        $scope.categories = filterpostcategories();

        $scope.category = { id: 'All', name: 'Events && Accidents && Divers'};

        $scope.ifIsHidden = function (post) {

            if ($scope.category.id == 'All'){
                return false
            } else {
                return post.category != $scope.category.id;
            }
        }
    }])

    .controller('PostViewManageController', ['$scope','$http','$routeParams','$location', function ($scope, $http, $routeParams,$location) {
        $scope.tabComments = [];
        $http({
            method : "GET",
            url : "/api/posts/"+$routeParams.id
        }).then(function mySucces(response) {
            $scope.post = response.data;
            //console.log("post details: "+$scope.post);
            var tabCommentsId = $scope.post.comments;

            tabCommentsId.forEach(function (element) {
                $http.get("http://localhost:3000/api/commentforum/"+element)
                    .then(function(response) {
                        $scope.tabComments.push(response.data)
                    })
            })
        }, function myError(response) {
            console.log(response.statusText);
        });

        $scope.msharefb = function () {
            window.location.href="https://www.facebook.com/sharer/sharer.php?u="+escape(window.location.href)+"&t="+document.title;
        };

        $scope.twitershare = function () {
            window.location.href="https://twitter.com/intent/tweet?url="+escape(window.location.href);
        };



        $scope.addComment = function () {
            var data = {
                body: $scope.body,
                author : $scope.author,
                upvotes: $scope.upvotes,
                downvotes: $scope.downvotes,
                created: $scope.created
            };
            $http.post('/api/commentforum/comments/'+$routeParams.id, data).success(function (data, status) {
                console.log(status);
                console.log(data);
                $scope.tabComments.push(data);
                $scope.body = "";
            });
            $location.path('/post/show/'+$routeParams.id);
            //$route.reload();

        };


        $scope.updatemycomment = function (comment,_$index) {

        $scope.bod = comment.body;

        console.log(comment.body);
            var data = {
                body: comment.body,
                author : comment.author,
                upvotes: comment.upvotes,
                downvotes: comment.downvotes,
                created: comment.created
            };

            $http.put("/api/commentforum/update/"+comment._id+"/"+$routeParams.id, data).success(function (data, status) {
                console.log(status);
            });
            $scope.tabbool = new Array($scope.tabComments.length);
            for (var i =0;  i<$scope.tabComments.length;i++){
                $scope.tabbool[i] =false;
            }
        };

        $scope.updateComment = function (comment,_$index) {
            $scope.tabbool = new Array($scope.tabComments.length);
            for (var i =0;  i<$scope.tabComments.length;i++){
                $scope.tabbool[i] =false;
            }


            $scope.tabbool[_$index] =true;

        };

        $scope.upvoteComment = function(post, comment) {
            $http.put('/api/commentforum/upvote/'+comment._id).success(function(data){
                comment.upvotes += 1;
            });
        };

        $scope.downvoteComment = function(post, comment) {
            $http.put('/api/commentforum/downvote/'+comment._id).success(function(data){
                comment.downvotes += 1;
            });
        };

        $scope.deleteComment = function (comment) {

            var index = $scope.tabComments.indexOf(comment);

            $http({
                method : "DELETE",
                url : "/api/commentforum/delete/"+comment._id+"/"+$routeParams.id
            }).then(function mySucces() {

                $scope.tabComments.splice(index, 1);

                $location.path('/post/show/'+$routeParams.id);

            }, function myError(response) {
                console.log(response.statusText);
            });
        };

        $scope.upvotePost = function(post) {
            $http.put('/api/posts/upvote/'+post._id).success(function(data){
                post.upvotes += 1;
            });
        };

        $scope.downvotePost = function(post) {
            $http.put('/api/posts/downvote/'+post._id).success(function(data){
                post.downvotes += 1;
            });
        };

        $scope.deletePost = function () {
            $http({
                method : "DELETE",
                url : "/api/posts/delete/"+$routeParams.id
            }).then(function mySucces() {
                $location.path('/posts/list');
            }, function myError(response) {
                console.log(response.statusText);
            });

        };
    }])


.controller('PostAddController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
    $scope.addPost = function () {
        var data = {
            title: $scope.title,
            postcontent: $scope.content,
            category: $scope.category,
            author:$scope.author
        };
        $http.post('/api/posts/', data).success(function (data, status) {
            console.log(status);
        });
        $location.path('/posts/list');
    };
    $scope.categories = postcategories();
}])

.controller('PostEditController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
    $http({
        method : "GET",
        url : "/api/posts/"+$routeParams.id
    }).then(function mySucces(response) {
        //$scope.post = response.data;
        $scope.title = response.data.title;
        $scope.content = response.data.postcontent;
        $scope.category = {name : response.data.category};

        console.log("aaaaaaaaaaaaaaaa"+$scope.category);

        console.log("post details: "+$scope.post);
    }, function myError(response) {
        console.log(response.statusText);
    });

    $scope.editPost = function () {
        var data = {
            title: $scope.title,
            postcontent: $scope.content,
            category: $scope.category.name
        };
        $http.put('/api/posts/edit/'+$routeParams.id, data).success(function (data, status) {
            console.log(status);
        });
        $location.path('/post/show/'+$routeParams.id);
    };
    $scope.categories = postcategories();
}]);


function postcategories() {
    return [
            { name: 'Events'},
            { name: 'Accidents'},
            { name: 'Divers'}
        ];
    }

function filterpostcategories() {
    return [
        { id: 'All', name: 'Events && Accidents && Divers'},
        { id: 'Events', name: 'Events'},
        { id: 'Accidents', name: 'Accidents'},
        { id: 'Divers', name: 'Divers'}
    ];
}


