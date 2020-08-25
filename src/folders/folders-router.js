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
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    for (const [key, value] of Object.entries(newFolder)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    folderService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializerFolder(folder));
      })
      .catch(next);
  });

foldersRouter
  .route('/:id')
  .all((req, res, next) => {
    folderService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({ error: { message: 'Folder doesn\'t exist' } });
        }

        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializerFolder(res.folder));
  })
  .delete((req, res, next) => {
    folderService.deleteFolder(
      req.app.get('db'),
      req.params.id
    )
      .then(() => { res.status(204).end(); })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const updatedFolder = { folder_name };


    const numberOfValues = Object.values(updatedFolder).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain new folder name'
        }
      });
    }

    folderService.updateFolder(
      req.app.get('db'),
      req.params.id,
      updatedFolder
    )
      .then(numOfRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });


module.exports = foldersRouter;