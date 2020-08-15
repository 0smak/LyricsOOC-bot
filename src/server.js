'use strict';
const twitter = require('./helpers/twitter');
const express = require('express');
const app = express();
app.listen(process.env.PORT || 8080);

const start = (q = undefined) => {
  console.log('Server started')
  twitter.start();
};

start();