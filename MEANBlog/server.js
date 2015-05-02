var express = require('express');
var bodyParser = require('body-parser');
var app = express.createServer();
var path = require('path');
var mongoose = require('mongoose');


var postSchema = mongoose.Schema({
    body:String,
    permalink:String,
    author:String,
    title:String,
    tags:[String],
    comments:{type:String}
});

var Post = mongoose.model('Post',postSchema);
mongoose.connect('localhost:27017/blog');

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


app.use(express.static(path.join(__dirname, 'client'))); //***direct to index.html in client file

//=========displayMainPagePosts=======
app.get('/displayMainPagePosts', function(req,res){
    var query = Post.find().limit(10);
    query.exec(function(err,posts){
        if(err) throw err;
        res.send(posts);
    });
});

app.listen('3031',function(){
    console.log('now is running at localhost:3031')
});