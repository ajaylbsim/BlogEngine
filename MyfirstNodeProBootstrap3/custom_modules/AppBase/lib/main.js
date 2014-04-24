var ConfigManager = require("./modules/ConfigManager");
var Logger = require("./modules/Logger");
var MongoDatabaseProvider = require("./modules/MongoDatabaseProvider");
var fs = require("fs");
var path = require("path");
require("colors");

//Populate the configurations by reading the AppConfig as well as the Config.json files. The environment is considered.
exports.initConfig = function (options) {
   new ConfigManager(options, function (config) {
        Object.defineProperty(global, '_config', {
            get: function () {
               // console.log(config);
                return config;
            }
        });
    });
};

//Initialize teh logger for the application. Consumer is teh method which will consume the produces logs.
exports.initLogger = function (consumer) {
    global.log = new Logger(consumer, _config.logger);
};

//Init all database Models
exports.initDomains = function (callback) {
    MongoDatabaseProvider.getDatabase(function (db) {
        Object.defineProperty(global, '_db', {
            get: function () {
                return db;
            }
        });
        fs.readdir(path.join(__appBaseDir, "domain"), function (err, list) {
            if (err) log.error(err);
            else {
                list.forEach(function (item) {
                    var name = item.toString().replace(/\.js$/, "");

                    var model = db.getDomain(name);
                    model.ensureAllManuallyDefinedSchemaIndexes();
                    Object.defineProperty(global, name, {
                        get: function () {
                            return model;
                        }
                    });
                });
            }
            callback();
        });
    });
};

//Inject all Singleton Services
exports.initServices = function () {
    try {
        var list = fs.readdirSync(path.join(__appBaseDir, "services"));
        list.forEach(function (item) {
            var name = item.toString().replace(/\.js$/, "");
            var service = require(path.join(__appBaseDir, "services", name));

            //log.info("caling list  -----------  ",service,name);


            Object.defineProperty(global, name, {
                get: function () {
                    return service;
                }
            });
        });
    } catch (err) {
        log.error(err);
    }
};

//Add a emitter transform for functions.
Function.prototype.toEmitter = function () {
    console.log("for each userservices is executing while services has been acquired to pass each function to new function whher original will be called  by emitter in nexttick");
    var origFunc = this;
    return function () {
        console.log("this is new function which is putting services function in nexttick");
        var args = arguments;
        var emitter = new process.EventEmitter();
        process.nextTick(function () {
            origFunc.apply(emitter, args);
        });
        return emitter;
    }
};




exports.initSocialLoginStrategy=function()
{
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google').Strategy;
    var GitHubStrategy = require('passport-github').Strategy;
    var TwitterStrategy = require('passport-twitter').Strategy;
    //google
    _passport.use(new GoogleStrategy({
            returnURL: 'http://localhost:3001/google/callback',
            realm: 'http://localhost:3001/'
        },
        function(url,identifier, done) {
           done(null,identifier);
            console.log('--------------------',arguments)
           // User.findByOpenID({ openId: identifier }, function (err, user) {

           // });
        }
    ));
//github
    _passport.use(new GitHubStrategy({
            clientID:'7a11fb5700640154166d',
            clientSecret: 'be25a256d964e857d2a0d561a77612b13efeb1d7',
            callbackURL: "http://127.0.0.1:3001/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            log.info("check======================",profile);
            process.nextTick(function(){done(null,profile);});
        }
    ));

//Twitterstrategy
   _passport.use(new TwitterStrategy({
            consumerKey: 'Oms3suXrnDBn9ll6jFrw',
            consumerSecret:'o5NaFIFuoN9GZUI3OI9gG06tYp7Bb7PE3lL88pJXFvM',
            callbackURL: 'http://127.0.0.1:3001/auth/twitter/callback'
        },
        function(token, tokenSecret, profile, done) {
            process.nextTick(function(){done(null,profile);})

        }));
    //facebook strategy
    log.info("fb init called");
    _passport.use(new FacebookStrategy({
            clientID: '712435645446680',
            clientSecret:'2aa9bb9fee99478bbed4bb98dbc0ab73',
            callbackURL:'http://localhost:3001/fb_loginPassport/facebook/callback'
        },
        function(accessTokenN, refreshToken, profile, done) {
  console.log("------------------------------------",profile);

            accessToken=accessTokenN;
            process.nextTick(function(){done(null,profile);})
        }));

    _passport.serializeUser(function(user, done) {
        done(null, user);
    });

    _passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

exports.doFilter=function()
    {
        var ejs=require('ejs');
        ejs.filters.add=function(obj,text){


            return obj.split("").join(text);

        }



    }



    /*****************************
     social media login end
     *****************************/


}





















