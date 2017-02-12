'use strict';

const express = require('express');
const app = express();

app.use(express.static('public'));
// app.use(require('./routes/index.jsx'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('http://localhost:' + PORT);
});