var passport = require('passport');
var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var bcrypt=require('bcrypt-nodejs');
var AppBase = require('./custom_modules/AppBase');
var app = express();
global.__appBaseDir = __dirname;
global.accessToken='';
//Get the Environment
global.__appEnv = process.env.NODE_ENV || "development";
console.log("Initializing with environment:", __appEnv);
//Initialize the config. Now the configurations will be available in _config global getter.
AppBase.initConfig({
    postProcess: function (config) {
        //Check if port is defined in environment then set that one.
        config.port = process.env.PORT || config.port;
        //More overrides
        return config;
    }});
//Initialize the Logger. this is available in the "log" global object.
var logOnStdOut = _config.logger.stdout.enabled;
AppBase.initLogger(function (message, level) {
    if (logOnStdOut) {
        //Print on console the fully formatted message
        console.log(message.fullyFormattedMessage, level);
    }
});
//Initialize the Express middlewares
app.set('port', _config.port);
app.set('views', path.join(__dirname, 'views'));   //Static mapping
app.set('view engine', 'ejs');
var routes = require('./routes');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({"secret": "ajaySecret"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next)
{
    console.log("hello Jee !!!!!!!!!!!");
    next();
});


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger("dev"));

app.configure('development', function () {
    express.errorHandler.title = _config.appName;
    app.use(express.errorHandler());
});

//Export the bcrypt via getter in global
global.__defineGetter__("bcrypt", function () {
    return bcrypt;
});

//Export the app via getter in global
global.__defineGetter__("_app", function () {
    return app;
});

//Export the AppBase js via getter in global
global.__defineGetter__("_AppBase", function () {
    return AppBase;
});

//Export the passport via getter in global
global.__defineGetter__("_passport", function () {
    return passport;
});


AppBase.initDomains(function () {

    require("./conf/Bootstrap").init();
    AppBase.initServices();
})
require("./conf/URLMappings");
AppBase.initSocialLoginStrategy();
AppBase.doFilter();


var server = http.createServer(app).listen(app.get('port'), function () {
    log.info('Server listening on', _config.serverUrl);
});

