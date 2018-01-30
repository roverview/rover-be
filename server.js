'use strict'

const pg = require('pg');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


 app.use(express.static('./client'));

 app.get('*', function(req, res) {
     console.log('recieved request');
    res.sendFile('index.html', {root: './client'});
    res.json({ msg: 'placeholder - deployment worked!' });
    console.log('file sent');
});



app.get('/db/user', function(req, res) {
    client.query(`SELECT * FROM user;`)
    .then(function(data) {
        res.send(data);
        console.log('sent user data!')
    })
    .catch(function(err) {
        console.error(err);
    });
});
   
//the image data base is not properly set up!!!!!(we need to REFACTOR and create a JOIN to connect the users favorites)
app.get('/db/image', function(req, res) {
    client.query(`SELECT * FROM image;`)
    .then(function(data) {
        res.send(data);
        console.log('sent image data!')
    })
    .catch(function(err) {
        console.error(err);
    });
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