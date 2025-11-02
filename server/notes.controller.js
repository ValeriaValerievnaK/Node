const chalk = require('chalk');
const Note = require('./models/Note');

async function addNote(fullName, phone, problemDescription) {
	await Note.create({ fullName, phone, problemDescription });

	console.log(chalk.green.inverse('Заметка добавленна!'));
}

async function getNotes() {
	const notes = await Note.find();
	return notes;
}

module.exports = {
	addNote,
	getNotes,
};
