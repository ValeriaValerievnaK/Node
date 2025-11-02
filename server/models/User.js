const mongoose = require('mongoose');

const UserShema = mongoose.Schema({
	login: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const User = mongoose.model('User', UserShema);

module.exports = User;
