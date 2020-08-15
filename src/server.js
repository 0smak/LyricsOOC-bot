'use strict';
const twitter = require('./helpers/twitter');

const start = (q = undefined) => {
  console.log('Server started')
  twitter.start();
};

start();