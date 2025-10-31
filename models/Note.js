const mongoose = require("mongoose");

const NoteShema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model("Note", NoteShema);

module.exports = Note;
