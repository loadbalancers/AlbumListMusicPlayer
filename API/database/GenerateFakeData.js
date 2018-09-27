const database = require('./MySqlDatabase.js');
const faker = require('faker');

// UTILITY FUNCTIONS
const times = (num, callback) => {
    for (var i = 0; i < num; i++) {
        callback();
    }
}

// GENERATE SQL DATABASE
exports.generateSQLDatabase = (amount) => {
    database.sql.sync({force: true}).then(() => {
        times(amount, () => {
            database.schemas.artist.create({
                name: faker.name.firstName() + ' ' + faker.name.lastName(),
            })
            .then(artist => artist.createAlbum({
                name: faker.company.bsBuzz(),
                image: faker.image.imageUrl(),
                releaseYear: 2017
            }))
            .then(album => {
                for (var i = 0; i < 10; i++) {
                    album.createSong({
                        name: faker.commerce.productName(),
                        url: faker.internet.url(),
                        streams: faker.random.number(),
                        length: faker.random.number(),
                        popularity: 5,
                        addedToLibrary: false
                    })
                }
            })
        });
    });
}

module.exports = generateSQLDatabase;