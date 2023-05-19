const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const playlistRepository = require('../repository/playlistRepository');
const RepositoryError = require('../exceptions/repositoryError');

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/playlist', function (req, res) {
  res.send('getting list of playlists')
})

app.get('/playlist/:playlistId', async function (req, res) {
  const playlistId = req.params.playlistId;

  console.debug(`getting playlist for key: ${playlistId}`);

  // Probably should try/catch and return a proper error code at this level
  try {
    const playlist = await playlistRepository.findById(playlistId);
    res.send(playlist);

  } catch (error) {
    if (error instanceof RepositoryError) {
      res.statusCode = error.status;
      res.send(error.message);
    } else {
      res.statusCode = 400;
      res.send("Something went wrong with the request");
    }
  }
})

app.post('/playlist', async function (req, res) {
  const newPlaylist = req.body;
  console.debug(`creating playlist for ID: ${newPlaylist.id}`);
  baseUrl = req.url;
  console.debug(`Base URL= ${baseUrl}`);
  try {
    key = await playlistRepository.create(newPlaylist);
    res.location(  baseUrl + '/' + key)
    res.statusCode = 201; // Created
    res.send();
  } catch (error) {
    if (error instanceof RepositoryError) {
      res.statusCode = error.status;
      res.send(error.message);
    } else {
      res.statusCode = 400;
      res.send("Something went wrong with the request");
    }
  }


})

app.delete('/playlist/:playlistKey', async function (req, res) {
  const key = req.params.playlistKey;

  console.debug(`deleting playlist for key: ${key}`);

  try {
    await playlistRepository.remove(key);
    res.statusCode = 204; // No Content
    res.send();

  } catch (error) {
    if (error instanceof RepositoryError) {
      res.statusCode = error.status;
      res.send(error.message);
    } else {
      res.statusCode = 400;
      res.send("Something went wrong with the request");
    }
  }
});

app.put('/playlist/:playlistKey', async function (req, res) {
  const key = req.params.playlistKey;
  const playlist = req.body;
  console.debug(`updating playlist for key: ${key}`);

  try {
    const updatedPlaylist = await playlistRepository.update(key, playlist);
    res.statusCode = 200; // Ok
    res.send(updatedPlaylist);

  } catch (error) {
    if (error instanceof RepositoryError) {
      res.statusCode = error.status;
      res.send(error.message);
    } else {
      console.error(error);
      res.statusCode = 400;
      res.send("Something went wrong with the request");
    }
  }
});

app.get('/playlists/:username', async function (req, res) {

  try {
    const matchingPlaylists = await playlistRepository.findPlaylistsByUsername(req.params.username);
    res.statusCode = 200; // ok
    res.send(matchingPlaylists);

  } catch (error) {
    if (error instanceof RepositoryError) {
      res.statusCode = error.status;
      res.send(error.message);
    } else {
      console.error(error);
      res.statusCode = 400;
      res.send("Something went wrong with the request");
    }
  }
});

app.get('/playlist/tracks/:playlistId', async function (req, res) {
 


  try {
    const matchingTracks = await playlistRepository.findTracksForPlaylist(req.params.playlistId);
    res.statusCode = 200; // ok
    res.send(matchingTracks);

  } catch (error) {
    if (error instanceof RepositoryError) {
      res.statusCode = error.status;
      res.send(error.message);
    } else {
      console.error(error);
      res.statusCode = 400;
      res.send("Something went wrong with the request");
    }
  }

});


module.exports = app;