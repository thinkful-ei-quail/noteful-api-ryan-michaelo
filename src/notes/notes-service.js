const NotesService = {
  getAllNotes(knex) {
    // return Promise.resolve('all the articles');
    return knex.select('*').from('notes');
  },
  insertNote(knex, newNote) {
    // return Promise.resolve({});
    return knex
      .insert(newNote)
      .into('notes')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from('notes').select('*').where('id', id).first();
  },
  deleteNote(knex, id) {
    return knex('notes').where({ id }).delete();
  },
  updateNote(knex, id, newNoteField) {
    return knex('notes').where({ id }).update(newNoteField);
  },
};

module.exports = NotesService;
