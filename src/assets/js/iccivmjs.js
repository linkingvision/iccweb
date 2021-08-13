(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["iccivmjs"] = factory();
	else
		root["iccivmjs"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ivm/Iccplayer.js":
/*!**************************!*\
  !*** ./ivm/Iccplayer.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
	value: true
}));
/**
 * Common function
 */
function createRTCSessionDescription(msg) {
	var SessionDescription = new RTCSessionDescription(msg);
	return SessionDescription;
}

var gStrH5SPlayerVersion = 'Iccplayer r1.1.0829';
console.log('[Icc]', gStrH5SPlayerVersion);

/** 
 *=================WebRTC based Player
 *
 */
/** 
 * Interface with h5s WebRTC player API
 * @constructor
 * @param 
 var conf = {
	videoid:'h5sVideo1', //{string} - id of the video element tag
	videodom: h5svideodom1, //{object} - video dom. if there has videoid, just use the videoid
	protocol: window.location.protocol, // {string} - 'http:' or 'https:'
	host: window.location.host, //{string} - 'localhost:8080'
	rootpath:window.location.pathname, // {string} - path of the app running
	device:'device1', // {string} - token of device
	token:'token1', // {string} - token of stream
	hlsver:'v1', //{string} -  v1 is for ts, v2 is for fmp4 
	session:'c1782caf-b670-42d8-ba90-2244d0b0ee83', //{string} - session got from login
	consolelog: 'true' // 'true' or 'false' enable/disable console.log
};

 _    _ _____     _____  _                       _____ _______ _____ 
| |  | | ____|   |  __ \| |                     |  __ \__   __/ ____|
| |__| | |__  ___| |__) | | __ _ _   _  ___ _ __| |__) | | | | |     
|  __  |___ \/ __|  ___/| |/ _` | | | |/ _ \ '__|  _  /  | | | |     
| |  | |___) \__ \ |    | | (_| | |_| |  __/ |  | | \ \  | | | |____ 
|_|  |_|____/|___/_|    |_|\__,_|\__, |\___|_|  |_|  \_\ |_|  \_____|
                                  __/ |                              
                                 |___/                               

*/

function IccPlayerRTC(conf) {
	this.wsSocket;
	this.keepaliveTimerId;
	this.bNeedReconnect = false;
	this.bDisConnected = false;

	this._debug = true;
	if (conf.consolelog !== undefined) {
		if (conf.consolelog === 'false') {
			this._debug = false;
		}
	}

	this._conf = conf;

	this._videoId = conf.videoid;

	this._pbconf = conf.pbconf;

	this._token = conf.token;

	this._nReconnectCnt = 1;

	//if(this._debug === true) console.log(conf.token, this._videoId);
	if (this._videoId === undefined) {
		this._videodom = conf.videodom;
		if (this._debug === true) console.log("[RTC] use dom directly", conf.token);
	} else {
		this._videodom = document.getElementById(this._videoId);
		if (this._debug === true) console.log("[RTC] use videoid", conf.token);
	}

	this.video = this._videodom;

	this.pc = null;

	this.pcOptions = { "optional": [{ "DtlsSrtpKeyAgreement": true }] };

	this.mediaConstraints = {
		mandatory: {
			'offerToReceiveAudio': true,
			'offerToReceiveVideo': true
		}
	};
	/*
 this.pcConfig         = {"iceServers": [
 	{
 	  'urls': 'turn:192.168.100.142?transport=tcp',
 	  'credential': '12345678',
 	  'username': 'linkingvision'
 	}
 	
 	],"iceTransportPolicy":"relay"};
    
 */
	this.pcConfig = { "iceServers": [] };

	this.earlyCandidates = [];
	this._strPosterUri;

	if (this._pbconf != undefined && this._pbconf.showposter == 'false') {} else {
		this._strPosterUri = this._conf.protocol + '//' + this._conf.host + this._conf.rootpath + 'api/v1/GetImage?token=' + this._token + '&session=' + this._conf.session;
		if (this._debug === true) console.log("[WS] connect src", conf.token);
		this._videodom.setAttribute('poster', this._strPosterUri);
	}

	//if (this._pbconf != undefined && this._pbconf.callback != undefined)
	//{
	//if(this._debug === true) console.log("connect src =============", this._pbconf.callback, this._pbconf.userdata);
	//	this._pbconf.callback('UPDATE_TIME', 'update time 1111', this._pbconf.userdata);
	//}

}

IccPlayerRTC.prototype.ReconnectFunction = function () {
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
	if (this.bNeedReconnect === true) {
		if (this._debug === true) console.log('[RTC] Reconnect...');

		var strReconnectUrl = this._strPosterUri + "&update=" + this._nReconnectCnt;
		this._videodom.setAttribute('poster', strReconnectUrl);
		if (this._debug === true) console.log('[RTC] Reconnect image', strReconnectUrl);
		this._nReconnectCnt++;
		this.setupWebSocket(this._token);
		this.bNeedReconnect = false;
	}
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
};
IccPlayerRTC.prototype.H5SWebSocketClient = function (h5spath) {
	var socket;
	if (this._debug === true) console.log("[RTC] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") {
			if (typeof MozWebSocket != "undefined") {
				socket = new MozWebSocket('ws://' + this._conf.host + h5spath);
			} else {
				socket = new WebSocket('ws://' + this._conf.host + h5spath);
			}
		}
		if (this._conf.protocol == "https:") {
			//alert(this._conf.host);
			if (this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined") {
				socket = new MozWebSocket('wss://' + this._conf.host + h5spath);
			} else {
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}
		}
		if (this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
};

IccPlayerRTC.prototype.keepaliveTimer = function () {
	try {
		var j = {};
		j.type = "keepalive";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
		if (this._debug === true) console.log(e);
	}
};

/*
* RTCPeerConnection IceCandidate callback
*/
IccPlayerRTC.prototype.onIceCandidate = function (event) {
	if (event.candidate) {
		if (this._debug === true) console.log("[RTC] onIceCandidate currentice", event.candidate);
		//if (this.pc.currentRemoteDescription)  {
		var currentice;
		currentice = event.candidate;
		if (this._debug === true) console.log("[RTC] onIceCandidate currentice", JSON.stringify(currentice));
		var msgremoteice = JSON.parse(JSON.stringify(currentice));
		msgremoteice.type = 'remoteice';
		if (this._debug === true) console.log("[RTC] onIceCandidate currentice new", JSON.stringify(msgremoteice));
		this.wsSocket.send(JSON.stringify(msgremoteice));

		//} else {
		//	this.earlyCandidates.push(event.candidate);
		//}
	} else {
		if (this._debug === true) console.log("End of candidates.");
	}
};

/*
* RTCPeerConnection AddTrack callback
*/
IccPlayerRTC.prototype.onTrack = function (event) {
	if (this._debug === true) console.log("[RTC] Remote track added:" + JSON.stringify(event));
	var stream;
	if (event.streams) {
		stream = event.streams[0];
	} else {
		stream = event.stream;
	}
	var videoElement = this._videodom;
	//videoElement.src = URL.createObjectURL(stream);
	//URL.createObjectURL(stream) is deprecated
	videoElement.srcObject = stream;
	//videoElement.setAttribute("playsinline", true);
	videoElement.play();
};

/*
* create RTCPeerConnection 
*/
IccPlayerRTC.prototype.createPeerConnection = function () {
	if (this._debug === true) console.log("[RTC] createPeerConnection  config: " + JSON.stringify(this.pcConfig) + " option:" + JSON.stringify(this.pcOptions));
	var pc = new RTCPeerConnection(this.pcConfig, this.pcOptions);
	var streamer = this;
	pc.onicecandidate = function (evt) {
		streamer.onIceCandidate.call(streamer, evt);
	};
	if (typeof pc.ontrack != "undefined") {
		pc.ontrack = function (evt) {
			streamer.onTrack.call(streamer, evt);
		};
	} else {
		pc.onaddstream = function (evt) {
			streamer.onTrack.call(streamer, evt);
		};
	}
	pc.oniceconnectionstatechange = function (evt) {
		if (streamer._debug === true) console.log("[RTC] oniceconnectionstatechange  state: " + pc.iceConnectionState);
		return;
		//var videoElement = streamer._videodom;
		//if (videoElement) {
		//	if (pc.iceConnectionState === "connected") {
		//		videoElement.style.opacity = "1.0";
		//	}			
		//	else if (pc.iceConnectionState === "disconnected") {
		//		//videoElement.style.opacity = "0.25";
		//	}			
		//	else if ( (pc.iceConnectionState === "failed") || (pc.iceConnectionState === "closed") )  {
		//		//videoElement.style.opacity = "0.5";
		//	}		
		//}
	};

	if (this._debug === true) console.log("[RTC] Created RTCPeerConnnection with config: " + JSON.stringify(this.pcConfig) + "option:" + JSON.stringify(this.pcOptions));
	return pc;
};

IccPlayerRTC.prototype.ProcessRTCOffer = function (msg) {
	if (this._debug === true) console.log("[RTC] ProcessRTCOffer", msg);
	try {
		this.pc = this.createPeerConnection();
		this.earlyCandidates.length = 0;
		var streamer = this;

		if (this._debug === true) console.log("[RTC] createRTCSessionDescription ");
		this.pc.setRemoteDescription(createRTCSessionDescription(msg));
		// create answer
		this.pc.createAnswer(this.mediaConstraints).then(function (sessionDescription) {
			if (streamer._debug === true) console.log("[RTC] Create answer:" + JSON.stringify(sessionDescription));

			streamer.pc.setLocalDescription(sessionDescription, function () {
				if (streamer._debug === true) console.log("[RTC] ProcessRTCOffer createAnswer", sessionDescription);
				streamer.wsSocket.send(JSON.stringify(sessionDescription));
			}, function () {});
		}, function (error) {
			alert("[RTC] Create awnser error:" + JSON.stringify(error));
		});
	} catch (e) {
		this.disconnect();
		alert("[RTC] connect error: " + e);
	}
};

IccPlayerRTC.prototype.ProcessRemoteIce = function (msg) {
	if (this._debug === true) console.log("[RTC] ProcessRemoteIce", msg);

	try {
		var candidate = new RTCIceCandidate({
			sdpMLineIndex: msg.sdpMLineIndex,
			candidate: msg.candidate
		});
		if (this._debug === true) console.log("[RTC] ProcessRemoteIce", candidate);

		if (this._debug === true) console.log("[RTC] Adding ICE candidate :" + JSON.stringify(candidate));
		this.pc.addIceCandidate(candidate, function () {/*console.log ("[RTC] addIceCandidate OK");*/}, function (error) {
			console.log("[RTC] addIceCandidate error:" + JSON.stringify(error));
		});
	} catch (e) {
		//this.disconnect();
		alert("connect ProcessRemoteIce error: " + e);
	}
};

IccPlayerRTC.prototype.onWebSocketData = function (msg) {
	if (msg.data instanceof ArrayBuffer) {}
	//if(this._debug === true) console.log("ArrayBuffer =====");


	//if (typeof message !== 'string')
	if (typeof msg.data === 'string') {
		//if(this._debug === true) console.log("String ======");
	}

	if (this._debug === true) console.log("[RTC] RTC received ", msg.data);
	var msgrtc = JSON.parse(msg.data);
	if (this._debug === true) console.log("[RTC] Get Message type ", msgrtc.type);
	if (msgrtc.type === 'offer') {
		if (this._debug === true) console.log("[RTC] Process Message type ", msgrtc.type);
		this.ProcessRTCOffer(msgrtc);
		return;
	}

	if (msgrtc.type === 'iceserver') {
		if (this._debug === true) console.log("[RTC] Process Message type ", msgrtc.type);
		this.pcConfig.iceServers = msgrtc.iceServers;
		this.pcConfig.iceTransportPolicy = msgrtc.iceTransportPolicy;
		if (this._debug === true) console.log("[RTC] Iceserver:", this.pcConfig);
		return;
	}

	if (msgrtc.type === 'remoteice') {
		if (this._debug === true) console.log("[RTC] Process Message type ", msgrtc.type);
		this.ProcessRemoteIce(msgrtc);
		return;
	}

	if (this._pbconf != undefined && this._pbconf.callback != undefined) {
		this._pbconf.callback(msg.data, this._pbconf.userdata);
	}
};

IccPlayerRTC.prototype.setupWebSocket = function (token) {
	this.video.autoplay = true;

	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5srtcapi";
	//var token = this.video.getAttribute('token');

	var streamprofile = 'main';
	if (this._conf.streamprofile === undefined) {} else {
		streamprofile = this._conf.streamprofile;
	}

	if (this._pbconf === undefined) {
		h5spath = this._conf.rootpath + h5spath + "?token=" + token + "&profile=" + streamprofile + '&session=' + this._conf.session;
	} else {
		var serverpb = 'false';
		var filename = 'fake';
		if (this._pbconf.serverpb === undefined) {} else {
			serverpb = this._pbconf.serverpb;
		}

		if (this._pbconf.filename === undefined) {} else {
			filename = this._pbconf.filename;
		}
		h5spath = this._conf.rootpath + h5spath + "?token=" + token + "&playback=true" + "&profile=" + streamprofile + "&serverpb=" + serverpb + "&begintime=" + encodeURIComponent(this._pbconf.begintime) //this._pbconf.begintime
		+ "&endtime=" + encodeURIComponent(this._pbconf.endtime) //this._pbconf.endtime
		+ "&filename=" + filename //file name
		+ '&session=' + this._conf.session;
	}

	if (this._debug === true) console.log(h5spath);

	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if (this._debug === true) console.log("[RTC] setupWebSocket", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);

	this.wsSocket.onopen = function () {
		if (this.h5._debug === true) console.log("[RTC] wsSocket.onopen", this.h5);

		var j = {};
		j.type = "open";
		this.h5.wsSocket.send(JSON.stringify(j));

		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);
		if (this.h5._pbconf != undefined && this.h5._pbconf.autoplay === 'true') {
			this.h5.start();
		}
	};

	this.wsSocket.onclose = function () {
		if (this._debug === true) console.log("[RTC] wsSocket.onclose", this.h5);
		if (this.h5.bDisConnected === true) {
			if (this.h5._debug === true) console.log("[RTC] wsSocket.onclose disconnect");
		} else {
			this.h5.bNeedReconnect = true;
		}

		this.h5.CleanupWebSocket(this.h5);
	};
};

IccPlayerRTC.prototype.CleanupWebSocket = function (h5sPlayer) {
	if (h5sPlayer._debug === true) console.log('[RTC] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
};

/** 
 * Connect a websocket Stream to videoElement 
*/
IccPlayerRTC.prototype.connect = function () {
	/* start connect to server */
	this.setupWebSocket(this._token);
	this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 3000);
};

/** 
 * Disconnect a websocket Stream and clear videoElement source
*/
IccPlayerRTC.prototype.disconnect = function () {
	if (this._debug === true) console.log("[RTC] disconnect", this);
	this.bDisConnected = true;
	clearInterval(this.reconnectTimerId);

	if (this.wsSocket != null) {
		this.wsSocket.close();
		this.wsSocket = null;
	}

	if (this._videodom) {
		this._videodom.src = "";
	}

	if (this.pc) {
		try {
			this.pc.close();
		} catch (e) {
			if (this._debug === true) console.log("[RTC] close peer connection failed:" + e);
		}
		this.pc = null;
	}

	if (this._debug === true) console.log("[RTC] disconnect", this);
};

IccPlayerRTC.prototype.start = function () {
	try {
		var j = {};
		j.cmd = "H5_START";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
		if (this._debug === true) console.log(e);
	}
};

IccPlayerRTC.prototype.pause = function () {
	try {
		var j = {};
		j.cmd = "H5_PAUSE";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
		if (this._debug === true) console.log(e);
	}
};

IccPlayerRTC.prototype.resume = function () {
	try {
		var j = {};
		j.cmd = "H5_RESUME";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
		if (this._debug === true) console.log(e);
	}
};

IccPlayerRTC.prototype.seek = function (nTime) {
	try {
		var j = {};
		j.cmd = "H5_SEEK";
		j.nSeekTime = nTime;
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
		if (this._debug === true) console.log(e);
	}
};

IccPlayerRTC.prototype.speed = function (nSpeed) {
	try {
		var j = {};
		j.cmd = "H5_SPEED";
		j.nSpeed = nSpeed;
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
		if (this._debug === true) console.log(e);
	}
};

/** 
 *=================WebRTC based Push
 *
 */
/** 
 * Interface with h5s WebRTC Push API
 * @constructor
 * @param 
var conf = {
	localvideoid:'h5sVideoLocal', //{string} - id of the local video element tag
	//localvideodom: h5svideodomlocal, //{object} - local video dom. if there has videoid, just use the videoid
	protocol: window.location.protocol, //http: or https:
	host: window.location.host, //localhost:8080
	rootpath:'/', // {string} - path of the app running
	user:'user1', // {string} - user name
	type:'media', // {string} - media or sharing
	facingmode:'environment', // {string} - user or environment; desktop remove this config 
	callback: EventCB, //Callback for the event
	userdata: null, // user data
	session: strSession //session got from login
	consolelog: 'true' // 'true' or 'false' enable/disable console.log
};
 _    _ _____     _____ _______ _____ _____           _     
| |  | | ____|   |  __ \__   __/ ____|  __ \         | |    
| |__| | |__  ___| |__) | | | | |    | |__) |   _ ___| |__  
|  __  |___ \/ __|  _  /  | | | |    |  ___/ | | / __| '_ \ 
| |  | |___) \__ \ | \ \  | | | |____| |   | |_| \__ \ | | |
|_|  |_|____/|___/_|  \_\ |_|  \_____|_|    \__,_|___/_| |_|
*/

function IccRTCPush(conf) {
	this.wsSocket;
	this.keepaliveTimerId;
	this.bNeedReconnect = false;
	this.bDisConnected = false;

	this._debug = true;
	if (conf.consolelog !== undefined) {
		if (conf.consolelog === 'false') {
			this._debug = false;
		}
	}

	this._conf = conf;

	this._videoId = conf.localvideoid;

	this._user = conf.user;

	this._nReconnectCnt = 1;

	//if(this._debug === true) console.log(conf.token, this._videoId);
	if (this._videoId === undefined) {
		this._localvideodom = conf.localvideodom;
		if (this._debug === true) console.log("[PUSH] use dom directly", conf.user);
	} else {
		this._localvideodom = document.getElementById(this._videoId);
		if (this._debug === true) console.log("[PUSH] use videoid", conf.user);
	}

	this.video = this._localvideodom;

	this.pc = null;

	this.pcOptions = { "optional": [{ "DtlsSrtpKeyAgreement": true }] };

	this.mediaConstraints = {
		mandatory: {
			'offerToReceiveAudio': false,
			'offerToReceiveVideo': false
		}
	};
	/*
 this.pcConfig         = {"iceServers": [
 	{
 	  'urls': 'turn:192.168.100.142?transport=tcp',
 	  'credential': '12345678',
 	  'username': 'linkingvision'
 	}
 	
 	],"iceTransportPolicy":"relay"};
    
 */
	this.pcConfig = { "iceServers": [] };

	this.earlyCandidates = [];
}

IccRTCPush.prototype.ReconnectFunction = function () {
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
	if (this.bNeedReconnect === true) {
		if (this._debug === true) console.log('[PUSH] Reconnect...');

		this.setupWebSocket(this._user);
		this.bNeedReconnect = false;
	}
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
};

IccRTCPush.prototype.H5SWebSocketClient = function (h5spath) {
	var socket;
	if (this._debug === true) console.log("[PUSH] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") {
			if (typeof MozWebSocket != "undefined") {
				socket = new MozWebSocket('ws://' + this._conf.host + h5spath);
			} else {
				socket = new WebSocket('ws://' + this._conf.host + h5spath);
			}
		}
		if (this._conf.protocol == "https:") {
			//alert(this._conf.host);
			if (this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined") {
				socket = new MozWebSocket('wss://' + this._conf.host + h5spath);
			} else {
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}
		}
		if (this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
};

IccRTCPush.prototype.keepaliveTimer = function () {
	try {
		var j = {};
		j.type = "keepalive";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
		if (this._debug === true) console.log(e);
	}
};

/*
* RTCPeerConnection IceCandidate callback
*/
IccRTCPush.prototype.onIceCandidate = function (event) {
	if (event.candidate) {
		if (this._debug === true) console.log("[PUSH] onIceCandidate currentice", event.candidate);
		//if (this.pc.currentRemoteDescription)  {
		var currentice;
		currentice = event.candidate;
		if (this._debug === true) console.log("[PUSH] onIceCandidate currentice", JSON.stringify(currentice));
		var msgremoteice = JSON.parse(JSON.stringify(currentice));
		msgremoteice.type = 'remoteice';
		if (this._debug === true) console.log("[PUSH] onIceCandidate currentice new", JSON.stringify(msgremoteice));
		this.wsSocket.send(JSON.stringify(msgremoteice));

		//} else {
		//	this.earlyCandidates.push(event.candidate);
		//}
	} else {
		if (this._debug === true) console.log("End of candidates.");
	}
};

/*
* RTCPeerConnection AddTrack callback
*/
IccRTCPush.prototype.onTrack = function (event) {
	if (this._debug === true) console.log("[PUSH] Remote track added:" + JSON.stringify(event));
	var stream;
	if (event.streams) {
		stream = event.streams[0];
	} else {
		stream = event.stream;
	}

	return;
	//var videoElement = this._localvideodom;

	//videoElement.srcObject = stream;

	//videoElement.play();
};

/*
* create RTCPeerConnection 
*/
IccRTCPush.prototype.createPeerConnection = function () {
	if (this._debug === true) console.log("[PUSH] createPeerConnection  config: " + JSON.stringify(this.pcConfig) + " option:" + JSON.stringify(this.pcOptions));
	var pc = new RTCPeerConnection(this.pcConfig, this.pcOptions);
	var streamer = this;
	pc.onicecandidate = function (evt) {
		streamer.onIceCandidate.call(streamer, evt);
	};
	if (typeof pc.ontrack != "undefined") {
		pc.ontrack = function (evt) {
			streamer.onTrack.call(streamer, evt);
		};
	} else {
		pc.onaddstream = function (evt) {
			streamer.onTrack.call(streamer, evt);
		};
	}
	pc.oniceconnectionstatechange = function (evt) {
		if (streamer._debug === true) console.log("[PUSH] oniceconnectionstatechange  state: " + pc.iceConnectionState);
		return;
		//var videoElement = streamer._localvideodom;
		//if (videoElement) {
		//	if (pc.iceConnectionState === "connected") {
		//		videoElement.style.opacity = "1.0";
		//	}			
		//	else if (pc.iceConnectionState === "disconnected") {
		//		//videoElement.style.opacity = "0.25";
		//	}			
		//	else if ( (pc.iceConnectionState === "failed") || (pc.iceConnectionState === "closed") )  {
		//		//videoElement.style.opacity = "0.5";
		//	}		
		//}
	};

	if (this._debug === true) console.log("[PUSH] Created RTCPeerConnnection with config: " + JSON.stringify(this.pcConfig) + "option:" + JSON.stringify(this.pcOptions));
	return pc;
};

IccRTCPush.prototype.SetBitrate = function (pc, bitrate) {
	if ((adapter.browserDetails.browser === 'chrome' || adapter.browserDetails.browser === 'safari' || adapter.browserDetails.browser === 'firefox' && adapter.browserDetails.version >= 64) && 'RTCRtpSender' in window && 'setParameters' in window.RTCRtpSender.prototype) {
		var senders = pc.getSenders();
		for (var i = 0; i !== senders.length; ++i) {

			var sender = senders[i];
			if (sender.track.kind == 'video') {
				var parameters = sender.getParameters();
				if (!parameters.encodings) {
					parameters.encodings = [{}];
				}
				//console.log(sender, parameters);

				parameters.encodings[0].maxBitrate = bitrate * 1000;

				sender.setParameters(parameters).then(function () {
					//console.log(bitrate);
				}).catch(function (e) {
					return console.error(e);
				});
			}
		}
	}
};

IccRTCPush.prototype.CreateOffer = function () {
	var _this = this;

	if (this._debug === true) console.log("[PUSH] CreateOffer");
	try {
		this.pc = this.createPeerConnection();
		this.earlyCandidates.length = 0;
		var streamer = this;
		var videoTracks = this._streamlocal.getVideoTracks();
		var audioTracks = this._streamlocal.getAudioTracks();
		if (videoTracks.length > 0) {
			console.log('[PUSH] Using video device:', videoTracks[0].label);
		}
		if (audioTracks.length > 0) {
			console.log('[PUSH] Using audio device:', audioTracks[0].label);
		}
		this._streamlocal.getTracks().forEach(function (track) {
			return _this.pc.addTrack(track, _this._streamlocal);
		});

		var supportsSetCodecPreferences = window.RTCRtpTransceiver && 'setCodecPreferences' in window.RTCRtpTransceiver.prototype;

		try {
			if (supportsSetCodecPreferences) {
				var codecString = 'video/H264';
				if (this._codec == "VP9") {
					codecString = 'video/VP9';
				} else if (this._codec == "H264") {
					codecString = 'video/H264';
				}
				//AV1 here

				var ret = window.RTCRtpSender.getCapabilities('video');
				var codecs = ret.codecs;
				var selectedCodec = [];

				for (var i = 0; i !== codecs.length; ++i) {
					var codec = codecs[i];
					if ([codecString].includes(codec.mimeType)) {
						selectedCodec.push(codec);
					}
				}

				if (streamer._debug === true) console.log("[PUSH] Select codec:", selectedCodec);
				var transceiver = this.pc.getTransceivers().find(function (t) {
					return t.sender && t.sender.track === _this._streamlocal.getVideoTracks()[0];
				});
				transceiver.setCodecPreferences(selectedCodec);
			}
		} catch (e) {
			//nothing todo
		}

		this.pc.createOffer(this.mediaConstraints).then(function (sessionDescription) {
			if (streamer._debug === true) console.log("[PUSH] Create offer:" + JSON.stringify(sessionDescription));

			streamer.pc.setLocalDescription(sessionDescription, function () {
				var offer = sessionDescription;
				//if(streamer._debug === true) console.log('[PUSH] createOffer ', JSON.stringify(offer));
				streamer.wsSocket.send(JSON.stringify(offer));
			}, function () {});
		}, function (error) {
			alert("[PUSH ]Create offer error:" + JSON.stringify(error));
		});
		return;
	} catch (e) {
		this.disconnect();
		alert("connect error: " + e);
	}
};

IccRTCPush.prototype.ProcessAnswer = function (msg) {
	if (this._debug === true) console.log("[PUSH] ProcessAnswer", msg);
	try {
		this.pc.setRemoteDescription(createRTCSessionDescription(msg));
	} catch (e) {
		this.disconnect();
		alert("connect error: " + e);
	}

	this.SetBitrate(this.pc, this._bitrate);
};

IccRTCPush.prototype.ProcessRemoteIce = function (msg) {
	if (this._debug === true) console.log("[PUSH] ProcessRemoteIce", msg);

	try {
		var candidate = new RTCIceCandidate({
			sdpMid: msg.sdpMid,
			sdpMLineIndex: msg.sdpMLineIndex,
			candidate: msg.candidate
		});
		if (this._debug === true) console.log("[PUSH] ProcessRemoteIce", candidate);

		if (this._debug === true) console.log("[PUSH] Adding ICE candidate :" + JSON.stringify(candidate));
		this.pc.addIceCandidate(candidate, function () {/*console.log ("[PUSH] addIceCandidate OK");*/}, function (error) {
			console.log("[PUSH] addIceCandidate error:" + JSON.stringify(error));console.log(error);
		});
	} catch (e) {
		//this.disconnect();
		alert("connect ProcessRemoteIce error: " + e);
	}
};

IccRTCPush.prototype.onWebSocketData = function (msg) {
	if (msg.data instanceof ArrayBuffer) {
		//if(this._debug === true) console.log("ArrayBuffer =====");
	}

	if (typeof msg.data === 'string') {
		//if(this._debug === true) console.log("String ======");
	}

	if (this._debug === true) console.log("[PUSH] RTC received ", msg.data);
	var msgrtc = JSON.parse(msg.data);
	if (this._debug === true) console.log("[PUSH] Get Message type ", msgrtc.type);

	if (msgrtc.type === 'iceserver') {
		if (this._debug === true) console.log("[PUSH] Process Message type ", msgrtc.type);
		this.pcConfig.iceServers = msgrtc.iceServers;
		//this.pcConfig.iceTransportPolicy = msgrtc.iceTransportPolicy;
		if (this._debug === true) console.log("[PUSH] Iceserver:", this.pcConfig);
		this.CreateOffer();
		return;
	}

	if (msgrtc.type === 'answer') {
		if (this._debug === true) console.log("[PUSH] Process Message type ", msgrtc.type);
		this.ProcessAnswer(msgrtc);
		return;
	}

	if (msgrtc.type === 'remoteice') {
		if (this._debug === true) console.log("[PUSH] Process Message type ", msgrtc.type);
		this.ProcessRemoteIce(msgrtc);
		return;
	}

	if (this._conf.callback != undefined) {
		this._conf.callback(msg.data, this._conf.userdata);
	}
};

IccRTCPush.prototype.setupWebSocket = function (token) {
	this.video.autoplay = true;

	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5srtcpushapi";
	//var token = this.video.getAttribute('token');


	h5spath = this._conf.rootpath + h5spath + "?token=" + token + '&conftoken=' + this._conftoken + "&type=" + this._conf.type + '&session=' + this._conf.session;

	if (this._debug === true) console.log(h5spath);

	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if (this._debug === true) console.log("[PUSH] setupWebSocket", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);

	this.wsSocket.onopen = function () {
		if (this.h5._debug === true) console.log("[PUSH] wsSocket.onopen", this.h5);

		var j = {};
		j.type = "open";
		this.h5.wsSocket.send(JSON.stringify(j));

		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);
		if (this.h5._pbconf != undefined && this.h5._pbconf.autoplay === 'true') {
			this.h5.start();
		}
	};

	this.wsSocket.onclose = function () {
		if (this._debug === true) console.log("[PUSH] wsSocket.onclose", this.h5);
		if (this.h5.bDisConnected === true) {
			if (this.h5._debug === true) console.log("[PUSH] wsSocket.onclose disconnect");
		} else {
			this.h5.bNeedReconnect = true;
		}

		this.h5.CleanupWebSocket(this.h5);
	};
};

IccRTCPush.prototype.CleanupWebSocket = function (h5sPlayer) {
	if (h5sPlayer._debug === true) console.log('[PUSH] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
};

/** 
 * Connect a websocket Stream to videoElement 
*/
//IccRTCPush.prototype.connect = function(videoin, codec, bitrate, resolution, audioin, bDisplayMedia) {
IccRTCPush.prototype.connect = function (conftoken, param) {
	/* start connect to server */
	//var bDisplayMedia = false;
	this._param = param;
	this._conftoken = conftoken;
	this._videoin = param.videoin;
	this._codec = param.codec;
	this._bitrate = param.bitrate;
	this._resolution = param.resolution;
	this._audioin = param.audioin;
	if (this._debug === true) console.log('[PUSH] videoin:', param.videoin, 'codec:', param.codec, 'bitrate:', param.bitrate, 'resolution:', param.resolution, 'audioin:', param.audioin);

	var w = 1280;
	var h = 720;
	if (param.resolution == 'QVGA') {
		w = 320;h = 240;
	} else if (param.resolution == 'VGA') {
		w = 640;h = 480;
	} else if (param.resolution == 'D1') {
		w = 720;h = 576;
	} else if (param.resolution == '720P') {
		w = 1280;h = 720;
	} else if (param.resolution == '1080P') {
		w = 1920;h = 1080;
	} else if (param.resolution == '4K') {
		w = 4096;h = 2160;
	} else if (param.resolution == '8K') {
		w = 7680;h = 4320;
	}
	var audioConf;
	var videoConf;

	var facingmode = '';
	var bFacingmode = false;
	if (this._param.facingmode !== undefined) {
		facingmode = this._param.facingmode;
		if (this._debug === true) console.log("[PUSH] facing mode:", facingmode);
		bFacingmode = true;
	}
	if (this._param.audio == 'true') {
		//audioConf = {deviceId: {exact: param.audioin}};
		audioConf = true;
	} else {
		audioConf = false;
	}
	if (this._param.video == 'true') {
		videoConf = bFacingmode ? { facingMode: { exact: facingmode }, width: { exact: w }, height: { exact: h } } : { deviceId: { exact: param.videoin }, width: { exact: w }, height: { exact: h } };
	} else {
		videoConf = false;
	}
	console.log(param.videoin);
	try {
		console.log(param.videoin);
		var constraints = {
			audio: audioConf,
			//audio: false,
			video: videoConf
		};
		try {
			var Iccplayer = this;
			if (this._param.desktopshare == false) {
				navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
					Iccplayer._localvideodom.srcObject = stream;
					Iccplayer._streamlocal = stream;

					Iccplayer.setupWebSocket(Iccplayer._user);
				}).catch(function (err) {
					var strMsg = '[PUSH] getUserMedia failed: ' + err.name + " " + err.message;
					alert(strMsg);
					return;
				});
			} else {
				navigator.mediaDevices.getDisplayMedia({ video: true }).then(function (stream) {
					Iccplayer._localvideodom.srcObject = stream;
					Iccplayer._streamlocal = stream;

					Iccplayer.setupWebSocket(Iccplayer._user);
				}).catch(function (err) {
					alert('[PUSH] getUserMedia failed:', err.name + ": " + err.message);
					return;
				});
			}
			//do need reconnect
			//this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 3000);
		} catch (e) {
			var strMsg = '[PUSH] getUserMedia failed: ' + err.name + " " + err.message;
			alert(strMsg);
			return;
		}
	} catch (e) {
		if (this._debug === true) console.log(e);
		return;
	}
};

IccRTCPush.prototype.send = function (token, message) {
	var j = {};
	j.type = "message";
	j.user = this._user;
	j.token = token;
	j.msg = message;
	this.wsSocket.send(JSON.stringify(j));
};

//TODO add control message here

/** 
 * Disconnect a websocket Stream and clear videoElement source
*/
IccRTCPush.prototype.disconnect = function () {
	if (this._debug === true) console.log("[PUSH] disconnect", this);
	this.bDisConnected = true;
	clearInterval(this.reconnectTimerId);

	if (this.wsSocket != null) {
		this.wsSocket.close();
		this.wsSocket = null;
	}

	if (this._localvideodom) {
		this._localvideodom.src = "";
	}

	if (this.pc) {
		try {
			this.pc.close();
		} catch (e) {
			if (this._debug === true) console.log("[PUSH] close peer connection failed:" + e);
		}
		this.pc = null;
	}

	if (this._debug === true) console.log("[PUSH] disconnect", this);
};

function IccRTCGetCapability(success, conf, error) {
	//console.log(conf)
	var capability = {};
	var videocodec = [];
	var audioin = [];
	var audioout = [];
	var videoin = [];
	// local video loopback
	if (conf == null) {} else {
		var _conf = conf;
		var _resolution = conf.resolution;

		var w = 1280;
		var h = 720;
		if (_resolution == 'QVGA') {
			w = 320;h = 240;
		} else if (_resolution == 'VGA') {
			w = 640;h = 480;
		} else if (_resolution == 'D1') {
			w = 720;h = 576;
		} else if (_resolution == '720P') {
			w = 1280;h = 720;
		} else if (_resolution == '1080P') {
			w = 1920;h = 1080;
		} else if (_resolution == '4K') {
			w = 4096;h = 2160;
		} else if (_resolution == '8K') {
			w = 7680;h = 4320;
		}
		var facingmode = '';
		var bFacingmode = false;
		if (_conf.facingmode !== undefined) {
			facingmode = _conf.facingmode;
			bFacingmode = true;
		}

		var audioConf;
		var videoConf;
		var _videoId = conf.localvideoid;
		var _localvideodom = document.getElementById(_videoId);
		console.log(_localvideodom, _videoId, document.getElementById(_videoId));
		if (_conf.audio == ' true') {
			console.log(_conf.audio);
			audioConf = { deviceId: { exact: conf.audioin } };
		} else {
			audioConf = false;
		}
		if (_conf.video == 'true') {
			videoConf = bFacingmode ? { facingMode: { exact: facingmode }, width: { exact: w }, height: { exact: h } } : { deviceId: { exact: conf.videoin }, width: { exact: w }, height: { exact: h }, codec: { exact: conf.codec }, bitrate: { exact: conf.bitrate } };
		} else {
			videoConf = false;
		}
		console.log(conf.bitrate);
		var constraints = {
			audio: audioConf,
			// video:true,
			video: videoConf
		};
		navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
			if (stream) {
				if (_localvideodom != null) {
					console.log(stream);
					console.log(_localvideodom);
					_localvideodom.srcObject = stream;
					_localvideodom.play();
				}
				// stream.getTracks().forEach(track => {
				// 	track.stop();
				// });
			}
		}).catch(function (err) {
			var strMsg = '[PUSH] getUserMedia failed: ' + err.name + " " + err.message;
			alert(strMsg);
			return;
		});
	}

	if (success == null) {
		return;
	} else {
		var supportsSetCodecPreferences = window.RTCRtpTransceiver && 'setCodecPreferences' in window.RTCRtpTransceiver.prototype;

		if (supportsSetCodecPreferences) {
			var ret = window.RTCRtpSender.getCapabilities('video');
			var codecs = ret.codecs;
			//console.log(codecs);
			var bVP9 = false;
			var bH264 = false;
			for (var i = 0; i !== codecs.length; ++i) {
				var codec = codecs[i];
				//console.log(codec);
				if (['video/red', 'video/ulpfec', 'video/rtx'].includes(codec.mimeType)) {
					continue;
				}
				if (['video/VP9'].includes(codec.mimeType)) {
					bVP9 = true;
					continue;
				}
				if (['video/H264'].includes(codec.mimeType)) {
					bH264 = true;
					continue;
				}
			}
			if (bVP9 == true) {
				videocodec.push("VP9");
			}
			if (bH264 == true) {
				videocodec.push("H264");
			}
		} else {
			videocodec.push("Default");
		}
		navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
			//console.log(deviceInfos);
			for (var _i = 0; _i !== deviceInfos.length; ++_i) {
				var deviceInfo = deviceInfos[_i];
				var dev = {};
				dev['id'] = deviceInfo.deviceId;
				dev['name'] = deviceInfo.label;

				if (deviceInfo.kind === 'audioinput') {
					audioin.push(dev);
				} else if (deviceInfo.kind === 'audiooutput') {
					audioout.push(dev);
				} else if (deviceInfo.kind === 'videoinput') {
					videoin.push(dev);
				} else {}
			}

			capability['videocodec'] = videocodec;
			capability['videoin'] = videoin;
			capability['audioin'] = audioin;
			capability['audioout'] = audioout;

			//console.log(capability);

			success(capability);
			console.log(videoin);
		}).catch(function (err) {
			if (success == null) {
				return;
			}
			alert('[PUSH] enumerateDevices failed', e);
			return;
		});
	}
}

