function makeNotesArray() {
  return [
    {
      id: 1,
      note_name: 'test note 1',
      date_created: '2000-01-22T16:28:32.615Z',
      content: 'some tasty, delicious test content for your reading pleasure',
      folder_id: 1,
    },
    {
      id: 2,
      note_name: 'test note 2',
      date_created: '2001-01-22T16:28:32.615Z',
      content: 'some fire, cool test content for your reading pleasure',
      folder_id: 2,
    },
    {
      id: 3,
      note_name: 'test note 3',
      date_created: '2002-01-22T16:28:32.615Z',
      content: 'some righteous, mighty test content for your reading pleasure',
      folder_id: 3,
    },
    {
      id: 4,
      note_name: 'test note 4',
      date_created: '2003-01-22T16:28:32.615Z',
      content: 'some boring, lame test content for your reading pleasure',
      folder_id: 1,
    },
  ];
}

function makeMaliciousNote() {
  const maliciousNote = {
    id: 911,
    note_name: 'Bad hacker! <script>alert("xss");</script>',
    date_created: new Date().toISOString(),
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    folder_id: 2,
  };
  const expectedNote = {
    ...maliciousNote,
    note_name: 'Bad Hacker! &lt;script&gt;alert("xss");&lt;/script&gt;',
    note_name: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
}

module.exports = {
  makeNotesArray,
  makeMaliciousNote,
};
