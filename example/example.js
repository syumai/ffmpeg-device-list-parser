const { parse } = require('../lib/main.js');

const options = {
	ffmpegPath: null
}

parse(options).then(
	result => console.log(result)
);

