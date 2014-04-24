
var async = require("async");

/*
 * This is the start point for BootStrap. This method is triggered externally from app.js when the instance is loaded.
 * This is only called once when the instance spins up.
 * */
var ObjectId = require('mongoose').Types.ObjectId;
var id=new ObjectId(1)

exports.init = function () {
    log.info("Executing Bootstrap");

    switch (__appEnv) {
        case "development":
            bootstrapForDevelopment();
            break;
        case "test":
            bootstrapForTest();
            break;
        case "production":
            bootstrapForProduction();
            break;
        case "qa":
            bootstrapForQa();
            break;
        default:
            log.info("No Bootstrap for the Environment:", __appEnv);
    }
};

/*
 * Bootstrap execution for the env "development"
 * */
function bootstrapForDevelopment() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);
    tasks.push(createSuperAdminBlogIfDoesNotExist);
    tasks.push(createSuperAdminBlogIfDoesNotExist);
    tasks.push(createSuperAdminBlogIfDoesNotExist);
    tasks.push(createSuperAdminBlogIfDoesNotExist);

    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'development'");
    });
}

/*
 * Bootstrap execution for the env "production"
 * */
function bootstrapForProduction() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);

    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'production'");
    });
}

/*
 * Bootstrap execution for the env "test"
 * */
function bootstrapForTest() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);

    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'test'");
    });
}

/*
 * Bootstrap execution for the env "qa"
 * */
function bootstrapForQa() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);

    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'qa'");
    });
}


/***********************************************************************************************
 *
 * Individual task methods are described below.
 *
 ***********************************************************************************************/

/*
 * Create A super admin user if does not exist.
 * */
function createSuperAdminUserIfDoesNotExist(callback) {
    var hash=bcrypt.hashSync('admin');
    Author.findOne({ AuthorName: "admin"}, function (err, user) {
        if (err) log.error(err);
        else if (Boolean(user)) callback();
        else {
            new Author({
                _id:id,
                AuthorSMId:['A'],
                AuthorName: "admin",
                Dob:new Date('01/03/1986'),
                //password
                password:hash,
                //gender
                Gender:'Male',
                //Email
                email: "admin@admin.com",
                enabled: true,
                roles: [' userAdmin '],
                timestampCreated: +new Date(),
                timestampUpdated: +new Date()
            }).save(function (err, user) {
                    if (err) log.error(err);
                    else log.debug("Created Super Admin user: ", user);
                    callback();
                });
        }
    });
}
function createSuperAdminBlogIfDoesNotExist(callback) {
    Blog.findOne({ BlogTitle:"adminBlog"}, function (err, blog) {
        if (err) log.error(err);
        else if (Boolean(blog)) callback();
        else {
            new Blog({

//title of the blog
                BlogTitle:'adminBlog',
                //Name of the blog
                BlogContent: "#####hello my self admin has writt "+
                    "What is your greatest weakness? - Best Answe+rs"+
                    "How do you handle stress and pressure? - Best Answers"+
                        "What was it like working for your supervisor? - Best Answers"+
                        "What do you expect from a supervisor? - Best Answers"+
                        "Do you prefer to work independently or on a team? - Best Answers"+
                        "Do you work well with people? - Best Answers"+
                        "Give some examples of teamwork. - Best Answers"+
                        "Receptionist interview questions. - List of Questions",
                //author
                BlogAuthor:{
                    Id:id,
                    "name":"admin",
                    email:'admin@admin.com'
                },
                //boolean value blog published
                BlogPublish:0,
                BlogComments:[],
                BlogTags:["admin","adminBlog","startBlog","example"],
                BlogLikes:["admin","ajay"],
                timestampCreated: +new Date(),
                timestampUpdated: +new Date()
            }).save(function (err, blog) {
                    if (err) log.error(err);
                    else log.debug("Created Super Admin user: ", blog);
                    callback();
                });
        }
    });
}





