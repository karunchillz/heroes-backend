var gcm = require('node-gcm');
var message = new gcm.Message();
var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel');
var TrackModel = mongoose.model('TrackModel');
var serverKey = "";
var sender = new gcm.Sender(serverKey);

function sendSOSMessage(user,latitude,longitude,trackId){
	var gcmregids = [];
	UserModel.find({},'gcm_reg_id',function(err, data){
		console.log(data);
		if(data){
			
			for(var i=0;i<data.length;i++){
				gcmregids.push(data[i].gcm_reg_id);
			}

			console.log(gcmregids);

			message.addData('message',"Location:"+latitude+","+longitude+"-Track Id:"+trackId);
			message.addData('title','HELP ME');
			message.addData('msgcnt','3'); // Shows up in the notification in the status bar
			message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
			//message.delayWhileIdle = true; //Default is false
			message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
 
			sender.send(message, gcmregids, 2, function (result) {
	    	if(result){
		    	console.log('Result',result);
		    }
		    return result;
			});	

		}
	});

}


/**
*	SAVE USER'S GCM Registration ID
**/
exports.gcmRegistration = function(req,res){
	var user = req.param('user');
	var gcm_reg_id = req.param('regid');
	var query = {email: user};
	var update = { gcm_reg_id: gcm_reg_id };
	console.log("user",user);
	console.log("regid",gcm_reg_id);
	if(user != null & gcm_reg_id != null){
		UserModel.findOneAndUpdate(query, update,function(err,user){
			if (err)
				res.send('not saved');
		});		
		res.send('saved');
	}
	else{
		res.send('not saved');
	}	
};



/**
*	SAVE THE SOS SIGNAL IN TRACK
**/
exports.initialNotify = function(req,res){
	console.log("Inside Initial notify !!");
	var latitude = req.param('latitude');
	var longitude = req.param('longitude');
	var user = req.param('user');
	//var type = req.param('type');
	var result = null;

	var tracking = new TrackModel({victim: {username: user,longitude: longitude,latitude: latitude}});
	tracking.save(function (err,track) {
  		if(err) {
  			console.log('Save Error');
  			result = err;
  		}
  		if(track){
  			console.log('Save Success');
  			//if(type == 'sos'){
  				result = sendSOSMessage(user,latitude,longitude,track._id);
  				console.log(track._id);
  			//}
  			//else if(type == 'trackme'){
  			//	result = sendTrackMeMessage(user,latitude,longitude,track._id);
  			//}
  		}
	});

	res.send(result);

};
