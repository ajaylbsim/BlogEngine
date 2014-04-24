var result={
    message:""
           };

exports.getUser = function (req, res) {
    console.log("---------------------  iin search of user  ----------  ", req.session.user);
    res.send(req.session.user)
};

exports.login = function (req, res) {
    req.user = req.body;

    if (req.body.user_email) {
        AuthorService.getAuthorProfile(req.body.user_email)
            .on("error", function (err) {
                log.error(err);
                console.log("error occured !!!!!!!!");
                res.render('fail', {})
            })
            .on("data", function (users) {
                console.log("=---------email checked=====================data=====", users);

                if (users.length) {

                    if (bcrypt.compareSync(req.body.user_password, users[0].password)) {
                        console.log("=-------session is being created------");
                        req.session.user = {}
                        req.session.user._id = users[0]._id;
                        req.session.user.name = users[0].AuthorName;
                        req.session.user.email = users[0].email;
                        req.session.user.accessToken = accessToken;
                        res.render('account', {})

                    }
                    else {
                        console.log("password  not matched>>>>>>>>>>>>>>>>>");
                        res.render('index', {message: "password not matched"})

                    }

                }
                else {
                    res.render('index', {message: "please enter your details"})
                }
            });


    }
    else {

        res.render('fail', {})


    }


};


exports.signup = function (req, res) {

    if (req.body) {
        function callback(AuthorObj) {
            AuthorService.createAuthor(AuthorObj)
                .on('error', function (err) {
                    log.error(err);

                    res.render("index", {message: AuthorObj.email + "  already exist"});

                    // res.send(JSON.stringify({error:err.message},null,4));
                })
                .on('data', function (data) {

                    log.info("account created >>>>>>>>>>>   " + data)

                  //  exports.mail("ajaylbsim@gmail.com", "ajaylbsim@gmail.com", bcrypt.hashSync('secret'));

                    res.render("index", {message: AuthorObj.AuthorName + " please vrify your email !!"});

                })
        }

        (function (author, clb) {
            console.log("req after signup  with author  >>>>>>>>>  ", author);
            var AuthorObj = new Author();
            AuthorObj.AuthorName = author.user_name || "";
            AuthorObj.email = author.user_email || "";
            var hash = bcrypt.hashSync(author.user_password);
            console.log("hash is>>>>>>>>>>>>>>>>>", hash);
            AuthorObj.password = hash || "";
            var month = ['January', 'February', 'March', 'April', 'May', 'june', 'July', 'August', 'September', 'October', 'November', 'December']
            var DOB = new Date();
            DOB.setDate(author.birthday_day);
            DOB.setMonth(month[author.birthday_day]);
            DOB.setYear(author.birthday_year);
            console.log("DOB is>>>>>>>>>>>>>>>>>", DOB);

            AuthorObj.Dob = DOB,
                AuthorObj.Gendr = author.sex || ""
            AuthorObj.roles = ["Author"] || ""
            clb(AuthorObj)
        })(req.body, callback);


    }
    else {
        res.render("signup", {});

    }


};

exports.list = function (req, res) {
    AuthorService.listUsers()
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (users) {
            res.end(JSON.stringify(users, null, 4))
        });
};

exports.createAuthor = function (req, res) {
    log.info("in                  create author----------------", req.user);
    var author = null;
    if (req.user) {
        author = req.user;
    }

    AuthorService.getAuthorObj(author, function (authorobj) {
        AuthorService.createAuthor(authorobj)
            .on("error", function (err) {
                log.error(err);
                res.end(JSON.stringify({error: err.message}, null, 4));
            })
            .on("data", function (users) {
                res.render("successful");
            });

    });
}
exports.FBlogin=function (req, res) {
    log.info("in FBlogin----------------", req.user.id);
    if(req.user.id)
    {

        AuthorService.findSocialMediaId( req.user.id)
            .on("error", function (err) {
                log.error(err);
                res.end(JSON.stringify({error: err.message}, null, 4));
            })
            .on("data", function (users) {

               // res.end(JSON.stringify({error:resp}, null, 4));
                if(users.length>0)
                {

                    console.log("=-------session is being created------");
                    req.session.user = {}
                    req.session.user._id = users[0]._id;
                    req.session.user.name = users[0].AuthorName;
                    req.session.user.email = users[0].email;
                    req.session.user.accessToken = accessToken;
                    res.render('account', {})


                }
                else
                {

                if(!req.user._json.email)
                {
                    res.render('index', {message:'please make native login as your email not found'})


                }
                    else
                {

var author={

    AuthorName:req.user._json.name,
    AuthorSMId:[req.user._json.id],
    email:req.user._json.email,
    enabled: true,
    roles: [' Author '],
    timestampCreated: +new Date(),
    timestampUpdated: +new Date()






}
                    AuthorService.createAuthor(author)
                        .on("error", function (err) {
                            log.error(err);
                            res.render('index', {message:'this email Id is already registered with us please make native login'})

                        })
                        .on("data", function (users) {
                            console.log("user created ",users);
                            req.session.user = {}
                            req.session.user._id = users._id;
                            req.session.user.name = users.AuthorName;
                            req.session.user.email = users.email;
                            req.session.user.accessToken = accessToken;
                            res.render('account', {})





                        })




                }
                }
            });

    }
    else
    {
        res.render('index', {message: "login failed please try again "})


    }




}

