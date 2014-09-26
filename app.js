
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require("fs");
var mongoose = require('mongoose');


// To see whats going on inside

mongoose.connect('mongodb://testuser:testuser@127.0.0.1/heroes');
var models_path = './models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file)
});

var UserModel = mongoose.model('UserModel');

var gcm = require('./controllers/gcm');
var tracking = require('./controllers/track');



var app = express();
app.get('/initialnotify',gcm.initialNotify);
app.get('/gcmregistration',gcm.gcmRegistration);
app.get('/acknowledge',tracking.acknowledge);
app.get('/updateposition',tracking.getallpositions);
app.get('/getallpositions',tracking.getallpositions);

app.post('/initialnotify',gcm.initialNotify);
app.post('/gcmregistration',gcm.gcmRegistration);
app.post('/acknowledge',tracking.acknowledge);
app.post('/updateposition',tracking.getallpositions);
app.post('/getallpositions',tracking.getallpositions);

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});
