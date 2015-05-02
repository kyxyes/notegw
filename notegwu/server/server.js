global.config = require('./config.js');
Evernote = require('evernote').Evernote;
var util = require('util');
var bodyParser = require('body-parser');
var path = require('path');
var config = global.config; 
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express.createServer();

var uesrsSchema = new mongoose.Schema({
   username: String,
   password: String,
   authToken: String
});

var notesSchema = new mongoose.Schema({
    title: String,
    content: String,
    guid: String,
    updateDate: Date,
    createDate: Date,
    isSync: Boolean,
    tags:[String]
});

var Notesdb = mongoose.model('Notesdb', notesSchema);
mongoose.connect(config.db);

var evernote = new Evernote.Client({
	consumerKey: config.evernoteConsumerKey,
	consumerSecret: config.evernoteConsumerSecret,
	sandbox: config.evernoteUsedSandbox
});
var userStore = evernote.getUserStore();
var noteStore = evernote.getNoteStore();
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

//================================================
//session/session id
//===============================================

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.cookieParser()); 
	app.use(express.bodyParser());
	
	//Use static files
	app.use("/website", express.static(__dirname + '/website'));
	
	//Use session
	app.use(express.session(
		{ secret: "EverestJS" }
	));
});

app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  }
});


app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//==========================================
//Authentications
//==========================================
app.all('/authentication', function(req, res){
	 // console.log('Access-Control-Allow-Origin2')
	var evernote_callback = config.serverUrl + '/authentication/callback';
	evernote.getRequestToken(evernote_callback, function(error, oauthToken, oauthTokenSecret, results){
			if (error) return res.send("Error getting OAuth request token : " + util.inspect(error), 500);
	req.session.oauthRequestToken = oauthToken;
	res.redirect(evernote.oAuthRedirectUrl(oauthToken));		
	});
});

//this is after the login page and click the re-authorize button
app.all('/authentication/callback', function(req, res){
	//console.log('Access-Control-Allow-Origin3');

	var evernote_callback = config.serverUrl +'/evernote/authentication/callback';
		
  evernote.oAuth(evernote_callback).getOAuthAccessToken( req.session.oauthRequestToken, 
		req.session.oauthRequestTokenSecret, 
		req.query.oauth_verifier, 
		function(err, authToken, accessTokenSecret, results) {
            var client = new Evernote.Client({token:authToken});
            var noteStore = client.getNoteStore();
            noteStore.listNotebooks(authToken, function(err, notebooks) {
            for(var i in notebooks)
            console.log("Notebooks "+notebooks[i].name);
            });
			if (err) return res.send("Error getting accessToken", 500);
			//  evernote.getUser(authToken, function(err, edamUser) {

			// 	if (err) return res.send("Error getting userInfo", 500);

			 req.session.authToken = authToken;
			// 	req.session.user = edamUser;
			 res.redirect('#/mynote');
			// });
  });
});

//====================
// get username
//====================
app.get('/getuser',function(req, res){
    var client = new Evernote.Client({token:req.session.authToken});
    var userStore = client.getUserStore();
    var authToken = req.session.authToken;
    userStore.getUser(authToken,function(err,user){
        res.send(user);
    });

});

//====================
//logout
//======================

app.get('/logout', function(req, res, next) {
    req.session.authToken = null;
    res.send(200);
});

app.get('/getmynotes', function(req, res){

     console.log('hi, this is my notes');
     var client = new Evernote.Client({token:req.session.authToken});
     var noteStore = client.getNoteStore();
     var notebook=noteStore.getDefaultNotebook(function (err, notebook){
    //create filter for findNotesMetadata
    filter = new Evernote.NoteFilter();
    //set the notebook guid filter to the GUID of the default notebook
    filter.notebookGuid = notebook.guid;
    //create a new result spec for findNotesMetadata
    resultSpec = new Evernote.NotesMetadataResultSpec();
    //set the result spec to include titles
    resultSpec.includeTitle=true;
    resultSpec.includeTags=true;
    resultSpec.includeUpdated=true;
    resultSpec.includeCreated=true;
    resultSpec.includeTagGuids=true;
    //call findNotesMetadata on the note store
    noteStore.findNotesMetadata(filter, 0, 100, resultSpec, function(err, notesMeta) {
        if (err) {
          console.error('err',err);
        }
        else {
          res.send(notesMeta.notes);


        }}); 



  });
});