exports.IccPlayerRTC = IccPlayerRTC;
exports.IccRTCPush = IccRTCPush;
exports.IccRTCGetCapability = IccRTCGetCapability;

/***/ }),

/***/ "./ivm/audio_bridge.js":
/*!*****************************!*\
  !*** ./ivm/audio_bridge.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(/*! ./events.js */ "./ivm/events.js");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioBridge = function (_EventEmitter) {
  _inherits(AudioBridge, _EventEmitter);

  function AudioBridge(room) {
    _classCallCheck(this, AudioBridge);

    var _this = _possibleConstructorReturn(this, (AudioBridge.__proto__ || Object.getPrototypeOf(AudioBridge)).call(this));

    _this.room = room;
    return _this;
  }

  _createClass(AudioBridge, [{
    key: "isLive",
    value: function isLive() {
      return this.plugin && this.plugin.webrtcStuff.pc.iceConnectionState !== "completed" && this.plugin.webrtcStuff.pc.iceConnectionState !== "connected";
    }
  }, {
    key: "isAudioMuted",
    value: function isAudioMuted() {
      return this.plugin.isAudioMuted();
    }
  }, {
    key: "muteAudio",
    value: function muteAudio() {
      var _this2 = this;

      return new Promise(function (success, error) {
        _this2.plugin.send({
          message: { request: "configure", muted: true },
          success: success,
          error: error
        });
      });
    }
  }, {
    key: "unmuteAudio",
    value: function unmuteAudio() {
      var _this3 = this;

      return new Promise(function (success, error) {
        _this3.plugin.send({
          message: { request: "configure", muted: false },
          success: success,
          error: error
        });
      });
    }
  }, {
    key: "changeBandwidth",
    value: function changeBandwidth(bitrate) {
      var _this4 = this;

      return new Promise(function (success, error) {
        _this4.plugin.send({
          message: { request: "configure", bitrate: bitrate },
          success: success,
          error: error
        });
      });
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this5 = this;

      var join_opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve, reject) {
        _this5.room.janus.attach({
          plugin: "janus.plugin.audiobridge",
          opaqueId: "" + _this5.room.user.id,
          success: function success(pluginHandle) {
            _this5.plugin = pluginHandle;
            var register = {
              request: "join",
              room: _this5.room.room_id,
              id: _this5.room.user.id,
              display: _this5.room.user.name,
              pin: _this5.pin,
              muted: true,
              join_opts: join_opts
            };
            _this5.plugin.send({
              message: register,
              success: resolve
            });
          },
          error: reject,
          consentDialog: function consentDialog(on) {},
          mediaState: function mediaState(medium, on) {
            _this5.emit("mediaState", medium, on);
          },
          webrtcState: function webrtcState(on) {
            _this5.emit("webrtcState", on);
          },
          onmessage: function onmessage(msg, jsep) {
            console.log("Got message", msg);
            _this5.emit("onmessage", msg, jsep);

            var event = msg.audiobridge;
            if (event) {
              if (event === "joined") {
                _this5.plugin.createOffer({
                  media: {
                    video: false,
                    audio: true,
                    audioSend: true,
                    captureDesktopAudio: { echoCancellation: true }
                  }, // This is an audio only room
                  success: function success(jsep) {
                    console.debug("Got SDP!");
                    console.debug(jsep);
                    var publish = { request: "configure", muted: true };
                    _this5.plugin.send({
                      message: publish,
                      jsep: jsep,
                      success: function success() {
                        _this5.emit("joined", msg, jsep);
                      }
                    });
                  },
                  error: reject
                });
              } else if (event === "destroyed") {
                _this5.emit(event, msg, jsep);
              } else if (event === "event") {
                if (msg.error !== undefined && msg.error !== null) {
                  _this5.emit("handle_error", msg);
                } else if (msg.publishers !== undefined && msg.publishers !== null) {
                  _this5.emit("publishers", msg, jsep);
                } else if (msg["leaving"] !== undefined && msg["leaving"] !== null) {
                  _this5.emit("leaving", msg, jsep);
                } else if (msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                  _this5.emit("unpublished", msg, jsep);
                }
              }
            }

            if (jsep !== undefined && jsep !== null) {
              console.debug("Handling SDP as well...");
              console.debug(jsep);
              _this5.plugin.handleRemoteJsep({ jsep: jsep });
            }
          },

          onlocalstream: function onlocalstream(stream) {
            console.log(" ::: Got a local stream :::");
            _this5.emit("onlocalstream", stream);
          },
          onremotestream: function onremotestream(stream) {
            console.log(" ::: Got remote stream :::");
            _this5.remote_stream = stream;
            _this5.emit("onremotestream", stream);
          },
          oncleanup: function oncleanup() {
            _this5.emit("oncleanup");
          }
        });
      });
    }
  }, {
    key: "publish",
    value: function publish() {
      var _this6 = this;

      var medial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve, reject) {
        var media = {
          audioRecv: false,
          videoRecv: false,
          audioSend: true,
          videoSend: false,
          video: false
          // ...medial,
        };
        for (var key in medial) {
          media[key] = medial[key];
        }
        _this6.plugin.createOffer({
          media: media, // This is an audio only room
          simulcast: false,
          success: function success(jsep) {
            console.debug(jsep);
            var publish = { request: "configure", muted: false };

            _this6.plugin.send({
              message: publish,
              jsep: jsep,
              success: resolve,
              error: reject
            });
          },
          error: reject
        });
      });
    }
  }]);

  return AudioBridge;
}(_events2.default);

exports.default = AudioBridge;

/***/ }),

/***/ "./ivm/events.js":
/*!***********************!*\
  !*** ./ivm/events.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = (typeof Reflect === 'undefined' ? 'undefined' : _typeof(Reflect)) === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
//module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)));
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {

  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }var doError = type === 'error';

  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) {
      ReflectApply(listeners[i], this, args);
    }
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  checkListener(listener);

  events = this._events;
  if (events === undefined) return this;

  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }

    if (list.length === 1) events[type] = list[0];

    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;

  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined) return [];

  var evlistener = events[type];
  if (evlistener === undefined) return [];

  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1];
  }list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

exports.default = EventEmitter;

/***/ }),

/***/ "./ivm/janus.js":
/*!**********************!*\
  !*** ./ivm/janus.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
	value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
	The MIT License (MIT)

	Copyright (c) 2016 Meetecho

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the "Software"),
	to deal in the Software without restriction, including without limitation
	the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included
	in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
	THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.
 */

// List of sessions

Janus.sessions = {};

Janus.isExtensionEnabled = function () {
	if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
		// No need for the extension, getDisplayMedia is supported
		return true;
	}
	if (window.navigator.userAgent.match('Chrome')) {
		var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10);
		var maxver = 33;
		if (window.navigator.userAgent.match('Linux')) maxver = 35; // "known" crash in chrome 34 and 35 on linux
		if (chromever >= 26 && chromever <= maxver) {
			// Older versions of Chrome don't support this extension-based approach, so lie
			return true;
		}
		return Janus.extension.isInstalled();
	} else {
		// Firefox and others, no need for the extension (but this doesn't mean it will work)
		return true;
	}
};

var defaultExtension = {
	// Screensharing Chrome Extension ID
	extensionId: 'hapfgfdkleiggjjpfpenajgdnfckjpaj',
	isInstalled: function isInstalled() {
		return document.querySelector('#janus-extension-installed') !== null;
	},
	getScreen: function getScreen(callback) {
		var pending = window.setTimeout(function () {
			var error = new Error('NavigatorUserMediaError');
			error.name = 'The required Chrome extension is not installed: click <a href="#">here</a> to install it. (NOTE: this will need you to refresh the page)';
			return callback(error);
		}, 1000);
		this.cache[pending] = callback;
		window.postMessage({ type: 'janusGetScreen', id: pending }, '*');
	},
	init: function init() {
		var cache = {};
		this.cache = cache;
		// Wait for events from the Chrome Extension
		window.addEventListener('message', function (event) {
			if (event.origin != window.location.origin) return;
			if (event.data.type == 'janusGotScreen' && cache[event.data.id]) {
				var callback = cache[event.data.id];
				delete cache[event.data.id];

				if (event.data.sourceId === '') {
					// user canceled
					var error = new Error('NavigatorUserMediaError');
					error.name = 'You cancelled the request for permission, giving up...';
					callback(error);
				} else {
					callback(null, event.data.sourceId);
				}
			} else if (event.data.type == 'janusGetScreenPending') {
				console.log('clearing ', event.data.id);
				window.clearTimeout(event.data.id);
			}
		});
	}
};

