exports.home = function (req, res) {

   //res.render('markEditor', {data: {blog: null, author: {}}})

  //res.render('login', {})
  res.render('index', {message:""})
};
exports.angular = function (req, res) {
    res.render('index', {})
};


exports.fail = function (req, res) {
    res.render('fail', {})
};

exports.viewBlog = function (req, res) {


    var blog = new Blog();
    blog.BlogContent = "  my first  Blog on NodeJS ";
    blog.BlogTitle = "A blog on Node"
    blog.BlogAuthor = {
        "username": "Ajay Mishra",
        "age": "23",
        "email": "Ajay Mishra@CreatedByApplication.com"

    };


    res.render('viewBlog', {data:{blog: blog,author:blog.BlogAuthor}})
};


exports.createBlog = function (req, res) {


var author={"img":"ajay.JPG"}

    res.render('markEditor',{data:{blog:null,author:{}}})
};

exports.visitorsBlog = function (req, res) {
     console.log("get request for visitors blog");
    res.render('viewBlog',{});
};

exports.verification = function (req, res) {


console.log("get request received for verification",req.query);
console.log("get request received for verification",req.query.query);
//console.log("get request received for verification",req);

    if(bcrypt.compareSync('secret',req.query.query))
    {
        console.log("=-------session is being created------");
       // req.session.user={}
       // req.session.user._id= users[0]._id;
       // req.session.user.email= users[0].email;
        res.render('account', {})

    }
    else
    {
        console.log("password  not matched>>>>>>>>>>>>>>>>>");
        res.render('index', {message:"verfication failed"})

    }


    res.render('account',{})

};


    exports.search = function (req, res) {
    console.log("get request for search blog",req.body);
    //res.render('viewBlog',{});
      };







exports.search = function (req, res) {

    var ResultData=[];
    BlogServices.searchBlog()
        .on("error", function (err) {
            log.error(err);
            res.end(JSON.stringify({error: err.message}, null, 4));
        })
        .on("data", function (result) {

           result.forEach(function(blog)
           {
               var match='';
               var arr=blog.BlogTitle.split(" ");
               arr.forEach(function(ele){
                   match=ele.toLowerCase()==req.body.title.toLowerCase()

                   if(match)
                   {
                    ResultData.push(blog);
                    match=false;
                   }

               })
         });
            console.log("total blogs matched are ", ResultData.length);
            res.send( ResultData);

        });
};