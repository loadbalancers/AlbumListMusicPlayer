const {schemas: {song, album, artist}} = require('./MySqlDatabase');
const getPicture = require('./Images.js');

// --------------------------------
// ARTISTS REQUESTS
// --------------------------------
// GET REQUESTS -------------------
exports.getArtist = (artistId) => {
    return new Promise((resolve, reject) => {
        artist.findOne({where: {artistId: artistId}})
            .then(({dataValues}) => {
                resolve(dataValues);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

exports.getAllArtists = () => {
    return new Promise((resolve, reject) => {
        artist.findAll()
            .then((artists) => {
                resolve(artists);
            })
            .catch((err) => {
                reject(err);
            });
        });
};

// POST REQUESTS -------------------
exports.createArtist = (artistInfo) => {
    return new Promise((resolve, reject) => {
        if (artistInfo) {
            artist.create({
                artistName: artistInfo.name
            }).then((artist) => {
                resolve(artist);
            });
        } else {
            reject('ERROR: INCORRECT ARTIST PROPERTIES');
        }
    });
}

// UPDATE REQUESTS -------------------
exports.updateArtist = (id, newField) => {
    return new Promise((resolve, reject) => {
        artist.update(newField, {where: {artistId: id}})
            .then((newArtist) => {
                resolve(newArtist);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

// DELETE REQUESTS -------------------
exports.deleteArtist = (id) => {
    return artist.destroy({where: {artistId: id}});
}

// --------------------------------
// ALBUM REQUESTS
// --------------------------------
// GET REQUESTS -------------------
exports.getAlbum = (albumId, artistId) => {
    return new Promise((resolve, reject) => {
        album.findOne({where: {albumId: albumId, artistId: artistId}})
            .then(({dataValues}) => {
                resolve(dataValues);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.getAlbumsFromArtist = (artistId) => {
    async function getAllData() {
        async function getAlbumsAndSongs() {
            let artist = await exports.getArtist(artistId);
            let albums = await album.findAll({where: {artistId: artistId}, raw: true});
            let songs = albums.map(async(album) => {
                return await exports.getSongsFromAlbum(album.albumId);
            });
            songs = await Promise.all(songs);
            albums = albums.map((album, i) => {
                album.songs = songs[i][0];
                album.albumImage = getPicture(Math.floor(Math.random()*20));
                return album;
            });
            return {artist, albums};
        }
        return await getAlbumsAndSongs();
    }
    return getAllData();
};

// DELETE REQUESTS -------------------
exports.deleteAlbum = (id) => {
    return album.destroy({where: {id: id}});
}

// POST REQUESTS -------------------
exports.createAlbumFromArtist = (albumInfo, artistId) => {
    return new Promise((resolve, reject) => {
        exports.getArtist(artistId)
            .then((wantedArtist) => {
                album.create({
                    albumName: albumInfo.name,
                    albumImage: albumInfo.image,
                    publishedYear: albumInfo.releaseYear,
                    artistId: wantedArtist.id
                }).then((album) => {
                    resolve(album);
                })
            }).catch((err) => {
                reject(err);
            });
        });
}

// UPDATE REQUESTS -------------------
exports.updateAlbum = (id, newField) => {
    return new Promise((resolve, reject) => {
        album.update(newField, {where: {albumId: id}})
            .then((updatedFields) => {
                resolve(updatedFields);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

// --------------------------------
// SONG REQUESTS
// --------------------------------
// GET REQUESTS -------------------
exports.getSong = (songId) => {
    return new Promise((resolve, reject) => {
        song.findOne({where: {songId: songId}})
            .then((song) => {
                resolve(song);
            })
            .catch((err) => {
                reject(err);
            });
        });
};

exports.getSongsFromAlbum = (albumIds) => {
    async function getSongs() {
        albumIds = (Array.isArray(albumIds)) ? albumIds : [albumIds]; 
        async function getSong(id) {
            return await song.findAll({where: {albumId: id}});
        }
        let songs = albumIds.map((id) => {
            return getSong(id);
        });
        return await Promise.all(songs);
    }
    return getSongs();
};

// POST REQUESTS -------------------
exports.createSongFromAlbum = (songInfo, albumId, artistId) => {
    return new Promise((resolve, reject) => {
        exports.getAlbum(albumId, artistId)
            .then((wantedAlbum) => {
                song.create({
                    songName: songInfo.name,
                    url: songInfo.url,
                    streams: songInfo.streams,
                    length: songInfo.length,
                    popularity: songInfo.popularity,
                    addedToLibrary: songInfo.addedToLibrary,
                    albumId: wantedAlbum.id
                }).then((song) => {
                    resolve(song);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
}

// UPDATE REQUESTS -------------------
exports.updateSong = (id, newField) => {
    return new Promise((resolve, reject) => {
        song.update(newField, {where: {songId: id}})
            .then((updatedFields) => {
                resolve(updatedFields);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

// DELETE REQUESTS -------------------
exports.deleteSong = (id) => {
    return song.destroy({where: {songId: id}});
}