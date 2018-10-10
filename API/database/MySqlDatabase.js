const sequelize = require('sequelize');

const sql = new sequelize({ username: 'root',
                            password: 'muzBost&i3^meoW7bowWow',
                            database: 'spotify',
                            host: '54.153.78.160',
                            dialect: 'mysql',
                            define: {
                                timestamps: false
                            },
                            pool: {
                                max: 100,
                                min: 0,
                                acquire: 20000,
                                idle: 20000,
                              }
                         });

// SCHEMAS ------------------------------------------------------
// SONG SCHEMA --------------------------------------------------                         
const song = sql.define('song', {
    songId: {
        type: sequelize.INTEGER,
        primaryKey: true,
        validate: {
            unique: true
        }
    },
    songName: {
        type: sequelize.STRING,
        allowNull: false
    },
    url: {
        type: sequelize.STRING,
        allowNull: false
    },
    streams: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    length: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    popularity: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    addedToLibrary: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },
    albumId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

// ALBUM SCHEMA ----------------------------------------------------------  
const album = sql.define('album', {
    albumId: {
        type: sequelize.INTEGER,
        primaryKey: true,
        validate: {
            unique: true
        }
    },
    albumName: {
        type: sequelize.STRING,
        allowNull: false
    },
    albumImage: {
        type: sequelize.STRING,
        allowNull: false
    },
    publishedYear: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    artistId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

// ARTIST SCHEMA ----------------------------------------------------------  
const artist = sql.define('artist', {
    artistId: {
        type: sequelize.INTEGER,
        primaryKey: true,
        validate: {
            unique: true
        }
    },
    artistName: {
        type: sequelize.STRING,
        allowNull: false,
        unique: false,
        validate: {
            unique: false
        }
    }
});


// DESCRIBE RELATIONSHIPS --------------------------------------------------
// THERE ARE MANY SONGS IN ONE ALBUM  
// album.hasMany(song);
// song.belongsTo(album);

// THERE ARE MANY ALBUMS FOR ONE ARTIST
// artist.hasMany(album);
// album.belongsTo(artist);

exports.schemas = {song, album, artist};
exports.sql = sql;