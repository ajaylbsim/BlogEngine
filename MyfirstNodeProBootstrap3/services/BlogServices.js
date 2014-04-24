
exports.getBlog= function (blog) {
    console.log("blog services \"getBlog\" has been called",blog);

    var emitter = this;
    Blog.find(blog, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);

    });
}.toEmitter();

exports.getAllBlogOfAuthor= function (email) {
    console.log("blog services \"getBlog\" has been called",email);

    var emitter = this;
    Blog.find({'BlogAuthor.email':email},function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);

    });
}.toEmitter();


exports.editBlog= function (id) {
    console.log("blog services \"getadminEditBlog \" has been called for ",id);
    var emitter = this;
    Blog.find({_id:id},{_id:1,BlogTitle:1,BlogAuthor:1,BlogPublish:1,BlogTags:1,BlogLikes:1,BlogComments:1}, function (err, blog) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data",blog);
    });
}.toEmitter();

exports.saveMyBlog = function (blog) {
    console.log("blog services \"saveMyBlog \" has been called for ",blog);
    var emitter = this;
    var blogobj=new Blog()
    blogobj.BlogTitle=blog.title;
    blogobj.BlogContent=blog.data;
    blogobj.BlogTags=blog.tags;
    blogobj.BlogAuthor=blog.author;
    blogobj.BlogPublish=0;
    blogobj.save(function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();



exports.getDraftBlogList = function (author) {
    console.log("blog services \"getDraftBlogList\" has been called",author.email);

    var emitter = this;
    //todo find by id
    Blog.find({'BlogAuthor.email':author.email, 'BlogPublish': 0}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();


exports.getAuthorPublishBlog = function (author) {
    console.log("blog services \"getAuthorPublishBlog\" has been called",author.email);

    var emitter = this;
    //todo find by id
    Blog.find({'BlogAuthor.email':author.email, 'BlogPublish': 1}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();


exports.getUserBlogCount= function (email) {

    console.log("blog services \"getUserBlogCount\" has been called",email);

    var emitter = this;
    //todo find by id
    Blog.find({'BlogAuthor.email':email}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();



exports.getAllBlogTitle = function (author) {
    console.log("blog services \"getAllBlogTitle\" has been called",author.email);

    var emitter = this;
    //todo find by id
    Blog.find({'BlogAuthor.email':author.email},{BlogTitle:1}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();
exports.getBlogByTitle = function (blog) {
    console.log("blog services \"getBlogByTitle\" has been called",blog.title);

    var emitter = this;
    Blog.find({BlogTitle:blog.title}, function (err, blog) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blog);
    });
}.toEmitter();
exports.getBlogByTitleForVisitor= function (blog) {
    console.log("blog services \"getBlogByTitleForVisitor\" has been called",blog.title);

    var emitter = this;
    Blog.find({BlogTitle:blog.title}, function (err, blog) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blog);
    });
}.toEmitter();


exports.publishBlog= function (data) {
    console.log("blog services \"publishBlog\" has been called",data);

    var emitter = this;
    Blog.update({'BlogAuthor.email':data.email,BlogTitle:data.title}, {$set: {BlogPublish:1}}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();

exports.getVisitorPublishBlog= function () {
    console.log("blog services \"getVisitorPublishBlog\" has been called");

    var emitter = this;
    Blog.find({BlogPublish:1}, function (err, blog) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blog);
    });
}.toEmitter();


exports.findComment = function (blog) {
    console.log("blog services \".findComment \" has been called for " + JSON.stringify(blog) + "");
    var emitter = this;
    Blog.find({BlogTitle:blog.title,BlogComments:{$in:[{name:blog.user,email:blog.email,message:blog.Comment}]}},function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();

exports.saveNewComment = function (blog) {
    console.log("blog services \".saveNewComment \" has been called for " + JSON.stringify(blog) + "");
    var emitter = this;
    Blog.update({BlogTitle:blog.title},
        {$addToSet:{BlogComments:{name:blog.user,email:blog.email,message:blog.Comment}}},
        function (err, blogs) {
            if (err) emitter.emit("error", err);
            else emitter.emit("data", blogs);
        });
}.toEmitter();


exports.updateMyBlog = function (data) {
    console.log("blog services \"updateMyBlog \" has been called",data);
    var emitter = this;

    Blog.update({BlogTitle:data.title,'BlogAuthor.email':data.email}, {$set: {BlogContent: data.content,BlogTags:data.Tags}}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();

exports.adminUpdateBlog= function (data) {
    console.log("blog services \"adminUpdateBlog \" has been called",data);
    var emitter = this;

    Blog.update({BlogTitle:data.title,'BlogAuthor.email':data.email}, {$set: {BlogTitle:data.title,BlogPublished:data.published,BlogTags:data.Tags}}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();

exports.removeBlog= function (blog) {
    console.log("blog services \"removeBlog \" has been called for ",blog);
    var emitter = this;
    Blog.remove({_id:blog._id}, function (err, blog) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data",blog);
    });
}.toEmitter();






























/**
 * Created by ajay on 22/3/14.
 */
/*
exports.getBlogList = function (user_email) {
    console.log("blog services \"getBlogList\" has been called", user_email);

    var emitter = this;
    if (user_email) {
        Blog.find({'BlogAuthor.email': user_email, 'BlogPublish': 1}, function (err, blogs) {
            if (err) emitter.emit("error", err);
            else emitter.emit("data", blogs);
        });
    }
    else {

        Blog.find({'BlogPublish': 1}, function (err, blogs) {
            if (err) emitter.emit("error", err);
            else emitter.emit("data", blogs);
        });
    }

}.toEmitter();
*/
/*
exports.getDraftBlogList = function (user_email) {
    console.log("blog services \"getDraftBlogList\" has been called", user_email);

    var emitter = this;
    Blog.find({'BlogAuthor.email': user_email, 'BlogPublish': 0}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();

exports.saveMyBlog = function (blog) {
    console.log("blog services \"saveMyBlog \" has been called", blog.BlogAuthor);
    var emitter = this;
    var blogobj = new Blog(blog);
    blogobj.BlogAuthor = blog.BlogAuthor;
    blogobj.save(function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();

exports.updateMyBlog = function (blog) {
    console.log("blog services \"updateMyBlog \" has been called", blog);
    var emitter = this;
    var blogobj = new Blog(blog);
    console.log("BlogTitle:", blog.BlogTitle, "BlogContent:", blog.BlogContent);
    Blog.update({BlogTitle: blog.BlogTitle}, {$set: {BlogContent: blog.BlogContent}}, function (err, blogs) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", blogs)
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();


exports.publishMyBlog = function (blog) {
    console.log("blog services \"publishMyBlog \" has been called", blog);
    var emitter = this;
    var blogobj = new Blog(blog);
    console.log("BlogTitle:", blog.BlogTitle, "BlogContent:", blog.BlogContent);
    Blog.update({BlogTitle: blog.BlogTitle}, {$set: {BlogPublish: 1}}, function (err, blogs) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", blogs)
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();

exports.getBlogContengt = function (title) {
    console.log("blog services \"getBlogContengt\" has been called", title);
    var emitter = this;

    Blog.find({BlogTitle: title}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();


exports.findComment = function (blog) {
    console.log("blog services \".findComment \" has been called for " + JSON.stringify(blog) + "");
    var emitter = this;
     Blog.find({$and:[{BlogTitle:blog.title},{BlogComments:{$in:[{name:blog.user,email:blog.email,message:blog.Comment}]}}]},function (err, blogs) {
     if (err) emitter.emit("error", err);
     else emitter.emit("data", blogs);
     });
}.toEmitter();

exports.saveNewComment = function (blog) {
    console.log("blog services \".saveNewComment \" has been called for " + JSON.stringify(blog) + "");
    var emitter = this;
     Blog.update({BlogTitle:blog.title},
     {$addToSet:{BlogComments:{$each:[{name:blog.user,email:blog.email,message:blog.Comment}]}}},
      function (err, blogs) {
     if (err) emitter.emit("error", err);
     else emitter.emit("data", blogs);
     });
}.toEmitter();


exports.searchBlog = function () {
    console.log("blog services \" search  \" has been called for ");
    var emitter = this;

    Blog.find({'BlogPublish':1}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });

}.toEmitter();

exports.getVisitorsBlog= function () {
    console.log("blog services \"visitors bloglist service\" has been called");

    var emitter = this;
    Blog.find({BlogPublish:1}, function (err, blogs) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", blogs);
    });
}.toEmitter();
*/
