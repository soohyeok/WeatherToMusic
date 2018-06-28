const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, 'name of the user']
	},
	location: {
		type: String
	},
	refreshToken: {
		type: String
	},
	accessToken: {
		type: String
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User