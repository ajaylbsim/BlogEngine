var myApp = angular.module("myApp", ["ngRoute", "numFilters", 'ui.bootstrap']);
var User = null;
var displayMessage="hello jee";
var blogTextInput = "";
myApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/viewPublishBlog", {
        templateUrl: "blogview.html", controller: "viewPublishBlogCtrl"})
        .when("/adminDashBoard", {
            templateUrl: "adminPanel.html", controller: "adminBlogCtrl"})
        .when("/authorPanel", {
            templateUrl: "authorsPanel.html", controller: "adminAuthorCtrl"})
        .when("/blogPanel", {
            templateUrl: "blogsPanel.html", controller: "adminPanelBlogCtrl"})
        .when("/userBlogPanel", {
            templateUrl: "userBlogPanel.html", controller: "authorPanelBlogCtrl"})
        .when("/editAuthor/:id", {
            templateUrl: "AuthorProfile.html", controller: "editAuthorCtrl"})
        .when("/editBlog/:id", {
            templateUrl: "adminEditBlog.html", controller: "adminEditBlogCtrl"})
        .when("/userDashBoard", {
            templateUrl: "userDashboard.html", controller: "userBlogCtrl"})
        .when("/createBlog", {
            templateUrl: "createblog.html", controller: "createBlogCtrl"})
        .when("/draftBlog", {
            templateUrl: "blogview.html", controller: "draftBlogCtrl"})
        .when("/readBlog/:title", {
            templateUrl: "singlePageBlogView.html", controller: "readBlogCtrl"})
        .when("/authorEditBlog/:title", {
            templateUrl: "createblog.html", controller: "editBlogCtrl"})
        .when("/visitorsBlog", {
            templateUrl: "visitorBlogview.html", controller: "VisitorsBlogCtrl"})
        .when("/message/:message", {
            templateUrl: "message.html", controller: "messageCtrl"})
        .otherwise({redirectTo: "/"})
}])
myApp.controller("mainCtrl", ["$scope", "$http", "$location", "$sce", "$window", function ($scope, $http, $location, $sce, $window) {
    console.log("starting mainCtrl ...................");
    $scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie",
        "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred",
        "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];

    $scope.name = 'red';
    $scope.searchTitle = '';
    $scope.blogArray = [];
    $scope.list = [];
    $http.post("getUser", {}).success(function (data) {
        if (!data.error) {
            User = data;

            console.log("found successfully!!>>>>>>>>>>>>>>>>>>", User);
            if ((User.name == 'admin') && (User.email == 'admin@admin.com')) {
                console.log("found successfully!! admin>>>>>>>>>>>>>>>>>>");

                $location.path("adminDashBoard");
            }
            else {
                console.log("found successfully!! author>>>>>>>>>>>>>>>>>>");

                $location.path("userDashBoard");

            }



        } else {


        }
        console.log("----------result after found-------", JSON.stringify(data));
    })


    $scope.bindContent = function (text) {

        return $sce.trustAsHtml(text)

    }

    $scope.getTitle = function () {

        $http.post("getAllBlogTitle", {email: User.email}).success(function (data) {
            console.log("count ", data.length);
            data.forEach(function (obj) {
                $scope.blogArray.push(obj.BlogTitle);

            });
        });
        $scope.list = []

        console.log(">>>>>>>>>>>>>>>>",  $scope.searchTitle);
        $scope.blogArray.forEach(function (word) {
            var txt = $scope.searchTitle
            var txt = word.substr(0, $scope.searchTitle.length)

            if ((txt.toLowerCase() == $scope.searchTitle.toLowerCase()) && txt != "") {
                console.log("matched")
                $scope.list.push(word)
                console.log("pushed", $scope.list)

            }
            else {
                //$scope.list.pop(word);
                console.log(" not matched")
                console.log("pushed", $scope.list)


            }


        })


    }


    $scope.logout = function () {

        $http.get("logout").success(function (data) {

            console.log(">>>>>>>>>>>logout callled>>>>>>>>>>>>");
            window.location.href = '/'
            // $location.path('/');

        });

    }


}])
myApp.controller("adminBlogCtrl", ["$scope", "$http", function ($scope, $http) {

    console.log("starting adminBlogCtrl ...................");
    $scope.totalBlog = 0;
    $scope.publishedBlog = 0;
    $scope.draftBlog = 0;
    $scope.totalAuthor = 0;
    $scope.blogArray = [];
    $scope.authorArray = [];
    $http.post("getBlog", {blog: {}}).success(function (data) {
        console.log("count ", data.length);
        data.forEach(function (object) {
            $scope.blogArray.push(object);
        });
    });

    $http.get("getAuthorCount").success(function (data) {

        $scope.totalAuthor = data.length;


    });


    $http.post("f", {id: User._id}).success(function (data) {
        console.log(" after getUserBlogCount val is   ", data.length);
        if (data) {
            data.forEach(function (obj) {

                console.log(" in each    ");

                $scope.totalBlog = $scope.totalBlog + 1;
                if (obj.BlogPublish == 1) {
                    $scope.publishedBlog = $scope.publishedBlog + 1;

                }
                else {
                    $scope.draftBlog = $scope.draftBlog + 1;

                }


            });

        }


    });


}])
myApp.controller("adminPanelBlogCtrl", ["$scope", "$http", "$location", "$sce", function ($scope, $http, $location, $sce) {
    console.log("starting adminBlogCtrl ...................");
    $scope.blogArray = [];
    $http.post("getBlog", {blog: {}}).success(function (data) {
        console.log("count ", data.length);

        data.forEach(function (object) {
            $scope.blogArray.push(object);
        });
        console.log("count ", $scope.blogArray.length);

    });

    $scope.remove = function (id) {
        $http.post("removeBlog", {blog: {_id: id}}).success(function (data) {
            console.log(" after remove  ", data);
            $scope.blogArray.forEach(function (ele, i) {
                if (ele._id == id) {
                    $scope.blogArray.splice(i, 1);

                }


            });

        });

    }


}])
myApp.controller("authorPanelBlogCtrl", ["$scope", "$http", "$location", "$sce", function ($scope, $http, $location, $sce) {
    console.log("starting adminBlogCtrl ...................");
    $scope.blogArray = [];
    $http.post("getAllBlogOfAuthor", {email: User.email}).success(function (data) {

       if(data.length>0)
        {

            data.forEach(function (object) {
                $scope.blogArray.push(object);
            });
        }
        else
        {
            $location.path('message/" you have not created any blog till yet "');
        }



    });


    $scope.remove = function (id) {
        $http.post("removeBlog", {blog: {_id: id}}).success(function (data) {
            console.log(" after remove  ", data);
            $scope.blogArray.forEach(function (ele, i) {
                if (ele._id == id) {
                    $scope.blogArray.splice(i, 1);

                }


            });

        });

    }


}])
myApp.controller("adminAuthorCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.Authors = []

    console.log("adminAuthorCtrl called  ");
    $http.post("getAuthors", {}).success(function (data) {
        if (data.length > 0) {

            console.log("there are found authors ", $scope.Authors.length)
            data.forEach(function (ele) {
                $scope.Authors.push(ele);
                console.log("helo >>>>>>>>>>>>>>>>>>>>>>>>  ", ele);


            });


        }
        {
            console.log("no authors found ")

        }


    });

}])
myApp.controller("editAuthorCtrl", ["$scope", "$http", "$location", "$sce", "$routeParams", function ($scope, $http, $location, $sce, $routeParams) {
    console.log("starting editAuthorCtrl    ...................");
    $scope.genderArray = [
        {val: 'Male'},
        {val: 'Female'}
    ];
    $scope.arr = ['a', 'b', 'c'];
    $scope.Arr = [
        {name: 'ajay', cast: 'brahmin'},
        {name: 'ajay2', cast: 'brahmin'},
        {name: 'ajay3', cast: 'muslim'}
    ];
    $scope.genderSelected = "";
    $scope.Author = {}
    $http.post("getAuthor", {Author: {_id: $routeParams.id}}).success(function (data) {
        console.log("count ", data.length);
        $scope.Author = data[0];

    });

    $scope.updateStatus = function () {
        $scope.Author.Gender = $scope.genderSelected.val;
        console.log("the author is ", $scope.genderSelected.val);
        console.log("the author is ", $scope.Author._id);
        var helloObj = {
            id: $scope.Author._id,
            name: $scope.Author.AuthorName,
            Gender: $scope.Author.Gender,
            Roles: $scope.Author.roles,
            email: $scope.Author.email
        };
        console.log("the author is ", helloObj);


        $http.post("UpdateAuthor", helloObj).success(function (data) {
            console.log(" after update  ", data);

        });

    }


}])
myApp.controller("adminEditBlogCtrl", ["$scope", "$http", "$location", "$sce", "$routeParams", function ($scope, $http, $location, $sce, $routeParams) {

    $scope.tag = "";
    $scope.removeTag = "";
    $scope.Blog = {};
    console.log("adminedt Ctrl called   >>>>>>>>>>>>>>>>>>>>>>>  ", $routeParams.id);
    $http.post("adminEditBlog", {id: $routeParams.id}).success(function (data) {
        $scope.Blog = data[0];
        console.log("?>>>>>>>>>>>>>>>>>>>>>", $scope.Blog.BlogTags)
        console.log("?>>>>>>>>>>>>>>>>>>>>>", $scope.Blog.BlogAuthor.name)


    });


    $scope.updateStatus = function () {

        console.log("the author is ", $scope.Blog.BlogPublish);

        $http.post("adminUpdateBlog", {id: $scope.Blog._id, title: $scope.Blog.BlogTitle, published: $scope.Blog.BlogPublish, Tags: $scope.Blog.BlogTags, email: $scope.Blog.BlogAuthor.email}).success(function (data) {
            console.log(" after update  ", data);

        });

    }

}])
myApp.controller("userBlogCtrl", ["$scope", "$http", "$sce", "$location" , "limitToFilter", function ($scope, $http, $sce, $location, limitToFilter) {
    $scope.totalBlog = 0;
    $scope.publishedBlog = 0;
    $scope.draftBlog = 0;
    console.log("userBlogCtrl called");
    $scope.result = ""
    $scope.arr = {name: 'he'};


    console.log("getUserBlogCount>>>>>>>>>>>>>>>  ", User._id)

    $http.post("getUserBlogCount", {email: User.email}).success(function (data) {
        console.log(" after getUserBlogCount val is   ", data.length);
        data.forEach(function (obj) {

            console.log(" in each    ");

            $scope.totalBlog = $scope.totalBlog + 1;
            if (obj.BlogPublish == 1) {
                $scope.publishedBlog = $scope.publishedBlog + 1;

            }
            else {
                $scope.draftBlog = $scope.draftBlog + 1;

            }


        });


    });


}])
myApp.controller("createBlogCtrl", ["$scope", "$http", "$sce", function ($scope, $http, $sce) {
    console.log("   create controlller  called");
    var blog = "";
    $scope.previousData = "pre"
    $scope.previousTitle = ""
    $scope.Tag = "";
    $scope.tagArray = [];
    $scope.editorData = "";
    $scope.previewData = "";
    $scope.tagArray = [];
    $scope.Information = ""
    $scope.title = "";
    $scope.published = false;

    $scope.publish = function () {
        console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLL");
        console.log($scope.title != "");
        console.log($scope.published != true);
        console.log($scope.editorData != "");
        if (($scope.title != "") && ($scope.published != true) && ($scope.editorData != "")) {


            $http.post("publishMyBlog", {email: User.email, title: $scope.title}).success(function (data) {
                $scope.Information = data.message;
                $scope.published = true;

            })


        } else {
            $scope.Information = "please save the blog before you publish !!   kk";

        }


    }

    $scope.save = function () {

        if (($scope.editorData == $scope.previousData) || ($scope.title == $scope.previousTitle)) {
            $scope.Information = "please do not try to save the same blog again !!";
            console.log(">>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
            return;
        }
        if (( $scope.editorData != "" ) && ($scope.title != "")) {


            if ($scope.title == "") {
                $scope.Information = "please add the title!!";
                return;
            } else {
                data = $scope.editorData;

                $http.post("saveMyBlog", {title: $scope.title, data: $scope.editorData, tags: $scope.tagArray, author: {ID: User._id, name: User.name, email: User.email}}).success(function (data) {

                    console.log(">>>>>>>>", data.message);
                    //$scope.editorData =data.message;
                    //$scope.previewData =$sce.trustAsHtml("<h3>"+data.message+"</h3>");
                    $scope.Information = data.message;
                    $scope.previousData = $scope.editorData;
                    $scope.published = false;


                    if ($scope.previousData == $scope.editorData) {
                        console.log("--===================================");
                    }
                    $scope.previousTitle = $scope.title;
                    ;
                })
            }

        } else {
            $scope.Information = "write the Blog before you save";


        }

    }


    $scope.convert = function () {
        var str = markdown.toHTML($scope.editorData);
        $scope.previewData = $sce.trustAsHtml(str);
        blogTextInput = $scope.editorData;
    }

    $scope.getTags = function () {
        $scope.tagArray.push($scope.Tag);
        $scope.Tag = "";
    }
}])
myApp.controller("draftBlogCtrl", ["$scope", "$http", "$location" , function ($scope, $http, $location) {

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> draftBlogCtrl ");
    $scope.arrayOfblogObj = [];
    $http.post("getAuthorDraftBlog", {email: User.email}).success(function (data) {
        if (data.length > 0) {
            data.forEach(function (ele) {
                $scope.arrayOfblogObj.push(ele);


            });
        }
        else {
            $location.path('message/"there is no draft blog in yor account "');

        }
        console.log("total element found are ", $scope.arrayOfblogObj.length);
    });


}])
myApp.controller("readBlogCtrl", ["$scope", "$http", "$location", "$sce", "$routeParams", function ($scope, $http, $location, $sce, $routeParams) {
    console.log("starting readBlogCtrl ...................");

    $scope.commentText = "";
    $scope.user_name = "";
    $scope.user_email = "";
    $scope.Obj = "";
    $http.post("getBlogByTitle", {title: $routeParams.title }).success(function (data) {
        console.log(">>>>>>>>>>>>>>>>>>>>", data);

        data.forEach(function (object) {
            console.log(object);
            object.BlogContent = markdown.toHTML(object.BlogContent);
            $scope.Obj = object;
            console.log($scope.Obj.BlogTitle);


        });
    });


    $scope.diaprove = function (commentName) {
        console.log("remove  ", commentName);
        $scope.Obj.BlogComments.forEach(function (comment, i) {
            if (comment.name == commentName) {
                $scope.Obj.BlogComments.splice(i, 1);
                console.log("elements are left ");
                $scope.Obj.BlogComments.forEach(function (ele) {
                    console.log(ele.name)
                })

            }

        });


    }
    $scope.convert = function () {
        return $sce.trustAsHtml($scope.Obj.BlogContent);
    }
    $scope.fbShare = function () {
        console.log("share me");
        if (!User.accessToken) {
            console.log(" access token  not available >>>>>>>>>>>>>>>>>>  ");


        } else {
            console.log(" access token  is available so going to share the post >>>>>>>>>>>>>>>>>>  ");
            $http.post("shareBlog", {username: User.name, title: $routeParams.title, accessToken: User.accessToken}).success(function (data) {
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
        blog.Comment = $scope.commentText;
        blog.user = $scope.user_name || "Anonymous";
        blog.email = $scope.user_email;
        blog.title = title;
        if ((blog.Comment != "") & (blog.user != "") && (blog.name != "")) {
            $http.post("saveNewComment", {blog: blog}).success(function (res) {
                if (!res.error) {
                    console.log("saved successfully!!", res.length);
                    $scope.commentText = "";
                    $scope.user_name = "";
                    $scope.user_email = "";
                    if (res) {
                        $scope.Obj.BlogComments.push({name: blog.user, email: blog.email, message: blog.Comment})
                        console.log("pushed new ", $scope.Obj.BlogComments.length)
                    }

                } else {
                    $scope.commentText = "try later";
                }
            })
        }
    }


}]);
myApp.controller("viewPublishBlogCtrl", ["$scope", "$http", "$sce", "$location" , function ($scope, $http, $sce, $location) {
    console.log("   view  publish blog controlller  called for ", User);
    $scope.arrayOfblogObj = [];
    $http.post("getAuthorPublishBlog", {email: User.email}).success(function (data) {
        if (data.length > 0) {

            data.forEach(function (ele) {
                $scope.arrayOfblogObj.push(ele);


            });
        }
        else {
            $location.path('message/"there is no published blog in yor account "');


        }
        console.log("total element found are ", $scope.arrayOfblogObj.length);
    });
}])
myApp.controller("editBlogCtrl", ["$scope", "$http", "$routeParams", "$sce", function ($scope, $http, $routeParams, $sce) {
    console.log("EDIT controlller  called", $routeParams.title);
    var blog = {};
    $scope.perviousText = ""
    $scope.Information = ""
    $scope.editorData = "";
    $scope.previewData = "";
    $scope.tagArray = [];
    $scope.blogdata;
    $scope.title = $routeParams.title;

//ajax request to get the blog to be edited
    $http.post("authorEditBlog", {title: $scope.title}).success(function (data) {
        if (!data.error) {
            blog = data[0];
            $scope.blogdata = data[0].BlogContent;

            console.log("found successfully!!>>>>>>>>>>>>>>", data[0]);
            $scope.tagArray = data[0].BlogTags;
            $scope.editorData = $scope.blogdata;
            $scope.perviousText = $scope.editorData

            // $scope.blogdata = markdown.toHTML($scope.blogdata);
            //$scope.previewData = $sce.trustAsHtml($scope.blogdata);
        } else {
            $scope.Information = " blog not found !! "

        }
        //this method show the preview by appending the html data in preview
        $scope.convert = function () {
            var str = markdown.toHTML($scope.editorData);
            $scope.previewData = $sce.trustAsHtml(str)

        }

    })

    $scope.publish = function () {
        if ($scope.title != null) {
            if (blog.BlogPublish != 1) {
                $http.post("publishMyBlog", {email: User.email, title: $scope.title }).success(function (data) {
                    $scope.Information = data.message;

                })
            }
            else {
                $scope.Information = "This blog is already  published !!";


            }

        } else {
            $scope.Information = "please save the blog before you publish !!";

        }
    }


    $scope.save = function () {
        if ($scope.editorData == $scope.perviousText) {
            $scope.Information = "pleasemake some change before you save !!";
            console.log(" is equal ");
            return;

        } else {
            console.log("going to save >>>>>>>>>>>>>>>>>>>>  ");

        }

        if ($scope.title != null && $scope.editorData != "") {
            $http.post("updateMyBlog", {title: $scope.title, content: $scope.editorData, email: User.email, Tags: $scope.tagArray}).success(function (data) {

                if (data) {
                    $scope.Information = "has been saved successfully"
                    console.log("saved ")
                    $scope.perviousText = $scope.editorData

                } else {

                    $scope.Information = " not saved properly"
                    console.log(" not saved ")


                }
                //console.log("----------result afte update-------", JSON.stringify(data));
                //$scope.convert();

            })

        }
        else {
            console.log("please check either textarea OR Title is empty>>>>>>>>>");

        }

    }

    $scope.getTags = function () {
        $scope.tagArray.push($scope.Tag);
        //  $scope.blogdata.BlogTags.push($scope.Tag);
        console.log("----------------------------   ", $scope.tagArray);
        $scope.Tag = "";
    }

}])
myApp.controller("VisitorsBlogCtrl", ["$scope", "$http", "$sce", "$location" , function ($scope, $http, $sce, $location) {
    console.log("   view  publish blog controlller  called for ", User);
    $scope.arrayOfblogObj = [];
    $http.get("getVisitorPublishBlog").success(function (data) {
        data.forEach(function (ele) {
            $scope.arrayOfblogObj.push(ele);


        });
        console.log("total element found are ", $scope.arrayOfblogObj.length);
    });
}])
myApp.controller("messageCtrl", ["$scope", "$routeParams", function ($scope, $routeParams) {
    console.log("   view message  controlller  called for ", User);
    $scope.message = $routeParams.message;


}])

myApp.directive('autoComplete',function($timeout,$http)
{
    return function(scope, iElement, iAttrs) {
        console.log("hello");

        iElement.autocomplete({
            source:function(request, response){
                console.log(request);

                $http.post('searchTitle',{text:req.term},function(result){
                    console.log('result is',result);


                });
                var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.grep( scope[iAttrs.uiItems], function( item ){
                    return matcher.test( item );
                }) );

            }

        });

    }

});

