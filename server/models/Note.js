const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
	fullName: {
		type: String,
		required: true,
		trim: true,
	},
	phone: {
		type: String,
		required: true,
		trim: true,
	},
	problemDescription: {
		type: String,
		required: false,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
