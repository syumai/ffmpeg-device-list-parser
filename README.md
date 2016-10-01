# FFmpeg device list parser

### Supported Platforms
* macOS (using AVFoundation)
* Windows (using DirectShow)

## Usage
```sh
npm install ffmpeg-device-list-parser
```

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

## Output Example
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

// Windows
{
	videoDevices: [
		{
			name: 'Lenovo EasyCamera',
			alternativeName: '@device_pnp_\\\\?\\usb#vid_04f2&pid_b483&mi_00#6&30849109&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global'
		}
	],
	audioDevices: [
		{
			name: 'Microphone (Realtek High Definition Audio)',
			alternativeName: '@device_cm_{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave_{A5E96CD9-7A60-406C-8E66-7C75CFDD006C}'
		}
	]
}

```

## Author
syumai

## License
MIT