Janus.useDefaultDependencies = function (deps) {
	var f = deps && deps.fetch || fetch;
	var p = deps && deps.Promise || Promise;
	var socketCls = deps && deps.WebSocket || WebSocket;

	return {
		newWebSocket: function newWebSocket(server, proto) {
			return new socketCls(server, proto);
		},
		extension: deps && deps.extension || defaultExtension,
		isArray: function isArray(arr) {
			return Array.isArray(arr);
		},
		webRTCAdapter: deps && deps.adapter || adapter,
		httpAPICall: function httpAPICall(url, options) {
			var fetchOptions = {
				method: options.verb,
				headers: {
					'Accept': 'application/json, text/plain, */*'
				},
				cache: 'no-cache'
			};
			if (options.verb === "POST") {
				fetchOptions.headers['Content-Type'] = 'application/json';
			}
			if (options.withCredentials !== undefined) {
				fetchOptions.credentials = options.withCredentials === true ? 'include' : options.withCredentials ? options.withCredentials : 'omit';
			}
			if (options.body) {
				fetchOptions.body = JSON.stringify(options.body);
			}

			var fetching = f(url, fetchOptions).catch(function (error) {
				return p.reject({ message: 'Probably a network error, is the server down?', error: error });
			});

			/*
    * fetch() does not natively support timeouts.
    * Work around this by starting a timeout manually, and racing it agains the fetch() to see which thing resolves first.
    */

			if (options.timeout) {
				var timeout = new p(function (resolve, reject) {
					var timerId = setTimeout(function () {
						clearTimeout(timerId);
						return reject({ message: 'Request timed out', timeout: options.timeout });
					}, options.timeout);
				});
				fetching = p.race([fetching, timeout]);
			}

			fetching.then(function (response) {
				if (response.ok) {
					if (_typeof(options.success) === _typeof(Janus.noop)) {
						return response.json().then(function (parsed) {
							options.success(parsed);
						}).catch(function (error) {
							return p.reject({ message: 'Failed to parse response body', error: error, response: response });
						});
					}
				} else {
					return p.reject({ message: 'API call failed', response: response });
				}
			}).catch(function (error) {
				if (_typeof(options.error) === _typeof(Janus.noop)) {
					options.error(error.message || '<< internal error >>', error);
				}
			});

			return fetching;
		}
	};
};

Janus.useOldDependencies = function (deps) {
	var jq = deps && deps.jQuery || jQuery;
	var socketCls = deps && deps.WebSocket || WebSocket;
	return {
		newWebSocket: function newWebSocket(server, proto) {
			return new socketCls(server, proto);
		},
		isArray: function isArray(arr) {
			return jq.isArray(arr);
		},
		extension: deps && deps.extension || defaultExtension,
		webRTCAdapter: deps && deps.adapter || adapter,
		httpAPICall: function httpAPICall(url, options) {
			var payload = options.body !== undefined ? {
				contentType: 'application/json',
				data: JSON.stringify(options.body)
			} : {};
			var credentials = options.withCredentials !== undefined ? { xhrFields: { withCredentials: options.withCredentials } } : {};

			return jq.ajax(jq.extend(payload, credentials, {
				url: url,
				type: options.verb,
				cache: false,
				dataType: 'json',
				async: options.async,
				timeout: options.timeout,
				success: function success(result) {
					if (_typeof(options.success) === _typeof(Janus.noop)) {
						options.success(result);
					}
				},
				error: function error(xhr, status, err) {
					if (_typeof(options.error) === _typeof(Janus.noop)) {
						options.error(status, err);
					}
				}
			}));
		}
	};
};

Janus.noop = function () {};

Janus.dataChanDefaultLabel = "JanusDataChannel";

// Note: in the future we may want to change this, e.g., as was
// attempted in https://github.com/meetecho/janus-gateway/issues/1670
Janus.endOfCandidates = null;

