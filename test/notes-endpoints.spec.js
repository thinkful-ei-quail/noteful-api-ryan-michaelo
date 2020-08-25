const knex = require('knex');
const app = require('../src/app');

const { makeNotesArray, makeMaliciousNote } = require('./notes.fixtures');
const { makeFoldersArray } = require('./folders.fixtures');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Notes Endpoints', function () {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE notes, folders RESTART IDENTITY CASCADE')
  );

  afterEach('clean the table', () =>
    db.raw('TRUNCATE notes, folders RESTART IDENTITY CASCADE')
  );

  describe('GET /notes', () => {
    context('Given no notes', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/notes').expect(200, []);
      });
    });

    context('Given there are notes in the database', () => {
      const testNotes = makeNotesArray();
      const testFolders = makeFoldersArray();

      beforeEach('insert notes', () => {
        return db
          .into('folders')
          .insert(testFolders)
          .then(() => {
            return db.into('notes').insert(testNotes);
          });
      });

      it('responds with 200 and all the articles', () => {
        return supertest(app).get('/api/notes').expect(200, testNotes);
      });
    });

    context('Given an XSS attack note', () => {
      const testFolders = makeFoldersArray();
      const { maliciousNote, expectedNote } = makeMaliciousNote();

      beforeEach('insert malicious note', () => {
        return db
          .into('folders')
          .insert(testFolders)
          .then(() => {
            return db.into('notes').insert(maliciousNote);
          });
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/notes`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].note_name).to.eql(expectedNote.note_name);
            expect(res.body[0].content).to.eql(expectedNote.content);
          });
      });
    });
  });

  describe('GET /api/notes/:notes_id', () => {
    context('Given no notes', () => {
      it('responds with 404', () => {
        const noteId = 12334;
        return supertest(app)
          .get(`/api/notes/${noteId}`)
          .expect(404, { error: { message: 'Note does not exist' } });
      });
    });
  });
});
