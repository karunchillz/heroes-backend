var mongoose = require('mongoose'),
	UserModel = mongoose.model('UserModel'),
	TrackModel = mongoose.model('TrackModel');

function insertHelperTrack(latitude,longitude,user,trackId){
	var helperTracks = [];
	var helperTrack = '{user:'+user+',position:{"lat":'+latitude+',"long":'+longitude+'}}';
	var query = '{_id : trackId}';

	console.log("inersting...");
	TrackModel.findOne(query,function(err,track){
		console.log(track);
		if(track){
			helperTracks = track.helpers;
			helperTracks.push(helperTrack);
			console.log("helper="+helperTracks);
			track.save(function(err){
				if(err)
					console.log(err);
			});
			console.log("track="+track);
		}
	});
}

function updateHelperTrack(latitude,longitude,user,trackId){
	var helperTracks = [];
	var newHelperTrack = '{user:'+user+',position:{"lat":'+latitude+',"long":'+longitude+'}}';
	var query = '{_id : trackId}';

	TrackModel.findOne(query,function(err,track){
		if(track){
			helperTracks = track.helpers;
			var index = 0;
			helperTracks.forEach(function(arrayItem){
				if(arrayItem.user == user){
					helperTracks.splice(index,1);
				}
				index++;
			});
			helperTracks.push(newhelperTrack);
			track.save(function(err){
				if(err)
					console.log(err);
			});
		}
	});
}

function getAllHelperTracks(trackId,res){
	var projection = 'helpers';
	//var helperTracks = [];
	console.log("querying trackid="+trackId);
    var query = '{_id : trackId}';
	TrackModel.findOne(query,function(err,tracks){
		if(!err){
			//tracks.forEach(function(track){
				console.log("karun="+tracks.helpers);
				res.send(JSON.stringify(tracks));
				//return tracks.helpers;

				//helperTracks.push(tracks.helpers);
			//});
		}
		console.log(err);
	});

	//return helperTracks
}

/**
*	ACKNOWLEDGE HELP SIGNAL
**/
exports.acknowledge = function(req,res){
	var latitude = req.param('latitude');
	var longitude = req.param('longitude');
	var user = req.param('user');
	var trackId = req.param('trackId');

	insertHelperTrack(latitude,longitude,user,trackId);
	var success="{('success:success')}";
	res.send(success);
};

/**
*	UPDATE CURRENT POSITION
**/
exports.updateposition = function(req,res){
	var latitude = req.param('latitude');
	var longitude = req.param('longitude');
	var user = req.param('user');
	var trackId = req.param('trackId');

	updateHelperTrack(latitude,longitude,user,trackId);
};

/**
*	GET ALL POSITIONS
**/
exports.getallpositions = function(req,res){
	var trackId = req.param('trackId');

	var tracks = getAllHelperTracks(trackId,res);
	//console.log("json stringify="+tracks);
	

};