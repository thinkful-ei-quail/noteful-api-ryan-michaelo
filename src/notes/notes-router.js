const express = require('express');
const path = require('path');
const xss = require('xss');

const notesRouter = express.Router();
const jsonParser = express.json();

const NotesService = require('./notes-service');

const serializeNote = (note) => ({
  id: note.id,
  note_name: xss(note.note_name),
  date_created: note.date_created,
  content: xss(note.content),
  folder_id: note.folder_id,
});

notesRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  NotesService.getAllNotes(knexInstance)
    .then((notes) => {
      res.json(notes.map(serializeNote));
    })
    .catch(next);
});

module.exports = notesRouter;