exports.checkSocialMediaUser = function (req, res, next) {

    if (req.user) {

        if (req.user.id) {
            console.log("inside checkSocialMediaUser login session is being created ", req.user);
            //this session is for fb users
            req.session.user = {}
            req.session.user._id = req.user.id;
            req.session.user.name = req.user.displayName;
            req.session.user.email = req.user._json.email;
            req.session.user.accessToken = accessToken;
            var stratgy = "ohter";
            AuthorService.findId(req.user.id)
                .on("error", function (err) {
                    console.log(" find id query error");
                })
                .on("data", function (author) {
                    console.log("---------------------------------------------------------------------", author.length);

                    if (author.length) {

                        log.info("user  already exit!!!  \n  the user detail found in db are ---", author);
                        res.render("account", {data: {blog: null, author: author}})
                    }
                    else {

                        log.info("user not exit so will be created !!");
                        var author = new Author();
                        author.AuthorName = req.user._json.name;
                        author.AuthorSMId = req.user._json.id;
                        if (req.user.emails) {
                            author.email = req.user.emails[0].value;

                        }
                        else {
                            console.log(" user email not exits  email given by admin !!!!!!!!!>>>>>>>>>>>>>>>>>>>>>>> ");
                            author.email = "createdByAdmin.com";
                        }
                        if (!author.email) {
                            author.email = req.user._json.name + "@CreatedByApplication.com";
                        }
                        AuthorService.getAuthorObj(author, function (authorobj) {
                            AuthorService.createAuthor(authorobj)
                                .on("error", function (err) {
                                    log.error(err);
                                    res.end(JSON.stringify({error: err.message}, null, 4));
                                })
                                .on("data", function (users) {
                                    res.render("account");
                                });

                        });
                    }
                });

        }
        else {
            log.info("google strategy called  !!!!!!!!!!!!!!!!!!!!!", JSON.stringify(req.user));
            AuthorService.findEmail(req.user.emails[0].value)
                .on("error", function (err) {
                    console.log(" find id query error");
                })
                .on("data", function (author) {
                    console.log("---------------------------------------------------------------------", author.length);

                    if (author.length) {

                        log.info("user  already exit!!!  \n  the user detail found in db are ---", author);
                        res.render("account", {data: {blog: null, author: author}})
                    }
                    else {
                        var author = new Author();
                        author.AuthorName = req.user.name.givenName || "";
                        author.email = req.user.emails[0].value || "";

                        log.info("user not exit so will be created !!");
                        AuthorService.getAuthorObj(author, function (authorobj) {
                            AuthorService.createAuthor(authorobj)
                                .on("error", function (err) {
                                    log.error(err);
                                    res.end(JSON.stringify({error: err.message}, null, 4));
                                })
                                .on("data", function (users) {
                                    res.render("account");
                                });

                        });

                    }
                });
        }

    }
    else {

        log.info("user not found in request");
        res.render("fail")
    }


}

/*

exports.display = function (req, res) {
    log.info("================================", req.user);
    res.send("successfull!!!!!!!!!!!!!!");
};


exports.listProfile = function (req, res) {

    var email = req.body.email;

    AuthorService.getAuthorProfile(email)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (author) {
            console.log(author);

            res.send(author)

        });
};
*/


exports.getBlog = function (req, res) {
    console.log("getBlog>>>>>>>>>>>>>>>> ",req.body.blog)
    BlogServices.getBlog(req.body.blog)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {
            console.log("getBlog>>>>>>>>>>>>>>>> ",blogList.length)

            res.send(blogList)

        });
};

exports.getAllBlogOfAuthor = function (req, res) {
    console.log("getAllBlogOfAuthor>>>>>>>>>>>>>>>> ",req.body.email)
    BlogServices.getAllBlogOfAuthor(req.body.email)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {
            console.log("getAllBlogOfAuthor>>>>>>>>>>>>>>> ",blogList.length)

            res.send(blogList)

        });
};