//==========================================
//get the detail of mynode
//==========================================
app.get('/getmynotedetail/:guid', function(req, res){
    console.log('hi, this is mynodedetail');
    var authToken = req.session.authToken;
    var client = new Evernote.Client({token:authToken});
    var noteStore = client.getNoteStore();
    var guid = req.params.guid;
    noteStore.getNote(authToken, guid, true, true, true, true, function(error, note){
      //console.log(notecontent.content);
      //  console.log(notecontent.tags);
      res.send(note);
    });
    //noteStore.getNoteContent(authToken,guid,function(error, content){
    //    console.log(content.content);
    //});
});


//==========================================
//get tags of mynode
//==========================================
app.get('/gettags/:guid', function(req,res){
    var authToken = req.session.authToken;  //这个一定要有（包括下面三行）
    var client = new Evernote.Client({token:authToken});
    var noteStore = client.getNoteStore();
    var authToken = req.session.authToken;
    var guid = req.params.guid;
    noteStore.getNoteTagNames(authToken, guid, function(err, tags){
        console.log('hi, this is my tags :'+tags);
        res.send(tags);
    });
});

//==========================================
//isSync?/store this note
//==========================================
app.get('/isSync/:guid', function(req,res){
    var guid = req.params.guid;
    Notesdb.findOne({guid:guid},function(err, note){
        if (err) return done(err);
        else {
            var isSync;
            if(note==null)
                isSync = false;
            else{
                isSync = note.isSync;
            }
            res.send(isSync);
        }
    });
});

//==========================================
//dissync/store this note
//==========================================
app.post('/dissync/:guid', function(req,res){
    console.log('hi, this is dissync');
    var guid = req.params.guid;
    Notesdb.findOne({guid:guid},function(err,note){
        if(err) throw err;
        else
            note.isSync = false;
        note.save(function(err){
            if(err) throw err;
            res.send(200);
        });
    })
});


//==========================================
//sync/store this note
//==========================================
app.post('/sync/:guid', function(req,res){
    console.log('hi, this is sync');
    var guid = req.params.guid;
    Notesdb.findOne({guid:guid},function(err,note){
      if(note!=null){  //if the note going to sync exited in the database than
          note.isSync = true; //sign this to be true
          note.save(function(err){
              if(err) throw err;
              res.send(200);
          });
      }else{           //if the note is note in db then store it
          var authToken = req.session.authToken;
          var client = new Evernote.Client({token:authToken});
          var noteStore = client.getNoteStore();
          var guid = req.params.guid;
          noteStore.getNote(authToken, guid, true, true, true, true, function(error, note){
              //save/sync this note to db
              var title = note.title;
              var content = note.content;
              var createDate = note.created;
              var updateDate = note.updated;
              var isSync = true;
              //var notesdb = new Notesdb({
              //    "title": title,
              //    "content":content,
              //    "createDate":createDate,
              //    "guid":guid,
              //    "updateDate":updateDate,
              //    "isSync":isSync
              //});
              noteStore.getNoteTagNames(authToken, guid, function(err, tags){
                  var notesdb = new Notesdb({
                      "title": title,
                      "content":content,
                      "createDate":createDate,
                      "guid":guid,
                      "updateDate":updateDate,
                      "isSync":isSync,
                      "tags":tags
                  });
                  notesdb.save(function(err){
                      if(err) console.log("save err");
                      else console.log("save ok");
                  });
              });
              //notesdb.save(function(err){
              //    if(err) console.log("save err");
              //    else console.log("save ok");
              //});
          });

      }

    });


});

//==========================================
//browser all notes
//==========================================
app.get('/allNotes', function(req, res){
    console.log('hi, this is browserAllNotes');
    //find in notegw db note
    var query = Notesdb.find({isSync:true});
    //if there is query condition
    query.exec(function(err, notes){
        if(err) throw err;
        else res.send(notes);
    });
});

//==========================================
//browser detail of shared note
//==========================================
app.get('/getSharedNotesDetail/:guid', function(req,res){
    var guid = req.params.guid;
    console.log('hi, here is shared note detail'+guid);
    var query = Notesdb.find({guid:guid});
    query.exec(function(err,notes){
        if(err) throw err;
        else res.send(notes);
    });
});

app.listen(config.serverPort, function(){
	  console.log("Node app is running at localhost:" + config.serverPort);
});