// Stop all tracks from a given stream
Janus.stopAllTracks = function (stream) {
	try {
		// Try a MediaStreamTrack.stop() for each track
		var tracks = stream.getTracks();
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var mst = _step.value;

				Janus.log(mst);
				if (mst) {
					mst.stop();
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	} catch (e) {
		// Do nothing if this fails
	}
};

// Initialization
Janus.init = function (options) {
	options = options || {};
	options.callback = typeof options.callback == "function" ? options.callback : Janus.noop;
	if (Janus.initDone) {
		// Already initialized
		options.callback();
	} else {
		if (typeof console == "undefined" || typeof console.log == "undefined") {
			console = { log: function log() {} };
		}
		// Console logging (all debugging disabled by default)
		Janus.trace = Janus.noop;
		Janus.debug = Janus.noop;
		Janus.vdebug = Janus.noop;
		Janus.log = Janus.noop;
		Janus.warn = Janus.noop;
		Janus.error = Janus.noop;
		if (options.debug === true || options.debug === "all") {
			// Enable all debugging levels
			Janus.trace = console.trace.bind(console);
			Janus.debug = console.debug.bind(console);
			Janus.vdebug = console.debug.bind(console);
			Janus.log = console.log.bind(console);
			Janus.warn = console.warn.bind(console);
			Janus.error = console.error.bind(console);
		} else if (Array.isArray(options.debug)) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = options.debug[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var d = _step2.value;

					switch (d) {
						case "trace":
							Janus.trace = console.trace.bind(console);
							break;
						case "debug":
							Janus.debug = console.debug.bind(console);
							break;
						case "vdebug":
							Janus.vdebug = console.debug.bind(console);
							break;
						case "log":
							Janus.log = console.log.bind(console);
							break;
						case "warn":
							Janus.warn = console.warn.bind(console);
							break;
						case "error":
							Janus.error = console.error.bind(console);
							break;
						default:
							console.error("Unknown debugging option '" + d + "' (supported: 'trace', 'debug', 'vdebug', 'log', warn', 'error')");
							break;
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
		Janus.log("Initializing library");

		var usedDependencies = options.dependencies || Janus.useDefaultDependencies();
		Janus.isArray = usedDependencies.isArray;
		Janus.webRTCAdapter = usedDependencies.webRTCAdapter;
		Janus.httpAPICall = usedDependencies.httpAPICall;
		Janus.newWebSocket = usedDependencies.newWebSocket;
		Janus.extension = usedDependencies.extension;
		Janus.extension.init();

		// Helper method to enumerate devices
		Janus.listDevices = function (callback, config) {
			callback = typeof callback == "function" ? callback : Janus.noop;
			if (config == null) config = { audio: true, video: true };
			if (Janus.isGetUserMediaAvailable()) {
				navigator.mediaDevices.getUserMedia(config).then(function (stream) {
					navigator.mediaDevices.enumerateDevices().then(function (devices) {
						Janus.debug(devices);
						callback(devices);
						// Get rid of the now useless stream
						Janus.stopAllTracks(stream);
					});
				}).catch(function (err) {
					Janus.error(err);
					callback([]);
				});
			} else {
				Janus.warn("navigator.mediaDevices unavailable");
				callback([]);
			}
		};
		// Helper methods to attach/reattach a stream to a video element (previously part of adapter.js)
		Janus.attachMediaStream = function (element, stream) {
			try {
				element.srcObject = stream;
			} catch (e) {
				try {
					element.src = URL.createObjectURL(stream);
				} catch (e) {
					Janus.error("Error attaching stream to element");
				}
			}
		};
		Janus.reattachMediaStream = function (to, from) {
			try {
				to.srcObject = from.srcObject;
			} catch (e) {
				try {
					to.src = from.src;
				} catch (e) {
					Janus.error("Error reattaching stream to element");
				}
			}
		};
		// Detect tab close: make sure we don't loose existing onbeforeunload handlers
		// (note: for iOS we need to subscribe to a different event, 'pagehide', see
		// https://gist.github.com/thehunmonkgroup/6bee8941a49b86be31a787fe8f4b8cfe)
		var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
		var eventName = iOS ? 'pagehide' : 'beforeunload';
		var oldOBF = window["on" + eventName];
		window.addEventListener(eventName, function (event) {
			Janus.log("Closing window");
			for (var s in Janus.sessions) {
				if (Janus.sessions[s] && Janus.sessions[s].destroyOnUnload) {
					Janus.log("Destroying session " + s);
					Janus.sessions[s].destroy({ unload: true, notifyDestroyed: false });
				}
			}
			if (oldOBF && typeof oldOBF == "function") {
				oldOBF();
			}
		});
		// If this is a Safari Technology Preview, check if VP8 is supported
		Janus.safariVp8 = false;
		if (Janus.webRTCAdapter.browserDetails.browser === 'safari' && Janus.webRTCAdapter.browserDetails.version >= 605) {
			// Let's see if RTCRtpSender.getCapabilities() is there
			if (RTCRtpSender && RTCRtpSender.getCapabilities && RTCRtpSender.getCapabilities("video") && RTCRtpSender.getCapabilities("video").codecs && RTCRtpSender.getCapabilities("video").codecs.length) {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = RTCRtpSender.getCapabilities("video").codecs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var codec = _step3.value;

						if (codec && codec.mimeType && codec.mimeType.toLowerCase() === "video/vp8") {
							Janus.safariVp8 = true;
							break;
						}
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				if (Janus.safariVp8) {
					Janus.log("This version of Safari supports VP8");
				} else {
					Janus.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, " + "try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu");
				}
			} else {
				// We do it in a very ugly way, as there's no alternative...
				// We create a PeerConnection to see if VP8 is in an offer
				var testpc = new RTCPeerConnection({});
				testpc.createOffer({ offerToReceiveVideo: true }).then(function (offer) {
					Janus.safariVp8 = offer.sdp.indexOf("VP8") !== -1;
					if (Janus.safariVp8) {
						Janus.log("This version of Safari supports VP8");
					} else {
						Janus.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, " + "try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu");
					}
					testpc.close();
					testpc = null;
				});
			}
		}
		// Check if this browser supports Unified Plan and transceivers
		// Based on https://codepen.io/anon/pen/ZqLwWV?editors=0010
		Janus.unifiedPlan = false;
		if (Janus.webRTCAdapter.browserDetails.browser === 'firefox' && Janus.webRTCAdapter.browserDetails.version >= 59) {
			// Firefox definitely does, starting from version 59
			Janus.unifiedPlan = true;
		} else if (Janus.webRTCAdapter.browserDetails.browser === 'chrome' && Janus.webRTCAdapter.browserDetails.version >= 72) {
			// Chrome does, but it's only usable from version 72 on
			Janus.unifiedPlan = true;
		} else if (!window.RTCRtpTransceiver || !('currentDirection' in RTCRtpTransceiver.prototype)) {
			// Safari supports addTransceiver() but not Unified Plan when
			// currentDirection is not defined (see codepen above).
			Janus.unifiedPlan = false;
		} else {
			// Check if addTransceiver() throws an exception
			var tempPc = new RTCPeerConnection();
			try {
				tempPc.addTransceiver('audio');
				Janus.unifiedPlan = true;
			} catch (e) {}
			tempPc.close();
		}
		Janus.initDone = true;
		options.callback();
	}
};

// Helper method to check whether WebRTC is supported by this browser
Janus.isWebrtcSupported = function () {
	return !!window.RTCPeerConnection;
};
// Helper method to check whether devices can be accessed by this browser (e.g., not possible via plain HTTP)
Janus.isGetUserMediaAvailable = function () {
	return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
};

// Helper method to create random identifiers (e.g., transaction)
Janus.randomString = function (len) {
	var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	return randomString;
};

function Janus(gatewayCallbacks) {
	gatewayCallbacks = gatewayCallbacks || {};
	gatewayCallbacks.success = typeof gatewayCallbacks.success == "function" ? gatewayCallbacks.success : Janus.noop;
	gatewayCallbacks.error = typeof gatewayCallbacks.error == "function" ? gatewayCallbacks.error : Janus.noop;
	gatewayCallbacks.destroyed = typeof gatewayCallbacks.destroyed == "function" ? gatewayCallbacks.destroyed : Janus.noop;
	if (!Janus.initDone) {
		gatewayCallbacks.error("Library not initialized");
		return {};
	}
	if (!Janus.isWebrtcSupported()) {
		gatewayCallbacks.error("WebRTC not supported by this browser");
		return {};
	}
	Janus.log("Library initialized: " + Janus.initDone);
	if (!gatewayCallbacks.server) {
		gatewayCallbacks.error("Invalid server url");
		return {};
	}
	var websockets = false;
	var ws = null;
	var wsHandlers = {};
	var wsKeepaliveTimeoutId = null;
	var servers = null;
	var serversIndex = 0;
	var server = gatewayCallbacks.server;
	if (Janus.isArray(server)) {
		Janus.log("Multiple servers provided (" + server.length + "), will use the first that works");
		server = null;
		servers = gatewayCallbacks.server;
		Janus.debug(servers);
	} else {
		if (server.indexOf("ws") === 0) {
			websockets = true;
			Janus.log("Using WebSockets to contact Janus: " + server);
		} else {
			websockets = false;
			Janus.log("Using REST API to contact Janus: " + server);
		}
	}
	var iceServers = gatewayCallbacks.iceServers || [{ urls: "stun:stun.l.google.com:19302" }];
	var iceTransportPolicy = gatewayCallbacks.iceTransportPolicy;
	var bundlePolicy = gatewayCallbacks.bundlePolicy;
	// Whether IPv6 candidates should be gathered
	var ipv6Support = gatewayCallbacks.ipv6 === true;
	// Whether we should enable the withCredentials flag for XHR requests
	var withCredentials = false;
	if (gatewayCallbacks.withCredentials !== undefined && gatewayCallbacks.withCredentials !== null) withCredentials = gatewayCallbacks.withCredentials === true;
	// Optional max events
	var maxev = 10;
	if (gatewayCallbacks.max_poll_events !== undefined && gatewayCallbacks.max_poll_events !== null) maxev = gatewayCallbacks.max_poll_events;
	if (maxev < 1) maxev = 1;
	// Token to use (only if the token based authentication mechanism is enabled)
	var token = null;
	if (gatewayCallbacks.token !== undefined && gatewayCallbacks.token !== null) token = gatewayCallbacks.token;
	// API secret to use (only if the shared API secret is enabled)
	var apisecret = null;
	if (gatewayCallbacks.apisecret !== undefined && gatewayCallbacks.apisecret !== null) apisecret = gatewayCallbacks.apisecret;
	// Whether we should destroy this session when onbeforeunload is called
	this.destroyOnUnload = true;
	if (gatewayCallbacks.destroyOnUnload !== undefined && gatewayCallbacks.destroyOnUnload !== null) this.destroyOnUnload = gatewayCallbacks.destroyOnUnload === true;
	// Some timeout-related values
	var keepAlivePeriod = 25000;
	if (gatewayCallbacks.keepAlivePeriod !== undefined && gatewayCallbacks.keepAlivePeriod !== null) keepAlivePeriod = gatewayCallbacks.keepAlivePeriod;
	if (isNaN(keepAlivePeriod)) keepAlivePeriod = 25000;
	var longPollTimeout = 60000;
	if (gatewayCallbacks.longPollTimeout !== undefined && gatewayCallbacks.longPollTimeout !== null) longPollTimeout = gatewayCallbacks.longPollTimeout;
	if (isNaN(longPollTimeout)) longPollTimeout = 60000;

	// overrides for default maxBitrate values for simulcasting
	function getMaxBitrates(simulcastMaxBitrates) {
		var maxBitrates = {
			high: 900000,
			medium: 300000,
			low: 100000
		};

		if (simulcastMaxBitrates !== undefined && simulcastMaxBitrates !== null) {
			if (simulcastMaxBitrates.high) maxBitrates.high = simulcastMaxBitrates.high;
			if (simulcastMaxBitrates.medium) maxBitrates.medium = simulcastMaxBitrates.medium;
			if (simulcastMaxBitrates.low) maxBitrates.low = simulcastMaxBitrates.low;
		}

		return maxBitrates;
	}

	var connected = false;
	var sessionId = null;
	var pluginHandles = {};
	var that = this;
	var retries = 0;
	var transactions = {};
	createSession(gatewayCallbacks);

	// Public methods
	this.getServer = function () {
		return server;
	};
	this.isConnected = function () {
		return connected;
	};
	this.reconnect = function (callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		callbacks["reconnect"] = true;
		createSession(callbacks);
	};
	this.getSessionId = function () {
		return sessionId;
	};
	this.getInfo = function (callbacks) {
		getInfo(callbacks);
	};
	this.destroy = function (callbacks) {
		destroySession(callbacks);
	};
	this.attach = function (callbacks) {
		createHandle(callbacks);
	};

	function eventHandler() {
		if (sessionId == null) return;
		Janus.debug('Long poll...');
		if (!connected) {
			Janus.warn("Is the server down? (connected=false)");
			return;
		}
		var longpoll = server + "/" + sessionId + "?rid=" + new Date().getTime();
		if (maxev) longpoll = longpoll + "&maxev=" + maxev;
		if (token) longpoll = longpoll + "&token=" + encodeURIComponent(token);
		if (apisecret) longpoll = longpoll + "&apisecret=" + encodeURIComponent(apisecret);
		Janus.httpAPICall(longpoll, {
			verb: 'GET',
			withCredentials: withCredentials,
			success: handleEvent,
			timeout: longPollTimeout,
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown);
				retries++;
				if (retries > 3) {
					// Did we just lose the server? :-(
					connected = false;
					gatewayCallbacks.error("Lost connection to the server (is it down?)");
					return;
				}
				eventHandler();
			}
		});
	}

	// Private event handler: this will trigger plugin callbacks, if set
	function handleEvent(json, skipTimeout) {
		retries = 0;
		if (!websockets && sessionId !== undefined && sessionId !== null && skipTimeout !== true) eventHandler();
		if (!websockets && Janus.isArray(json)) {
			// We got an array: it means we passed a maxev > 1, iterate on all objects
			for (var i = 0; i < json.length; i++) {
				handleEvent(json[i], true);
			}
			return;
		}
		if (json["janus"] === "keepalive") {
			// Nothing happened
			Janus.vdebug("Got a keepalive on session " + sessionId);
			return;
		} else if (json["janus"] === "server_info") {
			// Just info on the Janus instance
			Janus.debug("Got info on the Janus instance");
			Janus.debug(json);
			var transaction = json["transaction"];
			if (transaction) {
				var reportSuccess = transactions[transaction];
				if (reportSuccess) reportSuccess(json);
				delete transactions[transaction];
			}
			return;
		} else if (json["janus"] === "ack") {
			// Just an ack, we can probably ignore
			Janus.debug("Got an ack on session " + sessionId);
			Janus.debug(json);
			var transaction = json["transaction"];
			if (transaction) {
				var reportSuccess = transactions[transaction];
				if (reportSuccess) reportSuccess(json);
				delete transactions[transaction];
			}
			return;
		} else if (json["janus"] === "success") {
			// Success!
			Janus.debug("Got a success on session " + sessionId);
			Janus.debug(json);
			var transaction = json["transaction"];
			if (transaction) {
				var reportSuccess = transactions[transaction];
				if (reportSuccess) reportSuccess(json);
				delete transactions[transaction];
			}
			return;
		} else if (json["janus"] === "trickle") {
			// We got a trickle candidate from Janus
			var sender = json["sender"];
			if (!sender) {
				Janus.warn("Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if (!pluginHandle) {
				Janus.debug("This handle is not attached to this session");
				return;
			}
			var candidate = json["candidate"];
			Janus.debug("Got a trickled candidate on session " + sessionId);
			Janus.debug(candidate);
			var config = pluginHandle.webrtcStuff;
			if (config.pc && config.remoteSdp) {
				// Add candidate right now
				Janus.debug("Adding remote candidate:", candidate);
				if (!candidate || candidate.completed === true) {
					// end-of-candidates
					config.pc.addIceCandidate(Janus.endOfCandidates);
				} else {
					// New candidate
					config.pc.addIceCandidate(candidate);
				}
			} else {
				// We didn't do setRemoteDescription (trickle got here before the offer?)
				Janus.debug("We didn't do setRemoteDescription (trickle got here before the offer?), caching candidate");
				if (!config.candidates) config.candidates = [];
				config.candidates.push(candidate);
				Janus.debug(config.candidates);
			}
		} else if (json["janus"] === "webrtcup") {
			// The PeerConnection with the server is up! Notify this
			Janus.debug("Got a webrtcup event on session " + sessionId);
			Janus.debug(json);
			var sender = json["sender"];
			if (!sender) {
				Janus.warn("Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if (!pluginHandle) {
				Janus.debug("This handle is not attached to this session");
				return;
			}
			pluginHandle.webrtcState(true);
			return;
		} else if (json["janus"] === "hangup") {
			// A plugin asked the core to hangup a PeerConnection on one of our handles
			Janus.debug("Got a hangup event on session " + sessionId);
			Janus.debug(json);
			var sender = json["sender"];
			if (!sender) {
				Janus.warn("Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if (!pluginHandle) {
				Janus.debug("This handle is not attached to this session");
				return;
			}
			pluginHandle.webrtcState(false, json["reason"]);
			pluginHandle.hangup();
		} else if (json["janus"] === "detached") {
			// A plugin asked the core to detach one of our handles
			Janus.debug("Got a detached event on session " + sessionId);
			Janus.debug(json);
			var sender = json["sender"];
			if (!sender) {
				Janus.warn("Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if (!pluginHandle) {
				// Don't warn here because destroyHandle causes this situation.
				return;
			}
			pluginHandle.detached = true;
			pluginHandle.ondetached();
			pluginHandle.detach();
		} else if (json["janus"] === "media") {
			// Media started/stopped flowing
			Janus.debug("Got a media event on session " + sessionId);
			Janus.debug(json);
			var sender = json["sender"];
			if (!sender) {
				Janus.warn("Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if (!pluginHandle) {
				Janus.debug("This handle is not attached to this session");
				return;
			}
			pluginHandle.mediaState(json["type"], json["receiving"]);
		} else if (json["janus"] === "slowlink") {
			Janus.debug("Got a slowlink event on session " + sessionId);
			Janus.debug(json);
			// Trouble uplink or downlink
			var sender = json["sender"];
			if (!sender) {
				Janus.warn("Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if (!pluginHandle) {
				Janus.debug("This handle is not attached to this session");
				return;
			}
			pluginHandle.slowLink(json["uplink"], json["lost"]);
		} else if (json["janus"] === "error") {
			// Oops, something wrong happened
			Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
			Janus.debug(json);
			var transaction = json["transaction"];
			if (transaction) {
				var reportSuccess = transactions[transaction];
				if (reportSuccess) {
					reportSuccess(json);
				}
				delete transactions[transaction];
			}
			return;
		} else if (json["janus"] === "event") {
			Janus.debug("Got a plugin event on session " + sessionId);
			Janus.debug(json);
			var sender = json["sender"];
			if (!sender) {
				Janus.warn("Missing sender...");
				return;
			}
			var plugindata = json["plugindata"];
			if (!plugindata) {
				Janus.warn("Missing plugindata...");
				return;
			}
			Janus.debug("  -- Event is coming from " + sender + " (" + plugindata["plugin"] + ")");
			var data = plugindata["data"];
			Janus.debug(data);
			var pluginHandle = pluginHandles[sender];
			if (!pluginHandle) {
				Janus.warn("This handle is not attached to this session");
				return;
			}
			var jsep = json["jsep"];
			if (jsep) {
				Janus.debug("Handling SDP as well...");
				Janus.debug(jsep);
			}
			var callback = pluginHandle.onmessage;
			if (callback) {
				Janus.debug("Notifying application...");
				// Send to callback specified when attaching plugin handle
				callback(data, jsep);
			} else {
				// Send to generic callback (?)
				Janus.debug("No provided notification callback");
			}
		} else if (json["janus"] === "timeout") {
			Janus.error("Timeout on session " + sessionId);
			Janus.debug(json);
			if (websockets) {
				ws.close(3504, "Gateway timeout");
			}
			return;
		} else {
			Janus.warn("Unknown message/event  '" + json["janus"] + "' on session " + sessionId);
			Janus.debug(json);
		}
	}

	// Private helper to send keep-alive messages on WebSockets
	function keepAlive() {
		if (!server || !websockets || !connected) return;
		wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
		var request = { "janus": "keepalive", "session_id": sessionId, "transaction": Janus.randomString(12) };
		if (token) request["token"] = token;
		if (apisecret) request["apisecret"] = apisecret;
		ws.send(JSON.stringify(request));
	}

	// Private method to create a session
	function createSession(callbacks) {
		var transaction = Janus.randomString(12);
		var request = { "janus": "create", "transaction": transaction };
		if (callbacks["reconnect"]) {
			// We're reconnecting, claim the session
			connected = false;
			request["janus"] = "claim";
			request["session_id"] = sessionId;
			// If we were using websockets, ignore the old connection
			if (ws) {
				ws.onopen = null;
				ws.onerror = null;
				ws.onclose = null;
				if (wsKeepaliveTimeoutId) {
					clearTimeout(wsKeepaliveTimeoutId);
					wsKeepaliveTimeoutId = null;
				}
			}
		}
		if (token) request["token"] = token;
		if (apisecret) request["apisecret"] = apisecret;
		if (!server && Janus.isArray(servers)) {
			// We still need to find a working server from the list we were given
			server = servers[serversIndex];
			if (server.indexOf("ws") === 0) {
				websockets = true;
				Janus.log("Server #" + (serversIndex + 1) + ": trying WebSockets to contact Janus (" + server + ")");
			} else {
				websockets = false;
				Janus.log("Server #" + (serversIndex + 1) + ": trying REST API to contact Janus (" + server + ")");
			}
		}
		if (websockets) {
			ws = Janus.newWebSocket(server, 'janus-protocol');
			wsHandlers = {
				'error': function error() {
					Janus.error("Error connecting to the Janus WebSockets server... " + server);
					if (Janus.isArray(servers) && !callbacks["reconnect"]) {
						serversIndex++;
						if (serversIndex === servers.length) {
							// We tried all the servers the user gave us and they all failed
							callbacks.error("Error connecting to any of the provided Janus servers: Is the server down?");
							return;
						}
						// Let's try the next server
						server = null;
						setTimeout(function () {
							createSession(callbacks);
						}, 200);
						return;
					}
					callbacks.error("Error connecting to the Janus WebSockets server: Is the server down?");
				},

				'open': function open() {
					// We need to be notified about the success
					transactions[transaction] = function (json) {
						Janus.debug(json);
						if (json["janus"] !== "success") {
							Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
							callbacks.error(json["error"].reason);
							return;
						}
						wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
						connected = true;
						sessionId = json["session_id"] ? json["session_id"] : json.data["id"];
						if (callbacks["reconnect"]) {
							Janus.log("Claimed session: " + sessionId);
						} else {
							Janus.log("Created session: " + sessionId);
						}
						Janus.sessions[sessionId] = that;
						callbacks.success();
					};
					ws.send(JSON.stringify(request));
				},

				'message': function message(event) {
					handleEvent(JSON.parse(event.data));
				},

				'close': function close() {
					if (!server || !connected) {
						return;
					}
					connected = false;
					// FIXME What if this is called when the page is closed?
					gatewayCallbacks.error("Lost connection to the server (is it down?)");
				}
			};

			for (var eventName in wsHandlers) {
				ws.addEventListener(eventName, wsHandlers[eventName]);
			}

			return;
		}
		Janus.httpAPICall(server, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function success(json) {
				Janus.debug(json);
				if (json["janus"] !== "success") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
					callbacks.error(json["error"].reason);
					return;
				}
				connected = true;
				sessionId = json["session_id"] ? json["session_id"] : json.data["id"];
				if (callbacks["reconnect"]) {
					Janus.log("Claimed session: " + sessionId);
				} else {
					Janus.log("Created session: " + sessionId);
				}
				Janus.sessions[sessionId] = that;
				eventHandler();
				callbacks.success();
			},
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown); // FIXME
				if (Janus.isArray(servers) && !callbacks["reconnect"]) {
					serversIndex++;
					if (serversIndex === servers.length) {
						// We tried all the servers the user gave us and they all failed
						callbacks.error("Error connecting to any of the provided Janus servers: Is the server down?");
						return;
					}
					// Let's try the next server
					server = null;
					setTimeout(function () {
						createSession(callbacks);
					}, 200);
					return;
				}
				if (errorThrown === "") callbacks.error(textStatus + ": Is the server down?");else callbacks.error(textStatus + ": " + errorThrown);
			}
		});
	}

	// Private method to get info on the server
	function getInfo(callbacks) {
		callbacks = callbacks || {};
		// FIXME This method triggers a success even when we fail
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		Janus.log("Getting info on Janus instance");
		if (!connected) {
			Janus.warn("Is the server down? (connected=false)");
			callbacks.error("Is the server down? (connected=false)");
			return;
		}
		// We just need to send an "info" request
		var transaction = Janus.randomString(12);
		var request = { "janus": "info", "transaction": transaction };
		if (token) request["token"] = token;
		if (apisecret) request["apisecret"] = apisecret;
		if (websockets) {
			transactions[transaction] = function (json) {
				Janus.log("Server info:");
				Janus.debug(json);
				if (json["janus"] !== "server_info") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
				}
				callbacks.success(json);
			};
			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function success(json) {
				Janus.log("Server info:");
				Janus.debug(json);
				if (json["janus"] !== "server_info") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
				}
				callbacks.success(json);
			},
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown); // FIXME
				if (errorThrown === "") callbacks.error(textStatus + ": Is the server down?");else callbacks.error(textStatus + ": " + errorThrown);
			}
		});
	}

	// Private method to destroy a session
	function destroySession(callbacks) {
		callbacks = callbacks || {};
		// FIXME This method triggers a success even when we fail
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		var unload = callbacks.unload === true;
		var notifyDestroyed = true;
		if (callbacks.notifyDestroyed !== undefined && callbacks.notifyDestroyed !== null) notifyDestroyed = callbacks.notifyDestroyed === true;
		var cleanupHandles = callbacks.cleanupHandles === true;
		Janus.log("Destroying session " + sessionId + " (unload=" + unload + ")");
		if (!sessionId) {
			Janus.warn("No session to destroy");
			callbacks.success();
			if (notifyDestroyed) gatewayCallbacks.destroyed();
			return;
		}
		if (cleanupHandles) {
			for (var handleId in pluginHandles) {
				destroyHandle(handleId, { noRequest: true });
			}
		}
		if (!connected) {
			Janus.warn("Is the server down? (connected=false)");
			sessionId = null;
			callbacks.success();
			return;
		}
		// No need to destroy all handles first, Janus will do that itself
		var request = { "janus": "destroy", "transaction": Janus.randomString(12) };
		if (token) request["token"] = token;
		if (apisecret) request["apisecret"] = apisecret;
		if (unload) {
			// We're unloading the page: use sendBeacon for HTTP instead,
			// or just close the WebSocket connection if we're using that
			if (websockets) {
				ws.onclose = null;
				ws.close();
				ws = null;
			} else {
				navigator.sendBeacon(server + "/" + sessionId, JSON.stringify(request));
			}
			Janus.log("Destroyed session:");
			sessionId = null;
			connected = false;
			callbacks.success();
			if (notifyDestroyed) gatewayCallbacks.destroyed();
			return;
		}
		if (websockets) {
			request["session_id"] = sessionId;

			var unbindWebSocket = function unbindWebSocket() {
				for (var eventName in wsHandlers) {
					ws.removeEventListener(eventName, wsHandlers[eventName]);
				}
				ws.removeEventListener('message', onUnbindMessage);
				ws.removeEventListener('error', onUnbindError);
				if (wsKeepaliveTimeoutId) {
					clearTimeout(wsKeepaliveTimeoutId);
				}
				ws.close();
			};

			var onUnbindMessage = function onUnbindMessage(event) {
				var data = JSON.parse(event.data);
				if (data.session_id == request.session_id && data.transaction == request.transaction) {
					unbindWebSocket();
					callbacks.success();
					if (notifyDestroyed) gatewayCallbacks.destroyed();
				}
			};
			var onUnbindError = function onUnbindError(event) {
				unbindWebSocket();
				callbacks.error("Failed to destroy the server: Is the server down?");
				if (notifyDestroyed) gatewayCallbacks.destroyed();
			};

			ws.addEventListener('message', onUnbindMessage);
			ws.addEventListener('error', onUnbindError);

			if (ws.readyState === 1) {
				ws.send(JSON.stringify(request));
			} else {
				onUnbindError();
			}

			return;
		}
		Janus.httpAPICall(server + "/" + sessionId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function success(json) {
				Janus.log("Destroyed session:");
				Janus.debug(json);
				sessionId = null;
				connected = false;
				if (json["janus"] !== "success") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
				}
				callbacks.success();
				if (notifyDestroyed) gatewayCallbacks.destroyed();
			},
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown); // FIXME
				// Reset everything anyway
				sessionId = null;
				connected = false;
				callbacks.success();
				if (notifyDestroyed) gatewayCallbacks.destroyed();
			}
		});
	}

	// Private method to create a plugin handle
	function createHandle(callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		callbacks.consentDialog = typeof callbacks.consentDialog == "function" ? callbacks.consentDialog : Janus.noop;
		callbacks.iceState = typeof callbacks.iceState == "function" ? callbacks.iceState : Janus.noop;
		callbacks.mediaState = typeof callbacks.mediaState == "function" ? callbacks.mediaState : Janus.noop;
		callbacks.webrtcState = typeof callbacks.webrtcState == "function" ? callbacks.webrtcState : Janus.noop;
		callbacks.slowLink = typeof callbacks.slowLink == "function" ? callbacks.slowLink : Janus.noop;
		callbacks.onmessage = typeof callbacks.onmessage == "function" ? callbacks.onmessage : Janus.noop;
		callbacks.onlocalstream = typeof callbacks.onlocalstream == "function" ? callbacks.onlocalstream : Janus.noop;
		callbacks.onremotestream = typeof callbacks.onremotestream == "function" ? callbacks.onremotestream : Janus.noop;
		callbacks.ondata = typeof callbacks.ondata == "function" ? callbacks.ondata : Janus.noop;
		callbacks.ondataopen = typeof callbacks.ondataopen == "function" ? callbacks.ondataopen : Janus.noop;
		callbacks.oncleanup = typeof callbacks.oncleanup == "function" ? callbacks.oncleanup : Janus.noop;
		callbacks.ondetached = typeof callbacks.ondetached == "function" ? callbacks.ondetached : Janus.noop;
		if (!connected) {
			Janus.warn("Is the server down? (connected=false)");
			callbacks.error("Is the server down? (connected=false)");
			return;
		}
		var plugin = callbacks.plugin;
		if (!plugin) {
			Janus.error("Invalid plugin");
			callbacks.error("Invalid plugin");
			return;
		}
		var opaqueId = callbacks.opaqueId;
		var handleToken = callbacks.token ? callbacks.token : token;
		var transaction = Janus.randomString(12);
		var request = { "janus": "attach", "plugin": plugin, "opaque_id": opaqueId, "transaction": transaction };
		if (handleToken) request["token"] = handleToken;
		if (apisecret) request["apisecret"] = apisecret;
		if (websockets) {
			transactions[transaction] = function (json) {
				Janus.debug(json);
				if (json["janus"] !== "success") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
					callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
					return;
				}
				var handleId = json.data["id"];
				Janus.log("Created handle: " + handleId);
				var pluginHandle = {
					session: that,
					plugin: plugin,
					id: handleId,
					token: handleToken,
					detached: false,
					webrtcStuff: {
						started: false,
						myStream: null,
						streamExternal: false,
						remoteStream: null,
						mySdp: null,
						mediaConstraints: null,
						pc: null,
						dataChannel: {},
						dtmfSender: null,
						trickle: true,
						iceDone: false,
						volume: {
							value: null,
							timer: null
						},
						bitrate: {
							value: null,
							bsnow: null,
							bsbefore: null,
							tsnow: null,
							tsbefore: null,
							timer: null
						}
					},
					getId: function getId() {
						return handleId;
					},
					getPlugin: function getPlugin() {
						return plugin;
					},
					getVolume: function getVolume() {
						return _getVolume(handleId, true);
					},
					getRemoteVolume: function getRemoteVolume() {
						return _getVolume(handleId, true);
					},
					getLocalVolume: function getLocalVolume() {
						return _getVolume(handleId, false);
					},
					isAudioMuted: function isAudioMuted() {
						return isMuted(handleId, false);
					},
					muteAudio: function muteAudio() {
						return mute(handleId, false, true);
					},
					unmuteAudio: function unmuteAudio() {
						return mute(handleId, false, false);
					},
					isVideoMuted: function isVideoMuted() {
						return isMuted(handleId, true);
					},
					muteVideo: function muteVideo() {
						return mute(handleId, true, true);
					},
					unmuteVideo: function unmuteVideo() {
						return mute(handleId, true, false);
					},
					getBitrate: function getBitrate() {
						return _getBitrate(handleId);
					},
					send: function send(callbacks) {
						sendMessage(handleId, callbacks);
					},
					data: function data(callbacks) {
						sendData(handleId, callbacks);
					},
					dtmf: function dtmf(callbacks) {
						sendDtmf(handleId, callbacks);
					},
					consentDialog: callbacks.consentDialog,
					iceState: callbacks.iceState,
					mediaState: callbacks.mediaState,
					webrtcState: callbacks.webrtcState,
					slowLink: callbacks.slowLink,
					onmessage: callbacks.onmessage,
					createOffer: function createOffer(callbacks) {
						prepareWebrtc(handleId, true, callbacks);
					},
					createAnswer: function createAnswer(callbacks) {
						prepareWebrtc(handleId, false, callbacks);
					},
					handleRemoteJsep: function handleRemoteJsep(callbacks) {
						prepareWebrtcPeer(handleId, callbacks);
					},
					onlocalstream: callbacks.onlocalstream,
					onremotestream: callbacks.onremotestream,
					ondata: callbacks.ondata,
					ondataopen: callbacks.ondataopen,
					oncleanup: callbacks.oncleanup,
					ondetached: callbacks.ondetached,
					hangup: function hangup(sendRequest) {
						cleanupWebrtc(handleId, sendRequest === true);
					},
					detach: function detach(callbacks) {
						destroyHandle(handleId, callbacks);
					}
				};
				pluginHandles[handleId] = pluginHandle;
				callbacks.success(pluginHandle);
			};
			request["session_id"] = sessionId;
			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function success(json) {
				Janus.debug(json);
				if (json["janus"] !== "success") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
					callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
					return;
				}
				var handleId = json.data["id"];
				console.log(handleId,5555);
				// Janus.log("Created handle: " + handleId);
				var pluginHandle = {
					session: that,
					plugin: plugin,
					id: handleId,
					token: handleToken,
					detached: false,
					webrtcStuff: {
						started: false,
						myStream: null,
						streamExternal: false,
						remoteStream: null,
						mySdp: null,
						mediaConstraints: null,
						pc: null,
						dataChannel: {},
						dtmfSender: null,
						trickle: true,
						iceDone: false,
						volume: {
							value: null,
							timer: null
						},
						bitrate: {
							value: null,
							bsnow: null,
							bsbefore: null,
							tsnow: null,
							tsbefore: null,
							timer: null
						}
					},
					getId: function getId() {
						return handleId;
					},
					getPlugin: function getPlugin() {
						return plugin;
					},
					getVolume: function getVolume() {
						return _getVolume(handleId, true);
					},
					getRemoteVolume: function getRemoteVolume() {
						return _getVolume(handleId, true);
					},
					getLocalVolume: function getLocalVolume() {
						return _getVolume(handleId, false);
					},
					isAudioMuted: function isAudioMuted() {
						return isMuted(handleId, false);
					},
					muteAudio: function muteAudio() {
						return mute(handleId, false, true);
					},
					unmuteAudio: function unmuteAudio() {
						return mute(handleId, false, false);
					},
					isVideoMuted: function isVideoMuted() {
						return isMuted(handleId, true);
					},
					muteVideo: function muteVideo() {
						return mute(handleId, true, true);
					},
					unmuteVideo: function unmuteVideo() {
						return mute(handleId, true, false);
					},
					getBitrate: function getBitrate() {
						return _getBitrate(handleId);
					},
					send: function send(callbacks) {
						sendMessage(handleId, callbacks);
					},
					data: function data(callbacks) {
						sendData(handleId, callbacks);
					},
					dtmf: function dtmf(callbacks) {
						sendDtmf(handleId, callbacks);
					},
					consentDialog: callbacks.consentDialog,
					iceState: callbacks.iceState,
					mediaState: callbacks.mediaState,
					webrtcState: callbacks.webrtcState,
					slowLink: callbacks.slowLink,
					onmessage: callbacks.onmessage,
					createOffer: function createOffer(callbacks) {
						prepareWebrtc(handleId, true, callbacks);
					},
					createAnswer: function createAnswer(callbacks) {
						prepareWebrtc(handleId, false, callbacks);
					},
					handleRemoteJsep: function handleRemoteJsep(callbacks) {
						prepareWebrtcPeer(handleId, callbacks);
					},
					onlocalstream: callbacks.onlocalstream,
					onremotestream: callbacks.onremotestream,
					ondata: callbacks.ondata,
					ondataopen: callbacks.ondataopen,
					oncleanup: callbacks.oncleanup,
					ondetached: callbacks.ondetached,
					hangup: function hangup(sendRequest) {
						cleanupWebrtc(handleId, sendRequest === true);
					},
					detach: function detach(callbacks) {
						destroyHandle(handleId, callbacks);
					}
				};
				pluginHandles[handleId] = pluginHandle;
				callbacks.success(pluginHandle);
			},
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown); // FIXME
				if (errorThrown === "") callbacks.error(textStatus + ": Is the server down?");else callbacks.error(textStatus + ": " + errorThrown);
			}
		});
	}

	// Private method to send a message
	function sendMessage(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		if (!connected) {
			Janus.warn("Is the server down? (connected=false)");
			callbacks.error("Is the server down? (connected=false)");
			return;
		}
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var message = callbacks.message;
		var jsep = callbacks.jsep;
		var transaction = Janus.randomString(12);
		var request = { "janus": "message", "body": message, "transaction": transaction };
		if (pluginHandle.token) request["token"] = pluginHandle.token;
		if (apisecret) request["apisecret"] = apisecret;
		if (jsep) {
			request.jsep = {
				type: jsep.type,
				sdp: jsep.sdp
			};
			if (jsep.e2ee) request.jsep.e2ee = true;
			if (jsep.rid_order === "hml" || jsep.rid_order === "lmh") request.jsep.rid_order = jsep.rid_order;
		}
		Janus.debug("Sending message to plugin (handle=" + handleId + "):");
		Janus.debug(request);
		if (websockets) {
			request["session_id"] = sessionId;
			request["handle_id"] = handleId;
			transactions[transaction] = function (json) {
				Janus.debug("Message sent!");
				Janus.debug(json);
				if (json["janus"] === "success") {
					// We got a success, must have been a synchronous transaction
					var plugindata = json["plugindata"];
					if (!plugindata) {
						Janus.warn("Request succeeded, but missing plugindata...");
						callbacks.success();
						return;
					}
					Janus.log("Synchronous transaction successful (" + plugindata["plugin"] + ")");
					var data = plugindata["data"];
					Janus.debug(data);
					callbacks.success(data);
					return;
				} else if (json["janus"] !== "ack") {
					// Not a success and not an ack, must be an error
					if (json["error"]) {
						Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
						callbacks.error(json["error"].code + " " + json["error"].reason);
					} else {
						Janus.error("Unknown error"); // FIXME
						callbacks.error("Unknown error");
					}
					return;
				}
				// If we got here, the plugin decided to handle the request asynchronously
				callbacks.success();
			};
			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function success(json) {
				Janus.debug("Message sent!");
				Janus.debug(json);
				if (json["janus"] === "success") {
					// We got a success, must have been a synchronous transaction
					var plugindata = json["plugindata"];
					if (!plugindata) {
						Janus.warn("Request succeeded, but missing plugindata...");
						callbacks.success();
						return;
					}
					Janus.log("Synchronous transaction successful (" + plugindata["plugin"] + ")");
					var data = plugindata["data"];
					Janus.debug(data);
					callbacks.success(data);
					return;
				} else if (json["janus"] !== "ack") {
					// Not a success and not an ack, must be an error
					if (json["error"]) {
						Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
						callbacks.error(json["error"].code + " " + json["error"].reason);
					} else {
						Janus.error("Unknown error"); // FIXME
						callbacks.error("Unknown error");
					}
					return;
				}
				// If we got here, the plugin decided to handle the request asynchronously
				callbacks.success();
			},
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown); // FIXME
				callbacks.error(textStatus + ": " + errorThrown);
			}
		});
	}

	// Private method to send a trickle candidate
	function sendTrickleCandidate(handleId, candidate) {
		if (!connected) {
			Janus.warn("Is the server down? (connected=false)");
			return;
		}
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			return;
		}
		var request = { "janus": "trickle", "candidate": candidate, "transaction": Janus.randomString(12) };
		if (pluginHandle.token) request["token"] = pluginHandle.token;
		if (apisecret) request["apisecret"] = apisecret;
		Janus.vdebug("Sending trickle candidate (handle=" + handleId + "):");
		Janus.vdebug(request);
		if (websockets) {
			request["session_id"] = sessionId;
			request["handle_id"] = handleId;
			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function success(json) {
				Janus.vdebug("Candidate sent!");
				Janus.vdebug(json);
				if (json["janus"] !== "ack") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
					return;
				}
			},
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown); // FIXME
			}
		});
	}

	// Private method to create a data channel
	function createDataChannel(handleId, dclabel, dcprotocol, incoming, pendingData) {
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (!config.pc) {
			Janus.warn("Invalid PeerConnection");
			return;
		}
		var onDataChannelMessage = function onDataChannelMessage(event) {
			Janus.log('Received message on data channel:', event);
			var label = event.target.label;
			pluginHandle.ondata(event.data, label);
		};
		var onDataChannelStateChange = function onDataChannelStateChange(event) {
			Janus.log('Received state change on data channel:', event);
			var label = event.target.label;
			var protocol = event.target.protocol;
			var dcState = config.dataChannel[label] ? config.dataChannel[label].readyState : "null";
			Janus.log('State change on <' + label + '> data channel: ' + dcState);
			if (dcState === 'open') {
				// Any pending messages to send?
				if (config.dataChannel[label].pending && config.dataChannel[label].pending.length > 0) {
					Janus.log("Sending pending messages on <" + label + ">:", config.dataChannel[label].pending.length);
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = config.dataChannel[label].pending[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var data = _step4.value;

							Janus.log("Sending data on data channel <" + label + ">");
							Janus.debug(data);
							config.dataChannel[label].send(data);
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}

					config.dataChannel[label].pending = [];
				}
				// Notify the open data channel
				pluginHandle.ondataopen(label, protocol);
			}
		};
		var onDataChannelError = function onDataChannelError(error) {
			Janus.error('Got error on data channel:', error);
			// TODO
		};
		if (!incoming) {
			// FIXME Add options (ordered, maxRetransmits, etc.)
			var dcoptions = { ordered: true };
			if (dcprotocol) dcoptions.protocol = dcprotocol;
			config.dataChannel[dclabel] = config.pc.createDataChannel(dclabel, dcoptions);
		} else {
			// The channel was created by Janus
			config.dataChannel[dclabel] = incoming;
		}
		config.dataChannel[dclabel].onmessage = onDataChannelMessage;
		config.dataChannel[dclabel].onopen = onDataChannelStateChange;
		config.dataChannel[dclabel].onclose = onDataChannelStateChange;
		config.dataChannel[dclabel].onerror = onDataChannelError;
		config.dataChannel[dclabel].pending = [];
		if (pendingData) config.dataChannel[dclabel].pending.push(pendingData);
	}

	// Private method to send a data channel message
	function sendData(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		var data = callbacks.text || callbacks.data;
		if (!data) {
			Janus.warn("Invalid data");
			callbacks.error("Invalid data");
			return;
		}
		var label = callbacks.label ? callbacks.label : Janus.dataChanDefaultLabel;
		if (!config.dataChannel[label]) {
			// Create new data channel and wait for it to open
			createDataChannel(handleId, label, callbacks.protocol, false, data, callbacks.protocol);
			callbacks.success();
			return;
		}
		if (config.dataChannel[label].readyState !== "open") {
			config.dataChannel[label].pending.push(data);
			callbacks.success();
			return;
		}
		Janus.log("Sending data on data channel <" + label + ">");
		Janus.debug(data);
		config.dataChannel[label].send(data);
		callbacks.success();
	}

	// Private method to send a DTMF tone
	function sendDtmf(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (!config.dtmfSender) {
			// Create the DTMF sender the proper way, if possible
			if (config.pc) {
				var senders = config.pc.getSenders();
				var audioSender = senders.find(function (sender) {
					return sender.track && sender.track.kind === 'audio';
				});
				if (!audioSender) {
					Janus.warn("Invalid DTMF configuration (no audio track)");
					callbacks.error("Invalid DTMF configuration (no audio track)");
					return;
				}
				config.dtmfSender = audioSender.dtmf;
				if (config.dtmfSender) {
					Janus.log("Created DTMF Sender");
					config.dtmfSender.ontonechange = function (tone) {
						Janus.debug("Sent DTMF tone: " + tone.tone);
					};
				}
			}
			if (!config.dtmfSender) {
				Janus.warn("Invalid DTMF configuration");
				callbacks.error("Invalid DTMF configuration");
				return;
			}
		}
		var dtmf = callbacks.dtmf;
		if (!dtmf) {
			Janus.warn("Invalid DTMF parameters");
			callbacks.error("Invalid DTMF parameters");
			return;
		}
		var tones = dtmf.tones;
		if (!tones) {
			Janus.warn("Invalid DTMF string");
			callbacks.error("Invalid DTMF string");
			return;
		}
		var duration = typeof dtmf.duration === 'number' ? dtmf.duration : 500; // We choose 500ms as the default duration for a tone
		var gap = typeof dtmf.gap === 'number' ? dtmf.gap : 50; // We choose 50ms as the default gap between tones
		Janus.debug("Sending DTMF string " + tones + " (duration " + duration + "ms, gap " + gap + "ms)");
		config.dtmfSender.insertDTMF(tones, duration, gap);
		callbacks.success();
	}

	// Private method to destroy a plugin handle
	function destroyHandle(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		var noRequest = callbacks.noRequest === true;
		Janus.log("Destroying handle " + handleId + " (only-locally=" + noRequest + ")");
		cleanupWebrtc(handleId);
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || pluginHandle.detached) {
			// Plugin was already detached by Janus, calling detach again will return a handle not found error, so just exit here
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		if (noRequest) {
			// We're only removing the handle locally
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		if (!connected) {
			Janus.warn("Is the server down? (connected=false)");
			callbacks.error("Is the server down? (connected=false)");
			return;
		}
		var request = { "janus": "detach", "transaction": Janus.randomString(12) };
		if (pluginHandle.token) request["token"] = pluginHandle.token;
		if (apisecret) request["apisecret"] = apisecret;
		if (websockets) {
			request["session_id"] = sessionId;
			request["handle_id"] = handleId;
			ws.send(JSON.stringify(request));
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function success(json) {
				Janus.log("Destroyed handle:");
				Janus.debug(json);
				if (json["janus"] !== "success") {
					Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
				}
				delete pluginHandles[handleId];
				callbacks.success();
			},
			error: function error(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown); // FIXME
				// We cleanup anyway
				delete pluginHandles[handleId];
				callbacks.success();
			}
		});
	}

	// WebRTC stuff
	function streamsDone(handleId, jsep, media, callbacks, stream) {
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			// Close all tracks if the given stream has been created internally
			if (!callbacks.stream) {
				Janus.stopAllTracks(stream);
			}
			callbacks.error("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		Janus.debug("streamsDone:", stream);
		if (stream) {
			Janus.debug("  -- Audio tracks:", stream.getAudioTracks());
			Janus.debug("  -- Video tracks:", stream.getVideoTracks());
		}
		// We're now capturing the new stream: check if we're updating or if it's a new thing
		var addTracks = false;
		if (!config.myStream || !media.update || config.streamExternal) {
			config.myStream = stream;
			addTracks = true;
		} else {
			// We only need to update the existing stream
			if ((!media.update && isAudioSendEnabled(media) || media.update && (media.addAudio || media.replaceAudio)) && stream.getAudioTracks() && stream.getAudioTracks().length) {
				config.myStream.addTrack(stream.getAudioTracks()[0]);
				if (Janus.unifiedPlan) {
					// Use Transceivers
					Janus.log((media.replaceAudio ? "Replacing" : "Adding") + " audio track:", stream.getAudioTracks()[0]);
					var audioTransceiver = null;
					var transceivers = config.pc.getTransceivers();
					if (transceivers && transceivers.length > 0) {
						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;

						try {
							for (var _iterator5 = transceivers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var t = _step5.value;

								if (t.sender && t.sender.track && t.sender.track.kind === "audio" || t.receiver && t.receiver.track && t.receiver.track.kind === "audio") {
									audioTransceiver = t;
									break;
								}
							}
						} catch (err) {
							_didIteratorError5 = true;
							_iteratorError5 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion5 && _iterator5.return) {
									_iterator5.return();
								}
							} finally {
								if (_didIteratorError5) {
									throw _iteratorError5;
								}
							}
						}
					}
					if (audioTransceiver && audioTransceiver.sender) {
						audioTransceiver.sender.replaceTrack(stream.getAudioTracks()[0]);
					} else {
						config.pc.addTrack(stream.getAudioTracks()[0], stream);
					}
				} else {
					Janus.log((media.replaceAudio ? "Replacing" : "Adding") + " audio track:", stream.getAudioTracks()[0]);
					config.pc.addTrack(stream.getAudioTracks()[0], stream);
				}
			}
			if ((!media.update && isVideoSendEnabled(media) || media.update && (media.addVideo || media.replaceVideo)) && stream.getVideoTracks() && stream.getVideoTracks().length) {
				config.myStream.addTrack(stream.getVideoTracks()[0]);
				if (Janus.unifiedPlan) {
					// Use Transceivers
					Janus.log((media.replaceVideo ? "Replacing" : "Adding") + " video track:", stream.getVideoTracks()[0]);
					var videoTransceiver = null;
					var transceivers = config.pc.getTransceivers();
					if (transceivers && transceivers.length > 0) {
						var _iteratorNormalCompletion6 = true;
						var _didIteratorError6 = false;
						var _iteratorError6 = undefined;

						try {
							for (var _iterator6 = transceivers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
								var t = _step6.value;

								if (t.sender && t.sender.track && t.sender.track.kind === "video" || t.receiver && t.receiver.track && t.receiver.track.kind === "video") {
									videoTransceiver = t;
									break;
								}
							}
						} catch (err) {
							_didIteratorError6 = true;
							_iteratorError6 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion6 && _iterator6.return) {
									_iterator6.return();
								}
							} finally {
								if (_didIteratorError6) {
									throw _iteratorError6;
								}
							}
						}
					}
					if (videoTransceiver && videoTransceiver.sender) {
						videoTransceiver.sender.replaceTrack(stream.getVideoTracks()[0]);
					} else {
						config.pc.addTrack(stream.getVideoTracks()[0], stream);
					}
				} else {
					Janus.log((media.replaceVideo ? "Replacing" : "Adding") + " video track:", stream.getVideoTracks()[0]);
					config.pc.addTrack(stream.getVideoTracks()[0], stream);
				}
			}
		}
		// If we still need to create a PeerConnection, let's do that
		if (!config.pc) {
			var pc_config = { "iceServers": iceServers, "iceTransportPolicy": iceTransportPolicy, "bundlePolicy": bundlePolicy };
			if (Janus.webRTCAdapter.browserDetails.browser === "chrome") {
				// For Chrome versions before 72, we force a plan-b semantic, and unified-plan otherwise
				pc_config["sdpSemantics"] = Janus.webRTCAdapter.browserDetails.version < 72 ? "plan-b" : "unified-plan";
			}
			var pc_constraints = {
				"optional": [{ "DtlsSrtpKeyAgreement": true }]
			};
			if (ipv6Support) {
				pc_constraints.optional.push({ "googIPv6": true });
			}
			// Any custom constraint to add?
			if (callbacks.rtcConstraints && _typeof(callbacks.rtcConstraints) === 'object') {
				Janus.debug("Adding custom PeerConnection constraints:", callbacks.rtcConstraints);
				for (var i in callbacks.rtcConstraints) {
					pc_constraints.optional.push(callbacks.rtcConstraints[i]);
				}
			}
			if (Janus.webRTCAdapter.browserDetails.browser === "edge") {
				// This is Edge, enable BUNDLE explicitly
				pc_config.bundlePolicy = "max-bundle";
			}
			// Check if a sender or receiver transform has been provided
			if (RTCRtpSender && (RTCRtpSender.prototype.createEncodedStreams || RTCRtpSender.prototype.createEncodedAudioStreams && RTCRtpSender.prototype.createEncodedVideoStreams) && (callbacks.senderTransforms || callbacks.receiverTransforms)) {
				config.senderTransforms = callbacks.senderTransforms;
				config.receiverTransforms = callbacks.receiverTransforms;
				pc_config["forceEncodedAudioInsertableStreams"] = true;
				pc_config["forceEncodedVideoInsertableStreams"] = true;
				pc_config["encodedInsertableStreams"] = true;
			}
			Janus.log("Creating PeerConnection");
			Janus.debug(pc_constraints);
			config.pc = new RTCPeerConnection(pc_config, pc_constraints);
			Janus.debug(config.pc);
			if (config.pc.getStats) {
				// FIXME
				config.volume = {};
				config.bitrate.value = "0 kbits/sec";
			}
			Janus.log("Preparing local SDP and gathering candidates (trickle=" + config.trickle + ")");
			config.pc.oniceconnectionstatechange = function (e) {
				if (config.pc) pluginHandle.iceState(config.pc.iceConnectionState);
			};
			config.pc.onicecandidate = function (event) {
				if (!event.candidate || Janus.webRTCAdapter.browserDetails.browser === 'edge' && event.candidate.candidate.indexOf('endOfCandidates') > 0) {
					Janus.log("End of candidates.");
					config.iceDone = true;
					if (config.trickle === true) {
						// Notify end of candidates
						sendTrickleCandidate(handleId, { "completed": true });
					} else {
						// No trickle, time to send the complete SDP (including all candidates)
						sendSDP(handleId, callbacks);
					}
				} else {
					// JSON.stringify doesn't work on some WebRTC objects anymore
					// See https://code.google.com/p/chromium/issues/detail?id=467366
					var candidate = {
						"candidate": event.candidate.candidate,
						"sdpMid": event.candidate.sdpMid,
						"sdpMLineIndex": event.candidate.sdpMLineIndex
					};
					if (config.trickle === true) {
						// Send candidate
						sendTrickleCandidate(handleId, candidate);
					}
				}
			};
			config.pc.ontrack = function (event) {
				Janus.log("Handling Remote Track");
				Janus.debug(event);
				if (!event.streams) return;
				config.remoteStream = event.streams[0];
				pluginHandle.onremotestream(config.remoteStream);
				if (event.track.onended) return;
				if (config.receiverTransforms) {
					var receiverStreams = null;
					if (RTCRtpSender.prototype.createEncodedStreams) {
						receiverStreams = event.receiver.createEncodedStreams();
					} else if (RTCRtpSender.prototype.createAudioEncodedStreams || RTCRtpSender.prototype.createEncodedVideoStreams) {
						if (event.track.kind === "audio" && config.receiverTransforms["audio"]) {
							receiverStreams = event.receiver.createEncodedAudioStreams();
						} else if (event.track.kind === "video" && config.receiverTransforms["video"]) {
							receiverStreams = event.receiver.createEncodedVideoStreams();
						}
					}
					if (receiverStreams) {
						console.log(receiverStreams);
						if (receiverStreams.readableStream && receiverStreams.writableStream) {
							receiverStreams.readableStream.pipeThrough(config.receiverTransforms[event.track.kind]).pipeTo(receiverStreams.writableStream);
						} else if (receiverStreams.readable && receiverStreams.writable) {
							receiverStreams.readable.pipeThrough(config.receiverTransforms[event.track.kind]).pipeTo(receiverStreams.writable);
						}
					}
				}
				var trackMutedTimeoutId = null;
				Janus.log("Adding onended callback to track:", event.track);
				event.track.onended = function (ev) {
					Janus.log("Remote track removed:", ev);
					if (config.remoteStream) {
						clearTimeout(trackMutedTimeoutId);
						config.remoteStream.removeTrack(ev.target);
						pluginHandle.onremotestream(config.remoteStream);
					}
				};
				event.track.onmute = function (ev) {
					Janus.log("Remote track muted:", ev);
					if (config.remoteStream && trackMutedTimeoutId == null) {
						trackMutedTimeoutId = setTimeout(function () {
							Janus.log("Removing remote track");
							if (config.remoteStream) {
								config.remoteStream.removeTrack(ev.target);
								pluginHandle.onremotestream(config.remoteStream);
							}
							trackMutedTimeoutId = null;
							// Chrome seems to raise mute events only at multiples of 834ms;
							// we set the timeout to three times this value (rounded to 840ms)
						}, 3 * 840);
					}
				};
				event.track.onunmute = function (ev) {
					Janus.log("Remote track flowing again:", ev);
					if (trackMutedTimeoutId != null) {
						clearTimeout(trackMutedTimeoutId);
						trackMutedTimeoutId = null;
					} else {
						try {
							config.remoteStream.addTrack(ev.target);
							pluginHandle.onremotestream(config.remoteStream);
						} catch (e) {
							Janus.error(e);
						};
					}
				};
			};
		}
		if (addTracks && stream) {
			Janus.log('Adding local stream');
			var simulcast2 = callbacks.simulcast2 === true;
			stream.getTracks().forEach(function (track) {
				Janus.log('Adding local track:', track);
				var sender = null;
				if (!simulcast2 || track.kind === 'audio') {
					sender = config.pc.addTrack(track, stream);
				} else {
					Janus.log('Enabling rid-based simulcasting:', track);
					var maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
					var tr = config.pc.addTransceiver(track, {
						direction: "sendrecv",
						streams: [stream],
						sendEncodings: callbacks.sendEncodings || [{ rid: "h", active: true, maxBitrate: maxBitrates.high }, { rid: "m", active: true, maxBitrate: maxBitrates.medium, scaleResolutionDownBy: 2 }, { rid: "l", active: true, maxBitrate: maxBitrates.low, scaleResolutionDownBy: 4 }]
					});
					if (tr) sender = tr.sender;
				}
				// Check if insertable streams are involved
				if (sender && config.senderTransforms) {
					var senderStreams = null;
					if (RTCRtpSender.prototype.createEncodedStreams) {
						senderStreams = sender.createEncodedStreams();
					} else if (RTCRtpSender.prototype.createAudioEncodedStreams || RTCRtpSender.prototype.createEncodedVideoStreams) {
						if (sender.track.kind === "audio" && config.senderTransforms["audio"]) {
							senderStreams = sender.createEncodedAudioStreams();
						} else if (sender.track.kind === "video" && config.senderTransforms["video"]) {
							senderStreams = sender.createEncodedVideoStreams();
						}
					}
					if (senderStreams) {
						console.log(senderStreams);
						if (senderStreams.readableStream && senderStreams.writableStream) {
							senderStreams.readableStream.pipeThrough(config.senderTransforms[sender.track.kind]).pipeTo(senderStreams.writableStream);
						} else if (senderStreams.readable && senderStreams.writable) {
							senderStreams.readable.pipeThrough(config.senderTransforms[sender.track.kind]).pipeTo(senderStreams.writable);
						}
					}
				}
			});
		}
		// Any data channel to create?
		if (isDataEnabled(media) && !config.dataChannel[Janus.dataChanDefaultLabel]) {
			Janus.log("Creating default data channel");
			createDataChannel(handleId, Janus.dataChanDefaultLabel, null, false);
			config.pc.ondatachannel = function (event) {
				Janus.log("Data channel created by Janus:", event);
				createDataChannel(handleId, event.channel.label, event.channel.protocol, event.channel);
			};
		}
		// If there's a new local stream, let's notify the application
		if (config.myStream) {
			pluginHandle.onlocalstream(config.myStream);
		}
		// Create offer/answer now
		if (!jsep) {
			createOffer(handleId, media, callbacks);
		} else {
			config.pc.setRemoteDescription(jsep).then(function () {
				Janus.log("Remote description accepted!");
				config.remoteSdp = jsep.sdp;
				// Any trickle candidate we cached?
				if (config.candidates && config.candidates.length > 0) {
					for (var i = 0; i < config.candidates.length; i++) {
						var candidate = config.candidates[i];
						Janus.debug("Adding remote candidate:", candidate);
						if (!candidate || candidate.completed === true) {
							// end-of-candidates
							config.pc.addIceCandidate(Janus.endOfCandidates);
						} else {
							// New candidate
							config.pc.addIceCandidate(candidate);
						}
					}
					config.candidates = [];
				}
				// Create the answer now
				createAnswer(handleId, media, callbacks);
			}, callbacks.error);
		}
	}

	function prepareWebrtc(handleId, offer, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : webrtcError;
		var jsep = callbacks.jsep;
		if (offer && jsep) {
			Janus.error("Provided a JSEP to a createOffer");
			callbacks.error("Provided a JSEP to a createOffer");
			return;
		} else if (!offer && (!jsep || !jsep.type || !jsep.sdp)) {
			Janus.error("A valid JSEP is required for createAnswer");
			callbacks.error("A valid JSEP is required for createAnswer");
			return;
		}
		/* Check that callbacks.media is a (not null) Object */
		callbacks.media = _typeof(callbacks.media) === 'object' && callbacks.media ? callbacks.media : { audio: true, video: true };
		var media = callbacks.media;
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		config.trickle = isTrickleEnabled(callbacks.trickle);
		// Are we updating a session?
		if (!config.pc) {
			// Nope, new PeerConnection
			media.update = false;
			media.keepAudio = false;
			media.keepVideo = false;
		} else {
			Janus.log("Updating existing media session");
			media.update = true;
			// Check if there's anything to add/remove/replace, or if we
			// can go directly to preparing the new SDP offer or answer
			if (callbacks.stream) {
				// External stream: is this the same as the one we were using before?
				if (callbacks.stream !== config.myStream) {
					Janus.log("Renegotiation involves a new external stream");
				}
			} else {
				// Check if there are changes on audio
				if (media.addAudio) {
					media.keepAudio = false;
					media.replaceAudio = false;
					media.removeAudio = false;
					media.audioSend = true;
					if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
						Janus.error("Can't add audio stream, there already is one");
						callbacks.error("Can't add audio stream, there already is one");
						return;
					}
				} else if (media.removeAudio) {
					media.keepAudio = false;
					media.replaceAudio = false;
					media.addAudio = false;
					media.audioSend = false;
				} else if (media.replaceAudio) {
					media.keepAudio = false;
					media.addAudio = false;
					media.removeAudio = false;
					media.audioSend = true;
				}
				if (!config.myStream) {
					// No media stream: if we were asked to replace, it's actually an "add"
					if (media.replaceAudio) {
						media.keepAudio = false;
						media.replaceAudio = false;
						media.addAudio = true;
						media.audioSend = true;
					}
					if (isAudioSendEnabled(media)) {
						media.keepAudio = false;
						media.addAudio = true;
					}
				} else {
					if (!config.myStream.getAudioTracks() || config.myStream.getAudioTracks().length === 0) {
						// No audio track: if we were asked to replace, it's actually an "add"
						if (media.replaceAudio) {
							media.keepAudio = false;
							media.replaceAudio = false;
							media.addAudio = true;
							media.audioSend = true;
						}
						if (isAudioSendEnabled(media)) {
							media.keepAudio = false;
							media.addAudio = true;
						}
					} else {
						// We have an audio track: should we keep it as it is?
						if (isAudioSendEnabled(media) && !media.removeAudio && !media.replaceAudio) {
							media.keepAudio = true;
						}
					}
				}
				// Check if there are changes on video
				if (media.addVideo) {
					media.keepVideo = false;
					media.replaceVideo = false;
					media.removeVideo = false;
					media.videoSend = true;
					if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
						Janus.error("Can't add video stream, there already is one");
						callbacks.error("Can't add video stream, there already is one");
						return;
					}
				} else if (media.removeVideo) {
					media.keepVideo = false;
					media.replaceVideo = false;
					media.addVideo = false;
					media.videoSend = false;
				} else if (media.replaceVideo) {
					media.keepVideo = false;
					media.addVideo = false;
					media.removeVideo = false;
					media.videoSend = true;
				}
				if (!config.myStream) {
					// No media stream: if we were asked to replace, it's actually an "add"
					if (media.replaceVideo) {
						media.keepVideo = false;
						media.replaceVideo = false;
						media.addVideo = true;
						media.videoSend = true;
					}
					if (isVideoSendEnabled(media)) {
						media.keepVideo = false;
						media.addVideo = true;
					}
				} else {
					if (!config.myStream.getVideoTracks() || config.myStream.getVideoTracks().length === 0) {
						// No video track: if we were asked to replace, it's actually an "add"
						if (media.replaceVideo) {
							media.keepVideo = false;
							media.replaceVideo = false;
							media.addVideo = true;
							media.videoSend = true;
						}
						if (isVideoSendEnabled(media)) {
							media.keepVideo = false;
							media.addVideo = true;
						}
					} else {
						// We have a video track: should we keep it as it is?
						if (isVideoSendEnabled(media) && !media.removeVideo && !media.replaceVideo) {
							media.keepVideo = true;
						}
					}
				}
				// Data channels can only be added
				if (media.addData) {
					media.data = true;
				}
			}
			// If we're updating and keeping all tracks, let's skip the getUserMedia part
			if (isAudioSendEnabled(media) && media.keepAudio && isVideoSendEnabled(media) && media.keepVideo) {
				pluginHandle.consentDialog(false);
				streamsDone(handleId, jsep, media, callbacks, config.myStream);
				return;
			}
		}
		// If we're updating, check if we need to remove/replace one of the tracks
		if (media.update && !config.streamExternal) {
			if (media.removeAudio || media.replaceAudio) {
				if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
					var at = config.myStream.getAudioTracks()[0];
					Janus.log("Removing audio track:", at);
					config.myStream.removeTrack(at);
					try {
						at.stop();
					} catch (e) {}
				}
				if (config.pc.getSenders() && config.pc.getSenders().length) {
					var ra = true;
					if (media.replaceAudio && Janus.unifiedPlan) {
						// We can use replaceTrack
						ra = false;
					}
					if (ra) {
						var _iteratorNormalCompletion7 = true;
						var _didIteratorError7 = false;
						var _iteratorError7 = undefined;

						try {
							for (var _iterator7 = config.pc.getSenders()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
								var asnd = _step7.value;

								if (asnd && asnd.track && asnd.track.kind === "audio") {
									Janus.log("Removing audio sender:", asnd);
									config.pc.removeTrack(asnd);
								}
							}
						} catch (err) {
							_didIteratorError7 = true;
							_iteratorError7 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion7 && _iterator7.return) {
									_iterator7.return();
								}
							} finally {
								if (_didIteratorError7) {
									throw _iteratorError7;
								}
							}
						}
					}
				}
			}
			if (media.removeVideo || media.replaceVideo) {
				if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
					var vt = config.myStream.getVideoTracks()[0];
					Janus.log("Removing video track:", vt);
					config.myStream.removeTrack(vt);
					try {
						vt.stop();
					} catch (e) {}
				}
				if (config.pc.getSenders() && config.pc.getSenders().length) {
					var rv = true;
					if (media.replaceVideo && Janus.unifiedPlan) {
						// We can use replaceTrack
						rv = false;
					}
					if (rv) {
						var _iteratorNormalCompletion8 = true;
						var _didIteratorError8 = false;
						var _iteratorError8 = undefined;

						try {
							for (var _iterator8 = config.pc.getSenders()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
								var vsnd = _step8.value;

								if (vsnd && vsnd.track && vsnd.track.kind === "video") {
									Janus.log("Removing video sender:", vsnd);
									config.pc.removeTrack(vsnd);
								}
							}
						} catch (err) {
							_didIteratorError8 = true;
							_iteratorError8 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion8 && _iterator8.return) {
									_iterator8.return();
								}
							} finally {
								if (_didIteratorError8) {
									throw _iteratorError8;
								}
							}
						}
					}
				}
			}
		}
		// Was a MediaStream object passed, or do we need to take care of that?
		if (callbacks.stream) {
			var stream = callbacks.stream;
			Janus.log("MediaStream provided by the application");
			Janus.debug(stream);
			// If this is an update, let's check if we need to release the previous stream
			if (media.update) {
				if (config.myStream && config.myStream !== callbacks.stream && !config.streamExternal) {
					// We're replacing a stream we captured ourselves with an external one
					Janus.stopAllTracks(config.myStream);
					config.myStream = null;
				}
			}
			// Skip the getUserMedia part
			config.streamExternal = true;
			pluginHandle.consentDialog(false);
			streamsDone(handleId, jsep, media, callbacks, stream);
			return;
		}
		if (isAudioSendEnabled(media) || isVideoSendEnabled(media)) {
			if (!Janus.isGetUserMediaAvailable()) {
				callbacks.error("getUserMedia not available");
				return;
			}
			var constraints = { mandatory: {}, optional: [] };
			pluginHandle.consentDialog(true);
			var audioSupport = isAudioSendEnabled(media);
			if (audioSupport && media && _typeof(media.audio) === 'object') audioSupport = media.audio;
			var videoSupport = isVideoSendEnabled(media);
			if (videoSupport && media) {
				var simulcast = callbacks.simulcast === true;
				var simulcast2 = callbacks.simulcast2 === true;
				if ((simulcast || simulcast2) && !jsep && !media.video) media.video = "hires";
				if (media.video && media.video != 'screen' && media.video != 'window') {
					if (_typeof(media.video) === 'object') {
						videoSupport = media.video;
					} else {
						var width = 0;
						var height = 0,
						    maxHeight = 0;
						if (media.video === 'lowres') {
							// Small resolution, 4:3
							height = 240;
							maxHeight = 240;
							width = 320;
						} else if (media.video === 'lowres-16:9') {
							// Small resolution, 16:9
							height = 180;
							maxHeight = 180;
							width = 320;
						} else if (media.video === 'hires' || media.video === 'hires-16:9' || media.video === 'hdres') {
							// High(HD) resolution is only 16:9
							height = 720;
							maxHeight = 720;
							width = 1280;
						} else if (media.video === 'fhdres') {
							// Full HD resolution is only 16:9
							height = 1080;
							maxHeight = 1080;
							width = 1920;
						} else if (media.video === '4kres') {
							// 4K resolution is only 16:9
							height = 2160;
							maxHeight = 2160;
							width = 3840;
						} else if (media.video === 'stdres') {
							// Normal resolution, 4:3
							height = 480;
							maxHeight = 480;
							width = 640;
						} else if (media.video === 'stdres-16:9') {
							// Normal resolution, 16:9
							height = 360;
							maxHeight = 360;
							width = 640;
						} else {
							Janus.log("Default video setting is stdres 4:3");
							height = 480;
							maxHeight = 480;
							width = 640;
						}
						Janus.log("Adding media constraint:", media.video);
						videoSupport = {
							'height': { 'ideal': height },
							'width': { 'ideal': width }
						};
						Janus.log("Adding video constraint:", videoSupport);
					}
				} else if (media.video === 'screen' || media.video === 'window') {
					// We're going to try and use the extension for Chrome 34+, the old approach
					// for older versions of Chrome, or the experimental support in Firefox 33+
					var callbackUserMedia = function callbackUserMedia(error, stream) {
						pluginHandle.consentDialog(false);
						if (error) {
							callbacks.error(error);
						} else {
							streamsDone(handleId, jsep, media, callbacks, stream);
						}
					};

					var getScreenMedia = function getScreenMedia(constraints, gsmCallback, useAudio) {
						Janus.log("Adding media constraint (screen capture)");
						Janus.debug(constraints);
						navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
							if (useAudio) {
								navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (audioStream) {
									stream.addTrack(audioStream.getAudioTracks()[0]);
									gsmCallback(null, stream);
								});
							} else {
								gsmCallback(null, stream);
							}
						}).catch(function (error) {
							pluginHandle.consentDialog(false);gsmCallback(error);
						});
					};

					if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
						// The new experimental getDisplayMedia API is available, let's use that
						// https://groups.google.com/forum/#!topic/discuss-webrtc/Uf0SrR4uxzk
						// https://webrtchacks.com/chrome-screensharing-getdisplaymedia/
						constraints.video = {};
						if (media.screenshareFrameRate) {
							constraints.video.frameRate = media.screenshareFrameRate;
						}
						if (media.screenshareHeight) {
							constraints.video.height = media.screenshareHeight;
						}
						if (media.screenshareWidth) {
							constraints.video.width = media.screenshareWidth;
						}
						constraints.audio = media.captureDesktopAudio;
						navigator.mediaDevices.getDisplayMedia(constraints).then(function (stream) {
							pluginHandle.consentDialog(false);
							if (isAudioSendEnabled(media) && !media.keepAudio) {
								navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (audioStream) {
									stream.addTrack(audioStream.getAudioTracks()[0]);
									streamsDone(handleId, jsep, media, callbacks, stream);
								});
							} else {
								streamsDone(handleId, jsep, media, callbacks, stream);
							}
						}, function (error) {
							pluginHandle.consentDialog(false);
							callbacks.error(error);
						});
						return;
					}
					if (Janus.webRTCAdapter.browserDetails.browser === 'chrome') {
						var chromever = Janus.webRTCAdapter.browserDetails.version;
						var maxver = 33;
						if (window.navigator.userAgent.match('Linux')) maxver = 35; // "known" crash in chrome 34 and 35 on linux
						if (chromever >= 26 && chromever <= maxver) {
							// Chrome 26->33 requires some awkward chrome://flags manipulation
							constraints = {
								video: {
									mandatory: {
										googLeakyBucket: true,
										maxWidth: window.screen.width,
										maxHeight: window.screen.height,
										minFrameRate: media.screenshareFrameRate,
										maxFrameRate: media.screenshareFrameRate,
										chromeMediaSource: 'screen'
									}
								},
								audio: isAudioSendEnabled(media) && !media.keepAudio
							};
							getScreenMedia(constraints, callbackUserMedia);
						} else {
							// Chrome 34+ requires an extension
							Janus.extension.getScreen(function (error, sourceId) {
								if (error) {
									pluginHandle.consentDialog(false);
									return callbacks.error(error);
								}
								constraints = {
									audio: false,
									video: {
										mandatory: {
											chromeMediaSource: 'desktop',
											maxWidth: window.screen.width,
											maxHeight: window.screen.height,
											minFrameRate: media.screenshareFrameRate,
											maxFrameRate: media.screenshareFrameRate
										},
										optional: [{ googLeakyBucket: true }, { googTemporalLayeredScreencast: true }]
									}
								};
								constraints.video.mandatory.chromeMediaSourceId = sourceId;
								getScreenMedia(constraints, callbackUserMedia, isAudioSendEnabled(media) && !media.keepAudio);
							});
						}
					} else if (Janus.webRTCAdapter.browserDetails.browser === 'firefox') {
						if (Janus.webRTCAdapter.browserDetails.version >= 33) {
							// Firefox 33+ has experimental support for screen sharing
							constraints = {
								video: {
									mozMediaSource: media.video,
									mediaSource: media.video
								},
								audio: isAudioSendEnabled(media) && !media.keepAudio
							};
							getScreenMedia(constraints, function (err, stream) {
								callbackUserMedia(err, stream);
								// Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810
								if (!err) {
									var lastTime = stream.currentTime;
									var polly = window.setInterval(function () {
										if (!stream) window.clearInterval(polly);
										if (stream.currentTime == lastTime) {
											window.clearInterval(polly);
											if (stream.onended) {
												stream.onended();
											}
										}
										lastTime = stream.currentTime;
									}, 500);
								}
							});
						} else {
							var error = new Error('NavigatorUserMediaError');
							error.name = 'Your version of Firefox does not support screen sharing, please install Firefox 33 (or more recent versions)';
							pluginHandle.consentDialog(false);
							callbacks.error(error);
							return;
						}
					}
					return;
				}
			}
			// If we got here, we're not screensharing
			if (!media || media.video !== 'screen') {
				// Check whether all media sources are actually available or not
				navigator.mediaDevices.enumerateDevices().then(function (devices) {
					var audioExist = devices.some(function (device) {
						return device.kind === 'audioinput';
					}),
					    videoExist = isScreenSendEnabled(media) || devices.some(function (device) {
						return device.kind === 'videoinput';
					});

					// Check whether a missing device is really a problem
					var audioSend = isAudioSendEnabled(media);
					var videoSend = isVideoSendEnabled(media);
					var needAudioDevice = isAudioSendRequired(media);
					var needVideoDevice = isVideoSendRequired(media);
					if (audioSend || videoSend || needAudioDevice || needVideoDevice) {
						// We need to send either audio or video
						var haveAudioDevice = audioSend ? audioExist : false;
						var haveVideoDevice = videoSend ? videoExist : false;
						if (!haveAudioDevice && !haveVideoDevice) {
							// FIXME Should we really give up, or just assume recvonly for both?
							pluginHandle.consentDialog(false);
							callbacks.error('No capture device found');
							return false;
						} else if (!haveAudioDevice && needAudioDevice) {
							pluginHandle.consentDialog(false);
							callbacks.error('Audio capture is required, but no capture device found');
							return false;
						} else if (!haveVideoDevice && needVideoDevice) {
							pluginHandle.consentDialog(false);
							callbacks.error('Video capture is required, but no capture device found');
							return false;
						}
					}

					var gumConstraints = {
						audio: audioExist && !media.keepAudio ? audioSupport : false,
						video: videoExist && !media.keepVideo ? videoSupport : false
					};
					Janus.debug("getUserMedia constraints", gumConstraints);
					if (!gumConstraints.audio && !gumConstraints.video) {
						pluginHandle.consentDialog(false);
						streamsDone(handleId, jsep, media, callbacks, stream);
					} else {
						navigator.mediaDevices.getUserMedia(gumConstraints).then(function (stream) {
							pluginHandle.consentDialog(false);
							streamsDone(handleId, jsep, media, callbacks, stream);
						}).catch(function (error) {
							pluginHandle.consentDialog(false);
							callbacks.error({ code: error.code, name: error.name, message: error.message });
						});
					}
				}).catch(function (error) {
					pluginHandle.consentDialog(false);
					callbacks.error(error);
				});
			}
		} else {
			// No need to do a getUserMedia, create offer/answer right away
			streamsDone(handleId, jsep, media, callbacks);
		}
	}

	function prepareWebrtcPeer(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : webrtcError;
		callbacks.customizeSdp = typeof callbacks.customizeSdp == "function" ? callbacks.customizeSdp : Janus.noop;
		var jsep = callbacks.jsep;
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (jsep) {
			if (!config.pc) {
				Janus.warn("Wait, no PeerConnection?? if this is an answer, use createAnswer and not handleRemoteJsep");
				callbacks.error("No PeerConnection: if this is an answer, use createAnswer and not handleRemoteJsep");
				return;
			}
			callbacks.customizeSdp(jsep);
			config.pc.setRemoteDescription(jsep).then(function () {
				Janus.log("Remote description accepted!");
				config.remoteSdp = jsep.sdp;
				// Any trickle candidate we cached?
				if (config.candidates && config.candidates.length > 0) {
					for (var i = 0; i < config.candidates.length; i++) {
						var candidate = config.candidates[i];
						Janus.debug("Adding remote candidate:", candidate);
						if (!candidate || candidate.completed === true) {
							// end-of-candidates
							config.pc.addIceCandidate(Janus.endOfCandidates);
						} else {
							// New candidate
							config.pc.addIceCandidate(candidate);
						}
					}
					config.candidates = [];
				}
				// Done
				callbacks.success();
			}, callbacks.error);
		} else {
			callbacks.error("Invalid JSEP");
		}
	}

	function createOffer(handleId, media, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		callbacks.customizeSdp = typeof callbacks.customizeSdp == "function" ? callbacks.customizeSdp : Janus.noop;
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		var simulcast = callbacks.simulcast === true;
		if (!simulcast) {
			Janus.log("Creating offer (iceDone=" + config.iceDone + ")");
		} else {
			Janus.log("Creating offer (iceDone=" + config.iceDone + ", simulcast=" + simulcast + ")");
		}
		// https://code.google.com/p/webrtc/issues/detail?id=3508
		var mediaConstraints = {};
		if (Janus.unifiedPlan) {
			// We can use Transceivers
			var audioTransceiver = null,
			    videoTransceiver = null;
			var transceivers = config.pc.getTransceivers();
			if (transceivers && transceivers.length > 0) {
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = transceivers[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var t = _step9.value;

						if (t.sender && t.sender.track && t.sender.track.kind === "audio" || t.receiver && t.receiver.track && t.receiver.track.kind === "audio") {
							if (!audioTransceiver) {
								audioTransceiver = t;
							}
							continue;
						}
						if (t.sender && t.sender.track && t.sender.track.kind === "video" || t.receiver && t.receiver.track && t.receiver.track.kind === "video") {
							if (!videoTransceiver) {
								videoTransceiver = t;
							}
							continue;
						}
					}
				} catch (err) {
					_didIteratorError9 = true;
					_iteratorError9 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion9 && _iterator9.return) {
							_iterator9.return();
						}
					} finally {
						if (_didIteratorError9) {
							throw _iteratorError9;
						}
					}
				}
			}
			// Handle audio (and related changes, if any)
			var audioSend = isAudioSendEnabled(media);
			var audioRecv = isAudioRecvEnabled(media);
			if (!audioSend && !audioRecv) {
				// Audio disabled: have we removed it?
				if (media.removeAudio && audioTransceiver) {
					if (audioTransceiver.setDirection) {
						audioTransceiver.setDirection("inactive");
					} else {
						audioTransceiver.direction = "inactive";
					}
					Janus.log("Setting audio transceiver to inactive:", audioTransceiver);
				}
			} else {
				// Take care of audio m-line
				if (audioSend && audioRecv) {
					if (audioTransceiver) {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection("sendrecv");
						} else {
							audioTransceiver.direction = "sendrecv";
						}
						Janus.log("Setting audio transceiver to sendrecv:", audioTransceiver);
					}
				} else if (audioSend && !audioRecv) {
					if (audioTransceiver) {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection("sendonly");
						} else {
							audioTransceiver.direction = "sendonly";
						}
						Janus.log("Setting audio transceiver to sendonly:", audioTransceiver);
					}
				} else if (!audioSend && audioRecv) {
					if (audioTransceiver) {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection("recvonly");
						} else {
							audioTransceiver.direction = "recvonly";
						}
						Janus.log("Setting audio transceiver to recvonly:", audioTransceiver);
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						audioTransceiver = config.pc.addTransceiver("audio", { direction: "recvonly" });
						Janus.log("Adding recvonly audio transceiver:", audioTransceiver);
					}
				}
			}
			// Handle video (and related changes, if any)
			var videoSend = isVideoSendEnabled(media);
			var videoRecv = isVideoRecvEnabled(media);
			if (!videoSend && !videoRecv) {
				// Video disabled: have we removed it?
				if (media.removeVideo && videoTransceiver) {
					if (videoTransceiver.setDirection) {
						videoTransceiver.setDirection("inactive");
					} else {
						videoTransceiver.direction = "inactive";
					}
					Janus.log("Setting video transceiver to inactive:", videoTransceiver);
				}
			} else {
				// Take care of video m-line
				if (videoSend && videoRecv) {
					if (videoTransceiver) {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection("sendrecv");
						} else {
							videoTransceiver.direction = "sendrecv";
						}
						Janus.log("Setting video transceiver to sendrecv:", videoTransceiver);
					}
				} else if (videoSend && !videoRecv) {
					if (videoTransceiver) {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection("sendonly");
						} else {
							videoTransceiver.direction = "sendonly";
						}
						Janus.log("Setting video transceiver to sendonly:", videoTransceiver);
					}
				} else if (!videoSend && videoRecv) {
					if (videoTransceiver) {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection("recvonly");
						} else {
							videoTransceiver.direction = "recvonly";
						}
						Janus.log("Setting video transceiver to recvonly:", videoTransceiver);
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						videoTransceiver = config.pc.addTransceiver("video", { direction: "recvonly" });
						Janus.log("Adding recvonly video transceiver:", videoTransceiver);
					}
				}
			}
		} else {
			mediaConstraints["offerToReceiveAudio"] = isAudioRecvEnabled(media);
			mediaConstraints["offerToReceiveVideo"] = isVideoRecvEnabled(media);
		}
		var iceRestart = callbacks.iceRestart === true;
		if (iceRestart) {
			mediaConstraints["iceRestart"] = true;
		}
		Janus.debug(mediaConstraints);
		// Check if this is Firefox and we've been asked to do simulcasting
		var sendVideo = isVideoSendEnabled(media);
		if (sendVideo && simulcast && Janus.webRTCAdapter.browserDetails.browser === "firefox") {
			// FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
			Janus.log("Enabling Simulcasting for Firefox (RID)");
			var sender = config.pc.getSenders().find(function (s) {
				return s.track.kind === "video";
			});
			if (sender) {
				var parameters = sender.getParameters();
				if (!parameters) {
					parameters = {};
				}
				var maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
				parameters.encodings = callbacks.sendEncodings || [{ rid: "h", active: true, maxBitrate: maxBitrates.high }, { rid: "m", active: true, maxBitrate: maxBitrates.medium, scaleResolutionDownBy: 2 }, { rid: "l", active: true, maxBitrate: maxBitrates.low, scaleResolutionDownBy: 4 }];
				sender.setParameters(parameters);
			}
		}
		config.pc.createOffer(mediaConstraints).then(function (offer) {
			Janus.debug(offer);
			// JSON.stringify doesn't work on some WebRTC objects anymore
			// See https://code.google.com/p/chromium/issues/detail?id=467366
			var jsep = {
				"type": offer.type,
				"sdp": offer.sdp
			};
			callbacks.customizeSdp(jsep);
			offer.sdp = jsep.sdp;
			Janus.log("Setting local description");
			if (sendVideo && simulcast) {
				// This SDP munging only works with Chrome (Safari STP may support it too)
				if (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "safari") {
					Janus.log("Enabling Simulcasting for Chrome (SDP munging)");
					offer.sdp = mungeSdpForSimulcasting(offer.sdp);
				} else if (Janus.webRTCAdapter.browserDetails.browser !== "firefox") {
					Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring");
				}
			}
			config.mySdp = {
				type: "offer",
				sdp: offer.sdp
			};
			config.pc.setLocalDescription(offer).catch(callbacks.error);
			config.mediaConstraints = mediaConstraints;
			if (!config.iceDone && !config.trickle) {
				// Don't do anything until we have all candidates
				Janus.log("Waiting for all candidates...");
				return;
			}
			// If transforms are present, notify Janus that the media is end-to-end encrypted
			if (config.senderTransforms || config.receiverTransforms) {
				offer["e2ee"] = true;
			}
			callbacks.success(offer);
		}, callbacks.error);
	}

	function createAnswer(handleId, media, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		callbacks.customizeSdp = typeof callbacks.customizeSdp == "function" ? callbacks.customizeSdp : Janus.noop;
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		var simulcast = callbacks.simulcast === true;
		if (!simulcast) {
			Janus.log("Creating answer (iceDone=" + config.iceDone + ")");
		} else {
			Janus.log("Creating answer (iceDone=" + config.iceDone + ", simulcast=" + simulcast + ")");
		}
		var mediaConstraints = null;
		if (Janus.unifiedPlan) {
			// We can use Transceivers
			mediaConstraints = {};
			var audioTransceiver = null,
			    videoTransceiver = null;
			var transceivers = config.pc.getTransceivers();
			if (transceivers && transceivers.length > 0) {
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = transceivers[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var t = _step10.value;

						if (t.sender && t.sender.track && t.sender.track.kind === "audio" || t.receiver && t.receiver.track && t.receiver.track.kind === "audio") {
							if (!audioTransceiver) audioTransceiver = t;
							continue;
						}
						if (t.sender && t.sender.track && t.sender.track.kind === "video" || t.receiver && t.receiver.track && t.receiver.track.kind === "video") {
							if (!videoTransceiver) videoTransceiver = t;
							continue;
						}
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}
			}
			// Handle audio (and related changes, if any)
			var audioSend = isAudioSendEnabled(media);
			var audioRecv = isAudioRecvEnabled(media);
			if (!audioSend && !audioRecv) {
				// Audio disabled: have we removed it?
				if (media.removeAudio && audioTransceiver) {
					try {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection("inactive");
						} else {
							audioTransceiver.direction = "inactive";
						}
						Janus.log("Setting audio transceiver to inactive:", audioTransceiver);
					} catch (e) {
						Janus.error(e);
					}
				}
			} else {
				// Take care of audio m-line
				if (audioSend && audioRecv) {
					if (audioTransceiver) {
						try {
							if (audioTransceiver.setDirection) {
								audioTransceiver.setDirection("sendrecv");
							} else {
								audioTransceiver.direction = "sendrecv";
							}
							Janus.log("Setting audio transceiver to sendrecv:", audioTransceiver);
						} catch (e) {
							Janus.error(e);
						}
					}
				} else if (audioSend && !audioRecv) {
					try {
						if (audioTransceiver) {
							if (audioTransceiver.setDirection) {
								audioTransceiver.setDirection("sendonly");
							} else {
								audioTransceiver.direction = "sendonly";
							}
							Janus.log("Setting audio transceiver to sendonly:", audioTransceiver);
						}
					} catch (e) {
						Janus.error(e);
					}
				} else if (!audioSend && audioRecv) {
					if (audioTransceiver) {
						try {
							if (audioTransceiver.setDirection) {
								audioTransceiver.setDirection("recvonly");
							} else {
								audioTransceiver.direction = "recvonly";
							}
							Janus.log("Setting audio transceiver to recvonly:", audioTransceiver);
						} catch (e) {
							Janus.error(e);
						}
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						audioTransceiver = config.pc.addTransceiver("audio", { direction: "recvonly" });
						Janus.log("Adding recvonly audio transceiver:", audioTransceiver);
					}
				}
			}
			// Handle video (and related changes, if any)
			var videoSend = isVideoSendEnabled(media);
			var videoRecv = isVideoRecvEnabled(media);
			if (!videoSend && !videoRecv) {
				// Video disabled: have we removed it?
				if (media.removeVideo && videoTransceiver) {
					try {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection("inactive");
						} else {
							videoTransceiver.direction = "inactive";
						}
						Janus.log("Setting video transceiver to inactive:", videoTransceiver);
					} catch (e) {
						Janus.error(e);
					}
				}
			} else {
				// Take care of video m-line
				if (videoSend && videoRecv) {
					if (videoTransceiver) {
						try {
							if (videoTransceiver.setDirection) {
								videoTransceiver.setDirection("sendrecv");
							} else {
								videoTransceiver.direction = "sendrecv";
							}
							Janus.log("Setting video transceiver to sendrecv:", videoTransceiver);
						} catch (e) {
							Janus.error(e);
						}
					}
				} else if (videoSend && !videoRecv) {
					if (videoTransceiver) {
						try {
							if (videoTransceiver.setDirection) {
								videoTransceiver.setDirection("sendonly");
							} else {
								videoTransceiver.direction = "sendonly";
							}
							Janus.log("Setting video transceiver to sendonly:", videoTransceiver);
						} catch (e) {
							Janus.error(e);
						}
					}
				} else if (!videoSend && videoRecv) {
					if (videoTransceiver) {
						try {
							if (videoTransceiver.setDirection) {
								videoTransceiver.setDirection("recvonly");
							} else {
								videoTransceiver.direction = "recvonly";
							}
							Janus.log("Setting video transceiver to recvonly:", videoTransceiver);
						} catch (e) {
							Janus.error(e);
						}
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						videoTransceiver = config.pc.addTransceiver("video", { direction: "recvonly" });
						Janus.log("Adding recvonly video transceiver:", videoTransceiver);
					}
				}
			}
		} else {
			if (Janus.webRTCAdapter.browserDetails.browser === "firefox" || Janus.webRTCAdapter.browserDetails.browser === "edge") {
				mediaConstraints = {
					offerToReceiveAudio: isAudioRecvEnabled(media),
					offerToReceiveVideo: isVideoRecvEnabled(media)
				};
			} else {
				mediaConstraints = {
					mandatory: {
						OfferToReceiveAudio: isAudioRecvEnabled(media),
						OfferToReceiveVideo: isVideoRecvEnabled(media)
					}
				};
			}
		}
		Janus.debug(mediaConstraints);
		// Check if this is Firefox and we've been asked to do simulcasting
		var sendVideo = isVideoSendEnabled(media);
		if (sendVideo && simulcast && Janus.webRTCAdapter.browserDetails.browser === "firefox") {
			// FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
			Janus.log("Enabling Simulcasting for Firefox (RID)");
			var sender = config.pc.getSenders()[1];
			Janus.log(sender);
			var parameters = sender.getParameters();
			Janus.log(parameters);

			var maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
			sender.setParameters({ encodings: callbacks.sendEncodings || [{ rid: "h", active: true, maxBitrate: maxBitrates.high }, { rid: "m", active: true, maxBitrate: maxBitrates.medium, scaleResolutionDownBy: 2 }, { rid: "l", active: true, maxBitrate: maxBitrates.low, scaleResolutionDownBy: 4 }] });
		}
		config.pc.createAnswer(mediaConstraints).then(function (answer) {
			Janus.debug(answer);
			// JSON.stringify doesn't work on some WebRTC objects anymore
			// See https://code.google.com/p/chromium/issues/detail?id=467366
			var jsep = {
				"type": answer.type,
				"sdp": answer.sdp
			};
			callbacks.customizeSdp(jsep);
			answer.sdp = jsep.sdp;
			Janus.log("Setting local description");
			if (sendVideo && simulcast) {
				// This SDP munging only works with Chrome
				if (Janus.webRTCAdapter.browserDetails.browser === "chrome") {
					// FIXME Apparently trying to simulcast when answering breaks video in Chrome...
					//~ Janus.log("Enabling Simulcasting for Chrome (SDP munging)");
					//~ answer.sdp = mungeSdpForSimulcasting(answer.sdp);
					Janus.warn("simulcast=true, but this is an answer, and video breaks in Chrome if we enable it");
				} else if (Janus.webRTCAdapter.browserDetails.browser !== "firefox") {
					Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring");
				}
			}
			config.mySdp = {
				type: "answer",
				sdp: answer.sdp
			};
			config.pc.setLocalDescription(answer).catch(callbacks.error);
			config.mediaConstraints = mediaConstraints;
			if (!config.iceDone && !config.trickle) {
				// Don't do anything until we have all candidates
				Janus.log("Waiting for all candidates...");
				return;
			}
			// If transforms are present, notify Janus that the media is end-to-end encrypted
			if (config.senderTransforms || config.receiverTransforms) {
				answer["e2ee"] = true;
			}
			callbacks.success(answer);
		}, callbacks.error);
	}

	function sendSDP(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
		callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle, not sending anything");
			return;
		}
		var config = pluginHandle.webrtcStuff;
		Janus.log("Sending offer/answer SDP...");
		if (!config.mySdp) {
			Janus.warn("Local SDP instance is invalid, not sending anything...");
			return;
		}
		config.mySdp = {
			"type": config.pc.localDescription.type,
			"sdp": config.pc.localDescription.sdp
		};
		if (config.trickle === false) config.mySdp["trickle"] = false;
		Janus.debug(callbacks);
		config.sdpSent = true;
		callbacks.success(config.mySdp);
	}

	function _getVolume(handleId, remote) {
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			return 0;
		}
		var stream = remote ? "remote" : "local";
		var config = pluginHandle.webrtcStuff;
		if (!config.volume[stream]) config.volume[stream] = { value: 0 };
		// Start getting the volume, if audioLevel in getStats is supported (apparently
		// they're only available in Chrome/Safari right now: https://webrtc-stats.callstats.io/)
		if (config.pc.getStats && (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "safari")) {
			if (remote && !config.remoteStream) {
				Janus.warn("Remote stream unavailable");
				return 0;
			} else if (!remote && !config.myStream) {
				Janus.warn("Local stream unavailable");
				return 0;
			}
			if (!config.volume[stream].timer) {
				Janus.log("Starting " + stream + " volume monitor");
				config.volume[stream].timer = setInterval(function () {
					config.pc.getStats().then(function (stats) {
						stats.forEach(function (res) {
							if (!res || res.kind !== "audio") return;
							if (remote && !res.remoteSource || !remote && res.type !== "media-source") return;
							config.volume[stream].value = res.audioLevel ? res.audioLevel : 0;
						});
					});
				}, 200);
				return 0; // We don't have a volume to return yet
			}
			return config.volume[stream].value;
		} else {
			// audioInputLevel and audioOutputLevel seem only available in Chrome? audioLevel
			// seems to be available on Chrome and Firefox, but they don't seem to work
			Janus.warn("Getting the " + stream + " volume unsupported by browser");
			return 0;
		}
	}

	function isMuted(handleId, video) {
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			return true;
		}
		var config = pluginHandle.webrtcStuff;
		if (!config.pc) {
			Janus.warn("Invalid PeerConnection");
			return true;
		}
		if (!config.myStream) {
			Janus.warn("Invalid local MediaStream");
			return true;
		}
		if (video) {
			// Check video track
			if (!config.myStream.getVideoTracks() || config.myStream.getVideoTracks().length === 0) {
				Janus.warn("No video track");
				return true;
			}
			return !config.myStream.getVideoTracks()[0].enabled;
		} else {
			// Check audio track
			if (!config.myStream.getAudioTracks() || config.myStream.getAudioTracks().length === 0) {
				Janus.warn("No audio track");
				return true;
			}
			return !config.myStream.getAudioTracks()[0].enabled;
		}
	}

	function mute(handleId, video, mute) {
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			return false;
		}
		var config = pluginHandle.webrtcStuff;
		if (!config.pc) {
			Janus.warn("Invalid PeerConnection");
			return false;
		}
		if (!config.myStream) {
			Janus.warn("Invalid local MediaStream");
			return false;
		}
		if (video) {
			// Mute/unmute video track
			if (!config.myStream.getVideoTracks() || config.myStream.getVideoTracks().length === 0) {
				Janus.warn("No video track");
				return false;
			}
			config.myStream.getVideoTracks()[0].enabled = !mute;
			return true;
		} else {
			// Mute/unmute audio track
			if (!config.myStream.getAudioTracks() || config.myStream.getAudioTracks().length === 0) {
				Janus.warn("No audio track");
				return false;
			}
			config.myStream.getAudioTracks()[0].enabled = !mute;
			return true;
		}
	}

	function _getBitrate(handleId) {
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Invalid handle");
			return "Invalid handle";
		}
		var config = pluginHandle.webrtcStuff;
		if (!config.pc) return "Invalid PeerConnection";
		// Start getting the bitrate, if getStats is supported
		if (config.pc.getStats) {
			if (!config.bitrate.timer) {
				Janus.log("Starting bitrate timer (via getStats)");
				config.bitrate.timer = setInterval(function () {
					config.pc.getStats().then(function (stats) {
						stats.forEach(function (res) {
							if (!res) return;
							var inStats = false;
							// Check if these are statistics on incoming media
							if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) && res.type === "ssrc" && res.id.indexOf("rtcp") < 0) {
								// New stats
								inStats = true;
							} else if (res.type == 'ssrc' && res.bytesReceived && (res.googCodecName === "VP8" || res.googCodecName === "")) {
								// Older Chromer versions
								inStats = true;
							}
							// Parse stats now
							if (inStats) {
								config.bitrate.bsnow = res.bytesReceived;
								config.bitrate.tsnow = res.timestamp;
								if (config.bitrate.bsbefore === null || config.bitrate.tsbefore === null) {
									// Skip this round
									config.bitrate.bsbefore = config.bitrate.bsnow;
									config.bitrate.tsbefore = config.bitrate.tsnow;
								} else {
									// Calculate bitrate
									var timePassed = config.bitrate.tsnow - config.bitrate.tsbefore;
									if (Janus.webRTCAdapter.browserDetails.browser === "safari") timePassed = timePassed / 1000; // Apparently the timestamp is in microseconds, in Safari
									var bitRate = Math.round((config.bitrate.bsnow - config.bitrate.bsbefore) * 8 / timePassed);
									if (Janus.webRTCAdapter.browserDetails.browser === "safari") bitRate = parseInt(bitRate / 1000);
									config.bitrate.value = bitRate + ' kbits/sec';
									//~ Janus.log("Estimated bitrate is " + config.bitrate.value);
									config.bitrate.bsbefore = config.bitrate.bsnow;
									config.bitrate.tsbefore = config.bitrate.tsnow;
								}
							}
						});
					});
				}, 1000);
				return "0 kbits/sec"; // We don't have a bitrate value yet
			}
			return config.bitrate.value;
		} else {
			Janus.warn("Getting the video bitrate unsupported by browser");
			return "Feature unsupported by browser";
		}
	}

	function webrtcError(error) {
		Janus.error("WebRTC error:", error);
	}

	function cleanupWebrtc(handleId, hangupRequest) {
		Janus.log("Cleaning WebRTC stuff");
		var pluginHandle = pluginHandles[handleId];
		if (!pluginHandle) {
			// Nothing to clean
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (config) {
			if (hangupRequest === true) {
				// Send a hangup request (we don't really care about the response)
				var request = { "janus": "hangup", "transaction": Janus.randomString(12) };
				if (pluginHandle.token) request["token"] = pluginHandle.token;
				if (apisecret) request["apisecret"] = apisecret;
				Janus.debug("Sending hangup request (handle=" + handleId + "):");
				Janus.debug(request);
				if (websockets) {
					request["session_id"] = sessionId;
					request["handle_id"] = handleId;
					ws.send(JSON.stringify(request));
				} else {
					Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
						verb: 'POST',
						withCredentials: withCredentials,
						body: request
					});
				}
			}
			// Cleanup stack
			config.remoteStream = null;
			if (config.volume) {
				if (config.volume["local"] && config.volume["local"].timer) clearInterval(config.volume["local"].timer);
				if (config.volume["remote"] && config.volume["remote"].timer) clearInterval(config.volume["remote"].timer);
			}
			config.volume = {};
			if (config.bitrate.timer) clearInterval(config.bitrate.timer);
			config.bitrate.timer = null;
			config.bitrate.bsnow = null;
			config.bitrate.bsbefore = null;
			config.bitrate.tsnow = null;
			config.bitrate.tsbefore = null;
			config.bitrate.value = null;
			if (!config.streamExternal && config.myStream) {
				Janus.log("Stopping local stream tracks");
				Janus.stopAllTracks(config.myStream);
			}
			config.streamExternal = false;
			config.myStream = null;
			// Close PeerConnection
			try {
				config.pc.close();
			} catch (e) {
				// Do nothing
			}
			config.pc = null;
			config.candidates = null;
			config.mySdp = null;
			config.remoteSdp = null;
			config.iceDone = false;
			config.dataChannel = {};
			config.dtmfSender = null;
			config.senderTransforms = null;
			config.receiverTransforms = null;
		}
		pluginHandle.oncleanup();
	}

	// Helper method to munge an SDP to enable simulcasting (Chrome only)
	function mungeSdpForSimulcasting(sdp) {
		// Let's munge the SDP to add the attributes for enabling simulcasting
		// (based on https://gist.github.com/ggarber/a19b4c33510028b9c657)
		var lines = sdp.split("\r\n");
		var video = false;
		var ssrc = [-1],
		    ssrc_fid = [-1];
		var cname = null,
		    msid = null,
		    mslabel = null,
		    label = null;
		var insertAt = -1;
		for (var i = 0; i < lines.length; i++) {
			var mline = lines[i].match(/m=(\w+) */);
			if (mline) {
				var medium = mline[1];
				if (medium === "video") {
					// New video m-line: make sure it's the first one
					if (ssrc[0] < 0) {
						video = true;
					} else {
						// We're done, let's add the new attributes here
						insertAt = i;
						break;
					}
				} else {
					// New non-video m-line: do we have what we were looking for?
					if (ssrc[0] > -1) {
						// We're done, let's add the new attributes here
						insertAt = i;
						break;
					}
				}
				continue;
			}
			if (!video) continue;
			var sim = lines[i].match(/a=ssrc-group:SIM (\d+) (\d+) (\d+)/);
			if (sim) {
				Janus.warn("The SDP already contains a SIM attribute, munging will be skipped");
				return sdp;
			}
			var fid = lines[i].match(/a=ssrc-group:FID (\d+) (\d+)/);
			if (fid) {
				ssrc[0] = fid[1];
				ssrc_fid[0] = fid[2];
				lines.splice(i, 1);i--;
				continue;
			}
			if (ssrc[0]) {
				var match = lines[i].match('a=ssrc:' + ssrc[0] + ' cname:(.+)');
				if (match) {
					cname = match[1];
				}
				match = lines[i].match('a=ssrc:' + ssrc[0] + ' msid:(.+)');
				if (match) {
					msid = match[1];
				}
				match = lines[i].match('a=ssrc:' + ssrc[0] + ' mslabel:(.+)');
				if (match) {
					mslabel = match[1];
				}
				match = lines[i].match('a=ssrc:' + ssrc[0] + ' label:(.+)');
				if (match) {
					label = match[1];
				}
				if (lines[i].indexOf('a=ssrc:' + ssrc_fid[0]) === 0) {
					lines.splice(i, 1);i--;
					continue;
				}
				if (lines[i].indexOf('a=ssrc:' + ssrc[0]) === 0) {
					lines.splice(i, 1);i--;
					continue;
				}
			}
			if (lines[i].length == 0) {
				lines.splice(i, 1);i--;
				continue;
			}
		}
		if (ssrc[0] < 0) {
			// Couldn't find a FID attribute, let's just take the first video SSRC we find
			insertAt = -1;
			video = false;
			for (var i = 0; i < lines.length; i++) {
				var mline = lines[i].match(/m=(\w+) */);
				if (mline) {
					var medium = mline[1];
					if (medium === "video") {
						// New video m-line: make sure it's the first one
						if (ssrc[0] < 0) {
							video = true;
						} else {
							// We're done, let's add the new attributes here
							insertAt = i;
							break;
						}
					} else {
						// New non-video m-line: do we have what we were looking for?
						if (ssrc[0] > -1) {
							// We're done, let's add the new attributes here
							insertAt = i;
							break;
						}
					}
					continue;
				}
				if (!video) continue;
				if (ssrc[0] < 0) {
					var value = lines[i].match(/a=ssrc:(\d+)/);
					if (value) {
						ssrc[0] = value[1];
						lines.splice(i, 1);i--;
						continue;
					}
				} else {
					var match = lines[i].match('a=ssrc:' + ssrc[0] + ' cname:(.+)');
					if (match) {
						cname = match[1];
					}
					match = lines[i].match('a=ssrc:' + ssrc[0] + ' msid:(.+)');
					if (match) {
						msid = match[1];
					}
					match = lines[i].match('a=ssrc:' + ssrc[0] + ' mslabel:(.+)');
					if (match) {
						mslabel = match[1];
					}
					match = lines[i].match('a=ssrc:' + ssrc[0] + ' label:(.+)');
					if (match) {
						label = match[1];
					}
					if (lines[i].indexOf('a=ssrc:' + ssrc_fid[0]) === 0) {
						lines.splice(i, 1);i--;
						continue;
					}
					if (lines[i].indexOf('a=ssrc:' + ssrc[0]) === 0) {
						lines.splice(i, 1);i--;
						continue;
					}
				}
				if (lines[i].length === 0) {
					lines.splice(i, 1);i--;
					continue;
				}
			}
		}
		if (ssrc[0] < 0) {
			// Still nothing, let's just return the SDP we were asked to munge
			Janus.warn("Couldn't find the video SSRC, simulcasting NOT enabled");
			return sdp;
		}
		if (insertAt < 0) {
			// Append at the end
			insertAt = lines.length;
		}
		// Generate a couple of SSRCs (for retransmissions too)
		// Note: should we check if there are conflicts, here?
		ssrc[1] = Math.floor(Math.random() * 0xFFFFFFFF);
		ssrc[2] = Math.floor(Math.random() * 0xFFFFFFFF);
		ssrc_fid[1] = Math.floor(Math.random() * 0xFFFFFFFF);
		ssrc_fid[2] = Math.floor(Math.random() * 0xFFFFFFFF);
		// Add attributes to the SDP
		for (var i = 0; i < ssrc.length; i++) {
			if (cname) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' cname:' + cname);
				insertAt++;
			}
			if (msid) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' msid:' + msid);
				insertAt++;
			}
			if (mslabel) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' mslabel:' + mslabel);
				insertAt++;
			}
			if (label) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' label:' + label);
				insertAt++;
			}
			// Add the same info for the retransmission SSRC
			if (cname) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' cname:' + cname);
				insertAt++;
			}
			if (msid) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' msid:' + msid);
				insertAt++;
			}
			if (mslabel) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' mslabel:' + mslabel);
				insertAt++;
			}
			if (label) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' label:' + label);
				insertAt++;
			}
		}
		lines.splice(insertAt, 0, 'a=ssrc-group:FID ' + ssrc[2] + ' ' + ssrc_fid[2]);
		lines.splice(insertAt, 0, 'a=ssrc-group:FID ' + ssrc[1] + ' ' + ssrc_fid[1]);
		lines.splice(insertAt, 0, 'a=ssrc-group:FID ' + ssrc[0] + ' ' + ssrc_fid[0]);
		lines.splice(insertAt, 0, 'a=ssrc-group:SIM ' + ssrc[0] + ' ' + ssrc[1] + ' ' + ssrc[2]);
		sdp = lines.join("\r\n");
		if (!sdp.endsWith("\r\n")) sdp += "\r\n";
		return sdp;
	}

	// Helper methods to parse a media object
	function isAudioSendEnabled(media) {
		Janus.debug("isAudioSendEnabled:", media);
		if (!media) return true; // Default
		if (media.audio === false) return false; // Generic audio has precedence
		if (media.audioSend === undefined || media.audioSend === null) return true; // Default
		return media.audioSend === true;
	}

	function isAudioSendRequired(media) {
		Janus.debug("isAudioSendRequired:", media);
		if (!media) return false; // Default
		if (media.audio === false || media.audioSend === false) return false; // If we're not asking to capture audio, it's not required
		if (media.failIfNoAudio === undefined || media.failIfNoAudio === null) return false; // Default
		return media.failIfNoAudio === true;
	}

	function isAudioRecvEnabled(media) {
		Janus.debug("isAudioRecvEnabled:", media);
		if (!media) return true; // Default
		if (media.audio === false) return false; // Generic audio has precedence
		if (media.audioRecv === undefined || media.audioRecv === null) return true; // Default
		return media.audioRecv === true;
	}

	function isVideoSendEnabled(media) {
		Janus.debug("isVideoSendEnabled:", media);
		if (!media) return true; // Default
		if (media.video === false) return false; // Generic video has precedence
		if (media.videoSend === undefined || media.videoSend === null) return true; // Default
		return media.videoSend === true;
	}

	function isVideoSendRequired(media) {
		Janus.debug("isVideoSendRequired:", media);
		if (!media) return false; // Default
		if (media.video === false || media.videoSend === false) return false; // If we're not asking to capture video, it's not required
		if (media.failIfNoVideo === undefined || media.failIfNoVideo === null) return false; // Default
		return media.failIfNoVideo === true;
	}

	function isVideoRecvEnabled(media) {
		Janus.debug("isVideoRecvEnabled:", media);
		if (!media) return true; // Default
		if (media.video === false) return false; // Generic video has precedence
		if (media.videoRecv === undefined || media.videoRecv === null) return true; // Default
		return media.videoRecv === true;
	}

	function isScreenSendEnabled(media) {
		Janus.debug("isScreenSendEnabled:", media);
		if (!media) return false;
		if (_typeof(media.video) !== 'object' || _typeof(media.video.mandatory) !== 'object') return false;
		var constraints = media.video.mandatory;
		if (constraints.chromeMediaSource) return constraints.chromeMediaSource === 'desktop' || constraints.chromeMediaSource === 'screen';else if (constraints.mozMediaSource) return constraints.mozMediaSource === 'window' || constraints.mozMediaSource === 'screen';else if (constraints.mediaSource) return constraints.mediaSource === 'window' || constraints.mediaSource === 'screen';
		return false;
	}

	function isDataEnabled(media) {
		Janus.debug("isDataEnabled:", media);
		if (Janus.webRTCAdapter.browserDetails.browser === "edge") {
			Janus.warn("Edge doesn't support data channels yet");
			return false;
		}
		if (media === undefined || media === null) return false; // Default
		return media.data === true;
	}

	function isTrickleEnabled(trickle) {
		Janus.debug("isTrickleEnabled:", trickle);
		return trickle === false ? false : true;
	}
}

