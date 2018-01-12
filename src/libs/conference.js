'use strict';
import {webrtcDetectedBrowser, webrtcDetectedVersion} from './adapter.js';
import './EventEmitter.js';
import {WebRTC} from './webrtc.js';



export function Conference(args) {
	args = args || {};
	this.name = args.name;
	this.url = args.url;
	this.role = args.role;
	this.type = args.type;
	this.wsId = '';				// Login SessionId
	this.confid = '';
	this.ee = new EventEmitter();
	this.rtc = new WebRTC();

	var protocol = 'ajay';		// WebSocket Protocol for basic authentication
	var ws = null;				// WebSocket Object
	var isConnected = false;	// WebSocket state
	var toName ='', counter=0;
	var isRecording = false;
	var screenStream = null;
	var recorder = null;
	var confSess = {'id':'', 'type':'', 'role': 'candidate', 'host':'', 'state':0, 'via': 'ms', 'plist': [] } ;
	var selfObj = this;

	if(window.RTCPeerConnection == undefined ) {
		alert('Use latest version of Chrome or Firefox');
		return null;
	}

	function sendMessageToServer(msg) {
		try {
			if(ws !=null || ws != undefined) {
				//console.log('SEND: ' + msg);
				ws.send(msg);
			}
		} catch(e) {
			console.error('exception in websocket send' + e);
		}
	}

	var proto = Conference.prototype;
	proto.mute = function(audio, video) {
		selfObj.rtc.mute(audio, video);
	}
	proto.unmute = function(audio, video) {
		selfObj.rtc.unmute(audio, video);
	}
	proto.getStream = function(audio,video) {
		console.log('audio  feed conference', audio);
		console.log(' video feed conference', video);
		selfObj.rtc.getMedia(audio,video);
	}
	proto.switchStream = function(audioSource, videoSource) {
		var sess = confSess.plist[selfObj.wsId];
		if(sess) {
			selfObj.rtc.switchStream(sess, audioSource, videoSource);
		}
	}
	proto.startScrnShare = function(source) {
		if(this.confid && (confSess.state == 3)) {
			selfObj.rtc.getScreenMedia(source, function(err, stream) {
			if(err) {
				selfObj.emit('scrnStream', stream, err);
				return;
			}
			if(stream) {
				window.screenStream = screenStream = stream;
				stream.onended = function(e) {
					console.log('Stream ended ..', e);
					selfObj.stopScrnShare(stream);
				}
				 var track = stream.getVideoTracks()[0];
				 if(track) {
					track.onended = function(e){
							console.log(' Screenshare Vtrack ended  state: '+track.readyState+' kind:'+track.kind, e);
							selfObj.stopScrnShare(stream);
					};
				 }
				selfObj.emit('scrnStream', stream);

				if(confSess.via == 'ms') {
					var msg = {'type':'request','method':'addScreen', 'data':{'confid':selfObj.confid, 'name':selfObj.name}};
					sendMessageToServer(JSON.stringify(msg));
					return;
				}
				for(var id in confSess.plist) {
					var sess = confSess.plist[id];
					if(sess) {
						selfObj.rtc.addScreen(sess, stream);
					}
				}
			}
			});
		}
	}
	proto.stopScrnShare = function(lstream) {
		lstream = lstream || screenStream;
		if(lstream){
			if(confSess.state == 3) {
				if(confSess.via == 'ms') {
					var msg = {'type':'request','method':'removeScreen', 'data':{'confid':this.confid, 'name':this.name}};
					sendMessageToServer(JSON.stringify(msg));
					var sess = confSess.plist[selfObj.wsId+'_screen'];
					if(sess) {
						selfObj.rtc.close(sess);
					}
				} else {
					for(var id in confSess.plist) {
						var sess = confSess.plist[id];
						if(sess) {
							selfObj.rtc.removeScreen(sess, lstream);
						}
					}
				}
			}
			this.rtc.stopStream(lstream);
			selfObj.emit('stopScrn', '');
			window.screenStream = screenStream = null;
		}
	}
	proto.updateDetails = function(confid, data) {
		if(this.confid && (confSess.state == 3)) {
			data.confid = this.confid;
			var msg = {'type':'request','method':'updateDetails', 'wsId': this.wsId, 'data':data};
			sendMessageToServer(JSON.stringify(msg));
		}
	}
	proto.onCodeText = function(confid, data) {
		if(this.version < data.ver) {
			this.version = data.ver;
		}
		this.emit('ctext', confid, data.text, data.ver);
	}
	proto.sendCode = function(text) {
		if(this.confid && (confSess.state == 3)) {
			this.lastSent = new Date().getTime();
			this.version++;
			var msg = {'type':'request','method':'ctext', 'wsId': this.wsId, 'data':
				{'confid':this.confid, 'text': text, 'ver':this.version}};
			sendMessageToServer(JSON.stringify(msg));
		}
	}

	proto.sendDirectIM = function(confid, wsId, content) {
        if(confSess.state == 3) {
          var msg = {'type':'request','method':'directIM', 'data':{'confid':this.confid, 'name':this.name, 'wsId':wsId, 'content':content}};
     			sendMessageToServer(JSON.stringify(msg));
     		}
  }

	proto.sendIM = function(confid, content) {
		if(confSess.state == 3) {
			var msg = {'type':'request','method':'im', 'data':{'confid':this.confid, 'name':this.name, 'content':content}};
			sendMessageToServer(JSON.stringify(msg));
		}
	}

	proto.onRemoteCandidate = function(confid, data) {
		try {
			this.rtc.onCandidate(confSess.plist[data.wsId], data.candidate);
		} catch(e) {
			console.error('Exception in onRemoteCandidate :' , e);
		}
	}

	proto.onRemoteOffer = function(confid, data) {
		try {
			console.log('Got remote Offer');
			if(data.handle) {
				confSess.plist[data.handle] = {'handle' : data.handle, 'type':'listener'};
				this.rtc.onOffer(confSess.plist[data.handle], data.jsep);
				return;
			}
			confSess.plist[data.wsId] = {'wsId': data.wsId, 'name': data.name, 'role': data.role, 'screen':data.screen, 'isRecording': false};
			if(data.role == 'candidate') {
				confSess.cand = confSess.plist[data.wsId];
				confSess.remote = data.name;
			}
			this.rtc.onOffer(confSess.plist[data.wsId], data.jsep);
			this.emit('pjoined', confSess.plist[data.wsId]);
		} catch(e) {
			console.error('Exception in remoteOffer ' , e);
		}
	}
	proto.onRemoveStream = function(confid, data) {
		var sess = confSess.plist[data.wsId];
		if(sess) {
			this.rtc.close(sess);
			this.emit('removeStream', sess);
		}
		delete confSess.plist[data.wsId];
	}
	proto.onPartcipLeft = function(confid, data) {
		try {
		console.log('PLeft conf: ' + confid + ' wsid:' + data.wsId + ' name:' + data.name + ' role: ' + data.role);
		var sess = confSess.plist[data.wsId];
		if(sess) {
			this.rtc.close(sess);
			this.emit('removeStream', sess);
			this.emit('pleft', sess);

		}
		delete confSess.plist[data.wsId];
		}catch(e) {
			console.error('Exception in onPartcipLeft', e);
		}
	}
	proto.onAccepted = function(confid, data) {
		try {
			console.log('call accepted' + confid + ' cand: ' +  confSess.cand.name + ' = '+ confSess.cand.wsId);
			this.rtc.createOffer(confSess.plist[confSess.cand.wsId]);
			this.emit('answered', confSess.cand);
		} catch(e) {
			console.error('Exception in onAccepted ' + e);
		}
	}
	proto.onJoinedRoom = function(confid, data) {
		try {
			confSess.plist = confSess.plist || {};
			var sess = {'wsId':selfObj.wsId, 'type':'publisher'};
			confSess.plist[selfObj.wsId] = sess;
			selfObj.rtc.createOffer(sess);
			if((selfObj.role == 'host') && (selfObj.type != 'unlisted')) {
                var sess2 = {'wsId':selfObj.wsId+'_tab', 'type':'publisher_tab'};
                confSess.plist[sess2.wsId] = sess2;
                selfObj.rtc.extStartSession(confSess.id, sess2.wsId, selfObj.role, selfObj.name, sess2);
            }
		} catch(e) {
			console.error('Exception in proto.onJoinedRoom', e);
		}
	}
	proto.onJoined = function(confid, data) {
		try {
			console.log('joined session state: ' + data.state + ' id:' + confid + ' status:'  + data.status);
			if(data.status == 'failed' || data.confid == null) {
				console.log(data.status);
				console.log(data.confid);
				alert(data.reason || 'Expired link');
				return;
			}
			confSess.id = this.confid = data.confid;
			confSess.state = 3;
			confSess.plist = data.plist;
			// if(data.state == 3)
			if(data.via == 'ms') {


			} else {
				console.dir(confSess.plist);
				Object.keys(confSess.plist).forEach(function(key, index ) {
					var sess = confSess.plist[key];
						if(sess && (sess.wsId != selfObj.wsId)) {
						setTimeout(function() {
							selfObj.rtc.createOffer(sess);
						}, (1000 * index));
					}
				});
			}
			this.emit('joinedConf', data.confid, data.state, data.status || 'sucesses');
			if(data.text) this.emit('ctext', confid, data.text, data.ver);
		} catch(e) {
			console.error('Exception in onJoined', e);
		}
	}
	proto.answer = function(id) {
		var msg = {'type':'response', 'method':'incomingCall','wsId':this.wsId, 'data':{'confid':this.confid, 'state':3}};
		sendMessageToServer(JSON.stringify(msg));
		confSess.state = 3;
	}

	proto.onIncomingCall = function(id, data) {
		try {
		var from = data.from;
		/*
		if(confSess.isBusy == true) {
			var msg = {'type':'response', 'method':'incomingCall','wsId':this.wsId, 'data':{'confid':id,  'state':4, 'reason':'Already in call'}};
			sendMessageToServer(JSON.stringify(msg));
			console.warn('already in call, so rejecting incoming call from: ' + from);
			return;
		} */
		this.confid = id;
		confSess.id = id;
		confSess.type = 'incoming';
		confSess.remote = from;
		confSess.isBusy = true;
		confSess.state = 2;
		console.log('processing incoming call ' + this.confid + 'from:' + from);
		var msg = {'type':'response', 'method':'incomingCall','wsId':this.wsId, 'data':{'confid':this.confid, 'state':2, 'reason':'Ringing'}};
		sendMessageToServer(JSON.stringify(msg));
		this.emit('incomingcall', id, from);
		} catch(e) {
			console.error('Exception in incomingcall', e);
		}
	}
	proto.onConfStarted = function(data) {
		try {
		confSess = new Object();
		confSess.id = this.confid = data.confid;
		confSess.role = this.role;
		confSess.remote = '';
		confSess.cand = null;
		confSess.plist = new Array();
		confSess.state = 1;
		confSess.via = 'ms';
		this.emit('confstarted', data);
		} catch(e) {
			console.error('Exception in onConfSt ', e);
		}
	}
	proto.startConf = function(interviewType, interviewId, env, authheader) {
		var msg = {'type':'request', 'method':'startConf', 'data':{'name':this.name, 'role': this.role, 'confType':this.type, 'interviewTypeId':interviewType,'interviewId':interviewId, 'env':env, 'authheader':authheader, 'useragent': webrtcDetectedBrowser + '-' + webrtcDetectedVersion}};
		sendMessageToServer(JSON.stringify(msg));
	}
	proto.joinConf = function(confid, role, valid, interviewType, interviewId, env, authheader) {
		//console.log('join conf proto in confeerence, getting confid:' + confid + ' role is:' + this.role);
		this.confid = confid;
		this.interviewType = interviewType;
		this.interviewId = interviewId;
		confSess = new Object();
		confSess.role = this.role;
		confSess.type = this.type;
		confSess.cand = {};
		confSess.plist = [];
		confSess.state = 1;
		confSess.via = 'ms';
		var msg = {'type':'request', 'method':'joinConf', 
		'data':{'name':this.name, 'confid': this.confid, 'role': this.role, 'confType':confSess.type, 
		'interviewTypeId':interviewType,'interviewId' : interviewId, 'env':env, valid:valid, 'authheader':authheader, 'useragent': webrtcDetectedBrowser + '-' + webrtcDetectedVersion}};
		sendMessageToServer(JSON.stringify(msg));
		console.log('Joing conf r:' + this.role);
	}
	proto.leaveConf = function() {
		var msg = {'type':'request', 'method':'leaveConf', 'wsId':this.wsId, 'data':{'confid': this.confid, 'role': this.role}};
		sendMessageToServer(JSON.stringify(msg));
		confSess.state = 5;
		selfObj.stopScrnShare();
		cleanup(this.confid);
	}
	proto.uploader = function(source, data, pname) {
		try {
			if(source ) {
				var msg = {'type':'request', 'method':'stream', 'wsId':this.wsId, 'data':{'confid': this.confid, 'source':source, 'name': pname}};
				ws.send(JSON.stringify(msg));
			}
			console.log('source: ' + source, data)
			if(data != null)
				ws.send(data);
		} catch(e) {
			console.error('Exception in sendFileStream:', e);
		}
	}.bind(this);
	function cleanup(confid) {
		try {
			if(isRecording) {
				//stopRecording();
			}
			console.log('Cleaning the Call ######## ');
			if(screenStream) {
				selfObj.stopScrnShare();
			}
			var parent = document.getElementById("container");
			for(var id in confSess.plist) {
				var sess = confSess.plist[id];
				if(sess) {
					if(sess.wsId.indexOf('_tab')>0) {
                        selfObj.rtc.extStopSession(confid, sess.wsId, sess);
                    } else {
						selfObj.rtc.close(sess);
						selfObj.emit('removeStream', sess);
						if(sess.stream2) {
							selfObj.emit('removeStream', sess, sess.stream2);
						}
					}
				}
				delete confSess.plist[id];

			}
			delete confSess.plist;
			confSess.plist = [];
			confSess.id = '';
			confSess.type = '';
			confSess.remote = '';
			confSess.state = 0;
			confSess.isBusy = false;
			confSess.iceDone = false;
			selfObj.confid = null;
			selfObj.emit('hangup', confid);
		} catch(e) {
			console.error('Exception in cleanup' + e);
		}
	}
	proto.speaking = function(is_speaking){
		var msg = {'type':'request', 'method':'speaking', 'wsId':this.wsId, 'data': {'confid':this.confid, 'wsId':this.wsId, 'speaking':is_speaking}};
		sendMessageToServer(JSON.stringify(msg));
	}
	proto.hangup = function(){
		try {
		var msg = {'type':'request', 'method':'hangup', 'wsId':this.wsId, 'data':{'confid':this.confid, 'state': (confSess.state > 2)?5:4}};
		sendMessageToServer(JSON.stringify(msg));
		selfObj.stopScrnShare();
		confSess.state = 5;
		cleanup(this.confid);
		} catch(e) {
			console.error('Exception in hangup: ' + e);
			console.dir(confSess);
		}
	}
	proto.register = function() {
		console.log('Registering :' + this.name + 'UA: ' + webrtcDetectedBrowser + '_' +webrtcDetectedVersion);
		var msg = {'type':'request', 'method':'register', 'data':
		{'name':this.name, 'role': this.role, 'sessionId':session, 'useragent': webrtcDetectedBrowser + '-' + webrtcDetectedVersion}};
		sendMessageToServer(JSON.stringify(msg));
	}

	proto.onMessage = function(msg) {
		try {
		if(typeof msg === "string"){
			var json = JSON.parse(msg);
			var data = json.data;
			//console.log('RECV: type:' + json.type + ' method:' + json.method + ' Reason:' + ((data && data.reason)? data.reason:''));
			if(json.type == 'request') {
				switch(json.method){
				case 'ctext' : {
					this.onCodeText(data.confid, data);
				}
				break;
				case 'incomingCall': {
					selfObj.onIncomingCall(data.confid, data);
				}
				break;
				case 'activeCall':
				case 'speaking':
				case 'updateDetails':
				case 'delCall': {
					this.emit(json.method, data);
				}
				break;
				case 'addBuddy':
				case 'delCand':
				case 'addAdmin':
				case 'delBuddy': {
					this.emit(json.method, data.wsId, data.name);
				}
				break;
				case 'dimMsg': {
				  this.emit('dimMsg',  data);
				}
				break;
				case 'imMsg' : {
					this.emit('imMsg', data.name, data.content);
				}
				break;
				case 'videolist': {
					this.emit('videolist', data.name, data.file);
				}
				break;
				case 'pleft': {
					this.onPartcipLeft(data.confid, data);
				}
				break;
				case 'removestream': {
					this.onRemoveStream(data.confid, data);
				}
				break;
				case 'offer': {
					this.onRemoteOffer(data.confid, data);
				}
				break;
				case 'reoffer': {
					this.rtc.onReOffer(confSess.plist[data.wsId], data.jsep);
				}
				break;
				case 'answer': {
					this.rtc.onAnswer(confSess.plist[data.wsId], data.jsep, confSess.id);
				}
				break;
				case 'reanswer': {
					this.rtc.onReAnswer(confSess.plist[data.wsId], data.jsep, confSess.id);
				}
				break;
				case 'candidate': {
					this.onRemoteCandidate(data.confid, data);
				}
				break;
				default:
					console.log('unhadled request ' + json.method);
				}
			} else if(json.type == 'response') {
				switch(json.method){
				case 'ctext' : {

				}
				break;
				case 'register': {
					try {
						this.wsId = json.wsId;
						console.log('registered with id: ' + this.wsId);
						data.wsId = this.wsId;
						this.emit('connected', data);
					} catch(e) {
						console.error('Execp reg resp', e);
					}
				}
				break;
				case 'startConf': {
					try {
						this.wsId = json.wsId;
						data.wsId = this.wsId;
						this.onConfStarted(data);
						confSess.state = 3;
					} catch(e) {
						console.error('Execp startConf resp', e);
					}
				}
				break;
				case 'im':
				case 'directIM':
					console.log(' msg recv im resp');
				break;
				case 'call':
				case 'callstatus':
				case 'confstatus':{
					if(data.state <= 2) {
						// Trying & Ringing
					} else if(data.state == 3) { // accepted
						confSess.state = 3;
						this.onAccepted(data.confid, data);
					} else if(data.state > 3) {
						console.log('state:' + data.state + ' Reason: ' + data.reason);
						cleanup(data.confid);
					}
				}
				break;
				case 'joinConf': {
					this.wsId = json.wsId;
					this.onJoined(data.confid, data);
				}
				break;
				case 'joinedRoom': {
					this.onJoinedRoom(data.confid, data);
				}
				break;
				case 'addScreen': {
					var sess = {'wsId':selfObj.wsId+'_screen', 'type':'publisher_screen'};
					confSess.plist[sess.wsId] = sess;
					selfObj.rtc.createOffer(sess);
				}
				break;
				case 'addTab' : {
                    var sess = {'wsId':selfObj.wsId+'_tab', 'type':'publisher_tab'};
                    confSess.plist[sess.wsId] = sess;
                    selfObj.rtc.requestTabOffer(sess, confSess.id);
                }
                break
				case 'stream': {
					console.log('file submit sucesses ' + data.file);
					//document.getElementById("submitB").textContent = "Uploaded";
				}
				break;
				case 'answer': {
					this.rtc.onAnswer(confSess.plist[data.wsId], data.jsep, confSess.id);
				}
				break;
				default:
					console.log('unhadled response ' + json.method);
				}
			}
		}
		} catch(e) {
			console.error('Exception in onMessage method:' + json.method, e);
		}
	}

	proto.mutep = function(stream, audio, video) {
		selfObj.rtc.mutep(stream, audio, video);
	}

	proto.unmutep = function(stream, audio, video) {
		selfObj.rtc.unmutep(stream, audio, video);
	}

	proto.connect = function() {
		try {
			ws = new WebSocket(this.url, protocol);
			ws.onopen = function() {
				isConnected = true;
				console.log('websocket opened');
		//		setTimeout(selfObj.register, 500);
				selfObj.emit('connected', null);
			//	selfObj.rtc.getMedia(); //comment here
			};
			ws.onclose = function() {
				console.log('Webscoket closed');
				isConnected = false;
				ws = null;
			}
			ws.onerror = function(e) {
				console.error('error in websocket connection url: ' + nodeurl + ' e:' + e);
				isConnected = false;
			}
			ws.onmessage = function(event) {
				try {
					if(typeof event.data == 'string') {
						selfObj.onMessage(event.data);
					} else {
						selfObj.onInfileData(event.data);
					}
				} catch(e) {
					console.error('Exception in ws message ' + e);
				}
			}
		} catch(e) {
			console.error('Exception in connect', e);
		}
	}
	proto.on = function(name, cb) {
		try { this.ee.on(name, cb);
		} catch(e) { console.error("[conf:on] excep ", e);
		}
	}
	proto.emit = function(event) {
		this.ee.emit.apply(this.ee, arguments);
	}

	this.rtc.on('offer', function(sess, jsep) {
		var msg = {'type':'request', 'method':'offer', 'wsId': selfObj.wsId,
				'data':{'confid': selfObj.confid, 'wsId': sess.wsId, 'handle':sess.handle, 'type': sess.type, 'jsep':jsep}};
		sendMessageToServer(JSON.stringify(msg));
	});
	this.rtc.on('reoffer', function(sess, jsep) {
		var msg = {'type':'request', 'method':'reoffer', 'wsId': selfObj.wsId,
				'data':{'confid': selfObj.confid, 'wsId': sess.wsId, 'handle':sess.handle, 'jsep':jsep}};
		sendMessageToServer(JSON.stringify(msg));
	});
	this.rtc.on('answer', function(sess, jsep) {
		var msg = {'type':'request', 'method':'answer', 'wsId': selfObj.wsId,
				'data':{'confid': selfObj.confid, 'wsId': sess.wsId, 'handle':sess.handle, 'jsep':jsep}};
		sendMessageToServer(JSON.stringify(msg));
	});
	this.rtc.on('reanswer', function(sess, jsep) {
		var msg = {'type':'request', 'method':'reanswer', 'wsId': selfObj.wsId,
				'data':{'confid': selfObj.confid, 'wsId': sess.wsId, 'handle':sess.handle, 'jsep':jsep}};
		sendMessageToServer(JSON.stringify(msg));
	});
	this.rtc.on('candidate', function(sess, candidate) {
		var msg = {'type':'request', 'method':'candidate', 'wsId': selfObj.wsId,
				'data':{'confid': selfObj.confid, 'wsId': sess.wsId, 'handle':sess.handle, 'type': (sess.type?sess.type:'listener'), 'candidate': candidate}};
		sendMessageToServer(JSON.stringify(msg));
	});
	this.rtc.on('stream', function( stream) {
	//	selfObj.register();
		selfObj.emit('stream', stream);

	});
	this.rtc.on('rstream', function(sess, stream) {
		selfObj.emit('remStream', sess, stream);
	});
	this.rtc.on('removestream', function(sess, stream) {
		selfObj.emit('removeStream', sess, stream);
	});
	this.rtc.on('tready', function(sess) {
        var msg = {'type':'request','method':'addTab', 'data':{'confid':selfObj.confid, 'name':selfObj.name}};
        sendMessageToServer(JSON.stringify(msg));
        selfObj.emit('recStarted', sess);
    });
    this.rtc.on('tended', function(sess, stream) {
        var msg = {'type':'request','method':'removeTab', 'data':{'confid':selfObj.confid, 'name':selfObj.name}};
        sendMessageToServer(JSON.stringify(msg));
    });
	this.rtc.on('icecomp', function(sess) {
		confSess.iceDone = true;
	});
	this.rtc.on('error', function(sess) {

	});
}

