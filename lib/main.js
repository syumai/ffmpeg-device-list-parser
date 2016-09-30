const { spawn } = require('child_process');

let promise;

switch(process.platform) {
	case 'win32':
		break;
	case 'darwin':
		promise = new Promise(fulfill => parseOnDarwin(fulfill));
		break;
}

function parseOnDarwin(fulfill) {
	const logs = [];
	const videoDevices = [];
	const audioDevices = [];
	let isVideo = true;
	const ffmpeg = spawn('ffmpeg', ['-f', 'avfoundation', '-list_devices', 'true', '-i', '""']);
	ffmpeg.stderr.on('data', (data) => {
		const log = data.toString();
		if(log.search(/^\[AVFoundation/) > -1) {
			log.split("\n").forEach(line => {
				if(line.search(/AVFoundation\saudio\sdevices/) > -1) {
					isVideo = false;
				}
				const params = line.match(/^\[AVFoundation.*?\]\s\[(\d*?)\]\s(.*)$/);
				if(params && params.length >= 2) {
					const deviceList = isVideo ? videoDevices : audioDevices;
					deviceList.push(
						{
							id: parseInt(params[1]),
							name: params[2]
						}
					);
				}
			});
		}
	});
	ffmpeg.on('close', () => fulfill({videoDevices, audioDevices}));
}

module.exports = {
	parse: () => promise
};
