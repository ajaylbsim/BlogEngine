var myApp = angular.module("myApp", ["ngRoute", "numFilters"]);
var Textop = "Write your blog here";
var User = null;
var blogTextInput = "";
myApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/viewBlog", {
        templateUrl: "blogview.html", controller: "viewBlogCtrl"})
        .when("/mainpageblogview", {
            templateUrl: "101499.html", controller: "viewBlogCtrl"})
        .when("/readBlog", {
            templateUrl: "singlePageBlogView.html", controller: "blogCtrl"})
        .when("/createBlog", {
            templateUrl: "createblog.html", controller: "createBlogCtrl"})
        .when("/readBlog/:title", {
            templateUrl: "singlePageBlogView.html", controller: "readBlogCtrl"})

        .when("/visitorsBlog", {
            templateUrl: "unsuccessful.html", controller: "visitorBlogCtrl"})
        .otherwise({redirectTo: "/"})
}])
myApp.controller("mainCtrl", ["$scope", "$http", "$location", "$sce", function ($scope, $http, $location, $sce) {
console.log("starting mainCtrl ...................");
    jQuery('#visitor').hide();
    jQuery('#visitorSinglepage').hide();
    var i = 0;
    if(User)
    {
        console.log("-----------------------------kk-------------");
        $location.path("viewBlog");

    }
    $scope.title;
    $scope.blogContainer = [];
    var blogData = {};
    $scope.blogdata="";
    $http.post("getUser", {}).success(function (data) {
        if (!data.error) {
            User = data;
            console.log("found successfully!!", User, data);
        } else {
            $scope.texttop = "not found successfully!! "

        }
        console.log("----------result after found-------", JSON.stringify(data));
    })

    $scope.post = function (title) {
        var blog = {};
        blog.Comment= $scope.commentText;
        blog.user=$scope.user_name||"Anonymous";
        blog.email=$scope.user_email;
        blog.title= title;
        if((blog.Comment!="")&(blog.user!="")&&(blog.name!=""))
        {
            $http.post("saveNewComment", {blog: blog}).success(function (res) {
                if (!res.error) {
                    console.log("saved successfully!!",res.length);
                    $scope.commentText="";
                    $scope.user_name="";
                    $scope.user_email="";
                    if(res)
                    {
                        $scope.Obj.BlogComments.push( {name:blog.user,email:blog.email,message:blog.Comment})
                        console.log("pushed new ",$scope.Obj.BlogComments.length)
                    }

                } else {
                    $scope.commentText = "try later";
                }
            })
        }
    }

    $scope.viewblog = function () {
 jQuery('#contact').hide();
 jQuery('#about').hide();
 jQuery('#intro').hide();
       $location.path("mainpageblogview");
        $http.post("getBlogContent", {data: null}).success(function (data) {

            console.log("hello==inside  ajax post ==for blog list=", data[0]);

            data.forEach(function (obj) {
                $scope.blogContainer.push(obj.BlogContent);

                var title = obj.BlogContent;
                console.log("-------------------blog title ---------", obj.BlogTitle);

                /* Object.defineProperty(blogData, title, {
                 get: function () {
                 return obj.BlogContent;
                 }
                 });*/
                //              console.log("----------------------------blog data---------", blogData[title]);


            });

        });


    }



    $scope.arrayOfblogObj=[];
    $scope.Obj="";
    $scope.viewVisitorsBlog= function (obj) {
        jQuery('#visitor').show();
        console.log("ready to shw blog to vistor");
        //$scope.arrayOfblogObj=[]
        $http.get("getVisitorPublishBlo").success(function (data) {
            data.forEach(function(ele)
            {
                $scope.arrayOfblogObj.push(ele)

            });
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>",$scope.arrayOfblogObj.length);
        })
    }

    $scope.readBlog= function (titleText) {
        jQuery('#visitor').hide();
        jQuery('#visitorSinglepage').show()
        console.log("ready to shw blog to vistor a single blog ");
        $scope.arrayOfblogObj=[]
       $http.post("getBlogByTitleForVisitor",{title:titleText }).success(function (data)
        {
            //console.log(">>>>>>>>>>>>>>>>>>>>",data);

            data.forEach(function (object) {
                console.log(object);
               object.BlogContent= markdown.toHTML(object.BlogContent);
                $scope.Obj=object;
                console.log(">>>>>>>>>>>read blog called>>>>>>>>>",obj.BlogTitle);

                console.log($scope.Obj.BlogTitle);


            });
        });


    }
    $scope.convert=function (text) {
        console.log(">>>>>>>>>>>>>>>>>convert called for >>>>>>>>>>>>>>>>>>>>>>>",text);

        return  $sce.trustAsHtml(text);

    }
}])

