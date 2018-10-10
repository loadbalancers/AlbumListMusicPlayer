const fs = require('fs');
const async = require('async');
const csv = require('fast-csv');
const {schemas: {song, album, artist}} = require('./MySqlDatabase.js');

var input = fs.createReadStream('./GeneratedData/Songs/SongData15.csv');
var parser = csv.parse({
  columns: true,
  relax: true,
  rtrim: true,
  delimiter: ','
});

var inserter = async.cargo(function(tasks, inserterCallback) {
    song.bulkCreate(tasks)
        .then(() => {
            inserterCallback();
        })
        .catch((err) => {
            inserterCallback();
        });
}, 1000);

parser.on('readable', function() {
  while ((line = parser.read())) {
    let song = {};
    song.id = parseInt(line[0]);
    song.name = line[1];
    song.url = line[2];
    song.streams = parseInt(line[3]);
    song.length = parseInt(line[4]);
    song.popularity = parseInt(line[5]);
    song.addedToLibrary = eval(line[6]);
    song.albumId = parseInt(line[7]);
    inserter.push(song);
  }
});

parser.on('end', function(count) {
  inserter.drain = function() {
    // doneLoadingCallback();
  };
});

input.pipe(parser);

