'use strict'

const childProcess = require('child_process');
const spawn = childProcess.spawn;
const exec = childProcess.exec;
const platform = process.platform;

function parse(options, callback) {
	const ffmpegPath = options.ffmpegPath || 'ffmpeg';
	const videoDevices = [];
	const audioDevices = [];
	let isVideo = true;
	let inputDevice, prefix, audioSeparator, alternativeName, deviceParams;

	switch(platform) {
		case 'win32':
			inputDevice = 'dshow';
			prefix = /\[dshow/;
			audioSeparator = /DirectShow\saudio\sdevices/;
			alternativeName = /Alternative\sname\s*?\"(.*?)\"/;
			deviceParams = /\"(.*?)\"/;
			break;
		case 'darwin':
			inputDevice = 'avfoundation';
			prefix = /^\[AVFoundation/;
			audioSeparator = /AVFoundation\saudio\sdevices/;
			deviceParams = /^\[AVFoundation.*?\]\s\[(\d*?)\]\s(.*)$/;
			break;
	}

	const findAudioSeparator = (line) => isVideo && (line.search(audioSeparator) > -1);
	const findAlternativeName = (line) => (platform === 'win32') && (line.search(/Alternative\sname/) > -1);

	return new Promise((fulfill, reject) => {
		exec(`${ffmpegPath} -f ${inputDevice} -list_devices true -i ""`, (err, stdout, stderr) => {
			stderr.split("\n")
				.filter((line) => line.search(prefix) > -1)
				.forEach((line) => {
					if(findAudioSeparator(line)) {
						isVideo = false;
					}
					const deviceList = isVideo ? videoDevices : audioDevices;
					if(findAlternativeName(line)) {
						const lastDevice = deviceList[deviceList.length - 1];
						lastDevice.alternativeName = line.match(alternativeName)[1];
					} else {
						const params = line.match(deviceParams);
						if(params) {
							let device;
							switch(platform) {
								case 'win32':
									device = {
										name: params[1]
									}
									break;
								case 'darwin':
									device = {
										id: parseInt(params[1]),
										name: params[2]
									}
									break;
							}
							deviceList.push(device);
						}
					}
				});
			fulfill({videoDevices, audioDevices});
		});
	});
}

module.exports = { parse };