myApp.controller("readBlogCtrl", ["$scope", "$http", "$location", "$sce","$routeParams",function ($scope, $http, $location, $sce,$routeParams) {
    console.log("starting readBlogCtrl ...................");

    $scope.commentText = "";
    $scope.user_name = "";
    $scope.user_email = "";
    $scope.Obj="";
    $http.post("getBlogByTitleForVisitor",{title:$routeParams.title }).success(function (data)
    {
        console.log(">>>>>>>>>>>>>>>>>>>>",data);

        data.forEach(function (object) {
            console.log(object);
            object.BlogContent= markdown.toHTML(object.BlogContent);
            $scope.Obj=object;
            console.log($scope.Obj.BlogTitle);


        });
    });

    $scope.convert =function () {
        return $sce.trustAsHtml($scope.Obj.BlogContent);
    }
    $scope.fbShare = function () {
        console.log("share me");
        if(!User.accessToken)
        {
            console.log(" access token  not available >>>>>>>>>>>>>>>>>>  ");


        }else
        {
            console.log(" access token  is available so going to share the post >>>>>>>>>>>>>>>>>>  ");
            $http.post("shareBlog", {username:User.name,title: $routeParams.title,accessToken:User.accessToken}).success(function (data) {
                if (!data.error) {
                    $scope.Obj.push(data[0]);
                    $scope.Obj.BlogContent = markdown.toHTML($scope.Obj.BlogContent);

                } else {
                    console.log("Blog not found")
                }
            })
        }
    }

    $scope.post = function (title) {
        var blog = {};
        blog.Comment= $scope.commentText;
        blog.user=$scope.user_name||"Anonymous";
        blog.email=$scope.user_email;
        blog.title= title;
        if((blog.Comment!="")&(blog.user!="")&&(blog.name!=""))
        {
            $http.post("saveNewComment", {blog: blog}).success(function (res) {
                if (!res.error) {
                    console.log("saved successfully!!",res.length);
                    $scope.commentText="";
                    $scope.user_name="";
                    $scope.user_email="";
                    if(res)
                    {
                        $scope.Obj.BlogComments.push( {name:blog.user,email:blog.email,message:blog.Comment})
                        console.log("pushed new ",$scope.Obj.BlogComments.length)
                    }

                } else {
                    $scope.commentText = "try later";
                }
            })
        }
    }


}]);


myApp.controller("blogCtrl", ["$scope", "$http", "$location","$sce", function ($scope, $http, $location,$sce) {

    $scope.blogdata = "";

    console.log("ready for ajax call  -----tndbcbds------------------------", $scope.title)

    $http.post("getBlog", {title: $scope.title}).success(function (data) {
        if (!data.error) {

            $scope.blogdata = data[0].BlogContent;

            console.log("found successfully!!", $scope.blogdata);

        } else {
            $scope.texttop = "not found successfully!! "

        }
        console.log("----------result after found-------", JSON.stringify(data));


    })

    $scope.convert = function () {

        /*
         if(i<$scope.blogContainer.length)
         {
         str=$scope.blogContainer[i];
         i=i+1;
         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",i,str);
         }
         str=$scope.blogContainer[0];
         */
//   str=blogData.BlogContent;
        console.log(">>>>>>>>>>>>>>>>>>convert>>>>>>>>>>>>>>>>> ", $scope.blogdata);


        console.log("inside convert  :::::::::::::: ", $sce.trustAsHtml(  $scope.blogdata));
        return $sce.trustAsHtml(  $scope.blogdata);

    }

}])
myApp.controller("blogCtrl", ["$scope", "$http", "$location","$sce", function ($scope, $http, $location,$sce) {

    $scope.blogdata = "";

   console.log(">>>>>>>>>>>>>>>>>>>>>>visitor blog called >>>>>>>>>>>>>>>>>>>>s");
}])

