function configFN($routeProvider){
    
    $routeProvider
        .when("/",{
            controller:"HomeController",
            templateUrl:"./pages/home.view.html"
        })
        .when("/MyProfile",{
            templateUrl:"./pages/my-profile.view.html"
        })
        .when("/register",{
            templateUrl:"./pages/register.view.html",
            controller: "UserController"
        })
        .when("/login",{
            controller: "UserController",
            templateUrl:"./pages/login.view.html"
        })
        .when("/Payment",{
            controller:"PaymentController",
            templateUrl:"./pages/payment.view.html"
        })
        .when("/comments",{
            controller:"CommentsController",
            templateUrl:"./pages/comments.view.html"
        })
        .when("/404",{
            templateUrl:"./pages/404.view.html"
        })
        .when("/posts/list/",{
            controller:"PostsListController",
            templateUrl:"./pages/PostViews/PostsList.view.html"
        })
        .when("/post/show/:id",{
            controller:"PostViewManageController",
            templateUrl:"./pages/PostViews/PostView.view.html"
        })
        .when("/post/add/",{
            controller:"PostAddController",
            templateUrl:"./pages/PostViews/PostAdd.view.html"
        })
        .when("/post/edit/:id",{
        controller:"PostEditController",
        templateUrl:"./pages/PostViews/PostEdit.view.html"
        })
        .otherwise({
            redirectTo:"/404"
        });
}


function run($rootScope, $http, $location, $localStorage) {
    // keep user logged in after page refresh
    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/register','/login'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        console.log(publicPages.indexOf($location.path()) === -1);
        if (restrictedPage && !$localStorage.currentUser) {
            $location.path('/');
        }
    });
}

angular
    .module("mean-stack",["ngRoute","ngResource","angucomplete-alt","gm","ngStorage"])
    .config(configFN)
    .run(run);


