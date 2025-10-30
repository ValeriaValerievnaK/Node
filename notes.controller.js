const chalk = require("chalk");
const Note = require("./models/Note");

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function addNote(title) {
  await Note.create({ title });

  console.log(chalk.green.inverse("Node was added!"));
}

async function getNotes() {
  const notes = await Note.find();
  return notes;
}

async function removeNotes(id) {
  await Note.deleteOne({ _id: id });
  console.log(chalk.green.inverse(`Note with id ${id} was removed!`));
}

async function updateNote(noteData) {
  await Note.updateOne({ _id: noteData.id }, { title: noteData.title });
  console.log(chalk.green.inverse(`Note with id ${noteData.id} was updated!`));
}

module.exports = {
  addNote,
  getNotes,
  removeNotes,
  updateNote,
};
