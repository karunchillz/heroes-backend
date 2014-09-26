var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* Schema
**/
var TrackSchema = Schema ({
	victim: {},
	helpers: []	
});

mongoose.model('TrackModel', TrackSchema);