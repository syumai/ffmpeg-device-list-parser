'use strict'

const parse = require('../lib/main.js').parse;

// FFmpegPath is customizable
const options = {
	ffmpegPath: null
}

// Promise usage
parse(options).then(
	(result) => console.log(result)
);

// Callback usage
parse(options, 
	(result) => console.log(result)
);

// Callback usage without option
parse((result) => console.log(result));
