var mongoose = require('mongoose'),
	UserModel = mongoose.model('UserModel'),
	TrackModel = mongoose.model('TrackModel');

function insertHelperTrack(latitude,longitude,user,trackId){
	var helperTracks = [];
	var helperTrack = '{user:'+user+',position:{"lat":'+latitude+',"long":'+longitude+'}}';
	var query = '{_id : trackId}';

	TrackModel.findOne(query,function(err,track){
		if(track){
			helperTracks = track.helpers;
			helperTracks.push(helperTrack);
			track.save(function(err){
				if(err)
					console.log(err);
			});
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

function getAllHelperTracks(trackId){
	var projection = 'helpers';
	var helperTracks = [];

	TrackModel.find(projection,function(err,tracks){
		if(!err){
			tracks.forEach(function(track){
				helperTracks.push(track.helpers);
			});
		}
	});

	return helperTracks
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

	var tracks = getAllTracks(trackId);
	res.send(JSON.stringify(tracks));

};