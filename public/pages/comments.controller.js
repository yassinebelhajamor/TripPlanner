function CommentsControllerFN($scope,$http,$compile,Socket,$localStorage) {




    $scope.showmean = true;
    $scope.means = [];
    $scope.show = true;
    $scope.selected="";
    $scope.user=$localStorage.currentUser.email;
    $scope.index=undefined;

    Socket.on('listcomments',function (d) {

        $http.get("http://localhost:3000/comments/"+$scope.selected).then(function (response) {




            document.getElementById("input").value = "";
            $scope.comments = response.data;

        });

    });






    $http.get("http://localhost:3000/means").then(function (reponse) {

        $scope.means = reponse.data;

    });


Socket.on("preview1",function (data) {

  if($(".words").length == 0) {
        $("#new-comment").before("<span class='words'>test@esprit.tn et entrain d'écrire quelque chose .......</span>");
    }



 if(data.length== 0)
    {
        $(".words").remove();
    }

});




    $scope.dosomething = function(){

        object = {

            mean :$scope.selected,
            value : $(".input input").val()


        }

        Socket.emit("preview",object);

    }


    $scope.showcomments = function (mean) {





        if (mean != undefined)
        {
            $http.get("http://localhost:3000/comments/"+mean).then(function (reponse) {

                $scope.selected=mean;
                $scope.comments = reponse.data;
                $scope.show=false;
                Socket.emit("client",{"user" : $scope.user , "mean" : $scope.selected , "id" : "" });


                });

        }






    }


    $scope.print1= function(event) {

        if(event.keyCode==13){

                message1={ message : $(".edit").val()}
                comment=JSON.stringify(message1);
                console.log(comment);

            $http.put("http://localhost:3000/comments/"+$scope.index,comment).then(function (reponse) {

                    console.log(reponse.data);
                    Socket.emit("update",$scope.selected);


            });

        }

    }




    $scope.update= function (event,index) {

                $scope.index=index;
                console.log($scope.index);
                event.toElement.x=undefined;
                if($(event.toElement).parent().next().find(".span").length !=0)

                    {
                        $(event.toElement).parent().next().find(".span").remove();
                        l="<input type='text' value= '' class='edit' placeholder='modification ....'  ng-keyup='print1($event)' />";
                        $(event.toElement).parent().next().append($compile(l)($scope));


                    }
        }



    $scope.comments = [];




    $scope.add=function(event,message) {
        if (event.keyCode == 13) {


            comment = {
                "user": $scope.user,
                "mean": $scope.selected,
                "message": message,
                "rate": 1,
                "likes": []
            }

            comment1 = JSON.stringify(comment);
            console.log(comment1);
            $http.post("http://localhost:3000/comments", comment1).then(function (reponse) {
                console.log(reponse.data);
                    Socket.emit("newComment",$scope.selected);
                    object = {

                    mean :$scope.selected,
                    value :""


                    }

                Socket.emit("preview",object);



            });


        }






    }


    $scope.delete=function (index) {

        $http.delete("http://localhost:3000/comments/"+index).then(function(response){


                console.log(response);
                Socket.emit("delete",$scope.selected);


        }) ;







    }


    $scope.addlike = function(comment)

        {
           var  count = -1;
           var i;

            for(i = 0; i<comment.likes.length;i++)
            {
                if (comment.likes[i] ==  $scope.user)
                {
                    count = i;
                    break;
                }
            }



            if(count != -1) {

                comment.likes.splice(count, 1);


            }

            else
            {
                comment.likes.push($scope.user);
            }



            likes1 = {likes: comment.likes};
            comment1 = JSON.stringify(likes1);
            console.log(comment1);


            $http.put("http://localhost:3000/comments/" + comment._id, comment1).then(function (reponse) {

                console.log(reponse.data);
                Socket.emit("like",$scope.selected);

            });



        }
}


CommentsControllerFN.$inject=["$scope","$http","$compile","Socket","$localStorage"];
angular.module("mean-stack").controller("CommentsController",CommentsControllerFN);

