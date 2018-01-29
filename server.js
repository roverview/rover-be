'use strict'
const pg = require('pg');
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();


app.use(express.static('./public/'));

app.get('*', (req, res) => {
    console.log('recieved request');
    res.sendFile ('index.html', { root: './public/'});
    console.log('file sent');
});

createUserTable();
createImageTable();

app.listen(PORT, () => {
    console.log(`currently listening on ${PORT}`);
});



function createUserTable() {
    client.query(`
    CREATE TABLE IF NOT EXISTS user(
        id SERIAL PRIMARY KEY,
        name VARCHAR (256),
        passphrase VARCHAR (256)
    );`
    )
    .then(function(response) {
        console.log('created user table in db!')
    })
}

function createImageTable() {
    client.query(`
    CREATE TABLE IF NOT EXISTS image(
        image_id SERIAL PRIMARY KEY,
        rover_name VARCHAR (256),
        camera_name VARCHAR (256),
        earth_date VARCHAR (256),
        img_src VARCHAR (256),
        user_id VARCHAR (256),
    );`
    )
    .then(function(response) {
        console.log('created image table in db!')
    })
}