exports.default = Janus;

/***/ }),

/***/ "./ivm/room.js":
/*!*********************!*\
  !*** ./ivm/room.js ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
	value: true
}));
exports.FeedTypes = exports.Feed = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _text_room = __webpack_require__(/*! ./text_room.js */ "./ivm/text_room.js");

var _text_room2 = _interopRequireDefault(_text_room);

var _events = __webpack_require__(/*! ./events.js */ "./ivm/events.js");

var _events2 = _interopRequireDefault(_events);

var _janus = __webpack_require__(/*! ./janus.js */ "./ivm/janus.js");

var _janus2 = _interopRequireDefault(_janus);

var _video_publisher = __webpack_require__(/*! ./video_publisher.js */ "./ivm/video_publisher.js");

var _video_publisher2 = _interopRequireDefault(_video_publisher);

var _video_subscriber = __webpack_require__(/*! ./video_subscriber.js */ "./ivm/video_subscriber.js");

var _video_subscriber2 = _interopRequireDefault(_video_subscriber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
	janus: {
		keepAliveIntervalMs: 30000,
		options: {
			rejectUnauthorized: false
		}
	}
};

var Feed = function () {
	function Feed(room, user, type, identifier) {
		var extras = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

		_classCallCheck(this, Feed);

		Object.assign(this, { room: room, user: user, type: type, identifier: identifier });
		this.key = Feed.makeKey(user.id, type, identifier);
		this.data_provider = null;
		this.extras = extras;
		this.is_local = user.id === room.user.id;
		this.feed_type = room.feed_types.get(type);
		this.is_live = false;

		if (this.feed_type) {
			this.feed_type = this.is_local ? this.feed_type.local : this.feed_type.remote;

			var data_provider_klass = this.feed_type.data_provider;
			this.data_provider = new data_provider_klass(room);
		}
	}

	_createClass(Feed, [{
		key: "inited",
		value: function inited() {
			return this.data_provider !== null;
		}
	}, {
		key: "init",
		value: function init(data_provider) {
			this.data_provider = data_provider;
		}
	}, {
		key: "notify",
		value: function notify() {
			var to = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!this.is_live) return;
			var payload = {
				user: this.user,
				type: this.type,
				identifier: this.identifier,
				extras: this.extras
			};

			if (to) {
				console.log("send feed to =====", to, payload);
				this.room.text_room.send_to("feed", to, payload);
			} else {
				console.log("send feed========", payload);
				this.room.text_room.send("feed", payload);
			}
		}
	}, {
		key: "makeLive",
		value: function makeLive() {
			this.is_live = true;
			this.notify();
			return this;
		}
	}, {
		key: "close",
		value: function close() {
			if (this.data_provider && this.data_provider.close) {
				this.data_provider.close();
			}
		}
	}], [{
		key: "makeKey",
		value: function makeKey(user_id, type, identifier) {
			return user_id + "-" + type + "-" + identifier;
		}
	}]);

	return Feed;
}();

