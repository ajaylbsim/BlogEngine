var controllers = {
    author: require("../controllers/AuthorController"),
    views: require("../controllers/ViewController")
};
function checkUser(req,res,next)
{   if(req.session.user)
{
    console.log("user exist ");
    next();

}
else
{   console.log("user not exist ");
    console.log(req.path);
    res.render('index',{message:""})

}
}

//URL Mappings+
_app.get('/', controllers.views.home);
//_app.get('/visitorsBlog', controllers.views.visitorsBlog);
//_app.post('/visitorsBlog', controllers.author.getVisitorsBlog);
_app.post('/signup', controllers.author.signup);
//_app.get('/emailVerification', controllers.views.verification);
_app.post('/login', controllers.author.login);
//_app.post('/logout', controllers.author.logout);
//_app.get('/createBlog', controllers.views.createBlog);

/********************************************************************************************************************************
 * social media authentication
 *********************************************************************************************************************************/
_app.get('/auth/facebook', _passport.authenticate('facebook',{ scope: ['read_stream', 'publish_actions'] }));
_app.get('/fb_loginPassport/facebook/callback', _passport.authenticate('facebook', { failureRedirect: '/fail', successRedirect: '/FBlogin'}));
_app.get('/auth/twitter', _passport.authenticate('twitter'));
_app.get('/auth/twitter/callback', _passport.authenticate('twitter', { failureRedirect: '/fail', successRedirect: '/socialMediaLoginSuccess'}));
_app.get('/auth/github', _passport.authenticate('github'));
_app.get('/auth/github/callback', _passport.authenticate('github', { failureRedirect: '/fail', successRedirect: '/socialMediaLoginSuccess'}));
_app.get('/auth/google', _passport.authenticate('google'));
_app.get('/google/callback', _passport.authenticate('google', { failureRedirect: '/fail', successRedirect: '/socialMediaLoginSuccess'}));
_app.get('/socialMediaLoginSuccess', controllers.author.checkSocialMediaUser);
_app.get('/FBlogin', controllers.author.FBlogin);
_app.get('/fail', controllers.views.fail);

/********************************************************************************************************************************
 * getting content through ajax
 **********


/********************************************************************************************************************************
 * change
 *********************************************************************************************************************************/
_app.post('/getUser',checkUser,controllers.author.getUser);
_app.post('/getBlog',checkUser,controllers.author.getBlog);
_app.post('/getAllBlogOfAuthor',checkUser,controllers.author.getAllBlogOfAuthor);
_app.post('/getAuthors',checkUser,controllers.author.getAuthors);
_app.post('/getAuthor',checkUser,controllers.author.getAuthor);
_app.post('/UpdateAuthor',checkUser,controllers.author.UpdateAuthor);
_app.post('/adminEditBlog',checkUser,controllers.author.adminEditBlog);
_app.post('/adminUpdateBlog',checkUser,controllers.author.adminUpdateBlog);
_app.post('/saveMyBlog',checkUser,controllers.author.saveBlog);
_app.post('/getAuthorDraftBlog',checkUser, controllers.author.getDraftBlogList);
_app.post('/getAuthorPublishBlog',checkUser, controllers.author.getAuthorPublishBlog);
_app.post('/getAllBlogTitle',checkUser, controllers.author.getAllBlogTitle);
_app.post('/getBlogByTitle',checkUser, controllers.author.getBlogByTitle);
_app.post('/saveNewComment',controllers.author.saveNewComment);
_app.post('/authorEditBlog',checkUser,controllers.author.getBlogByTitle)
_app.post('/PublishMyBlog',checkUser,controllers.author.publishBlog);
_app.post('/updateMyBlog',checkUser,controllers.author.updateMyBlog);
_app.get('/getVisitorPublishBlo',controllers.author.getVisitorPublishBlog);
_app.post('/removeBlog',checkUser,controllers.author.removeBlog);
_app.post('/getUserBlogCount',checkUser,controllers.author.getUserBlogCount);
_app.get('/logout',controllers.author.logout);
_app.get('/getAuthorCount',controllers.author.getAuthors);


_app.post('/getBlogByTitleForVisitor', controllers.author.getBlogByTitleForVisitor);
_app.post('/getBlogByTitleForVisitor', controllers.author.getBlogByTitle);
_app.post('/searchTitle',function(req,res){


    console.log("hello >>>>>>>>>>>>>>>  ",req.body.text);
    res.send({res:[1,2,3,4,5]});

});

