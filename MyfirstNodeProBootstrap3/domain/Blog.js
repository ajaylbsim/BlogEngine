/**
 *
 * Model blog
 * This model defines the schema of the blog Domain.
 *
 * This collection is intended to store all blog.
 *
 * */

var ObjectId = require('mongoose').Schema.ObjectId;

/*
 * Define the Schema of the collection (MongooseJS schema definition)
 * id property is implicit, no need to define.
 * */
exports.schema = {

    //title of the blog
    BlogTitle:{type:String,unique:true},
    //Name of the blog
    BlogContent: String,
    //author
    BlogAuthor:Object,
    //commments on the blog
    BlogComments:Array,
    //Tagss on the blog
    BlogTags:Array,
    //Likes on the blog
    BlogLikes:Array,
    //boolean value blog published
    BlogPublish:Number,
    //timestamp of the time when the user was created
    timestampCreated: Number,

    //timestamp it was last updated
    timestampUpdated: Number

};

/*
 * Define the Indexes for this collection
 * */
exports.indexes = [
    {BlogName: 1},
    {blogName: 1,BlogAuthor: 1}
];

/*
 * Define the static methods for this Domain object.
 * */
exports.static = {
    findByName: function (name, callback) {
        this.find({BlogName: name}, callback);
    }
};

/*
 * the member functions are defined here for the document object.
 * */
exports.methods = {
    printName: function () {
        log.info("Name Is:", this.BlogName);
    }
};