myApp.controller("createBlogCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.texttop = "Write your blog here"
    console.log("   create controlller  called");
    var Title = null;

    $scope.publish = function () {
        if (Title) {

            console.log(" ready to publish the title !!!   ", Title)


        }


    }


    $scope.save = function () {
        console.log("check-----------------save function---------------------------------  !!!!!!!!!!!!!!!!!!!!!", JSON.stringify(User));
        Title = "hello"
        if (Title == "") {

            $scope.texttop = "please add the title!!"

        } else {
            console.log("checkig blog title===============", Title);
            var blog = {

                //title of the blog
                BlogTitle: Title,
                //Name of the blog
                BlogContent: blogTextInput,
                //author
                BlogAuthor: {
                    "name": User.AuthorName
                },
                //boolean value blog published
                BlogPublish: "to_do",
                timestampCreated: +new Date(),
                timestampUpdated: +new Date()
            }
            console.log(" inside   svae my blog -----------", blogTextInput)
            Title = null;

            $http.post("saveMyBlog", {blog: blog}).success(function (data) {
                if (!data.error) {

                    $scope.texttop = "saved successfully!!";
                } else {
                    $scope.texttop = "not saved successfully!! "

                }
                console.log("----------result after save-------", JSON.stringify(data));
                //console.log(data.length);

            })

        }

    }


    /*
     $scope.publish = function () {
     console.log("check--------------------------------------------------  !!!!!!!!!!!!!!!!!!!!!");

     if (Title == "") {
     $scope.texttop = "please add the title!!"
     return;
     }
     var data = {
     "from": User.email,
     "title": Title
     }

     console.log("ready to publish  from  !!!!!!!!!!!!!!!!!!", data.from);
     $http.post("publish", {data: data}, function (data) {
     console.log(data)
     })
     }
     $scope.saveMyBlog = function () {
     console.log("check--------------------------------------------------  !!!!!!!!!!!!!!!!!!!!!");

     if (Title == "") {

     $scope.texttop = "please add the title!!"

     } else {
     console.log("checkig blog title===============", Title);
     var blog = {

     //title of the blog
     BlogTitle: Title,
     //Name of the blog
     BlogContent: blogTextInput,
     //author
     BlogAuthor: {
     "name": User.AuthorName
     },
     //boolean value blog published
     BlogPublish: "to_do",
     timestampCreated: +new Date(),
     timestampUpdated: +new Date()
     }
     console.log(" inside   svae my blog -----------", blogTextInput)


     $http.post("saveMyBlog", {blog: blog}).success(function (data) {
     if (!data.error) {

     $scope.texttop = "saved successfully!!";
     } else {
     $scope.texttop = "not saved successfully!! "

     }
     console.log("----------result after save-------", JSON.stringify(data));
     //console.log(data.length);

     })

     }

     }
     $scope.setTitle = function (obj) {
     console.log("check--------------------------------------------------  !!!!!!!!!!!!!!!!!!!!!");
     $scope.texttop = "Write your blog here"
     console.log("settig title  ", obj.target.value);
     Title = obj.target.value;
     if (obj.target.value == "set the title") {
     Title = "";
     }
     }

     */

}])
myApp.controller("viewBlogCtrl", ["$scope", "$http", "$sce", "$location" , function ($scope, $http, $sce, $location) {
    console.log("   view blog controlller  called");
    var title_as_key = "";
    $scope.userBlog = "";
    var blogData = {};
    $scope.blogContainer = [];


    /*********************************************************
     AJAX POST REQUEST
     * ******************************************************/

    $http.post("getBlogContent", {data: User}).success(function (data) {

        console.log("hello==inside  ajax post ==for blog list=", data[0]);

        data.forEach(function (obj) {
            $scope.blogContainer.push(obj.BlogTitle);

            var title = obj.BlogTitle;
            console.log("-------------------blog title ---------", obj.BlogTitle);

            Object.defineProperty(blogData, title, {
                get: function () {
                    return obj.BlogContent;
                }
            });
            console.log("----------------------------blog data---------", blogData[title]);


        });

    });
    /*
     for( var i=0;i<100;i++)
     {
     $scope.blogContainer.push("blog  "+i);
     }*/


}])


myApp.controller("visitorBlogCtrl", ["$scope", "$http", "$sce", "$location" , function ($scope, $http, $sce, $location) {
    console.log("   view blog controlller  called");

}])



