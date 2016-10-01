# FFmpeg device list parser

### Supported Platforms
* macOS (using AVFoundation)
* Windows (using DirectShow)

## Usage
```js
const { parse } = require('ffmpeg-device-list-parser');

// FFmpegPath is customizable
const options = {
	ffmpegPath: '/usr/local/bin/ffmpeg'
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
```

## Output
```js
// macOS
{ 
	videoDevices: [
		{ id: 0, name: 'FaceTime HD Camera' },
		{ id: 1, name: 'Capture screen 0' } 
	],
	audioDevices: [
		{ id: 0, name: 'Built-in Microphone' }
	]
}
```

## License
MIT