var FeedTypes = function () {
	function FeedTypes() {
		_classCallCheck(this, FeedTypes);

		this.types = {};
	}

	_createClass(FeedTypes, [{
		key: "register",
		value: function register(_ref) {
			var type = _ref.type,
			    local = _ref.local,
			    remote = _ref.remote;

			if (!local.data_provider) throw "local data_provider missing ";
			if (!remote.data_provider) throw "remote data_provider missing ";

			this.types[type] = {
				local: local,
				remote: remote
			};
			return this;
		}
	}, {
		key: "get",
		value: function get(type) {
			return this.types[type];
		}
	}]);

	return FeedTypes;
}();
/*
user: {id: 101, name: "Moderator-1"}
*/

var VideoFeedConfig = {
	type: "videoroom",
	local: { data_provider: _video_publisher2.default },
	remote: { data_provider: _video_subscriber2.default }
};

var registeredFeedTypes = new FeedTypes().register(VideoFeedConfig);

var Room = function (_EventEmitter) {
	_inherits(Room, _EventEmitter);

	function Room(conf) {
		_classCallCheck(this, Room);

		// if (!Janus) throw "Janus is required";
		// this.JanusKlass = Janus;
		var _this = _possibleConstructorReturn(this, (Room.__proto__ || Object.getPrototypeOf(Room)).call(this));

		_this.user = {};
		_this.user.id = conf.userid;
		_this.user.name = conf.username;
		_this.room_id = conf.vmrid;
		_this.feed_types = registeredFeedTypes || new FeedTypes();
		_this.participants = {};
		_this.config = {};
		_this.on("feed_data_received", function (_ref2) {
			var from = _ref2.from,
			    payload = _ref2.payload;

			if (from !== "" + conf.userid) {
				console.warn("update feed", from, payload, conf.userid, "" + conf.userid === from);
				console.log("add remote feed");
				_this.addRemoteFeed(payload.user, payload.type, payload.identifier, payload.extras);
			}
		});
		var server;
		console.log(conf.host,conf.rootpath);
		try {
			//alert(this._conf.protocol);
			if (conf.protocol == 'http:') {
				// server = "http://" + window.location.hostname + ":8088/janus";
				server = "ws://" + conf.host + conf.rootpath + "api/ivmr/videoroom";
			} else {
				// server = "https://" + window.location.hostname + ":8089/janus";
				server = "wss://" + conf.host + conf.rootpath + "api/ivmr/videoroom";
			}
		} catch (e) {
			alert('error');
			return _possibleConstructorReturn(_this);
		}
		_this.config.url = server;
		return _this;
	}

	_createClass(Room, [{
		key: "addParticipant",
		value: function addParticipant(user) {
			if (!user) throw "no user";
			this.participants[user.id] = this.participants[user.id] || { user: user };
			this.participants[user.id].feeds = this.participants[user.id].feeds || {};
			this.emit("participants_changed");
			return this.participants[user.id];
		}
	}, {
		key: "sendParticipantMyLocalFeeds",
		value: function sendParticipantMyLocalFeeds(user) {
			this.localFeeds().forEach(function (feed) {
				feed.notify(user);
			});
		}
	}, {
		key: "addRemoteFeed",
		value: function addRemoteFeed(user, type, identifier, extras) {
			// console.log(user,type,identifier,extras,55555);
			var participant = this.addParticipant(user);
			var new_feed = new Feed(this, participant.user, type, identifier, extras);

			participant.feeds[new_feed.key] = participant.feeds[new_feed.key] || new_feed;
			this.emit("participants_changed");
			this.emit("onnewfeed", new_feed);
			console.log("=======", this.participants);
			return participant.feeds[new_feed.key];
		}
	}, {
		key: "removeParticipant",
		value: function removeParticipant(user_id) {
			if (this.participants[user_id]) {
				var feeds = this.participants[user_id].feeds;
				Object.values(feeds).forEach(function (feed) {
					feed.close();
				});
				delete this.participants[user_id];
				this.emit("participants_changed");
				this.emit("participants_deleted", user_id);
			}
		}
	}, {
		key: "getFeed",
		value: function getFeed(user_id, type, identifier) {
			if (this.participants[user_id]) {
				var feed_key = Feed.makeKey(user_id, type, identifier);
				return this.participants[user_id].feeds[feed_key];
			}
		}
	}, {
		key: "localFeeds",
		value: function localFeeds() {
			this.addParticipant(this.user);
			var my = this.participants[this.user.id];
			return Object.values(my.feeds);
		}
	}, {
		key: "findOrCreateLocalFeed",
		value: function findOrCreateLocalFeed(type, identifier) {
			this.addParticipant(this.user);
			var feed_key = Feed.makeKey(this.user.id, type, identifier);
			var my = this.participants[this.user.id];

			my.feeds[feed_key] = my.feeds[feed_key] || new Feed(this, this.user, type, identifier);
			var feed = my.feeds[feed_key];
			console.log("Local Feed", feed);
			return feed;
		}
		/*
  {
   token: "1620615516,janus,janus.plugin.videoroom,janus.plug…anus.plugin.textroom:qYvkON1uKqc1a1R+/y1XikgsumE=", 
   url: "ws://192.168.100.101:8188/"
  }
  */

	}, {
		key: "connect",
		value: function connect() {
			var _this2 = this;
			return this.janusInit(this.config).then(function () {
				_this2.text_room = new _text_room2.default(_this2);
				return _this2.text_room.setup();
			});
		}
	}, {
		key: "janusInit",
		value: function janusInit(config) {
			// const Janus = new Janus(this);
			var room = this;
			return new Promise(function (resolve, reject) {
				_janus2.default.init({
					debug: "all",
					callback: function callback() {
						if (!_janus2.default.isWebrtcSupported()) {
							console.log("No WebRTC support... ");
							return;
						}

						var janus = new _janus2.default({
							server: config.url,
							token: config.token,
							success: function success() {
								room.janus = janus;
								resolve(janus);
								room.emit("connected", room);
							},
							error: function error(_error) {
								reject();
							},
							destroyed: function destroyed() {
								room.emit("destoyed");
							}
						});
					}
				});
			});
		}
	}]);

	return Room;
}(_events2.default);

