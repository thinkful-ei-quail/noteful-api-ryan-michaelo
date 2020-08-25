const path = require('path');
const express = require('express');
const xss = require('xss');
const folderService = require('./folders-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializerFolder = folder => ({
  id: folder.id,
  folder_name: xss(folder.folder_name)
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
    folderService.getAllfolders(
      req.app.get('db')
    )
      .then(folders => {
        res.json(folders.map(serializerFolder));
      })
      .catch(next);
  });

module.exports = foldersRouter;