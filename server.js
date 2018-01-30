'use strict'

const express = require('express');
const pg = require('pg');
const mps = require('make-promises-safe');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// const connectionString = process.env.DATABASE_URL;
const connectionString = 'postgres://localhost:5432/roverview';
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
// app.use(express.static('./client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', (req, res) => {
    console.log('received request line 18');
    res.sendFile('index.html', {root: './client'});
    res.json({ msg: 'placeholder - deployment worked!' });
    console.log('file sent line 21');
});

app.post('/db/users', (res,req) => {
//     client.query(`INSERT INTO users (username)
//     VALUES($1);`,
//     [
//         req.body.username
//     ]
// )
//     .then(function(data) {
//         console.log('Username data passed: ', data);
//         res.send('request complete');
//     })
//     .catch(function(err) {
//         console.error(err);
//     })
    console.log(req.body)
});


app.post('/db/image', (res,req) => {
    client.query(`INSERT INTO image (rover_name, camera_name, earth_date, image_src, user_id)
    VALUES($1, $2, $3, $4, $5);`,
    [
         req.body.rover_name,
         camera_name,
         earth_date,
         image_src,
         user_id,
    ]
)
    .then(function(data) {
        console.log('Username data passed: ', data);
        res.send('request complete');
    })
    .catch(function(err) {
        console.error(err);
    })
});


app.get('/db/users/:username', (req, res) => {
    client.query(`SELECT * FROM users WHERE username = ${req.params.username};`)
    .then(function(data) {
        console.log('db/users route hit, sent users data!')
        res.send(data);
    })
    .catch(function(err) {
        console.error(err);
    });
});

//the image data base is not properly set up!!!!!(we might need to REFACTOR and create a JOIN to connect the users favorites)
app.get('/db/image/:user_id', function(req, res) {
    client.query(`
        SELECT id, username, image_id, rover_name, camera_name, earth_date, image_src 
        FROM users
            LEFT JOIN image
            ON users.id = image.user_id
            WHERE user_id = ${req.params.user_id};

    `)
    .then(function(data) {
        res.send(data);
        console.log('sent image data!')
    })
    .catch(function(err) {
        console.error(err);
    });
});


function createUsersTable() {
    client.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR (256)
        );`
    )
    .then(function(res) { // changed to res instead of response for consistency
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
            image_src VARCHAR (256),
            user_id VARCHAR (256)
        );`
    )
    .then(function(res) { // changed to res instead of response for consistency
        console.log('created image table in db!')
    })
}

createUsersTable();
createImageTable();

app.listen(PORT, () => {
    console.log(`currently listening on ${PORT}`);
});
