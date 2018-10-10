const csv = require('fast-csv');
const async = require('async');
const {albums_by_artist, songs_by_album} = require('./CassandraDatabase.js');
const fs = require('fs');

const albumsByArtistStream = fs.createWriteStream('./albumsByArtist.csv', 'utf8');

let currentArtist = null;
let artistAlbums = [];
let nextAlbum = null;
const creatorCargo = async.cargo((artist, cb) => {
    artist = artist[0];
    artist.albums.forEach((album) => {
        let doc = {};
        doc.artistId = artist.id;
        doc.artistName = artist.name;
        doc.albumId = album.id;
        doc.albumName = album.name;
        doc.albumYear = album.year;
        doc.albumImage = album.image;
        let line = `${artist.id},${artist.name},${album.id},${album.name},${album.year},${album.image}\n`;
        // albumsByArtistStream.write(line);
        let albumByArtist = new albums_by_artist(doc);
        albumByArtist.save();
    });
    cb();
}, 1);

const createArtist = (artist, albums) => {
    let newArtist = Object.assign({}, artist);
    newArtist.albums = [];
    albums.forEach((album) => {
        album = Object.assign({}, album);
        newArtist.albums.push(album);
    });
    return newArtist;
}

const documentCargo = async.cargo((doc, cb) => {
    doc = doc[0];
    // IF DOC IS AN ARTIST
    if (doc.tag === 'artist') {
        currentArtist = doc;
        albumSender.resume();
        cb();
    // IF DOC IS A album
    } else {
        if (nextAlbum && nextAlbum.artistId === currentArtist.id) {
            artistAlbums.push(nextAlbum);
            nextAlbum = null;
        }
        if (doc.artistId === currentArtist.id) {
            artistAlbums.push(doc);
            albumSender.resume();
        } else {
            creatorCargo.push(createArtist(currentArtist, artistAlbums));
            currentArtist = null;
            artistAlbums = [];
            artistSender.resume();
            nextAlbum = doc;
        }
        cb();
    }
}, 1);

const artistSender = async.cargo((artist, cb) => {
    documentCargo.push(artist);
    artistSender.pause();
    cb();
}, 1)

const albumSender = async.cargo((album, cb) => {
    documentCargo.push(album);
    albumSender.pause();
    cb();
}, 1);

// PARSE ALL album FILES AND PUSH TO album SENDER
const readalbumFile = (file) => {
    let parser = csv.parse();
    let albumReadStream = fs.createReadStream(file)
                             .pipe(parser);

    parser.on('readable', () => {
        while ((line = parser.read())) {
            let album = {};
            album.id = parseInt(line[0]);
            album.name = line[1];
            album.year = parseInt(line[3]);
            album.image = line[2];
            album.artistId = parseInt(line[4]);
            album.tag = 'album';
            albumSender.push(album);
        }
        albumDirCargo.resume();
    });
}

const albumDirCargo = async.cargo((file, cb) => {
    let fileDir = __dirname + `/GeneratedData/Albums/AlbumData${file}.csv`;
    readalbumFile(fileDir);
    albumDirCargo.pause();
    cb();
}, 1);

// PARSE ALL ARTIST FILES AND PUSH TO ARTIST SENDER
const readArtistFile = (file) => {
    let parser = csv.parse();
    let artistReadStream = fs.createReadStream(file)
                             .pipe(parser);

    parser.on('readable', () => {
        while ((line = parser.read())) {
            let artist = {};
            artist.id = parseInt(line[0]);
            artist.name = line[1];
            artist.tag = 'artist';
            artistSender.push(artist);
        }
        artistDirCargo.resume();
    });
}

const artistDirCargo = async.cargo((file, cb) => {
    let fileDir = __dirname + `/GeneratedData/Artists/ArtistData${file}.csv`;
    readArtistFile(fileDir);
    artistDirCargo.pause();
    cb();
}, 1);

// START PUSHING TO CARGOS
artistDirCargo.push([0,1,2,3,4,5,6,7,8,9]);
albumDirCargo.push([0,1,2,3,4,5,6,7,8,9]);