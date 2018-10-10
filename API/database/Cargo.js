const async = require('async');

const Cargo = async.cargo((requests, cb) => {
    async.forEach(requests, ({promise, response}) => {
        promise
            .then((data) => {
                response.end(JSON.stringify(data));
            })
            .catch((err) => {
                response.end(JSON.stringify(err));
            });
    });
    cb();
}, 100000);

exports.addToCargo = (promise, response) => {
    Cargo.push({promise, response});
}