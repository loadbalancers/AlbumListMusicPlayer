const fs = require('fs');
const async = require('async');
const csv = require('fast-csv');
const {schemas: {song, album, artist}} = require('../MySqlDatabase.js');

let lowestLine = 23999281;
let currentFile = 8;
let maxFile = 9;

const readFileCargo = async.cargo((albums, cb) => {
    album.bulkCreate(albums)
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

    let currentFileStream = fs.createReadStream(`../GeneratedData/Albums/AlbumData${num}.csv`, 'utf8')
                              .pipe(parser);

    parser.on('readable', (data) => {
        while ((line = parser.read())) {
            //if (parseInt(line[0]) >= lowestLine) {
                let album = {};
                album.id = parseInt(line[0]);
                album.name = line[1];
                album.image = line[2];
                album.releaseYear = parseInt(line[3]);
                album.artistId = parseInt(line[4]);
                readFileCargo.push(album);
            //}
        }
    });

    parser.on('end', () => {
        if (currentFile < maxFile) {
            currentFile++;
            directoryCargo.resume();
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

initReadDirectory(7,9);

