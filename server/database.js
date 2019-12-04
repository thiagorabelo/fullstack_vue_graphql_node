const { Client } = require("pg");

const client = new Client({
    user: "thiago",
    password: "sadan",
    host: "localhost",
    database: "namegator",
    port: 5432
});

client.connect();

exports.execute = function (query, values) {
    return new Promise(function (resolve, reject) {
        client.query(query, values, function (err, res) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}
