require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');

//const port = 3000;
const port = process.env.HTTP_PORT

const playlistController = require('./app/controller/playlistController');

app.use('/', playlistController);

// error handler
app.use((err, req, res, next) => {
    if (err) {
      res.status(500).send({
        error: err,
      });
      return;
    }
  
    next();
  });

app.listen(port, () => console.log(`Couchify Server listening on port ${port}!`));