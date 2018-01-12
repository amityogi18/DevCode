
'use strict';
import {webrtcDetectedBrowser} from './adapter.js';
export function CallRecorder( cb) {
	var uploadCB = cb;
	this.name = '';


	function StreamRecorder(type) {
		var streamObj = this;
		this.type = type;
		this.stream = null;
		this.streamId = '';
		this.error = false;
		this.started = false;
		this.stopped = false;
		this.mediaRecorder = null;
		this.recordedBlobs = null;
		this.queueBlobs = null;
		this.sourceBuffer = null;
		this.mediaSource = new MediaSource();
		this.mediaSource.addEventListener('sourceopen', function(event) {
			try {
				streamObj.sourceBuffer = streamObj.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
				console.log('Media Source Opened Type:' + streamObj.type);
			} catch(e) {
				console.error('Exception in sourceopen', e);
			}
		}, false);
		
		StreamRecorder.prototype.download = function(name) {
			try {
				var blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
				var url = window.URL.createObjectURL(blob);
				console.dir(url);
				var a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				a.download = name+'.webm';
				document.body.appendChild(a);
				console.log('downloading : ' + a.download);
				a.click();
				setTimeout(function() {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 100);
			} catch(e) {
				console.error('Exception in downloading file of ' +name + ' e:', e);
			}
		}
		StreamRecorder.prototype.play = function(videoTag, recordedBlobs) {
			videoTag.src = URL.createObjectURL(this.mediaSource);
	  		var superBuffer = new Blob(this.recordedBlobs);
			// Firefox can not yet deal with Buffer srcObjects.
			videoTag.src = window.URL.createObjectURL(superBuffer);
		}
		StreamRecorder.prototype.stop = function() {
			if(this.started == true) {
				this.started = false;
				this.mediaRecorder.stop();
				this.mediaRecorder = null;
				console.log('Stopped Recording Blobs: ', this.recordedBlobs);
			}
		}
		StreamRecorder.prototype.pause = function() {
			if(this.started == true) {
				this.mediaRecorder.pause();
				console.log('Pause Recording, Blobs: ', this.recordedBlobs);
			}
		}
		StreamRecorder.prototype.resume = function() {
			if(this.started == true) {
				this.mediaRecorder.resume();
				console.log('Resume Recording, Blobs: ', this.recordedBlobs);
			}
		}
		StreamRecorder.prototype.start = function(stream, id) {
			if(this.started == true) {
				console.log('Already recording the stream ?? ' + id, stream);
			}
			this.started = true;
			this.stream = stream;
			var options = {mimeType: 'video/webm'};
		/*	if((this.streamId == id )  && this.recordedBlobs){
				console.log('Appending same sess ' + this.streamId);
			} else {
		*/		this.recordedBlobs = [];
				this.queueBlobs = [];
				this.streamId = id;
				console.log('Recording new sess ' + this.streamId);
		//	}
			if(this.mediaRecorder) {
				try { this.mediaRecorder.stop(); this.mediaRecorder = null;} catch(e){};
			}
			console.log('strating recording on ' + streamObj.type + ' stream ', this.stream);
			try {
				this.mediaRecorder = new MediaRecorder(stream, options);
			} catch (e0) {
				console.log('Unable to create MediaRecorder with options Object: ', e0);
				try {
				  options = {mimeType: 'video/webm,codecs=vp9'};
				  this.mediaRecorder = new MediaRecorder(stream, options);
				} catch (e1) {
					console.log('Unable to create MediaRecorder with options Object: ', e1);
					try {
						options = 'video/vp8'; // Chrome 47
						this.mediaRecorder = new MediaRecorder(stream, options);
					} catch (e2) {
						if(webrtcDetectedBrowser == "firefox") {
							alert('Update your Firefox browser to Record the calls');
						} else if(webrtcDetectedBrowser == "chrome") {
							alert('Try Latest Chrome with Enable experimental Web Platform features in enabled from chrome://flags.');
						} else {
							alert('Recording is not possible in this browser Use Latest version of Firefox or Chrome');
						}
						console.error('Exception while creating MediaRecorder:', e2);
						this.error = true;
						return false;
					}
				}
			}
			console.log('Created ' + this.type + ' MediaRecorder', this.mediaRecorder, 'with options', options);
			var self = this;
			this.mediaRecorder.onstop = function handleStop(event) {
				self.stopped = true;
	  			console.log('' + streamObj.type + ' Recorder stopped: ', event);
				console.dir('blobs : ' + self.recordedBlobs.length + ' in queue:' + self.queueBlobs.length);
			}
			this.mediaRecorder.ondataavailable = function (event) {
				if (event.data && event.data.size > 0) {
					self.queueBlobs.push(event.data);
			  		self.recordedBlobs.push(event.data);
				}
			};
			this.mediaRecorder.start(500);
			console.log('' + this.type + ' MediaRecorder started', this.mediaRecorder);
			this.started = true;
			this.stopped = false;
			return true;
		}
	}
	
	var streamRecorder = new StreamRecorder('self');
	var proto = CallRecorder.prototype;	
	// TODO user noraml file upload instaed of sending over websocket	
	proto.uploadFile = function(type, _cb) {
		try {
			if(_cb) {
				_cb(new Blob(streamRecorder.queueBlobs, {type: 'video/webm'}));
				streamRecorder.queueBlobs = null;
				self.recordedBlobs = null;
				return;
			}
			uploadCB('self', null, this.name);
			console.log('uploading queued self blobs : ' + streamRecorder.queueBlobs.length + ', strated:' + streamRecorder.started);
			while(streamRecorder.queueBlobs.length > 0 ) {
				var blob  = streamRecorder.queueBlobs.shift();
				uploadCB(null, blob);
			}
				
			uploadCB('end', null, this.name);
		} catch(e) {
			console.error('Exception in uploadToServer ', e);
		}
	}
	proto.startRecording = function(stream, id) {
		try {
			var resp = streamRecorder.start(stream, id);
			return resp;
		} catch(e) {
			console.error('Exception in starting recodings ', e)
		}
	}
	proto.pauseRecording = function() {
		streamRecorder.pause();
	}
	proto.resumeRecording = function() {
		streamRecorder.resume();
	}
	proto.stopRecording = function() {
		try {
			var self = this;
			streamRecorder.stop();
		} catch(e) {
			console.error('Exception in stopping recodings ' + e)
		}
	}
	proto.playRecording = function(selfTag, remoteTag) {
		try {
			streamRecorder.play(selfTag);
		} catch(e) {
			console.error('Exception in play recodings ' + e)
		}
	}
	proto.downloadRecording = function(selfName, remoteName) {
		try {
			console.log('downloading recordings');
			streamRecorder.download(selfName);
		} catch(e) {
			console.error('Exception in download recodings ' + e)
		}
	}
}
