const fs = require('fs');
const async = require('async');
const csv = require('fast-csv');
const {schemas: {song, album, artist}} = require('../MySqlDatabase.js');

let lowestLine = 126828707;
let currentFile = 14;
let maxFile = 15;

const readFileCargo = async.cargo((songs, cb) => {
    song.bulkCreate(songs)
        .then(() => {
            cb();
        })
        .catch((err) => {
            cb();
        });
}, 1000);

const readFile = (num) => {
    let parser = csv.parse({
        columns: true,
        relax: true,
        rtrim: true,
        delimiter: ','
    });

    let currentFileStream = fs.createReadStream(`../GeneratedData/Songs/SongData${num}.csv`, 'utf8')
                              .pipe(parser);

    parser.on('readable', (data) => {
        while ((line = parser.read())) {
            if (parseInt(line[0]) >= lowestLine) {
                let song = {};
                song.id = parseInt(line[0]);
                song.name = line[1];
                song.url = line[2];
                song.streams = parseInt(line[3]);
                song.length = parseInt(line[4]);
                song.popularity = parseInt(line[5]);
                song.addedToLibrary = eval(line[6]);
                song.albumId = parseInt(line[7]);
                readFileCargo.push(song);
            }
        }
    });

    parser.on('end', () => {
        if (currentFile < maxFile) {
            currentFile++;
            directoryCargo.resume();
        } else {
            directoryCargo.kill();
        }
    });
}

const directoryCargo = async.cargo((fileNum, cb) => {
    readFile(fileNum);
    directoryCargo.pause();
    cb();
}, 1);

const initReadDirectory = (min, max) => {
    for (var i = min; i <= max; i++) {
        directoryCargo.push(i);
    }
}

initReadDirectory(currentFile, maxFile);

