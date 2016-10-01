'use strict'

const parse = require('../lib/main.js').parse;

const options = {
	ffmpegPath: null
}

parse(options).then(
	result => console.log(result)
);

