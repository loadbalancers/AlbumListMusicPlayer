const sequelize = require('sequelize');

const sql = new sequelize({ username: 'root',
                            password: 'root',
                            database: 'Spotify',
                            host: '127.0.0.1',
                            dialect: 'mysql',
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
    name: {
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
    }
});

// ALBUM SCHEMA ----------------------------------------------------------  
const album = sql.define('album', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    image: {
        type: sequelize.STRING,
        allowNull: false
    },
    releaseYear: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

// ARTIST SCHEMA ----------------------------------------------------------  
const artist = sql.define('artist', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    }
});

// DESCRIBE RELATIONSHIPS --------------------------------------------------
// THERE ARE MANY SONGS IN ONE ALBUM  
album.hasMany(song);
song.belongsTo(album);

// THERE ARE MANY ALBUMS FOR ONE ARTIST
artist.hasMany(album);
album.belongsTo(artist);

exports.schemas = {song, album, artist};
exports.sql = sql;