exports.getVisitorPublishBlog= function (req, res) {

    BlogServices.getVisitorPublishBlog()
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {
            console.log("getBlog>>>>>>>>>>>>>>>> ",blogList.length)

            res.send(blogList)

        });
};


exports.getAuthors = function (req, res) {
    AuthorService.getAllAuthors()
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (author) {
            console.log(author);

            res.send(author)

        });

};

exports.UpdateAuthor= function (req, res) {
    AuthorService.UpdateAuthor(req.body)
        .on("error", function (err) {
            log.error("err>>>>>>>>>>>>>>>>>>>>>>>>>>  ",err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {
            console.log(result);
            //   console.log("res>>>>>>>>>>>>>>>>>>>>>>   ",result);

            res.send({updated:true})

        });
    log.error("err>>>>>>>>>>>>>>>>>>>>>>>>>>  ");


};

exports.getAuthor=function (req, res) {
    AuthorService.getAuthor(req.body.Author)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (author) {
            console.log(author);

            res.send(author)

        });
};

exports.adminEditBlog=function (req, res) {
    console.log("------------------------------------------------------------------------",req.body);
    BlogServices.editBlog(req.body.id)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogs) {
            console.log(blogs);

            res.send(blogs)

        });

};
exports.getUserBlogCount=function (req, res) {
    console.log("----------------",req.body);
    BlogServices.getUserBlogCount(req.body.email)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogs) {
            console.log(blogs);

            res.send(blogs)

        });

};


exports.saveBlog = function (req, res) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
     BlogServices.saveMyBlog(req.body)
        .on("error", function (err) {
            log.error(err);
            result.message="Please retry action not completed !!"
            res.send(result)
        })
        .on("data", function (data) {
            console.log(data);
            result.message=" saved successfully !!"
            res.send(result)

        });
};


exports.getDraftBlogList = function (req, res) {
  BlogServices.getDraftBlogList(req.body)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {
            console.log("  bloglist---   ", blogList);
            console.log("  bloglist---   ", blogList[0]);

            res.send(blogList)

        });
};

exports.getAuthorPublishBlog = function (req, res) {
  BlogServices.getAuthorPublishBlog(req.body)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {
            console.log("  bloglist---   ", blogList);
            console.log("  bloglist---   ", blogList[0]);

            res.send(blogList)

        });
};

exports.getAllBlogTitle = function (req, res) {
  BlogServices.getAllBlogTitle(req.body)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {

            res.send(blogList)

        });
};

exports.getBlogByTitle= function (req, res) {
  BlogServices.getBlogByTitle(req.body)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {

            res.send(blogList)

        });
};

exports.getBlogByTitleForVisitor=function (req, res) {
  BlogServices.getBlogByTitleForVisitor(req.body)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {

            res.send(blogList)

        });
};

exports.publishBlog= function (req, res) {
  BlogServices.publishBlog(req.body)
        .on("error", function (err) {
            log.error(err);

          result.message="Please retry action not completed !!"
          res.send(result)

        })
        .on("data", function (blogList) {


          result.message="successfully  published !!"
          res.send(result)

        });
};


exports.saveNewComment = function (req, res) {
    BlogServices.findComment(req.body.blog)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {
            console.log(">>>>>>>>>>>>",result.length)
            if(result.length>0)
            { console.log("comment already exits ");
                res.send(null);
            }else
            {
                console.log("comment not  exits ");

                BlogServices.saveNewComment(req.body.blog)
                    .on("error", function (err) {
                        log.error(err);
                        res.end(JSON.stringify({error: err.message}, null, 4));
                    })
                    .on("data", function (result) {
                        console.log(result);

                        res.send({res:result})

                    });


            }

        });

};


exports.updateMyBlog= function (req, res) {

    BlogServices.updateMyBlog(req.body)
        .on("error", function (err) {
            log.error(err);
            result.message=" Action  not copleted !!"
            res.send(result)


        })
        .on("data", function (result) {
            console.log(result);

            result.message="successfullu saved !!"
            res.send(result)


        });
};

exports.adminUpdateBlog= function (req, res) {

    BlogServices.adminUpdateBlog(req.body)
        .on("error", function (err) {
            log.error(err);
            result.message=" Action  not copleted !!"
            res.send(result)


        })
        .on("data", function (result) {
            console.log(result);

            result.message="successfullu saved !!"
            res.send(result)


        });
};

exports.removeBlog=function (req, res) {
    BlogServices.removeBlog(req.body.blog)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blog) {
            console.log(blog);

            res.send({removed:1})

        });}

exports.logout = function (req, res) {
    console.log(">>>>>>>>>>>>>>>>>>>Successfully logOut>>>>>>>>>>>>>>>>>>>>>>>>", req.session.user);
    req.session.user = null;
    res.send({res: null});


};



