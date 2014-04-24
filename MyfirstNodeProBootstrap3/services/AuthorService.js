exports.getAuthorObj = function (author, callback) {
    console.log("author services \"getAuthorObj\" has been called");
    var user =
    {
        AuthorSMId: "",
        AuthorName: "ajay",
        //Email
        email: "ajay@admin.com",
        enabled: true,
        roles: [' Author '],
        timestampCreated: +new Date(),
        timestampUpdated: +new Date()
    }

    if (author) {

        author.AuthorSMId = author.AuthorSMId || user.AuthorSMId,
            author.AuthorName = author.AuthorName || user.AuthorName,
            //Email
            author.email = author.email || user.email,
            author.enabled = author.enabled || true,
            author.roles = [' Author '],
            author.timestampCreated = author.timestampCreated || user.timestampCreated,
            author.timestampUpdated = author.timestampUpdated || user.timestampUpdated

    }

    else {
        log.info("new user created");

    }
    callback(author);

}

exports.createAuthor = function (author) {
    console.log("author services \"create \" has been called for >>  ", author);
    var emitter = this;
    var author = new Author(author);
    author.save(function (err, authors) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", authors);
    });
}.toEmitter();


exports.UpdateAuthor = function (Authorobj) {
    console.log("author services \"UpdateAuthor\" has been called for ", Authorobj);
    var emitter = this;

    Author.update({_id: Authorobj.id}, {AuthorName: Authorobj.name, email: Authorobj.email, Gender: Authorobj.Gender, rolles: Authorobj.Roles}, function (err, authors) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", authors);
    });
}.toEmitter();
exports.listUsers = function () {
    console.log("author services \"list \" has been called");
    var emitter = this;
    Author.find({}, function (err, authors) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", authors);
    });
}.toEmitter();

exports.findId = function (id) {
    console.log("author services \"findId\" has been called");
    console.log(id);
    var emitter = this;
    Author.find({"AuthorSMId": id.toString()}, function (err, authors) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", authors);
    });
}.toEmitter();


exports.getAuthorProfile = function (email) {
    console.log("author services \"getAuthorProfile\" has been called");
    console.log(email);
    var emitter = this;
    Author.find({email: email}, function (err, authors) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", authors);
    });
}.toEmitter();

exports.getAllAuthors = function (l) {
    console.log("author services \"getAllAuthors\" has been called");
    var emitter = this;
    Author.find({}, function (err, authors) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", authors);
    });
}.toEmitter();

exports.getAuthor = function (author) {
    console.log("author services \"getAuthor\" has been called");
    var emitter = this;
    Author.find({_id: author._id}, function (err, author) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", author);
    });
}.toEmitter();

exports.findSocialMediaId = function (id) {
    console.log("author services \"findSocialMediaId\" has been called for ", id);
    var emitter = this;
    Author.find({AuthorSMId: id}, function (err, data) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", data);
    });
}.toEmitter();


/*

 exports.findEmail = function (email) {
 console.log("author services \"findEmail\" has been called");
 console.log(email);
 var emitter = this;
 Author.find({"email":email}, function (err, authors) {
 if (err) emitter.emit("error", err);
 else emitter.emit("data", authors);
 });
 }.toEmitter();



 exports.publish=function(title)
 {
 console.log("author services \"publish\" has been called",JSON.stringify(title));
 var emitter = this;


 Blog.find({BlogTitle:title},function (err, blogs) {
 if (err) emitter.emit("error", err);
 else emitter.emit("data",blogs);

 });



 }.toEmitter()

 */
