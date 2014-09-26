var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* Schema
**/
var UserSchema = Schema ({
	name: String,
	firstName: String,
	lastName: String,
	email: String,
	username: String,
	facebook_id: String,
	gcm_reg_id: String,
	emergency_contacts: [],
	facebook: {}	
});

mongoose.model('UserModel', UserSchema);