exports.default = Room;
exports.Feed = Feed;
exports.FeedTypes = FeedTypes;

/***/ }),

/***/ "./ivm/text_room.js":
/*!**************************!*\
  !*** ./ivm/text_room.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
	value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function randomString(len, charSet) {
	charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var randomString = "";
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	return randomString;
}

var TextRoom = function () {
	function TextRoom(room) {
		_classCallCheck(this, TextRoom);

		this.room = room;
	}

	_createClass(TextRoom, [{
		key: "send_txt",
		value: function send_txt(text) {
			var _this = this;

			var message = {
				textroom: "message",
				transaction: randomString(12),
				room: this.room.room_id,
				text: text,
				ack: false
			};
			// Note: messages are always acknowledged by default. This means that you'll
			// always receive a confirmation back that the message has been received by the
			// server and forwarded to the recipients. If you do not want this to happen,
			// just add an ack:false property to the message above, and server won't send
			// you a response (meaning you just have to hope it succeeded).
			return new Promise(function (resolve, reject) {
				_this.plugin.data({
					text: JSON.stringify(message),
					error: reject,
					success: resolve
				});
			});
		}
	}, {
		key: "whisper_txt",
		value: function whisper_txt(to, text) {
			var _this2 = this;

			var message = {
				textroom: "message",
				transaction: randomString(12),
				room: this.room.room_id,
				text: text,
				ack: true,
				to: to
			};
			// Note: messages are always acknowledged by default. This means that you'll
			// always receive a confirmation back that the message has been received by the
			// server and forwarded to the recipients. If you do not want this to happen,
			// just add an ack:false property to the message above, and server won't send
			// you a response (meaning you just have to hope it succeeded).
			return new Promise(function (resolve, reject) {
				_this2.plugin.data({
					text: JSON.stringify(message),
					error: reject,
					success: resolve
				});
			});
		}
	}, {
		key: "send_to",
		value: function send_to(type, to, payload) {
			return this.whisper_txt("" + to, JSON.stringify({
				payload: payload,
				type: type
			}));
		}
	}, {
		key: "send",
		value: function send(type, payload) {
			return this.send_txt(JSON.stringify({
				payload: payload,
				type: type
			}));
		}
	}, {
		key: "setup",
		value: function setup() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_this3.room.janus.attach({
					plugin: "janus.plugin.textroom",
					opaqueId: "" + _this3.room.user.id,
					success: function success(pluginHandle) {
						_this3.plugin = pluginHandle;
						var body = { request: "setup" };
						_this3.plugin.send({ message: body });
					},
					error: function error(_error) {
						reject();
						console.error("  -- Error attaching plugin...", _error);
					},
					webrtcState: function webrtcState(on) {
						console.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
					},
					onmessage: function onmessage(msg, jsep) {
						console.debug(" ::: Got a message :::");
						console.debug(msg);
						if (msg["error"] !== undefined && msg["error"] !== null) {
							//todo error
						}
						if (jsep !== undefined && jsep !== null) {
							// Answer
							_this3.plugin.createAnswer({
								jsep: jsep,
								media: { audio: false, video: false, data: true }, // We only use datachannels
								success: function success(jsep) {
									console.debug("Got SDP!");
									console.debug(jsep);
									var request = { request: "ack" };
									_this3.plugin.send({ message: request, jsep: jsep });
								},
								error: function error(_error2) {
									console.error("WebRTC error:", _error2);
								}
							});
						}
					},
					ondataopen: function ondataopen(data) {
						console.debug("The DataChannel is available!");

						var request = {
							textroom: "join",
							transaction: randomString(12),
							room: _this3.room.room_id,
							username: "" + _this3.room.user.id,
							display: _this3.room.user.name
						};
						console.log("joinign room", request);
						_this3.plugin.data({
							text: JSON.stringify(request),
							success: function success(data) {
								resolve();
								_this3.room.emit("datachannelready", data);
							}
						});
					},
					ondata: function ondata(data) {
						var json = JSON.parse(data);
						console.warn("We got data from the DataChannel! ", json);

						var event = json.textroom;

						if (event === "success") {
							if (json.participants) {
								json.participants.forEach(function (p) {
									return _this3.room.addParticipant({
										id: p.username,
										name: p.display
									});
								});
							}
						} else if (event === "message") {
							var _data = JSON.parse(json["text"]);
							var msg = {
								from: json["from"],
								date: json["date"]
								// payload:data.payload,
								// type:data.type
							};
							for (var key in _data) {
								msg[key] = _data[key];
							}
							if (msg.type) {
								_this3.room.emit(msg.type + "_data_received", msg);
							}
							_this3.room.emit("data_channel_recv_msg", msg);
						} else if (event === "join") {
							_this3.room.addParticipant({
								id: json.username,
								name: json.display
							});
							_this3.room.sendParticipantMyLocalFeeds(json.username);
						} else if (event === "leave") {
							_this3.room.removeParticipant(json.username);
						}

						// } else if (event === "announcement") {

						//
						// } else if (event === "kicked") {
						// } else if (event === "destroyed") {
						// }
						_this3.room.emit("data_channel_recv", json);
					},
					oncleanup: function oncleanup() {
						console.log(" ::: Got a cleanup notification :::");
					}
				});
			});
		}
	}]);

	return TextRoom;
}();

exports.default = TextRoom;

/***/ }),

