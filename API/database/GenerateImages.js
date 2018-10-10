const axios = require('axios');
const fs = require('fs');

const CreatePictures = () => {
    return new Promise((resolve) => {
        let server = 'https://api.unsplash.com/photos/random';
        let params = {
            client_id: '7675446baa2be5640af1b407b133c0f3926c482389743ea034a1f4e4ca6a9b46',
            orientation: 'landscape',
            count: 1000
        }
        axios.get(server, { params: params }).then((result) => {
            let images = result.data.map((image) => {
                return image.urls.thumb;
            });
            resolve(images);
        });
    })
}

CreatePictures().then((pictures) => {
    WritePictures(pictures);
});

const WritePictures = (pictures) => {
    var Pictures = {};
    Pictures.data = pictures;
    fs.writeFile('./AlbumPicturesSpotify2.json', JSON.stringify(Pictures), 'utf8', (err) => {
        if (err) throw err;
        console.log('DONE!');
    });
}