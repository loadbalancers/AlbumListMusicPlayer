const {models, Song, Album, Artist} = require('./CassandraDatabase');
const faker = require('faker');

const generateFakes = (amount) => {
    for (var i = 0; i < amount; i++) {
        let song = new Song(i, `song${i}`, `song${i}`, i, i, i, false);
        let album = new Album(i, [song], `album${i}`, `test${i}`, i);
        const MyArtist = new models.instance.artist({
            id: i,
            name: faker.name.firstName() + ' ' + faker.name.lastName(),
            albums: [album]
        });

        MyArtist.save((err)=>{
            if(err) console.log(err);
        });
    }
}

//generateFakes(20);

// --------------------------------
// ARTISTS REQUESTS
// --------------------------------
// GET REQUESTS -------------------
exports.getArtist = (id) => {
    return new Promise((resolve, reject) => {
        models.instance.artist.findOne({id: parseInt(id)}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.getAllArtists = () => {
    return new Promise((resolve, reject) => {
        models.instance.artist.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

// POST REQUESTS -------------------
exports.createArtist = (artistInfo) => {
    return new Promise((resolve, reject) => {
        if (artistInfo) {
            artist.create({
                name: artistInfo.name
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
        artist.update(newField, {where: {id: id}})
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
    return artist.destroy({where: {id: id}});
}

// --------------------------------
// ALBUM REQUESTS
// --------------------------------
// GET REQUESTS -------------------
exports.getAlbum = (albumId, artistId) => {
    return new Promise((resolve, reject) => {
        models.instance.artist.findOne({id: parseInt(id)}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.getAlbumsFromArtist = (artistId) => {
    return new Promise((resolve, reject) => {
        album.findAll({where: {artistId: artistId}})
            .then((albums) => {
                resolve(albums);
            })
            .catch((err) => {
                reject(err);
            });
        });
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
                    name: albumInfo.name,
                    image: albumInfo.image,
                    releaseYear: albumInfo.releaseYear,
                    artistId: wantedArtist.id
                }).then((album) => {
                    resolve(album);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
}

// UPDATE REQUESTS -------------------
exports.updateAlbum = (id, newField) => {
    return new Promise((resolve, reject) => {
        album.update(newField, {where: {id: id}})
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
        song.findOne({where: {id: songId}})
            .then((song) => {
                resolve(song);
            })
            .catch((err) => {
                reject(err);
            });
        });
};

exports.getSongsFromAlbum = (albumId) => {
    return new Promise((resolve, reject) => {
        song.findAll({where: {albumId: albumId}})
            .then((songs) => {
                resolve(songs);
            })
            .catch((err) => {
                reject(err);
            });
        });
};

// POST REQUESTS -------------------
exports.createSongFromAlbum = (songInfo, albumId, artistId) => {
    return new Promise((resolve, reject) => {
        exports.getAlbum(albumId, artistId)
            .then((wantedAlbum) => {
                song.create({
                    name: songInfo.name,
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
        song.update(newField, {where: {id: id}})
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
    return song.destroy({where: {id: id}});
}