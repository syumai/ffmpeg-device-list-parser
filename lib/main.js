'use strict'

const childProcess = require('child_process');
const spawn = childProcess.spawn;
const exec = childProcess.exec;

let ffmpegPath;

function parse(options, callback) {
	ffmpegPath = options.ffmpegPath || 'ffmpeg';

	let promise;

	switch(process.platform) {
		case 'win32':
			promise = new Promise((fulfill, reject) => parseOnWin32(fulfill, reject));
			break;
		case 'darwin':
			promise = new Promise((fulfill, reject) => parseOnDarwin(fulfill, reject));
			break;
	}
	
	return promise;
}

function parseOnWin32(fulfill, reject) {
	const videoDevices = [];
	const audioDevices = [];
	let isVideo = true;
	const ffmpeg = exec(`${ffmpegPath} -f dshow -list_devices true -i ""`, (err, stdout, stderr) => {
		if(err) {
			reject(err);
		}
		stderr.split("\n").forEach((line) => {
			if(line.search(/\[dshow/) > -1) {
				if(line.search(/DirectShow\saudio\sdevices/) > -1) {
					isVideo = false;
				}
				const deviceList = isVideo ? videoDevices : audioDevices;
				if(line.search(/Alternative\sname/) > -1) {
					const lastDevice = deviceList[deviceList.length - 1];
					lastDevice.alternativeName = line.match(/Alternative\sname\s*?\"(.*?)\"/)[1];
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
			}
		});
		fulfill({videoDevices, audioDevices});
	});
}

function parseOnDarwin(fulfill, reject) {
	const videoDevices = [];
	const audioDevices = [];
	let isVideo = true;
	const ffmpeg = spawn(ffmpegPath, ['-f', 'avfoundation', '-list_devices', 'true', '-i', '""']);
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

module.exports = { parse };
