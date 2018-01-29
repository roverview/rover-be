'use strict'

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./client'));

app.get('*', (req, res) => {
    res.json({ msg: 'placeholder - deployment worked!' });
});

app.listen(PORT, () => {
    console.log(`currently listening on ${PORT}`);
});