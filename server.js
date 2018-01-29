'use strict'

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./client'));

app.get('*', (req, res) => {
    res.sendFile ('index.html', { root: './client'});
});

app.listen(PORT, () => {
    console.log(`currently listening on ${PORT}`);
});