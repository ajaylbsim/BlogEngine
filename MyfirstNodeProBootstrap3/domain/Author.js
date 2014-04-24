/**
 *
 * Model User
 * This model defines the schema of the User Domain.
 *
 * This collection is intended to store all Users.
 *
 * */

var ObjectId = require('mongoose').Schema.ObjectId;

/*
 * Define the Schema of the collection (MongooseJS schema definition)
 * id property is implicit, no need to define.
 * */
exports.schema = {
    //socialMediaId of the user who is requesting access
    AuthorSMId:Array,

    //Name of the user who is requesting access
    AuthorName: String,

    //Date of Birth
    Dob:Date,
   //password
    password:String,
    //gender
    Gender:String,

    //Email
    email:{type:String,unique:true},

    //is the account enabled
    enabled: Boolean,

    //Roles given to this user. Specified by src/enum/Role.js enumeration
    roles: [],

    //timestamp of the time when the user was created
    timestampCreated: Number,

    //timestamp it was last updated
    timestampUpdated: Number

};

/*
 * Define the Indexes for this collection
 * */
exports.indexes = [
    {name: 1},
    {name: 1, age: 1}
];

/*
 * Define the static methods for this Domain object.
 * */
exports.static = {
    findByName: function (name, callback) {
        this.find({name: name}, callback);
    }
};

/*
 * the member functions are defined here for the document object.
 * */
exports.methods = {
    printName: function () {
        log.info("Name Is:", this.name);
    }
};