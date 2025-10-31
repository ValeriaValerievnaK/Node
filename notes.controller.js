const chalk = require("chalk");
const Note = require("./models/Note");

async function addNote(title, owner) {
  await Note.create({ title, owner });

  console.log(chalk.green.inverse("Node was added!"));
}

async function getNotes() {
  const notes = await Note.find();
  return notes;
}

async function removeNotes(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner });

  if (result.matchedCount === 0) {
    throw new Error("No note to delete");
  }

  console.log(chalk.green.inverse(`Note with id ${id} was removed!`));
}

async function updateNote(noteData, owner) {
  const result = await Note.updateOne(
    { _id: noteData.id, owner },
    { title: noteData.title }
  );

  if (result.matchedCount === 0) {
    throw new Error("No note to edit");
  }

  console.log(chalk.green.inverse(`Note with id ${noteData.id} was updated!`));
}

module.exports = {
  addNote,
  getNotes,
  removeNotes,
  updateNote,
};
