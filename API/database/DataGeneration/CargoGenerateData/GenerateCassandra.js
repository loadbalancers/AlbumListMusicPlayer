const async = require('async');
const faker = require('faker');
const fs = require('fs');

// UTILITY FUNCTIONS
// CALL FUNCTION A NUMBER OF TIMES
const times = (num, callback) => {
    var runTimes = new Array(num);
    var count = 0;
    async.forEach(runTimes, (element, id) => {
        count++;
        callback(count);
    });
}

// CAPITALIZE FIRST LETTER OF EACH WORD
const capitalizeWords = (sentence) => {
    return sentence.split(' ')
                   .map(word => word[0].toUpperCase() + word.slice(1, word.length))
                   .join(' ');
}

// GET YEAR FROM DATE
const getYear = (date) => {
    return parseInt(date.toString().match(/\d\d\d\d/)[0]);
}

const generatedAlbumsByArtist = fs.createWriteStream(__dirname + '/albumsByArtist.csv');
const generatedSongsByAlbum = fs.createWriteStream(__dirname + '/songsByAlbum.csv');

const writeArtistCargo = async.cargo((artists, cb) => {
    artists.forEach((artist) => {
        console.log('WRITE ARTIST------');
        generatedAlbumsByArtist.write(artist);
    });
    cb();
}, 1000);

const sendArtistsToCargo = async.cargo((docs, cb) => {
    writeArtistCargo.push(docs);
    cb();
}, 25);

const writeAlbumsCargo = async.cargo((albums, cb) => {
    albums.forEach((album) => {
        console.log('WRITE ALBUM------');
        generatedSongsByAlbum.write(album);
    });
    cb();
}, 1000);

const sendAlbumsToCargo = async.cargo((albums, cb) => {
    writeAlbumsCargo.push(albums);
    cb();
}, 25);

const sendDataToCargos = async.cargo(([data], cb) => {
    let {albums_by_artist, songs_by_album} = data;
    console.log('SEND');
    sendArtistsToCargo.push(albums_by_artist);
    sendAlbumsToCargo.push(songs_by_album);
    cb();
}, 25);

const makeCounter = (counter) => {
    var counter = 0;
    return function() {
        counter++;
        return counter;
    }
}

var artistId = makeCounter();
var albumId = makeCounter();
var songId = makeCounter();
// GENERATE ALBUMS BY ARTIST
async function generateDocs() {
    var albumByArtists = '';
    var songsByAlbum = '';
    var id = artistId();
    var artistName = faker.name.firstName() + ' ' + faker.name.lastName();
    var artistLine = `${id},${artistName},`;
    for (var i = 0; i <= 3; i++) {
        var newAlbumId = albumId();
        var albumName = capitalizeWords(faker.random.words());
        var albumYear = getYear(faker.date.past());
        var albumImage = faker.random.image();
        var albumLine = `${newAlbumId},${albumName},${albumYear},${albumImage}`;
        var album_by_artist = artistLine + albumLine;
        albumByArtists += album_by_artist + '\n';
        for (var j = 0; j <= 5; j++) {
            var newSongId = songId();
            var songName = capitalizeWords(faker.random.words());
            var songUrl = faker.internet.url();
            var songStreams = faker.random.number({min: 1000, max: 10000000});
            var songLength = faker.random.number({min: 30, max: 300});
            var songPopularity = faker.random.number(8);
            var addedToLibrary = false;
            var songLine = `${newSongId},${songName},${songUrl},${songStreams},${songLength},${songPopularity},${addedToLibrary}`;
            var song_by_album = `${albumLine},${songLine}`;
            songsByAlbum += song_by_album + '\n';
        }
    }
    return {albums_by_artist: albumByArtists, songs_by_album: songsByAlbum};
}

const generateAllArtists = async(amount) => {
    for (var i = 0; i < amount; i++) {
        let docs = await generateDocs();
        console.log('GENERATE RAN------');
        sendDataToCargos.push(docs);
    }
}
// 10000000
let amountOfTimes = new Array(1000);
async.forEach(amountOfTimes, () => {
    debugger;
    generateAllArtists(100);
});