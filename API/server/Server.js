const express = require('express');
const app = express();
const parser = require('body-parser');
const sqlController = require('../database/SqlControllers');
const PORT = 1600;

//CURRENTLY USED DATABASE
const currentDatabase = sqlController;

// MIDDLEWARE
app.use(parser.json());

// ENDPOINTS
const endpoints = {
    singleArtist: '/artists/:artistId',
    allArtists: '/artists',
    singleAlbum: '/artists/:artistId/albums/:albumId',
    albumsFromArtist: '/artists/:artistId/albums',
    singleSong: '/artists/:artistId/albums/:albumId/songs/:songId',
    songsFromAlbum: '/artists/:artistId/albums/:albumId/songs'
}

// -------------------------------------------------
// GET REQUESTS
// -------------------------------------------------
// GET AN ARTIST
app.get(endpoints.singleArtist, (request, response) => {
    let id = request.params.artistId;
    currentDatabase.getArtist(id)
        .then((artist) => {
            response.end(JSON.stringify(artist));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});

// GET All ARTISTS
app.get(endpoints.allArtists, (request, response) => {
    currentDatabase.getAllArtists()
        .then((artists) => {
            response.end(JSON.stringify(artists));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});

// GET AN ALBUM
app.get(endpoints.singleAlbum, (request, response) => {
    let {albumId, artistId} = request.params;
    currentDatabase.getAlbum(albumId, artistId)
        .then((artists) => {
            response.end(JSON.stringify(artists));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});

// GET ALL ALBUMS FROM ARTIST
app.get(endpoints.albumsFromArtist, (request, response) => {
    let {artistId} = request.params;
    currentDatabase.getAlbumsFromArtist(artistId)
        .then((albums) => {
            response.end(JSON.stringify(albums));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});

// GET A SONG
app.get(endpoints.singleSong, (request, response) => {
    let id = request.params.songId;
    currentDatabase.getSong(id)
        .then((song) => {
            response.end(JSON.stringify(song));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});

// GET ALL SONGS FROM ALBUM
app.get(endpoints.songsFromAlbum, (request, response) => {
    let {albumId} = request.params;
        currentDatabase.getSongsFromAlbum(albumId)
            .then((songs) => {
                response.end(JSON.stringify(songs));
            })
            .catch((err) => {
                response.end(JSON.stringify(err));
            });
});

// -------------------------------------------------
// POST REQUESTS
// -------------------------------------------------
// CREATE NEW ARTIST
app.post(endpoints.allArtists, (request, response) => {
    let {artistInfo} = request.body;
    currentDatabase.createArtist(artistInfo)
        .then(() => {
            response.end('Successfully created artist');
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});

// CREATE NEW ALBUM
app.post(endpoints.albumsFromArtist, (request, response) => {
    let {albumInfo} = request.body;
    let {artistId} = request.params;
    currentDatabase.createAlbumFromArtist(albumInfo, artistId)
        .then(() => {
            response.end('Successfully created album');
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});

// CREATE NEW SONG
app.post(endpoints.songsFromAlbum, (request, response) => {
    let {songInfo} = request.body;
    let {artistId, albumId} = request.params;
    currentDatabase.createSongFromAlbum(songInfo, albumId, artistId)
        .then((song) => {
            response.end(JSON.stringify(song));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        });
});


// -------------------------------------------------
// PUT REQUESTS
// -------------------------------------------------
// UPDATE ARTIST
app.put(endpoints.singleArtist, (request, response) => {
    let id = request.params.artistId;
    let { newField } = request.body;
    currentDatabase.updateArtist(id, newField)
        .then((updatedArtist) => {
            response.end(JSON.stringify(updatedArtist));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        })
});

// UPDATE ALBUM
app.put(endpoints.singleAlbum, (request, response) => {
    let id = request.params.albumId;
    let { newField } = request.body;
    currentDatabase.updateAlbum(id, newField)
        .then((updatedAlbum) => {
            response.end(JSON.stringify(updatedAlbum));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        })
});

// UPDATE SONG
app.put(endpoints.singleSong, (request, response) => {
    let id = request.params.songId;
    let { newField } = request.body;
    currentDatabase.updateSong(id, newField)
        .then((updatedFields) => {
            response.end(JSON.stringify(updatedFields));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        })
});

// -------------------------------------------------
// DELETE REQUESTS
// -------------------------------------------------
// DELETE ARTIST
app.delete(endpoints.singleArtist, (request, response) => {
    let id = request.params.artistId;
    currentDatabase.deleteArtist(id)
        .then((data) => {
            response.end(JSON.stringify(data));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        })
});

// DELETE ALBUM
app.delete(endpoints.singleAlbum, (request, response) => {
    let id = request.params.albumId;
    currentDatabase.deleteAlbum(id)
        .then((data) => {
            response.end(JSON.stringify(data));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        })
});

// DELETE SONG
app.delete(endpoints.singleSong, (request, response) => {
    let id = request.params.songId;
    currentDatabase.deleteSong(id)
        .then((data) => {
            response.end(JSON.stringify(data));
        })
        .catch((err) => {
            response.end(JSON.stringify(err));
        })
});

app.listen(PORT);
console.log('Listening on Port ' + PORT + '...');