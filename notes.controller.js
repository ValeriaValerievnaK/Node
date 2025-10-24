const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);

  console.log(chalk.green.inverse("Node was added!"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
  const notes = await getNotes();

  console.log(chalk.bgBlue("Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.blue(note.id, note.title));
  });
}

async function removeNotes(id) {
  const notes = await getNotes();
  const filteredNotes = notes.filter((note) => note.id !== id);

  if (notes.length === filteredNotes.length) {
    console.log(chalk.bgRed(`Note with id ${id} not found`));
    return;
  }

  await saveNotes(filteredNotes);
  console.log(chalk.green.inverse(`Note with id ${id} was removed!`));
}

async function updateNote(id, title) {
  const notes = await getNotes();
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    console.log(chalk.bgRed(`Note with id ${id} not found`));
    return;
  }

  notes[noteIndex].title = title;

  await saveNotes(notes);
  console.log(chalk.green.inverse(`Note with id ${id} was updated!`));
}

module.exports = {
  addNote,
  getNotes,
  removeNotes,
  updateNote,
};
