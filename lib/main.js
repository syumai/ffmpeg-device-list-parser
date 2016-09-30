const { spawn } = require('child_process');

let promise;

switch(process.platform) {
	case 'win32':
		promise = new Promise(fulfill => parseOnWin32(fulfill));
		break;
	case 'darwin':
		promise = new Promise(fulfill => parseOnDarwin(fulfill));
		break;
}

function parseOnWin32(fulfill) {
	const videoDevices = [];
	const audioDevices = [];
	let isVideo = true;
	const ffmpeg = spawn('ffmpeg', ['-f', 'dshow' ,'-list_devices', 'true', '-i', '""']);
	ffmpeg.stderr.on('data', (data) => {
		const log = data.toString();
		if(log.search(/^\[dshow/) > -1) {
			log.split("\n").forEach(line => {
				if(line.search(/DirectShow\saudio\sdevices/) > -1) {
					isVideo = false;
				}
				const deviceList = isVideo ? videoDevices : audioDevices;
				if(line.search(/Alternative\sname/) > -1) {
					const lastDevice = deviceList[deviceList.length - 1];
					lastDevice.alternativeName = line.match(/Alternative\sname\s\"(.*?)\"/)[1];
				} else {
					const params = line.match(/\"(.*?)\"/);
					if(params) {
						deviceList.push(
							{
								name: params[1]
							}
						);
					}
				}
			});
		}
	});
	ffmpeg.on('close', () => fulfill({videoDevices, audioDevices}));
}

function parseOnDarwin(fulfill) {
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
