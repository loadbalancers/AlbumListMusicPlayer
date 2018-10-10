//const database = require('./MySqlDatabase.js');
//const axios = require('axios');
const faker = require('faker');
const fs = require('fs');

// UTILITY FUNCTIONS
// CALL FUNCTION A NUMBER OF TIMES
const times = (num, callback) => {
    for (var i = 0; i < num; i++) {
        callback(i);
    }
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

// GENERATE DATA FUNCTION
// let artistId = 0;
// tracker = 3,000,000
let albumId = 29102899;
let songId = 174595828;
let generateNumber = 15;
const generateArtist = (albumCount) => {
    // MULTIPLIED
    // let addArtists = 1000000 * multiply;
    // artistId = artistId + addArtists;
    albumCount += albumId;
    // DEFINE TYPES
    let Artist = function(id = 0, name) {
        this.id = id;
        this.name = name;
    }
    let Album = function(id = 0, name, image, releaseYear, artistId) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.releaseYear = releaseYear;
        this.artistId = artistId;
    }
    let Song = function(id = 0, name, url, streams, length, popularity, added, albumId) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.streams = streams;
        this.length = length;
        this.popularity = popularity;
        this.addedToLibrary = added;
        this.albumId = albumId;
    }

    // GENERATE ARTIST
    // let name = faker.name.firstName() + ' ' + faker.name.lastName();
    // let artist = new Artist(artistId + additional, name);

    // GENERATE ALBUMS
    // let albums = [];
    // let amountOfAlbums = faker.random.number({min: 1, max: 5});
    // times(amountOfAlbums, () => {
    //     let id = albumId++;
    //     let name = capitalizeWords(faker.random.words());
    //     let image = faker.image.imageUrl();
    //     let releaseYear = getYear(faker.date.past(40));
    //     let album = new Album(id, name, image, releaseYear, artistId);
    //     albums.push(album);
    // });
    
    // // GENERATE SONGS
    // let songs = [];
    // albums.forEach((album) => {
        let songs = [];
        let amountOfSongsOnAlbum = faker.random.number({min: 2, max: 10});
        times(amountOfSongsOnAlbum, () => {
            let id = songId++;
            let name = capitalizeWords(faker.random.words());
            let url = faker.internet.url();
            let streams = faker.random.number({min: 100, max: 1000000});
            let length = faker.random.number({min: 30, max: 300});;
            let popularity = faker.random.number(8);;
            let addedToLibrary = false;
            let albumId = albumCount;
            songs.push(new Song(id, name, url, streams, length, popularity, addedToLibrary, albumCount));
        });
    // });
    return songs;
}

// total albums: 29995135
let count = 0;
let target = 29995135;
// CHANGE EVERY TIME
var WriteSongDataFile = fs.createWriteStream(`./GeneratedData/Songs/SongData${generateNumber}.csv`);

const writeDataToFile = () => {
    var songs = generateArtist(count++);
    songs.forEach((song) => {
        let {id, name, url, streams, length, popularity, addedToLibrary, albumId} = song;
        let songLine = `${id},${name},${url},${streams},${length},${popularity},${addedToLibrary},${albumId}\n`;
        WriteSongDataFile.write(songLine, () => { 
            if (id%10000===0) console.log(id);
            if (albumId <= target) writeDataToFile();
        });
    });
}

writeDataToFile();



// -------------------------------------
// IMAGE GENERATION --------------------
// -------------------------------------
// GENERATE IMAGES
// const generateImage = () => {
//     return new Promise((resolve) => {
//         let server = 'https://pixabay.com/api/';
//         let params = {
//             key: process.env.CLIENT_ID,
//             category: 'music',
//         }
//         axios.get(server, { params: params }).then(({data : {hits}}) => {
//             resolve(hits);
//         });
//     });
// }

// API KEY ----- 710248800-6fa1a657eb56139ed28ecd220

// const generateAllImages = () => {
//     return new Promise((resolve, reject) => {
//         let promises = [];
//         times(50, () => {
//             promises.push(generateImage());
//         });
//         Promise.all(promises)
//             .then(([images]) => {
//                 resolve(images);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//     });
// }

// generateAllImages().then((images) => {
//     let imageUrls = [];
//     images.forEach((image) => {
//         imageUrls.push(`"${image.webformatURL}"`);
//     });
//     fs.writeFile('imageURLs.txt', imageUrls.join(', '), 'utf8', (err) => {
//         if (err) throw err;
//         console.log ('DONE!!!!');
//     });
// });


// GENERATE SQL DATABASE
// exports.generateSQLDatabase = (amount) => {
//     database.sql.sync({force: true}).then(() => {
//         times(amount, () => {
//             database.schemas.artist.create({
//                 name: faker.name.firstName() + ' ' + faker.name.lastName(),
//             })
//             .then(artist => artist.createAlbum({
//                 name: faker.company.bsBuzz(),
//                 image: faker.image.imageUrl(),
//                 releaseYear: 2017
//             }))
//             .then(album => {
//                 for (var i = 0; i < 10; i++) {
//                     album.createSong({
//                         name: faker.commerce.productName(),
//                         url: faker.internet.url(),
//                         streams: faker.random.number(),
//                         length: faker.random.number(),
//                         popularity: 5,
//                         addedToLibrary: false
//                     })
//                 }
//             })
//         });
//     });
// }

// module.exports = generateSQLDatabase;