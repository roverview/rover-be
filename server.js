'use strict'



const pg = require('pg');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = 'postgress://localhost:5432/'; //change this!  it is currently set for local machines!!!
const client = new pg.Client(connectionString);
client.connect();

 app.use(express.static('./client'));

 app.get('*', (req, res) => {
    console.log('received request line 18');
    res.sendFile('index.html', {root: './client'});
    res.json({ msg: 'placeholder - deployment worked!' });
    console.log('file sent line 21');
});



app.get('/db/user', (req, res) => {
    client.query(`SELECT * FROM user;`)
    .then(function(data) {
        res.send(data);
        console.log('sent user data!')
    })
    .catch(function(err) {
        console.error(err);
    });
});
   
//the image data base is not properly set up!!!!!(we might need to REFACTOR and create a JOIN to connect the users favorites)
app.get('/db/image', function(req, res) {
    client.query(`
        SELECT id, name,  image_id, image_src, 
        FROM user
            JOIN image
            ON user.id = image.user_id;
    `)
    .then(function(data) {
        res.send(data);
        console.log('sent image data!')
    })
    .catch(function(err) {
        console.error(err);
    });
});

//=================================================

// these tables are not working correctly and throwing errors when I use the DB on my local machine.
// createUserTable();
// createImageTable();

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