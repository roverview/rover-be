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

// app.get('*', (req, res) => {
//     console.log('received request line 18');
//     res.sendFile('index.html', {root: './client'});
//     res.json({ msg: 'went to the wrong page!!!!!!  ******' });
//     console.log('file sent line 21 on server.js');
// });

app.post('/db/users', (req, res) => {
    console.log('req.body',req.body);
    console.log('req.body.user',req.body.user);
    client.query(`INSERT INTO users (username)
    VALUES($1);`,
    [
        req.body.user
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


app.post('/db/image', (req, res) => {
    client.query(`INSERT INTO image (rover_name, camera_name, earth_date, image_src, user_id)
    VALUES($1, $2, $3, $4, $5);`,
    [
         req.body.rover_name,
         req.body.camera_name,
         req.body.earth_date,
         req.body.image_src,
         req.body.user_id,
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
    console.log('params', req.params.username);
    client.query(`SELECT * FROM users WHERE username = '${req.params.username}';`)
    .then(function(data) {
        console.log('db/users route hit, sent users data!', data);
        res.send(data);
    })
    .catch(function(err) {
        console.error(err);
    });
});

app.get('/db/image/:user_id', (req, res) => {
    console.log('params',req.params.user_id)
    client.query(`
        SELECT id, username, image_id, rover_name, camera_name, earth_date, image_src 
        FROM users
            LEFT JOIN image
            ON users.id::varchar = image.user_id
            WHERE user_id = '${req.params.user_id}';
    `)
    .then(function(data) {
        res.send(data);
        console.log('sent image data!')
    })
    .catch(function(err) {
        console.error(err);
    });
});

app.delete('/db/image/:user_id/:image_id', (req, res) => {
    console.log('Deleted picture user id', req.params.user_id)
    console.log('Deleted picture image id', req.params.image_id)

    client.query(`
        DELETE FROM image WHERE image_id = ${req.params.image_id} AND user_id = '${req.params.user_id}';
    `)
    .then(() => {
        res.send(`deleted favorite photo from user ${req.params.user_id} , image id: ${req.params.image_id}`);
        console.log('deleted a favorite picture');
    }
)


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