/***********************************************************************************************************************************
 * inside angular
 ***********************************************************************************************************************************//*

exports.getBlogList = function (req, res) {
    var user_email;
    if (req.body.User) {
        console.log("---------get published blog for ------------------", req.body.User.email);

        user_email = req.body.User.email;
    }
    else {
        console.log("---------get published blog for all  user_email=null------------------");

        user_email = null;

    }
    BlogServices.getBlogList(user_email)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {
            console.log("  bloglist---   ", blogList[0]);

            res.send(blogList)

        });
};
exports.getDraftBlogList = function (req, res) {

    console.log("---------get draft blog list for ------------------", req.body.User.email);
    if (req.body.User) {
        var user_email = req.body.User.email;
    }
    else {
        user_email = null;
    }
    BlogServices.getDraftBlogList(user_email)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {
            console.log("  bloglist---   ", blogList[0]);

            res.send(blogList)

        });
};
exports.saveBlog = function (req, res) {

    BlogServices.saveMyBlog(req.body.blog)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {
            console.log(result);

            res.send(result)

        });
};

exports.updateBlog = function (req, res) {

    BlogServices.updateMyBlog(req.body.blog)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {
            console.log(result);

            res.send(result)

        });
};
exports.publishBlog = function (req, res) {
    console.log(">>>>>>>>>>>>>>>>checking session>>>>>>>>>>>>>>", req.session.user)
    BlogServices.publishMyBlog(req.body.blog)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {
            console.log(result);

            res.send(result)

        });
};

exports.getBlogContengt = function (req, res) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", req.body.title);

    BlogServices.getBlogContengt(req.body.title)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);

            res.send(result)

        });
};

exports.getVisitorsBlog = function (req, res) {

    BlogServices.getVisitorsBlog()
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (blogList) {

            res.send(blogList)

        });
};


exports.logout = function (req, res) {
    console.log(">>>>>>>>>>>>>>>>>>>Successfully logOut>>>>>>>>>>>>>>>>>>>>>>>>", req.session.user);
    req.session.user = null;
    res.send({res: null});


};


exports.saveNewComment = function (req, res) {
    BlogServices.findComment(req.body.blog)
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {
            console.log(">>>>>>>>>>>>",result.length)
            if(result.length>0)
            { console.log("comment already exits ");
                res.send(null);
            }else
            {
               console.log("comment not  exits ");

                BlogServices.saveNewComment(req.body.blog)
                    .on("error", function (err) {
                        log.error(err);
                        res.end(JSON.stringify({error: err.message}, null, 4));
                    })
                    .on("data", function (result) {
                        console.log(result);

                        res.send({res:result})

                    });


            }

        });

};

exports.shareBlog =function (req, res) {
    console.log(">>>>>>>>>>>>>>>>>>>ready to share my blog >>>>>>>>>>>>>>>>>>>>>>>>", req.body.title);
    var url ='http://127.0.0.1:3001/visitorsBlog/#!/readBlog/hello2';
    url

    var accessToken=req.body.accessToken;
    var FB=require('fb');
    var id,name;
    FB.api('712435645446680', { fields: [id,name] }, function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        id=res.id;
        name=res.name;
        console.log(res.id);
        console.log(res.name);
    });
    FB.setAccessToken(accessToken);
    //FB.setAccessToken('2aa9bb9fee99478bbed4bb98dbc0ab73');
    console.log(">>>>>>>>>>fb message >>>>>",body)
    //var body = 'Read this Blog on '+req.body.title+' By '+req.body.username+' '+'http://127.0.0.1:3001/visitorsBlog#/visitorsBlog';
    var body = 'Read this Blog on '+req.body.title+' By '+req.body.username+' '+url;
    FB.api('me/feed', 'post', { message: body}, function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log('Post Id: ' + res.id);
    });
    console.log(">>>>>>>>>>after message >>>>>",body)




    //////////////////////////////////
};
exports.mail = function (To, From, data) {


    var nodemailer = require('nodemailer');

    var transport = nodemailer.createTransport('smtp', {


        service: 'Gmail',
        auth: {
            user: "ajaylbsim@gmail.com",
            pass: "8802168668"
        }
    });
    var path = '<a href= ' + 'http://localhost:3001/emailVerification?query=' + data + '>' + 'verify' + '</a>'
    var message = {

        // sender info--
        from: From,

        // Comma separated list of recipients
        to: To,
        subject: data, //

        headers: {
            'X-Laziness-level': 1000
        },

        // plaintext body
        text: 'hello all this is a verification mail' + path,


        html: path
        // An array of attachments

    };


    transport.sendMail(message, function (error) {


        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        else {
            console.log('Message sent successfully!');

        }
    });


};



*/
