import {webrtcDetectedBrowser} from './adapter.js';
export function WebRTC () {
	var iceServers = [];// [{"url": "stun:stun.l.google.com:19302"}];	// ICE Server STUN/TURN
	this.ee = new EventEmitter();
	var isExtenAvailable = false;
	var proto = WebRTC.prototype;
	var extSessions = {}, cache = new Array();
	var rtcObj = this;
	function extensionListener(event) {
		if(event.origin != window.location.origin)
			return;
		var data = event.data;
		if(data.type == 'ajExtenStatus') {
			console.log('extension response', data);
			isExtenAvailable = true;
		} else if(data.type == 'ajGotScreen') {
			console.log('requesting GUM');
			var cb = cache[data.id];
			delete cache[data.id];
		
			if (data.sourceId === '') {
				//alert('you canceled the share');
				cb('you canceled the share');
			} else {
				var constraints = {
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							maxWidth: window.screen.width,
							maxHeight: window.screen.height,
							maxFrameRate: 3
						},
						optional: [
							{googTemporalLayeredScreencast: true}
						]
					}
				};
				constraints.video.mandatory.chromeMediaSourceId = data.sourceId;
				console.dir(constraints);
				rtcObj.getStream(constraints, cb);
				//getUserMedia(constraints, function(stream) {console.log('got the window stream function', arguments); cb(null, stream);}, function(err) {console.error('Errr scr ', arguments); cb(err);});
			}
		} else if (data.type == 'ajGetScreenPending') {
			console.log('Okk clearing timeout');
			window.clearTimeout(data.id);
		} else if(data.type == 'ajGetTabPending') {

		} else if(data.type == 'tready') {
			rtcObj.emit("tready", sess);
		} else if(data.type == 'tended') {
			rtcObj.emit("tended", sess);
		} else if(data.type == 'toffer') {
			var sess = extSessions[data.sessid];
			if(sess)		
				rtcObj.emit("offer", sess, data.jsep);
		} else if(data.type == 'tcandidate') {
			var sess = extSessions[data.sessid];
			if(sess)		
				rtcObj.emit("candidate", sess, data.candidate);
		}
	}

	window.addEventListener('message', extensionListener);
	window.postMessage({ type: 'ajCheckExten', 'event':'loading' }, '*');
	//window.removeEventListener('message', extensionListener);
	proto.extStartSession = function(confid, sessid, role, name, sess) {
		extSessions[sessid] = sess;
		window.postMessage({ type: 'ajNewSession', data:{confid: confid, sessid:sessid, 'role':role, name:name, url:window.location.href }}, '*');
	}
	proto.extStopSession = function(confid, sessid, sess) {
		delete extSessions[sessid];
		window.postMessage({ type: 'ajCloseSession', data:{confid: confid, sessid:sessid, url:window.location.href }}, '*');
	}
	proto.requestTabOffer = function(sess, confid) {
		window.postMessage({ type: 'ajCreateOffer', data:{confid: confid, sessid:sess.wsId,  url:window.location.href }}, '*');
	}
	proto.stopStream = function(stream) {
	try {
		console.log(' stopping stream ', stream);
		var tracks = stream.getTracks();
		for(var i in tracks) {
			var mst = tracks[i];
			if(mst) mst.stop();
		}
		if(stream) // for old browsers	
			stream.close();
	} catch(e) {
		console.error('Exception in stop stream ', e); 
	}
	}
	proto.getStream = function(opt, cb) {
		navigator.mediaDevices.getUserMedia(opt)
		.then(function(stream) { cb(null, stream);
		        console.log('got the window stream function');
		})
		.catch(function(error) { console.dir(error); alert('stream error  alert' ); cb(error); });
	}
	proto.getMedia = function (audioSource, videoSource) {
		console.log('audio  feed webrtc', audioSource);
		console.log(' video feed webrtc', videoSource);
		var constraints = { 
			audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
			//video: {width: {max: 640}, height: {max: 360}, frameRate: { ideal: 15, max: 20 }}
			video: {deviceId: videoSource ? {exact: videoSource} : undefined,width: {ideal: 640}, height: {ideal: 360}}
		//	video: {width: {max: 640}, height: {max: 360}}
		};
		if (window.mobile){
			constraints.audio = true;
		}
		
		
		this.getStream(constraints, function(err, stream) {
			if(err) {
				console.error('unable to get stream', err);
				return;
			}
			window.stream = stream; // make available to browser console
			rtcObj.emit('stream', stream);
		});
	}
	proto.switchStream = function(sess, audioSource, videoSource) {
		var constraints = {
			audio: {deviceId: audioSource ? {exact: audioSource} : undefined,},
			video: {deviceId: videoSource ? {exact: videoSource} : undefined, width: {ideal: 640}, height: {ideal: 360}}
			};
		console.log('Switching the stream', arguments);
		navigator.mediaDevices.getUserMedia(constraints)
		.then(function(_stream) {
		    if(window.stream) {
				sess.ignore = true;
				sess.pc.removeStream(window.stream);
				rtcObj.stopStream(window.stream);
			}
			window.stream = _stream;
			sess.pc.addStream(window.stream);
			sess.pending = 'offer';
			sess.restart = true;
			rtcObj.emit('stream', _stream);
		})
		.catch(function(error) { console.error('switch stream error ', error ); });
	}
	proto.mute = function (audio, video) {
		try {
			if(!window.stream) {
				console.log('No stream found ', window.stream);
				return;
			}
			if(audio) {
				var ats = window.stream.getAudioTracks();
				if(ats == 0) { console.log('No audio track available'); return; }
				for(var i=0; i < ats.length; i++) {
					ats[i].enabled = false;
				}
			}
			if(video) {
				var vts = window.stream.getVideoTracks();
				if(vts == 0) { console.log('No video track available'); return; }
				for(var i=0; i < vts.length; i++) {
					vts[i].enabled = false;
				}
			}
		} catch(e) {
			console.error('Exception in mute ', e);
		}
	}
	proto.unmute = function (audio, video) {
		try {
			if(!window.stream) {
				console.log('No stream found ', window.stream);
				return;
			}
			if(audio) {
				var ats = window.stream.getAudioTracks();
				if(ats == 0) { console.log('No audio track available'); return; }
				for(var i=0; i < ats.length; i++) {
					ats[i].enabled = true;
				}
			}
			if(video) {
				var vts = window.stream.getVideoTracks();
				if(vts == 0) { console.log('No video track available'); return; }
				for(var i=0; i < vts.length; i++) {
					vts[i].enabled = true;
				}
			}
		} catch(e) {
			console.error('Exception in unmute ', e);
		}
	}
	proto.getScreenMedia = function(source, cb) {
		var constraints = {},  pending = null;
		
		if(window.navigator.userAgent.match('Chrome')) {
			var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10);
			console.log(' ver:' + chromever);
			if(chromever < 26) {
				console.log('use latest chrome');
			} else if( chromever < 36) {
				constraints = {
					video: {
					mandatory: {
					maxWidth: window.screen.width,
					maxHeight: window.screen.height,
					maxFrameRate: 3,
					chromeMediaSource: 'screen'
			   		}
       					},
					audio:true
				};
				rtcObj.getStream(constraints, cb);
				return;
			} else {
				pending = window.setTimeout(function() {
					alert('Install Extenstion ');
				}, 2000);
				cache[pending] = cb;

				window.postMessage({ type: 'ajGetScreen', id: pending, 'options':['screen', 'window', 'tab'] }, '*');
				return;
			}
		} else if (window.navigator.userAgent.match('Firefox')) {
			var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
			if(ffver >= 33) {
				constraints = {
					video: {
						mozMediaSource: 'screen',
						mediaSource: 'screen'
					},
					audio: true
				};
				rtcObj.getStream(constraints, cb);
				return;
			}
		}	
		alert('Use latest version of chrome or firefox');		
	}
	proto.createAnswer = function(sess) {
		var mediaConstraints = null;
		if(webrtcDetectedBrowser == "firefox" || webrtcDetectedBrowser == "edge") {
			mediaConstraints = {
				'offerToReceiveAudio': true, 
				'offerToReceiveVideo': true,
			};
		} else {
			mediaConstraints = {
				'mandatory': {
					'OfferToReceiveAudio': true, 
					'OfferToReceiveVideo': true, 
				}
			};
		}
		sess.pc.createAnswer( 
			function(answer) {
				var method = 'answer';
				console.log('got answer');
				console.dir(answer);
				sess.pc.setLocalDescription(answer, 
					function() {
						console.log('set local description sucesses ');
					}, function() {
						console.error('set local description failed ');
				});
				var jsep = { "type":answer.type, "sdp":answer.sdp}; 
				if(sess.state == 3 ) {
					method = 'reanswer';
				}
				sess.answer = jsep;
				rtcObj.emit(method, sess, jsep);
			}, function() {
				console.error('Error: Unable to create answer');
				
			}, mediaConstraints);
	}
	
	proto.processOffer = function(sess, jsep) {
		try {
			
			console.dir(sess.pc);
			console.dir(jsep);
			if(sess.ssl_role == 'passive') {
				console.log('checking the role act to pass ');
				jsep.sdp.replace(/setup:active/g, 'setup:passive');
				console.dir(jsep);
			}
			var sessionObj;
			if(navigator.webkitGetUserMedia){
				sessionObj = RTCSessionDescription;
			} else if(navigator.mozGetUserMedia){
				sessionObj = mozRTCSessionDescription;
			}	
			sess.state = 3;
			sess.pc.setRemoteDescription( 
				new RTCSessionDescription(jsep), 
				function() {
					console.log('setRemoteDescription OFFER sucess');
				}, function(e) {
					console.error('failed to set remote description OFFER ');
			});
			
		
		} catch(e) {
			console.error('Exception' +e);
		}
	}
	var sdputils = {};
	sdputils.getSSRClist = function(sdp) {
		var l = sdp.split('\r\n'), last = 0, cur, ssrc = [];
		for(var i in l) {
			var j = l[i].indexOf("a=ssrc:");
			if(j > -1) {
				cur = parseInt(l[i].substr(7), 10);
				if(cur && (cur != last)){
					ssrc.push(cur);
					last = cur;
				}
			}
		}
		return ssrc;
	}
	proto.generateOffer = function(sess) {
		try {
			
			var mediaConstraints = null;
			/*
			if(webrtcDetectedBrowser == "firefox" || webrtcDetectedBrowser == "edge") {
				mediaConstraints = {
					'offerToReceiveAudio': true, 
					'offerToReceiveVideo': true,
				};
			} else {
				mediaConstraints = {
					'mandatory': {
						'OfferToReceiveAudio': true, 
						'OfferToReceiveVideo': true, 
					}
				};
			} */
			mediaConstraints = {
				'offerToReceiveAudio': true, 
				'offerToReceiveVideo': true,
			};
			if(sess.restart == true) {
			//	mediaConstraints.iceRestart = true;
			}
			console.log('creating offer', mediaConstraints);
			
			sess.pc.createOffer(
				function(offer) {
					var method = 'offer';
					console.dir(offer);
					console.log("Setting local description");
					if(sess.state == 3 ) {
						method = 'reoffer';
					}
					if((sess.restart == true) && sess.offer) {
						var ossrc = sdputils.getSSRClist(sess.offer.sdp),
							nssrc = sdputils.getSSRClist(offer.sdp);
						console.log('ssrc ', ossrc, nssrc);
						for(var i in nssrc) {
							//var r = new RegExp("a=ssrc:"+nssrc[i], 'g');
							//offer.sdp = offer.sdp.replace(r, "a=ssrc:"+ossrc[i]);
							//var ind = offer.sdp.indexOf("a=ssrc-group:FID");
							var r = new RegExp(nssrc[i], 'g');
							offer.sdp = offer.sdp.replace(r, ossrc[i]);
						}
					}
					sess.offer = offer;
					sess.pc.setLocalDescription(offer);
					if(sess.restart && sess.lanswer) {
						setTimeout(function(){
							rtcObj.onAnswer(sess, sess.lanswer);
						}, 1000);
					} else {
						var jsep = {
							"type": offer.type,
							"sdp": offer.sdp
						};
						rtcObj.emit(method, sess, jsep);
					}
					sess.restart = false;
				}, function(e) {
					console.error('Error in creating offer' +e);
				}, mediaConstraints);
		} catch (e) {
			console.error('Exception in createOffer ' +e );
		}
	} 
	proto.addScreen = function(sess, stream) {
		try {
			console.dir(sess.pc);
			sess.pending = 'offer'; 
			console.dir(sess.pc.getLocalStreams());
			sess.pc.addStream(stream);
			console.dir(sess.pc.getLocalStreams());
		} catch(e) {
			console.error('Exception in addScreen ' ,e );
		}
	}
	proto.removeScreen = function(sess, stream) {
		try {
			console.dir(sess.pc);
			sess.pending = 'offer'; 
			console.dir(sess.pc.getLocalStreams());
			sess.pc.removeStream(stream);
			console.dir(sess.pc.getLocalStreams());
		} catch(e) {
			console.error('Exception in removeScreen ' ,e );
		}
	}
	proto.createPC = function(sess) {
		try {
			var pc_config = {"iceServers": iceServers, "RTCBundlePolicy": "max-bundle", "RTCRtcpMuxPolicy": "require" };
			var pc_constraints = {
				"optional": [{"googIpv6":false},{"DtlsSrtpKeyAgreement": true}]
			};
			sess.state = 0;
			console.log('Creating peerconnection config:', pc_config);
			
			sess.pc = new RTCPeerConnection(pc_config, pc_constraints);
	
			sess.pc.onicecandidate = function(event) {
				console.log('on candidate')
				if (event.candidate == null) {
					console.log("End of candidates...");
					rtcObj.emit('icecomplete', sess);
				} else {
					var candidate = {
						"candidate": event.candidate.candidate,
						"sdpMid": event.candidate.sdpMid,
						"sdpMLineIndex": event.candidate.sdpMLineIndex
					};
					rtcObj.emit('candidate', sess, candidate);
				}
			};
			sess.pc.onremovestream = function(event) {
				console.log('Remote stream removed ', event);
				rtcObj.emit('removestream', sess, event.stream);
			};
			sess.pc.onnegotiationneeded = function(event) {
				try {
					console.log('Renegotiation needed pending: ' + sess.pendingi + ' ignore:' + sess.ignore);
					if(sess.ignore == true) { sess.ignore = false; return; };
					if(sess.pending == 'answer') {
						rtcObj.createAnswer(sess);
					} else if(sess.pending == 'offer') {
						rtcObj.generateOffer(sess);
					}
					sess.pending = '';
				} catch(e) {
					console.error('Exception in re neg ', e);
				}
			}	
			sess.pc.onaddstream = function(event) {
				console.log("Handling Remote Stream");
				console.dir(event);
				rtcObj.emit('rstream', sess, event.stream);
			};
			} catch(e) {
				console.error('Exception in create PC ', e);
			}
	}
	proto.onCandidate = function(sess, candidate) {
		try {
			if (sess && candidate) {
				sess.pc.addIceCandidate(new RTCIceCandidate(candidate),
					function() {
						console.log('Add candidate sucesses');
					}, function(err) {
						console.error('Unable to add candiate, Error:', err);
						console.dir(candidate);
				});
			}
		} catch(e) {
			console.error('Exception in onRemoteCandidate :' + e);
		}
	}
	proto.onAnswer = function(sess, jsep, confid) {
		try {
			if(!sess.pc && (sess.wsId.indexOf('_tab') > 0)) {
				window.postMessage({ type: 'ajTAnswer', data:{confid: confid, sessid:sess.wsId, 'jsep':jsep, url:window.location.href }}, '*');
				
				return;
			}
			sess.state = 3;
			sess.lanswer = jsep;
			sess.pc.setRemoteDescription(
				new RTCSessionDescription(jsep),
				function() {
					console.log(' Remote description(ANSWER) accepted ' + sess.wsId );
				}, function(e) {
					console.error(' Remote description(ANSWER) Failed'  + sess.wsId, e);
					console.dir(jsep);
			});
		} catch(e) {
			console.dir(jsep);
			console.error('Exception in onAnswer: ', e);
		}
	}
	proto.onReAnswer = function(sess, jsep) {
		try {
		if(sess) {
			if(sess.ssl_role == 'active') {
				console.log('reoffer checking offer passive to active ', jsep.sdp);
				jsep.sdp.replace(/a=setup:passive/g, 'a=setup:active');
				console.log('reoffer checked offer', jsep.sdp);
			}
			sess.state = 3;
			sess.pc.setRemoteDescription(
				new RTCSessionDescription(jsep),
				function() {
					console.log(' Remote description(REANSWER) accepted ' + sess.wsId );
				}, function(e) {
					console.error(' Remote description(REANSWER) Failed'  + sess.wsId);
					console.dir(jsep);
			});
		}} catch(e) {
			console.dir(jsep);
			console.error('Exception in onRemoteReAnswer: ', e);
		}
	}
	proto.onOffer = function(sess, jsep) {	
		try {
			this.createPC(sess);
			sess.pending = 'answer'; 
			sess.ssl_role = 'active';
			console.dir(this);
			this.processOffer(sess, jsep);
			if(true) { //janus
				return rtcObj.createAnswer(sess);
			}
			if(window.stream) {
				console.log('Adding stream');
				sess.pc.addStream(window.stream);
			}
			if(window.screenStream) {
				console.log('Adding screen stream');
				sess.pc.addStream(window.screenStream);
			}
		} catch(e) {
			console.error('Exception in on Offer', e);
		}
	}
	proto.onReOffer = function(sess, jsep) {	
		try {
			this.processOffer(sess, jsep);
			this.createAnswer(sess);
		} catch(e) {
			console.error('Exception in on reOffer', e);
		}
	}
	proto.createOffer = function(sess) {	
		this.createPC(sess);
		sess.pending = 'offer'; 
		sess.ssl_role = 'passive';
		if(sess.type == 'publisher_screen') {
			console.log('Adding screen stream');
			sess.pc.addStream(window.screenStream);
		} else if(window.stream) {
			console.log('Adding stream');
			sess.pc.addStream(window.stream);
		}
		//this.generateOffer(sess);
	}
	proto.close = function(session) {
		console.log('Stopping PC session');
		if(session && session.pc) {
			session.pc.close();
			session.pc = null;
		}
	}
	proto.on = function(name, cb) {
		try {
			this.ee.on(name, cb);
		} catch(e) {
			console.log("[WSWebRTC::on] exception " + e);
		}
	}

	proto.emit = function() {
		this.ee.emit.apply(this.ee, arguments);
	}
}