/***/ "./ivm/video_publisher.js":
/*!********************************!*\
  !*** ./ivm/video_publisher.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
	value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(/*! ./events.js */ "./ivm/events.js");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VideoPublisher = function (_EventEmitter) {
	_inherits(VideoPublisher, _EventEmitter);

	function VideoPublisher(room) {
		_classCallCheck(this, VideoPublisher);

		var _this = _possibleConstructorReturn(this, (VideoPublisher.__proto__ || Object.getPrototypeOf(VideoPublisher)).call(this));

		_this.room = room;
		_this.participants = {};
		return _this;
	}

	_createClass(VideoPublisher, [{
		key: "isLive",
		value: function isLive() {
			return this.plugin && this.plugin.webrtcStuff.pc.iceConnectionState !== "completed" && this.plugin.webrtcStuff.pc.iceConnectionState !== "connected";
		}
	}, {
		key: "isAudioMuted",
		value: function isAudioMuted() {
			return this.plugin.isAudioMuted();
		}
	}, {
		key: "muteAudio",
		value: function muteAudio() {
			return this.plugin.muteAudio();
		}
	}, {
		key: "unmuteAudio",
		value: function unmuteAudio() {
			return this.plugin.unmuteAudio();
		}
	}, {
		key: "changeBandwidth",
		value: function changeBandwidth(bitrate) {
			var _this2 = this;

			return new Promise(function (success, error) {
				_this2.plugin.send({
					message: { request: "configure", bitrate: bitrate },
					success: success,
					error: error
				});
			});
		}
	}, {
		key: "connect",
		value: function connect() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_this3.room.janus.attach({
					plugin: "janus.plugin.videoroom",
					opaqueId: "" + _this3.room.user.id,
					success: function success(pluginHandle) {
						_this3.plugin = pluginHandle;

						var register = {
							request: "join",
							room: _this3.room.room_id,
							ptype: "publisher",
							display: _this3.room.user.name
						};

						_this3.plugin.send({
							message: register,
							success: resolve,
							error: reject
						});
					},
					consentDialog: function consentDialog(on) {},
					mediaState: function mediaState(medium, on) {
						_this3.emit("mediaState", medium, on);
					},
					webrtcState: function webrtcState(on) {
						_this3.emit("webrtcState", on);
					},
					onmessage: function onmessage(msg, jsep) {
						_this3.emit("onmessage", msg, jsep);

						var event = msg.videoroom;
						if (msg.publishers) {
							_this3.participants = msg.publishers.reduce(function (ret, val) {
								ret[val.id] = val;
								return ret;
							}, {});
						}

						if (event) {
							if (event === "joined") {
								_this3.emit(event, msg, jsep);
							} else if (event === "destroyed") {
								_this3.emit(event, msg, jsep);
							} else if (event === "event") {
								if (msg.error) _this3.emit("error", msg, jsep);
								if (msg.publishers) {
									_this3.emit("publishers", msg, jsep);
								}
								if (msg.leaving) _this3.emit("leaving", msg, jsep);
								if (msg.unpublished) {
									delete _this3.participants[msg.unpublished];
									_this3.emit("unpublished", msg, jsep);
								}
							}
						}

						if (jsep !== undefined && jsep !== null) {
							_this3.plugin.handleRemoteJsep({ jsep: jsep });
							// Check if any of the media we wanted to publish has
							// been rejected (e.g., wrong or unsupported codec)

							if (_this3.local_stream) {
								if (_this3.local_stream.getAudioTracks() && _this3.local_stream.getAudioTracks().length > 0 && !msg.audio_codec) {
									// Audio has been rejected
									console.error("Our audio stream has been rejected, viewers won't hear us");
								}

								if (_this3.local_stream.getVideoTracks() && _this3.local_stream.getVideoTracks().length > 0 && !msg.video_codec) {
									console.error("Our video stream has been rejected, viewers won't see us");
								}
							}
						}
					},

					onlocalstream: function onlocalstream(stream) {
						_this3.local_stream = stream;
						_this3.emit("onlocalstream", stream);
					},
					oncleanup: function oncleanup() {
						_this3.emit("oncleanup");
					}
				});
			});
		}
	}, {
		key: "publish",
		value: function publish() {
			var _this4 = this;

			var medial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return new Promise(function (resolve, reject) {
				var media = {
					audioRecv: false,
					videoRecv: false,
					// audioSend: true,
					videoSend: true
					// ...medial,
				};
				for (var key in medial) {
					media[key] = medial[key];
				}
				console.log(media);
				_this4.plugin.createOffer({
					media: media,
					simulcast: false,
					success: function success(jsep) {
						var publish = {
							request: "configure",
							audio: media.audioSend,
							video: media.videoSend
						};
						if (media.vcodec) publish["videocodec"] = media.vcodec;
						_this4.plugin.send({
							message: publish,
							jsep: jsep,
							success: resolve,
							error: reject
						});
					},
					error: reject
				});
			});
		}
	}]);

	return VideoPublisher;
}(_events2.default);

exports.default = VideoPublisher;

/***/ }),

/***/ "./ivm/video_subscriber.js":
/*!*********************************!*\
  !*** ./ivm/video_subscriber.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(/*! ./events.js */ "./ivm/events.js");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VideoSubscriber = function (_EventEmitter) {
  _inherits(VideoSubscriber, _EventEmitter);

  function VideoSubscriber(room) {
    _classCallCheck(this, VideoSubscriber);

    var _this = _possibleConstructorReturn(this, (VideoSubscriber.__proto__ || Object.getPrototypeOf(VideoSubscriber)).call(this));

    _this.room = room;
    return _this;
  }

  _createClass(VideoSubscriber, [{
    key: "isLive",
    value: function isLive() {
      return this.plugin && this.plugin.webrtcStuff.pc.iceConnectionState !== "completed" && this.plugin.webrtcStuff.pc.iceConnectionState !== "connected";
    }
  }, {
    key: "connect",
    value: function connect(id) {
      var _this2 = this;

      var video_codec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return new Promise(function (resolve, reject) {
        _this2.room.janus.attach({
          plugin: "janus.plugin.videoroom",
          opaqueId: "" + _this2.room.user.id,
          success: function success(pluginHandle) {
            _this2.plugin = pluginHandle;

            var subscribe = {
              request: "join",
              room: _this2.room.room_id,
              ptype: "subscriber",
              feed: id,
              display: _this2.room.user.name
            };

            _this2.plugin.videoCodec = video_codec;
            _this2.plugin.send({ message: subscribe, error: reject });
          },
          onmessage: function onmessage(msg, jsep) {
            console.debug("Got a message (subscriber) ", msg);

            if (jsep !== undefined && jsep !== null) {
              console.debug("SUBS: Handling SDP as well...");
              console.debug(jsep);
              // Answer and attach
              _this2.plugin.createAnswer({
                jsep: jsep,
                // Add data:true here if you want to subscribe to datachannels as well
                // (obviously only works if the publisher offered them in the first place)
                media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
                success: function success(jsep) {
                  console.debug("Got SDP!");
                  console.debug(jsep);
                  var body = { request: "start", room: _this2.room.room_id };
                  _this2.plugin.send({
                    message: body,
                    jsep: jsep,
                    success: resolve
                  });
                },
                error: reject
              });
            }
          },
          webrtcState: function webrtcState(on) {
            _this2.emit("webrtcState", on);
          },
          onremotestream: function onremotestream(stream) {
            _this2.remote_stream = stream;
            _this2.emit("onremotestream", stream);
          },
          oncleanup: function oncleanup() {
            _this2.emit("oncleanup");
          }
        });
      });
    }
  }]);

  return VideoSubscriber;
}(_events2.default);

exports.default = VideoSubscriber;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************!*\
  !*** ./ivm/ivm.js ***!
  \********************/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.IccRTCGetCapability = exports.IccRTCPush = exports.IccPlayerRTC = exports.Janus = exports.VideoSubscriber = exports.VideoPublisher = exports.TextRoom = exports.AudioBridge = exports.FeedTypes = exports.Room = undefined;

var _room = __webpack_require__(/*! ./room.js */ "./ivm/room.js");

var _room2 = _interopRequireDefault(_room);

var _audio_bridge = __webpack_require__(/*! ./audio_bridge.js */ "./ivm/audio_bridge.js");

var _audio_bridge2 = _interopRequireDefault(_audio_bridge);

var _text_room = __webpack_require__(/*! ./text_room.js */ "./ivm/text_room.js");

var _text_room2 = _interopRequireDefault(_text_room);

var _video_publisher = __webpack_require__(/*! ./video_publisher.js */ "./ivm/video_publisher.js");

var _video_publisher2 = _interopRequireDefault(_video_publisher);

var _video_subscriber = __webpack_require__(/*! ./video_subscriber.js */ "./ivm/video_subscriber.js");

var _video_subscriber2 = _interopRequireDefault(_video_subscriber);

var _janus = __webpack_require__(/*! ./janus.js */ "./ivm/janus.js");

var _janus2 = _interopRequireDefault(_janus);

var _Iccplayer = __webpack_require__(/*! ./Iccplayer */ "./ivm/Iccplayer.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Room = _room2.default;
exports.FeedTypes = _room.FeedTypes;
exports.AudioBridge = _audio_bridge2.default;
exports.TextRoom = _text_room2.default;
exports.VideoPublisher = _video_publisher2.default;
exports.VideoSubscriber = _video_subscriber2.default;
exports.Janus = _janus2.default;
exports.IccPlayerRTC = _Iccplayer.IccPlayerRTC;
exports.IccRTCPush = _Iccplayer.IccRTCPush;
exports.IccRTCGetCapability = _Iccplayer.IccRTCGetCapability;
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=iccivmjs.js.map