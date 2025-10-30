const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const {
  addNote,
  getNotes,
  removeNotes,
  updateNote,
} = require("./notes.controller");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      created: true,
      error: false,
    });
  } catch (e) {
    console.log("Creation error", e);

    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      created: false,
      error: true,
    });
  }
});

app.delete("/:id", async (req, res) => {
  await removeNotes(req.params.id);

  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

app.put("/:id", async (req, res) => {
  await updateNote({ id: req.params.id, title: req.body.title });

  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

mongoose
  .connect("mongodb://user:mongopass@localhost:27017/notes?authSource=admin")
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been stsrted on port ${port}... `));
    });
  });
