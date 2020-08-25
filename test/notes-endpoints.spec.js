const knex = require('knex');
const app = require('../src/app');

const { makeNotesArray, makeMaliciousNote } = require('./notes.fixtures');
const { makeFoldersArray } = require('./folders.fixtures');
const supertest = require('supertest');

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
  });
});
