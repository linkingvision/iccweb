/**
 * Common function
 */
function createRTCSessionDescription(msg) {
    var SessionDescription = new RTCSessionDescription(msg);
    return SessionDescription;
}

var gStrH5SPlayerVersion = 'h5splayer r11.5.0611';
console.log('[h5s]', gStrH5SPlayerVersion);

/** 
 * Interface with h5s websocket player API
 * @constructor
 * @param 
 var pbconf1 = {
	begintime: '2019-03-23T120101+08',//{string} begintime 0 for fileplayback
	endtime: '2019-03-23T150101+08',//{string} endtime 0 for fileplayback
	autoplay: 'true', // 'true' or 'false' for playback autoplay
	showposter: 'true', //'true' or 'false' show poster
	serverpb: 'true', //'true' or 'false' playback from h5stream record, default false 
	filename: 'token1.mp4', // file name need to playback (begintime == 0 & endtime == 0 and serverpb is true)
	callback: PlaybackCB, //{function}(event(string), userdata(object)) 
	userdata:  user data // user data
};
 
 var conf = {
	videoid:'h5sVideo1', //{string} - id of the video element tag
	videodom: h5svideodom1, //{object} - video dom. if there has videoid, just use the videoid
	protocol: window.location.protocol, // {string} - 'http:' or 'https:'
	host: window.location.host, //{string} - 'localhost:8080'
	rootpath:window.location.pathname, // {string} - path of the app running
	token:'token1', // {string} - token of stream
	streamprofile: 'main', // {string} - stream profile, main/sub or other predefine transcoding profile
	pbconf: pbconf1, //This is optional, if no pbconf, this will be live.
	hlsver:'v1', //{string} -  v1 is for ts, v2 is for fmp4 
	session:'c1782caf-b670-42d8-ba90-2244d0b0ee83', //{string} - session got from login
	consolelog: 'true' // 'true' or 'false' enable/disable console.log
};
 _    _ _____     _____  _                    __          _______ 
| |  | | ____|   |  __ \| |                   \ \        / / ____|
| |__| | |__  ___| |__) | | __ _ _   _  ___ _ _\ \  /\  / / (___  
|  __  |___ \/ __|  ___/| |/ _` | | | |/ _ \ '__\ \/  \/ / \___ \ 
| |  | |___) \__ \ |    | | (_| | |_| |  __/ |   \  /\  /  ____) |
|_|  |_|____/|___/_|    |_|\__,_|\__, |\___|_|    \/  \/  |_____/ 
                                  __/ |                           
                                 |___/                            
*/

function H5sPlayerWS(conf)
{
	
	this.sourceBuffer;
	this.buffer = [];	
	this.mediaSource;
	this.video;
	this.wsSocket;
	this.checkSourceBufferId;
	this.keepaliveTimerId;
	this.emptyBuffCnt = 0;
	this.lastBuffTime = 0;
	this.buffTimeSameCnt = 0;
	this.bNeedReconnect = false;
	this.bDisConnected = false;
	this._bGetCodec = false;
	this._strCodec;
	this._nReconnectCnt = 1;
	
	this._debug = true;	
	if (conf.consolelog !== undefined)
	{
		if (conf.consolelog === 'false')
		{
			this._debug = false;	
		}
	}	
	
	this._conf = conf;
	if(this._debug === true) console.log("[WS] Websocket Conf:", conf);
	
	this._videoId = conf.videoid;
	
	this._pbconf = conf.pbconf;
	
	this._token = conf.token;
	
	//if(this._debug === true) console.log(conf.token, this._videoId);
	if (this._videoId === undefined)
	{
		this._videodom = conf.videodom;
		if(this._debug === true) console.log("[WS] use dom directly", conf.token);
	}else
	{
		this._videodom = document.getElementById(this._videoId);
		if(this._debug === true) console.log("[WS] use videoid", conf.token);
	}
	
	this.video = this._videodom;

	this._strPosterUri;
	//playback don't use poster
	if (this._pbconf != undefined && this._pbconf.showposter == 'false')
	{
	}else 
	{
		this._strPosterUri = this._conf.protocol + '//' + this._conf.host + this._conf.rootpath +
									'api/v1/GetImage?token=' + this._token + '&session=' + this._conf.session;									
		if(this._debug === true) console.log("[WS] connect src", conf.token);
		this._videodom.setAttribute('poster', this._strPosterUri);
	}
	
	
	
	
	
}

H5sPlayerWS.prototype.ReconnectFunction = function() 
{
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
	if (this.bNeedReconnect === true)
	{
		if(this._debug === true) console.log('[WS] Reconnect...');
		
		var strReconnectUrl = this._strPosterUri + "&update=" + this._nReconnectCnt;
		this._videodom.setAttribute('poster', strReconnectUrl);
		if(this._debug === true) console.log('[WS] Reconnect image', strReconnectUrl);
		this._nReconnectCnt++;
		
		this.setupWebSocket(this._token);
		this.bNeedReconnect = false;
		
	}
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
}
	
	
H5sPlayerWS.prototype.H5SWebSocketClient = function(h5spath) 
{
	var socket;
	if(this._debug === true) console.log("[WS] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") 
		{
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('ws://' + this._conf.host  +  h5spath);
			}else
			{
				socket = new WebSocket('ws://' + this._conf.host +  h5spath);
			}
		}
		if (this._conf.protocol == "https:")
		{	
			//alert(this._conf.host);
			if(this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('wss://' + this._conf.host +  h5spath);
			}else
			{
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}				
		}
		if(this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
}
	
	
H5sPlayerWS.prototype.readFromBuffer = function()
{
	if (this.sourceBuffer === null || this.sourceBuffer === undefined)
	{
		if(this._debug === true) console.log("[WS] is null or undefined", this.sourceBuffer);
		return;
	}
	if (this.buffer.length === 0 || this.sourceBuffer.updating) 
	{
	  return;
	}
	try {
	  var data = this.buffer.shift();
	  var dataArray = new Uint8Array(data);
	  this.sourceBuffer.appendBuffer(dataArray);
	} catch (e) {
	  if(this._debug === true) console.log(e);
	  this.wsSocket.close();
	}
}
H5sPlayerWS.prototype.keepaliveTimer = function()	
{
	try {
		var j = {};
		j.cmd = "H5_KEEPALIVE";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerWS.prototype.onWebSocketData = function(msg)	
{
/*
	var blob = msg.data;

	var fileReader = new FileReader();
	fileReader.onload = function () {
		this.buffer.push(this.result);
		readFromBuffer();
	};

	fileReader.readAsArrayBuffer(blob);
	*/
	if(msg.data instanceof ArrayBuffer )
	{
		//if(this._debug === true) console.log("ArrayBuffer");
	}
	
	if(typeof msg.data === 'string')
	{
		if(this._debug === true) console.log("[WS] string");
		if (this._pbconf != undefined && this._pbconf.callback != undefined)
		{
			this._pbconf.callback(msg.data, this._pbconf.userdata);
		}
		return;
	}
	
	if (this.bDisConnected === true)
	{
		return;
	}
	if (this._bGetCodec === false)
	{
		this._strCodec = String.fromCharCode.apply(null, new Uint8Array(msg.data));
		//if(this._debug === true) console.log("String Codec", this._strCodec);
		this.setupSourceBuffer(this);
		
		this._bGetCodec = true;
		return;
	}else
	{
		this.buffer.push(msg.data);
		this.readFromBuffer();
	}
} 
	

H5sPlayerWS.prototype.setupSourceBuffer = function(h5sPlayer)	
{
	try {
		window.MediaSource = window.MediaSource || window.WebKitMediaSource;
		if (!window.MediaSource) {
		  if(h5sPlayer._debug === true) console.log('[WS] MediaSource API is not available');
		}
		
		var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
		if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
			if(h5sPlayer._debug === true) console.log('[WS] MIME type or codec: ', mimeCodec);
		} else {
			if(h5sPlayer._debug === true) console.log('[WS] Unsupported MIME type or codec: ', mimeCodec);
		}

		h5sPlayer.mediaSource = new window.MediaSource();

		h5sPlayer.video.autoplay = true;
		if(h5sPlayer._debug === true) console.log(h5sPlayer._videoId);

		//var h5spath = video.getAttribute('h5spath');
		var h5spath = "api/v1/h5swsapi";
		

		/* var video = document.querySelector('h5sVideo'); */
		//alert(h5spath);
		h5sPlayer.video.src = window.URL.createObjectURL(h5sPlayer.mediaSource);
		h5sPlayer.video.play();

		h5sPlayer.mediaSource.addEventListener('sourceopen', h5sPlayer.mediaSourceOpen.bind(h5sPlayer), false);
	
	}
	catch (e)
	{
		if(h5sPlayer._debug === true) console.log(e);
	}
			
}

H5sPlayerWS.prototype.mediaSourceOpen = function()	
{
	if(this._debug === true) console.log("[WS] Add SourceBuffer");

	this.sourceBuffer = this.mediaSource.addSourceBuffer(this._strCodec);
	this.mediaSource.duration = Infinity;
	this.mediaSource.removeEventListener('sourceopen', this.mediaSourceOpen, false);
	this.sourceBuffer.addEventListener('updateend', this.readFromBuffer.bind(this), false);		
}
	
H5sPlayerWS.prototype.setupWebSocket = function(token)	
{
	this.video.autoplay = true;
	
	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5swsapi";
	//var token = this.video.getAttribute('token');
	var streamprofile = 'main';
	if (this._conf.streamprofile === undefined)
	{}else 
	{
		streamprofile = this._conf.streamprofile;
	}
	
	if (this._pbconf === undefined)
	{
		h5spath = this._conf.rootpath + h5spath + "?token=" + token + "&profile=" + streamprofile + '&session=' + this._conf.session;
	}else 
	{
		var serverpb = 'false';
		var filename = 'fake';
		if (this._pbconf.serverpb === undefined)
		{}else 
		{
			serverpb = this._pbconf.serverpb;
		}

		if (this._pbconf.filename === undefined)
		{}else 
		{
			filename = this._pbconf.filename;
		}		
		
		h5spath = this._conf.rootpath + h5spath + "?token=" + token 
								+ "&playback=true"
								+ '&profile=' + streamprofile
								+ "&serverpb=" + serverpb
								+ "&begintime=" + encodeURIComponent(this._pbconf.begintime)//this._pbconf.begintime
								+ "&endtime=" + encodeURIComponent(this._pbconf.endtime)//this._pbconf.endtime
								+ "&filename=" + filename//file name
								+ '&session=' + this._conf.session;
	}				+ '&session=' + this._conf.session;

	
	
	if(this._debug === true) console.log(h5spath);
	
	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if(this._debug === true) console.log("[WS] setupWebSocket", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);
	
	this.wsSocket.onopen = function()
	{
		if(this.h5._debug === true) console.log("[WS] wsSocket.onopen", this.h5);
		this.h5.checkSourceBufferId = setInterval(this.h5.CheckSourceBuffer.bind(this.h5), 10000);
		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);
		if (this.h5._pbconf != undefined && this.h5._pbconf.autoplay === 'true')
		{
			this.h5.start();
		}
	}
	
	this.wsSocket.onclose = function () {
		if(this.h5._debug === true) console.log("[WS] wsSocket.onclose", this.h5);
		if (this.h5.bDisConnected === true)
		{
			if(this.h5._debug === true) console.log("[WS] wsSocket.onclose disconnect");
		}else
		{
			this.h5.bNeedReconnect = true;
		}
		
		this.h5.CleanupSourceBuffer(this.h5);
		this.h5.CleanupWebSocket(this.h5);
		this.h5._strCodec = "";
		this.h5._bGetCodec = false;
	}

}
	
H5sPlayerWS.prototype.CleanupSourceBuffer = function(h5sPlayer)
{
	if(h5sPlayer._debug === true) console.log('[WS] Cleanup Source Buffer', h5sPlayer);
	
	try {
		h5sPlayer.sourceBuffer.removeEventListener('updateend', h5sPlayer.readFromBuffer, false);
		h5sPlayer.sourceBuffer.abort();


		if (document.documentMode || /Edge/.test(navigator.userAgent)) 
		{
			if(h5sPlayer._debug === true) console.log('[WS] IE or EDGE!');
		}else
		{
			h5sPlayer.mediaSource.removeSourceBuffer(h5sPlayer.sourceBuffer);
		}
		//Clear the this.video source
		//this.video.src = '';
		h5sPlayer.sourceBuffer = null;
		h5sPlayer.mediaSource = null;
		h5sPlayer.buffer = [];
	}
	catch (e)
	{
		if(h5sPlayer._debug === true) console.log(e);
	}	
}

H5sPlayerWS.prototype.CleanupWebSocket = function(h5sPlayer)
{
	if(h5sPlayer._debug === true) console.log('[WS] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
	clearInterval(h5sPlayer.checkSourceBufferId);
	h5sPlayer.emptyBuffCnt = 0;
	h5sPlayer.lastBuffTime = 0;
	h5sPlayer.buffTimeSameCnt = 0;
}
	

H5sPlayerWS.prototype.CheckSourceBuffer = function()	
{
	if (this._pbconf === undefined)
	{
		
	}else
	{	
		/* playback don't need check source buffer */
		return;
	}
	
	if (this.bDisConnected === true)
	{
		if(this._debug === true) console.log("[WS] CheckSourceBuffer has been disconnect", this);
		clearInterval(this.keepaliveTimerId);
		clearInterval(this.checkSourceBufferId);
		clearInterval(this.reconnectTimerId);
	}
	try {
		if(this._debug === true) console.log("[WS] CheckSourceBuffer", this);
		if (this.sourceBuffer.buffered.length <= 0)
		{
			this.emptyBuffCnt ++;
			if (this.emptyBuffCnt > 8)
			{
				if(this._debug === true) console.log("[WS] CheckSourceBuffer Close 1");
				this.wsSocket.close();
				return;
			}
		}else
		{
			this.emptyBuffCnt = 0;
			var buffStartTime = this.sourceBuffer.buffered.start(0);
			var buffEndTime = this.sourceBuffer.buffered.end(0);
			
			var buffDiff = buffEndTime - this.video.currentTime;
			if (buffDiff > 5 || buffDiff < 0)
			{
				if(this._debug === true) console.log("[WS] CheckSourceBuffer Close 2", buffDiff);
				this.wsSocket.close();
				return;				
			}
			
			if ( buffEndTime == this.lastBuffTime)
			{
				this.buffTimeSameCnt ++;
				if (this.buffTimeSameCnt > 3)
				{
					if(this._debug === true) console.log("[WS] CheckSourceBuffer Close 3");
					this.wsSocket.close();
					return;
				}
			}else
			{
				this.buffTimeSameCnt = 0;
			}
			
			this.lastBuffTime = buffEndTime;
			
		}
	
	}
	catch (e)
	{
		if(this._debug === true) console.log(e);
	}	

}

/** 
 * Connect a websocket Stream to videoElement 
*/
H5sPlayerWS.prototype.connect = function() {
	
	
	/* start connect to server */
	this.setupWebSocket(this._token);
	this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 800);
}


/** 
 * Disconnect a websocket Stream and clear videoElement source
*/
H5sPlayerWS.prototype.disconnect = function() {
	if(this._debug === true) console.log("[WS] disconnect", this);
	this.bDisConnected = true;
	clearInterval(this.reconnectTimerId);
	
	if (this.wsSocket != null)
	{
		this.wsSocket.close();
		this.wsSocket = null;
	}
	if(this._debug === true) console.log("[WS] disconnect", this);
}

H5sPlayerWS.prototype.start = function(){
	try {
		var j = {};
		j.cmd = "H5_START";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerWS.prototype.pause = function(){
	try {
		var j = {};
		j.cmd = "H5_PAUSE";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerWS.prototype.resume = function(){
	try {
		var j = {};
		j.cmd = "H5_RESUME";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerWS.prototype.seek = function(nTime){
	try {
		var j = {};
		j.cmd = "H5_SEEK";
		j.nSeekTime = nTime;
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerWS.prototype.speed = function(nSpeed){
	try {
		var j = {};
		j.cmd = "H5_SPEED";
		j.nSpeed = nSpeed;
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}


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

function H5sPlayerRTC(conf)
{
	this.wsSocket;
	this.keepaliveTimerId;
	this.bNeedReconnect = false;
	this.bDisConnected = false;
	
	this._debug = true;	
	if (conf.consolelog !== undefined)
	{
		if (conf.consolelog === 'false')
		{
			this._debug = false;	
		}
	}

	this._conf = conf;
	
	this._videoId = conf.videoid;
	
	this._pbconf = conf.pbconf;

	this._token = conf.token;
	
	this._nReconnectCnt = 1;
	
	//if(this._debug === true) console.log(conf.token, this._videoId);
	if (this._videoId === undefined)
	{
		this._videodom = conf.videodom;
		if(this._debug === true) console.log("[RTC] use dom directly", conf.token);
	}else
	{
		this._videodom = document.getElementById(this._videoId);
		if(this._debug === true) console.log("[RTC] use videoid", conf.token);
	}
	
	this.video = this._videodom;

	this.pc               = null;    

	this.pcOptions        = { "optional": [{"DtlsSrtpKeyAgreement": true} ] };

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
	this.pcConfig         = {"iceServers": [] };
  
	this.earlyCandidates = [];
	this._strPosterUri;

	if (this._pbconf != undefined && this._pbconf.showposter == 'false')
	{
	}else 
	{		
		this._strPosterUri = this._conf.protocol + '//' + this._conf.host + this._conf.rootpath +
									'api/v1/GetImage?token=' + this._token + '&session=' + this._conf.session;									
		if(this._debug === true) console.log("[WS] connect src", conf.token);
		this._videodom.setAttribute('poster', this._strPosterUri);
	}

	
	
	
	//if (this._pbconf != undefined && this._pbconf.callback != undefined)
	//{
		//if(this._debug === true) console.log("connect src =============", this._pbconf.callback, this._pbconf.userdata);
	//	this._pbconf.callback('UPDATE_TIME', 'update time 1111', this._pbconf.userdata);
	//}
	
	
}

H5sPlayerRTC.prototype.ReconnectFunction = function() 
{
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
	if (this.bNeedReconnect === true)
	{
		if(this._debug === true) console.log('[RTC] Reconnect...');
		
		var strReconnectUrl = this._strPosterUri + "&update=" + this._nReconnectCnt;
		this._videodom.setAttribute('poster', strReconnectUrl);
		if(this._debug === true) console.log('[RTC] Reconnect image', strReconnectUrl);
		this._nReconnectCnt++;
		
		this.setupWebSocket(this._token);
		this.bNeedReconnect = false;
	}
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
}
	
	
H5sPlayerRTC.prototype.H5SWebSocketClient = function(h5spath) 
{
	var socket;
	if(this._debug === true) console.log("[RTC] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") 
		{
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('ws://' + this._conf.host  +  h5spath);
			}else
			{
				socket = new WebSocket('ws://' + this._conf.host +  h5spath);
			}
		}
		if (this._conf.protocol == "https:")
		{	
			//alert(this._conf.host);
			if(this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('wss://' + this._conf.host +  h5spath);
			}else
			{
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}				
		}
		if(this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
}

H5sPlayerRTC.prototype.keepaliveTimer = function()	
{
	try {
		var j = {};
		j.type = "keepalive";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

/*
* RTCPeerConnection IceCandidate callback
*/
H5sPlayerRTC.prototype.onIceCandidate = function (event) {
	if (event.candidate) {
		if(this._debug === true) console.log("[RTC] onIceCandidate currentice", event.candidate);
    	//if (this.pc.currentRemoteDescription)  {
				var currentice;
				currentice = event.candidate;
				if(this._debug === true) console.log("[RTC] onIceCandidate currentice", JSON.stringify(currentice));
				var msgremoteice = JSON.parse(JSON.stringify(currentice));
				msgremoteice.type = 'remoteice';
				if(this._debug === true) console.log("[RTC] onIceCandidate currentice new", JSON.stringify(msgremoteice));
				this.wsSocket.send(JSON.stringify(msgremoteice));

		//} else {
		//	this.earlyCandidates.push(event.candidate);
		//}
	} 
	else {
		if(this._debug === true) console.log("End of candidates.");
	}
}

/*
* RTCPeerConnection AddTrack callback
*/
H5sPlayerRTC.prototype.onTrack = function(event) {
	if(this._debug === true) console.log("[RTC] Remote track added:" +  JSON.stringify(event));
        var stream;
	if (event.streams) {
		stream = event.streams[0];
	} 
	else {
		stream = event.stream;
	}
	var videoElement = this._videodom;
	//videoElement.src = URL.createObjectURL(stream);
	//URL.createObjectURL(stream) is deprecated
	videoElement.srcObject = stream;
	//videoElement.setAttribute("playsinline", true);
	videoElement.play();
}

/*
* create RTCPeerConnection 
*/
H5sPlayerRTC.prototype.createPeerConnection = function() 
{
	if(this._debug === true) console.log("[RTC] createPeerConnection  config: " + JSON.stringify(this.pcConfig) + " option:"+  JSON.stringify(this.pcOptions));
	var pc = new RTCPeerConnection(this.pcConfig, this.pcOptions);
	var streamer = this;
	pc.onicecandidate = function(evt) { streamer.onIceCandidate.call(streamer, evt); };
	if (typeof pc.ontrack != "undefined") {
		pc.ontrack        = function(evt) { streamer.onTrack.call(streamer,evt); };
	} 
	else {
		pc.onaddstream    = function(evt) { streamer.onTrack.call(streamer,evt); };
	}
	pc.oniceconnectionstatechange = function(evt) {
		if(streamer._debug === true) console.log("[RTC] oniceconnectionstatechange  state: " + pc.iceConnectionState);
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
	}
	
	if(this._debug === true) console.log("[RTC] Created RTCPeerConnnection with config: " + JSON.stringify(this.pcConfig) + "option:"+  JSON.stringify(this.pcOptions) );
	return pc;
}


H5sPlayerRTC.prototype.ProcessRTCOffer = function(msg)	
{
	if(this._debug === true) console.log("[RTC] ProcessRTCOffer", msg);
	try {
		this.pc = this.createPeerConnection();
		this.earlyCandidates.length = 0;
		var streamer = this;
		
		if(this._debug === true) console.log("[RTC] createRTCSessionDescription ");
		this.pc.setRemoteDescription(createRTCSessionDescription(msg));
		// create answer
		this.pc.createAnswer(this.mediaConstraints).then(function(sessionDescription) {
			if(streamer._debug === true) console.log("[RTC] Create answer:" + JSON.stringify(sessionDescription));
			
			streamer.pc.setLocalDescription(sessionDescription
				, function() 
				{ 
					if(streamer._debug === true) console.log("[RTC] ProcessRTCOffer createAnswer", sessionDescription);
					streamer.wsSocket.send(JSON.stringify(sessionDescription));
				}
				, function() {} );
			
		}, function(error) { 
			alert("[RTC] Create awnser error:" + JSON.stringify(error));
		});


	}catch (e) {
		this.disconnect();
		alert("[RTC] connect error: " + e);
	}	 


} 

H5sPlayerRTC.prototype.ProcessRemoteIce = function(msg)	
{
	if(this._debug === true) console.log("[RTC] ProcessRemoteIce", msg);

	try {
		var candidate = new RTCIceCandidate({
			sdpMLineIndex: msg.sdpMLineIndex,
			candidate: msg.candidate
		  });
		if(this._debug === true) console.log("[RTC] ProcessRemoteIce", candidate);
			
		if(this._debug === true) console.log("[RTC] Adding ICE candidate :" + JSON.stringify(candidate) );
		this.pc.addIceCandidate(candidate
			, function()      { /*console.log ("[RTC] addIceCandidate OK");*/ }
			, function(error) { console.log ("[RTC] addIceCandidate error:" + JSON.stringify(error)); } );

	}catch (e) {
		//this.disconnect();
		alert("connect ProcessRemoteIce error: " + e);
	}
} 

H5sPlayerRTC.prototype.onWebSocketData = function(msg)	
{
	if(msg.data instanceof ArrayBuffer)
	{
		//if(this._debug === true) console.log("ArrayBuffer =====");
	}
	
	//if (typeof message !== 'string')
	if(typeof msg.data === 'string')
	{
		//if(this._debug === true) console.log("String ======");
	}
	
	if(this._debug === true) console.log("[RTC] RTC received ", msg.data);
	var msgrtc = JSON.parse(msg.data);
	if(this._debug === true) console.log("[RTC] Get Message type ", msgrtc.type);
	if (msgrtc.type === 'offer')
	{
		if(this._debug === true) console.log("[RTC] Process Message type ", msgrtc.type);
		this.ProcessRTCOffer(msgrtc);
		return;

	}

	if (msgrtc.type === 'iceserver')
	{
		if(this._debug === true) console.log("[RTC] Process Message type ", msgrtc.type);
		this.pcConfig.iceServers = msgrtc.iceServers;
		this.pcConfig.iceTransportPolicy = msgrtc.iceTransportPolicy;
		if(this._debug === true) console.log("[RTC] Iceserver:", this.pcConfig);
		return;

	}

	if (msgrtc.type === 'remoteice')
	{
		if(this._debug === true) console.log("[RTC] Process Message type ", msgrtc.type);
		this.ProcessRemoteIce(msgrtc);
		return;

	}
	
	if (this._pbconf != undefined && this._pbconf.callback != undefined)
	{
		this._pbconf.callback(msg.data, this._pbconf.userdata);
	}
} 
	

H5sPlayerRTC.prototype.setupWebSocket = function(token)	
{
	this.video.autoplay = true;
	
	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5srtcapi";
	//var token = this.video.getAttribute('token');
	
	var streamprofile = 'main';
	if (this._conf.streamprofile === undefined)
	{}else 
	{
		streamprofile = this._conf.streamprofile;
	}
	
	if (this._pbconf === undefined)
	{
		h5spath = this._conf.rootpath + h5spath + "?token=" + token + "&profile=" + streamprofile + '&session=' + this._conf.session;
	}else 
	{
		var serverpb = 'false';
		var filename = 'fake';
		if (this._pbconf.serverpb === undefined)
		{}else 
		{
			serverpb = this._pbconf.serverpb;
		}
		
		if (this._pbconf.filename === undefined)
		{}else 
		{
			filename = this._pbconf.filename;
		}		
		h5spath = this._conf.rootpath + h5spath + "?token=" + token 
								+ "&playback=true"
								+ "&profile=" + streamprofile
								+ "&serverpb=" + serverpb
								+ "&begintime=" + encodeURIComponent(this._pbconf.begintime)//this._pbconf.begintime
								+ "&endtime=" + encodeURIComponent(this._pbconf.endtime)//this._pbconf.endtime
								+ "&filename=" + filename//file name
								+ '&session=' + this._conf.session;
	}
	
	if(this._debug === true) console.log(h5spath);
	
	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if(this._debug === true) console.log("[RTC] setupWebSocket", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);
	
	this.wsSocket.onopen = function()
	{
		if(this.h5._debug === true) console.log("[RTC] wsSocket.onopen", this.h5);

		var j = {};
		j.type = "open";
		this.h5.wsSocket.send(JSON.stringify(j));
		
		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);
		if (this.h5._pbconf != undefined && this.h5._pbconf.autoplay === 'true')
		{
			this.h5.start();
		}

	}
	
	this.wsSocket.onclose = function () {
		if(this._debug === true) console.log("[RTC] wsSocket.onclose", this.h5);
		if (this.h5.bDisConnected === true)
		{
			if(this.h5._debug === true) console.log("[RTC] wsSocket.onclose disconnect");
		}else
		{
			this.h5.bNeedReconnect = true;
		}
		
		this.h5.CleanupWebSocket(this.h5);
	}

}


H5sPlayerRTC.prototype.CleanupWebSocket = function(h5sPlayer)
{
	if(h5sPlayer._debug === true) console.log('[RTC] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
}


/** 
 * Connect a websocket Stream to videoElement 
*/
H5sPlayerRTC.prototype.connect = function() {
	/* start connect to server */
	this.setupWebSocket(this._token);
	this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 3000);
}


/** 
 * Disconnect a websocket Stream and clear videoElement source
*/
H5sPlayerRTC.prototype.disconnect = function() {
	if(this._debug === true) console.log("[RTC] disconnect", this);
	this.bDisConnected = true;
	clearInterval(this.reconnectTimerId);
	
	if (this.wsSocket != null)
	{
		this.wsSocket.close();
		this.wsSocket = null;
	}
	
	if (this._videodom)
	{
		this._videodom.src ="";
	}
	
	if (this.pc) 
	{
		try {
			this.pc.close();
		}
		catch (e) {
			if(this._debug === true) console.log ("[RTC] close peer connection failed:" + e);
		}
		this.pc = null;
	}

	if(this._debug === true) console.log("[RTC] disconnect", this);
} 

H5sPlayerRTC.prototype.start = function(){
	try {
		var j = {};
		j.cmd = "H5_START";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerRTC.prototype.pause = function(){
	try {
		var j = {};
		j.cmd = "H5_PAUSE";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerRTC.prototype.resume = function(){
	try {
		var j = {};
		j.cmd = "H5_RESUME";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerRTC.prototype.seek = function(nTime){
	try {
		var j = {};
		j.cmd = "H5_SEEK";
		j.nSeekTime = nTime;
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerRTC.prototype.speed = function(nSpeed){
	try {
		var j = {};
		j.cmd = "H5_SPEED";
		j.nSpeed = nSpeed;
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

/**
 *=================HLS based Player
 *
 */
/** 
 * Interface with h5s websocket player API
 * @constructor
 * @param 
 var conf = {
	videoid:'h5sVideo1', //{string} - id of the video element tag
	videodom: h5svideodom1, //{object} - video dom. if there has videoid, just use the videoid
	protocol: window.location.protocol, // {string} - 'http:' or 'https:'
	host: window.location.host, //{string} - 'localhost:8080'
	rootpath:window.location.pathname, // {string} - path of the app running
	token:'token1', // {string} - token of stream
	hlsver:'v1', //{string} -  v1 is for ts, v2 is for fmp4 
	session:'c1782caf-b670-42d8-ba90-2244d0b0ee83' //{string} - session got from login
};
*/
function H5sPlayerHls(conf)
{
	this.wsSocket;
	this.keepaliveTimerId;

	this._conf = conf;
	
	this._videoId = conf.videoid;
	this._token = conf.token;
	
	this._reConnectInterval;
	this._version = conf.hlsver;
	
	this._debug = true;	
	if (conf.consolelog !== undefined)
	{
		if (conf.consolelog === 'false')
		{
			this._debug = false;	
		}
	}

	//if(this._debug === true) console.log(conf.token, this._videoId);
	if (this._videoId === undefined)
	{
		this._videodom = conf.videodom;
		if(this._debug === true) console.log("[HLS] use dom directly", conf.token);
	}else
	{
		this._videodom = document.getElementById(this._videoId);
		if(this._debug === true) console.log("[HLS] use videoid", conf.token);
	}
	this._video = this._videodom;
	
	this._video.type="application/x-mpegURL";
	//webView.mediaPlaybackRequiresUserAction = NO;
	
	
	this._lastTime = 0;
	this._sameCnt = 0;
	
	var strPosterUri = this._conf.protocol + '//' + window.location.host + 
									'/api/v1/GetImage?token=' + this._token + '&session=' + this._conf.session;
	this._videodom.setAttribute('poster',strPosterUri);
	
		
}

H5sPlayerHls.prototype.H5SWebSocketClient = function(h5spath) 
{
	var socket;
	if(this._debug === true) console.log("[HLS] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") 
		{
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('ws://' + this._conf.host  +  h5spath);
			}else
			{
				socket = new WebSocket('ws://' + this._conf.host +  h5spath);
			}
		}
		if (this._conf.protocol == "https:")
		{	
			//alert(this._conf.host);
			if(this._debug === true) console.log("[HLS] ", this._conf.host);
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('wss://' + this._conf.host +  h5spath);
			}else
			{
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}				
		}
		if(this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
}

H5sPlayerHls.prototype.keepaliveTimer = function()	
{
	try {
		var j = {};
		j.type = "keepalive";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerHls.prototype.onWebSocketData = function(msg)	
{
	if(this._debug === true) console.log("[HLS] HLS received ", msg.data);
} 
	

H5sPlayerHls.prototype.setupWebSocket = function(token)	
{
	
	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5swscmnapi";
	//var token = this.video.getAttribute('token');
	h5spath = this._conf.rootpath + h5spath + "?token=" + token + '&session=' + this._conf.session;
	if(this._debug === true) console.log(h5spath);
	
	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if(this._debug === true) console.log("[HLS] setupWebSocket", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);
	
	this.wsSocket.onopen = function()
	{
		if(this.h5._debug === true) console.log("[HLS] wsSocket.onopen", this.h5);

		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);

	}
	
	this.wsSocket.onclose = function () {
		if(this.h5._debug === true) console.log("[HLS] wsSocket.onclose", this.h5);
		
		this.h5.CleanupWebSocket(this.h5);
	}

}


H5sPlayerHls.prototype.CleanupWebSocket = function(h5sPlayer)
{
	if(h5sPlayer._debug === true) console.log('[HLS] H5sPlayerHls CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
}

H5sPlayerHls.prototype.CheckPlaying = function()
{
	if(this._debug === true) console.log("[HLS]  video.ended", this._video.ended);
	if(this._debug === true) console.log("[HLS] video.currentTime", this._video.currentTime);
	var currentTime = this._video.currentTime;
	//if (this._lastTime != 0)
	{
		var diff = currentTime - this._lastTime;
		if(this._debug === true) console.log("[HLS]  diff", diff);
		if (diff === 0)
		{
			this._sameCnt ++;
		}
	}
	this._lastTime = currentTime;
	if (this._sameCnt > 3)
	{
		if (this.wsSocket != null)
		{
			this.wsSocket.close();
			this.wsSocket = null;
		}
		this.setupWebSocket(this._token);
		if(this._debug === true) console.log("[HLS] reconnect");
		this._video.src = '';
		this._lastTime = 0;
		this._sameCnt = 0;
		this._video.src = this._conf.protocol + '//' + this._conf.host + this._conf.rootpath + 'hls/' + this._version + '/' + this._token + '/hls.m3u8';
		this._video.play();
		
	}
}

/** 
 * Connect a websocket Stream to videoElement 
 * @param {string} id - id of WebRTC stream
*/
H5sPlayerHls.prototype.connect = function() {
	this.setupWebSocket(this._token);

	this._lastTime = 0;
	this._sameCnt = 0;

	this._video.onended = function(e) {
		if(this._debug === true) console.log('[HLS] The End');
	};
	this._video.onpause = function(e) {
		if(this._debug === true) console.log('[HLS] Pause');
	};
	
	this._video.onplaying = function(e) {
		if(this._debug === true) console.log('[HLS] Playing');
	};
	this._video.onseeking = function(e) {
		if(this._debug === true) console.log('[HLS] seeking');
	};
	this._video.onvolumechange = function(e) {
		if(this._debug === true) console.log('[HLS] volumechange');
	};
	this._video.src = this._conf.protocol + '//' + this._conf.host + this._conf.rootpath + 'hls/' + this._version + '/' + this._token + '/hls.m3u8';
	
	this._video.play();
	this._reConnectInterval = setInterval(this.CheckPlaying.bind(this), 3000);
}


/** 
 * Disconnect a websocket Stream and clear videoElement source
*/
H5sPlayerHls.prototype.disconnect = function() {
	clearInterval(this._reConnectInterval);
	this._lastTime = 0;
	this._sameCnt = 0;
	if (this.wsSocket != null)
	{
		this.wsSocket.close();
		this.wsSocket = null;
	}
	if(this._debug === true) console.log("[HLS] disconnect", this);
}


/** 
 *=================Audio player and Intercomm
 */
/** 
 * Interface with h5s audio player API
 * @constructor
 * @param 
 var conf = {
	protocol: window.location.protocol, // {string} - http: or https:
	host: window.location.host, //{string} - localhost:8080
	rootpath:window.location.pathname, // {string} - path of the app running
	token:'token1', // {string} - token of stream
	session:'c1782caf-b670-42d8-ba90-2244d0b0ee83' //{string} - session got from login
};
*/

function H5sPlayerAudio(conf)
{
	this.buffer = [];	
	this.wsSocket;
	this.bNeedReconnect = false;
	this.bDisConnected = false;
	this._conf = conf;
	
	this._debug = true;	
	if (conf.consolelog !== undefined)
	{
		if (conf.consolelog === 'false')
		{
			this._debug = false;	
		}
	}
	
	if(this._debug === true) console.log("[AUD] Aduio Player Conf:", conf);
	
	this._token = conf.token;
	this._audContext = new AudioContext();
	
	/*
	window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.oAudioContext ||
	window.msAudioContext;
	*/
}

H5sPlayerAudio.prototype.H5SWebSocketClient = function(h5spath) 
{
	var socket;
	if(this._debug === true) console.log("[AUD] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") 
		{
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('ws://' + this._conf.host  +  h5spath);
			}else
			{
				socket = new WebSocket('ws://' + this._conf.host +  h5spath);
			}
		}
		if (this._conf.protocol == "https:")
		{	
			//alert(this._conf.host);
			if(this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('wss://' + this._conf.host +  h5spath);
			}else
			{
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}				
		}
		if(this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
}

H5sPlayerAudio.prototype.keepaliveTimer = function()	
{
	try {
		this.wsSocket.send("keepalive");
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerAudio.prototype.onWebSocketData = function(msg)	
{
	var dataArray = new Int16Array(msg.data);
	var nSamples = 8000;
	var nChannel = 1;
	var nCount = dataArray.length;

	var buffer = this._audContext.createBuffer(nChannel, nCount, nSamples);

	for (var ch = 0; ch < nChannel; ch++) {
		var nowBuffering = buffer.getChannelData(ch);
		for (var i = 0; i < nCount; i++) {
			// Math.random() is in [0; 1.0]
			// audio needs to be in [-1.0; 1.0]
			nowBuffering[i] = dataArray[i] / (32767/2);
		}
	}

	var bufferSource = this._audContext.createBufferSource();
	bufferSource.buffer = buffer;
	bufferSource.connect(this._audContext.destination);
	bufferSource.start();
}

H5sPlayerAudio.prototype.CleanupWebSocket = function(h5sPlayer)
{
	if(h5sPlayer._debug === true) console.log('[AUD] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
	//h5sPlayer.emptyBuffCnt = 0;
	//h5sPlayer.lastBuffTime = 0;
	//h5sPlayer.buffTimeSameCnt = 0;
}


H5sPlayerAudio.prototype.setupWebSocket = function(token)	
{
	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5saudapi";
	//var token = this.video.getAttribute('token');
	h5spath = this._conf.rootpath + h5spath + "?token=" + token + '&session=' + this._conf.session;
	if(this._debug === true) console.log(h5spath);
	
	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if(this._debug === true) console.log("[AUD] setupWebSocket for audio", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);
	
	this.wsSocket.onopen = function()
	{
		if(this.h5._debug === true) console.log("[AUD] wsSocket.onopen", this.h5);
		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);
	}
	
	this.wsSocket.onclose = function () {
		if(this.h5._debug === true) console.log("[AUD] wsSocket.onclose", this.h5);
		this.h5.CleanupWebSocket(this.h5);
		//this.h5._strCodec = "";
		//this.h5._bGetCodec = false;
	}
}

/** 
 * Connect a websocket audio 
*/
H5sPlayerAudio.prototype.connect = function() {
	/* start connect to server */
	this.setupWebSocket(this._token);
}


/** 
 * Disconnect a websocket audio 
*/
H5sPlayerAudio.prototype.disconnect = function() {
	if(this._debug === true) console.log("[AUD] disconnect", this);
	
	if (this.wsSocket != null)
	{
		this.wsSocket.close();
		this.wsSocket = null;
	}
	if(this._debug === true) console.log("[AUD] disconnect", this);
}

/** 
 *=================Audio Intercomm
 */
/** 
 * Interface with h5s audio intecom API
 * @constructor
 * @param 
 var conf = {
	protocol: window.location.protocol, // {string} - http: or https:
	host: window.location.host, //{string} - localhost:8080
	rootpath:window.location.pathname, // {string} - path of the app running
	token:'token1', // {string} - token of stream
	session:'c1782caf-b670-42d8-ba90-2244d0b0ee83' //{string} - session got from login
};
*/
function H5sPlayerAudBack(conf)
{
	this.buffer = [];	
	this.wsSocket;
	this.bNeedReconnect = false;
	this.bDisConnected = false;
	this._conf = conf;
	this._cnt = 0;
	this._samplerate = 48000;
	this._bInit = false;
	
	this._debug = true;	
	if (conf.consolelog !== undefined)
	{
		if (conf.consolelog === 'false')
		{
			this._debug = false;	
		}
	}
	
	if(this._debug === true) console.log("[AUDBACK] Aduio Back Conf:", conf);
	
	this._token = conf.token;
	this._audContext = new AudioContext();
	if(this._debug === true) console.log("[AUDBACK] sampleRate", this._audContext.sampleRate);
	this.OpenAudio();
	
	/*
	window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.oAudioContext ||
	window.msAudioContext;
	*/
	
}

H5sPlayerAudBack.prototype.H5SWebSocketClient = function(h5spath) 
{
	var socket;
	if(this._debug === true) console.log("[AUDBACK] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") 
		{
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('ws://' + this._conf.host  +  h5spath);
			}else
			{
				socket = new WebSocket('ws://' + this._conf.host +  h5spath);
			}
		}
		if (this._conf.protocol == "https:")
		{	
			//alert(this._conf.host);
			if(this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('wss://' + this._conf.host +  h5spath);
			}else
			{
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}				
		}
		if(this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
}

H5sPlayerAudBack.prototype.keepaliveTimer = function()	
{
	try {
		this.wsSocket.send("keepalive");
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

H5sPlayerAudBack.prototype.onWebSocketData = function(msg)	
{

}

H5sPlayerAudBack.prototype.CleanupWebSocket = function(h5sPlayer)
{
	if(this._debug === true) console.log('[AUDBACK] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
}

H5sPlayerAudBack.prototype.OpenAudio = function()
{
	if(this._debug === true) console.log("[AUDBACK] sampleRate", this._audContext.sampleRate);
	
    navigator.getUserMedia = (navigator.getUserMedia || 
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
	//if(this._debug === true) console.log("wsSocket.onopen", this);
	try {
		navigator.getUserMedia({ video: false, audio: true }, 
					this.AudioProcess.bind(this));
	} catch (e) {
		alert('[AUDBACK] Audio back false getUserMedia', e);
		return;
	}
}

H5sPlayerAudBack.prototype.webSocketOnOpen = function()
{
	this._bInit = true;
}

H5sPlayerAudBack.prototype.setupWebSocket = function(token)	
{
	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5saudbackapi";
	//var token = this.video.getAttribute('token');
	h5spath = this._conf.rootpath + h5spath + "?token=" + token + '&samplerate=' + this._samplerate + '&session=' + this._conf.session;
	if(this._debug === true) console.log(h5spath);
	
	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if(this._debug === true) console.log("[AUDBACK] setupWebSocket for audio back", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);
	
	this.wsSocket.onopen = this.webSocketOnOpen.bind(this);
	
	this.wsSocket.onclose = function () {
		if(this._debug === true) console.log("[AUDBACK] wsSocket.onclose", this.h5);
		this.h5.CleanupWebSocket(this.h5);
	}
}

function float32ToInt16(buffer) {
	var l = buffer.length;
	var buf = new Int16Array(l);
	while (l--) {
		buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
	}
	return buf;
}

H5sPlayerAudBack.prototype.AudioSend = function(e) {
	var left = e.inputBuffer.getChannelData(0);
	var binaryData = float32ToInt16(left);
	//if(this._debug === true) console.log(this._cnt ++);
	//if(this._debug === true) console.log(binaryData);
	
	if (this._bInit === true && this.wsSocket)
		this.wsSocket.send(binaryData);

}

/* Audio process and send to server */
H5sPlayerAudBack.prototype.AudioProcess = function(stream) {
	try {
		var mediaStreamSource = this._audContext.createMediaStreamSource(stream);
		
		//TODO send the sampleRate before to send data
		//1024 2048 4096 can work
		var streamNode = this._audContext.createScriptProcessor(1024, 1, 1);
		
		
		mediaStreamSource.connect(streamNode);

		streamNode.connect(this._audContext.destination);
		streamNode.onaudioprocess = this.AudioSend.bind(this);
	} catch (e) {
		alert('Audio intecomm error', e);
		return;
	}
}

/** 
 * Connect a websocket audio back 
*/
H5sPlayerAudBack.prototype.connect = function() {
	/* start connect to server */
	this.setupWebSocket(this._token);
}

/** 
 * Disconnect a websocket audio back  
*/
H5sPlayerAudBack.prototype.disconnect = function() {
	if(this._debug === true) console.log("[AUDBACK] disconnect", this);
	
	if (this.wsSocket != null)
	{
		this.wsSocket.close();
		this.wsSocket = null;
	}
	if(this._debug === true) console.log("[AUDBACK] disconnect", this);
}



/** 
 *=================WebRTC based Conference
 *
 */
/** 
 * Interface with h5s WebRTC Conference API
 * @constructor
 * @param 
var conf = {
	localvideoid:'h5sVideoLocal', //{string} - id of the local video element tag
	remotevideoid:'h5sVideoRemote', //{string} - id of the remote video element tag
	//localvideodom: h5svideodomlocal, //{object} - local video dom. if there has videoid, just use the videoid
	//remotevideodom: h5svideodomremove, //{object} - remote video dom. if there has videoid, just use the videoid
	localrecord: 'false', //{string} - true or false 
	remoterecord: 'false', //{string} - true or false 
	protocol: window.location.protocol, //http: or https:
	host: window.location.host, //localhost:8080
	rootpath:'/', // {string} - path of the app running
	name: 'user1', //name of the user
	type:'media', // {string} - media or sharing 
	callback: EventCB, //Callback for the event
	userdata: null, // user data
	session: strSession //session got from login
};
 _    _ _____      _____             __                             
| |  | | ____|    / ____|           / _|                            
| |__| | |__  ___| |     ___  _ __ | |_ ___ _ __ ___ _ __   ___ ___ 
|  __  |___ \/ __| |    / _ \| '_ \|  _/ _ \ '__/ _ \ '_ \ / __/ _ \
| |  | |___) \__ \ |___| (_) | | | | ||  __/ | |  __/ | | | (_|  __/
|_|  |_|____/|___/\_____\___/|_| |_|_| \___|_|  \___|_| |_|\___\___|
*/



function H5sConference(conf)
{
	this.wsSocket;
	this.keepaliveTimerId;
	this.bNeedReconnect = false;
	this.bDisConnected = false;
	this._bBusy = false; 
	this._strId;
	this._strRemoteId;
	
	this._bRecordLocal = false;
	this._bRecordRemote = false;
	this._localRecorder;
	this._remoteRecorder;
	this._localRecorderChunks = [];
	this._remoteRecorderChunks = [];
	
	this._debug = true;	
	if (conf.consolelog !== undefined)
	{
		if (conf.consolelog === 'false')
		{
			this._debug = false;
		}
	}

	if (conf.localrecord !== undefined)
	{
		if (conf.localrecord === 'true')
		{
			this._bRecordLocal = true;
		}
	}

	if (conf.remoterecord !== undefined)
	{
		if (conf.remoterecord === 'true')
		{
			this._bRecordRemote = true;
		}
	}

	this._conf = conf;

	if (conf.localvideoid === undefined)
	{
		this._videodomlocal = conf.localvideodom;
		if(this._debug === true) console.log(conf.token, "[CFE] local use dom directly");
	}else
	{
		this._videodomlocal = document.getElementById(conf.localvideoid);
		if(this._debug === true) console.log(conf.token, "[CFE] local use videoid");
	}
	
	if (conf.remotevideoid === undefined)
	{
		this._videodomremote = conf.remotevideodom;
		if(this._debug === true) console.log(conf.token, "[CFE] remote use dom directly");
	}else
	{
		this._videodomremote = document.getElementById(conf.remotevideoid);
		if(this._debug === true) console.log(conf.token, "[CFE] remote use videoid");
	}

	this.pc               = null;    

	this.pcOptions        = { "optional": [{"DtlsSrtpKeyAgreement": true} ] };

	this.mediaConstraints = {
		mandatory: {
			'offerToReceiveAudio': true,
			'offerToReceiveVideo': true,
			'voiceActivityDetection': false
		}
	};
	this.pcConfig         = {"iceServers": [] };
	this.earlyCandidates = [];
}

H5sConference.prototype.ReconnectFunction = function() 
{
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
	if (this.bNeedReconnect === true)
	{
		if(this._debug === true) console.log('Reconnect...');
		
		this.setupWebSocket(this._token);
		this.bNeedReconnect = false;
	}
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
}
	
	
H5sConference.prototype.H5SWebSocketClient = function(h5spath) 
{
	var socket;
	if(this._debug === true) console.log("[CFE] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") 
		{
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('ws://' + this._conf.host  +  h5spath);
			}else
			{
				socket = new WebSocket('ws://' + this._conf.host +  h5spath);
			}
		}
		if (this._conf.protocol == "https:")
		{	
			//alert(this._conf.host);
			if(this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('wss://' + this._conf.host +  h5spath);
			}else
			{
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}				
		}
		if(this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
}

H5sConference.prototype.keepaliveTimer = function()	
{
	try {
		var j = {};
		j.type = "CFE_CMD_KEEPALIVE";
		var msg = {};
		msg.strId = this._strId;
		j.keepalive = msg;
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

/*
* RTCPeerConnection IceCandidate callback
*/
H5sConference.prototype.onIceCandidate = function (event) {
	if (event.candidate) {
		if(this._debug === true) console.log("[CFE] onIceCandidate currentice", event.candidate);
			var currentice;
			currentice = event.candidate;
			if(this._debug === true) console.log("[CFE] onIceCandidate currentice", JSON.stringify(currentice));
			
			var j = {};
			j.type = "CFE_CMD_REMOTE_ICE";
	
			var msg = {};
			console.log('[CFE] remote Ice to', this._strRemoteId);
			msg.strTo = this._strRemoteId;
			msg.msg = currentice;
			j.remoteIce = msg;
			this.wsSocket.send(JSON.stringify(j));
	} 
	else {
		if(this._debug === true) console.log("[CFE] End of candidates.");
	}
}

function makeLink(chunks, fileprefix, ext){
	const blob = new Blob(chunks, {type: 'video/webm'});
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	const date = new Date();
	var fileName = fileprefix + '_' + date.getFullYear() + '-' + (date.getMonth() + 1)
				 + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + ext;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
	  document.body.removeChild(a);
	  window.URL.revokeObjectURL(url);
	}, 100);
  }
//Chrome webm file can't be seekable https://bugs.chromium.org/p/chromium/issues/detail?id=642012 firefox has fix this.
H5sConference.prototype.ondataavailableLocal = function(event) {
	if(this._debug === true) console.log("[CFE] ondataavailableLocal", event.data);
	this._localRecorderChunks.push(event.data);
	if(this._localRecorder.state == 'inactive')  makeLink(this._localRecorderChunks, 'local', '.webm');
}

H5sConference.prototype.ondataavailableRemote = function(event) {
	if(this._debug === true) console.log("[CFE] ondataavailableRemote", event.data);
	this._remoteRecorderChunks.push(event.data);
	if(this._remoteRecorder.state == 'inactive')  makeLink(this._remoteRecorderChunks, 'remote', '.webm');
}

/*
* RTCPeerConnection AddTrack callback
*/
H5sConference.prototype.onTrack = function(event) {
	if(this._debug === true) console.log("[CFE] Remote track added:" +  JSON.stringify(event));
        var stream;
	if (event.streams) {
		stream = event.streams[0];
	} 
	else {
		stream = event.stream;
	}
	
	//console.log(stream);
	var videoElement = this._videodomremote;
	if (videoElement.srcObject !== stream) 
	{
		//videoElement.src = URL.createObjectURL(stream);
		//URL.createObjectURL(stream) is deprecated
		videoElement.srcObject = stream;
		//videoElement.setAttribute("playsinline", true);
		videoElement.play();

		try {
			var options = {
				mimeType : 'video/mp4'
			}
			if (this._bRecordLocal == true)
			{
				if(this._debug === true) console.log("[CFE] Start local record...")
				this._localRecorder = new MediaRecorder(this._streamlocal);
				this._localRecorder.ondataavailable = this.ondataavailableLocal.bind(this);
				this._localRecorder.start();
			}
			if (this._bRecordRemote == true)
			{
				if(this._debug === true) console.log("[CFE] Start remote record...")
				this._remoteRecorder = new MediaRecorder(stream);
				this._remoteRecorder.ondataavailable = this.ondataavailableRemote.bind(this);
				this._remoteRecorder.start();
			}
		}catch (e) {
			alert("start record error: " + e);
		}
	}	

}

/*
* create RTCPeerConnection 
*/
H5sConference.prototype.createPeerConnection = function() 
{
	if(this._debug === true) console.log("[CFE] createPeerConnection  config: " + JSON.stringify(this.pcConfig) + " option:"+  JSON.stringify(this.pcOptions));
	var pc = new RTCPeerConnection(this.pcConfig, this.pcOptions);
	var streamer = this;
	pc.onicecandidate = function(evt) { streamer.onIceCandidate.call(streamer, evt); };
	if (typeof pc.ontrack != "undefined") {
		pc.ontrack        = function(evt) { streamer.onTrack.call(streamer,evt); };
	} 
	else {
		pc.onaddstream    = function(evt) { streamer.onTrack.call(streamer,evt); };
	}
	pc.oniceconnectionstatechange = function(evt) {
		if(this._debug === true) console.log("[CFE] oniceconnectionstatechange  state: " + pc.iceConnectionState);
		return;
	}
	
	if(this._debug === true) console.log("[CFE] Created RTCPeerConnnection with config: " + JSON.stringify(this.pcConfig) + "option:"+  JSON.stringify(this.pcOptions) );
	return pc;
}

H5sConference.prototype.ProcessOffer = function(msg)	
{
	if(this._debug === true) console.log("[CFE] ProcessOffer", msg);
	try {
		this.pc = this.createPeerConnection();
		this.earlyCandidates.length = 0;
		var streamer = this;
		
		const videoTracks = this._streamlocal.getVideoTracks();
		const audioTracks = this._streamlocal.getAudioTracks();
		if (videoTracks.length > 0) {
			console.log('[CFE] Using video device:', videoTracks[0].label);
		}
		if (audioTracks.length > 0) {
			console.log('[CFE] Using audio device:', audioTracks[0].label);
		}

    /*
		for (i = 0; i < audioTracks.length; i++) {
			audioTracks[i].enabled = true;
		  }
    */

		this._streamlocal.getTracks().forEach(track => this.pc.addTrack(track, this._streamlocal));
		
		if(this._debug === true) console.log("[CFE] createRTCSessionDescription ");
		this.pc.setRemoteDescription(createRTCSessionDescription(msg));
		// create answer
		this.pc.createAnswer(this.mediaConstraints).then(function(sessionDescription) {
			if(streamer._debug === true) console.log("[CFE] Create answer:" + JSON.stringify(sessionDescription));
			
			streamer.pc.setLocalDescription(sessionDescription
				, function() 
				{ 
					if(streamer._debug === true) console.log("[CFE] ProcessOffer createAnswer", sessionDescription);
					
					var j = {};
					j.type = "CFE_CMD_CALL_ANSWER";
			
					var msg = {};
					console.log('[CFE] createAnswer to', streamer._strRemoteId);
					msg.strTo = streamer._strRemoteId;
					msg.msg = sessionDescription;
					j.answer = msg;
					streamer.wsSocket.send(JSON.stringify(j));
				}
				, function() {} );
			
		}, function(error) { 
			alert("[CFE ]Create awnser error:" + JSON.stringify(error));
		});


	}catch (e) {
		this.disconnect();
		alert("connect error: " + e);
	}	 


} 

H5sConference.prototype.ProcessAnswer = function(msg)
{
	if(this._debug === true) console.log("[CFE] ProcessAnswer", msg);
	try {
		this.pc.setRemoteDescription(createRTCSessionDescription(msg));
	}catch (e) {
		this.disconnect();
		alert("connect error: " + e);
	}		
}

H5sConference.prototype.CreateOffer = function()	
{
	if(this._debug === true) console.log("[CFE] CreateOffer");
	try {
		this.pc = this.createPeerConnection();
		this.earlyCandidates.length = 0;
		var streamer = this;
		const videoTracks = this._streamlocal.getVideoTracks();
		const audioTracks = this._streamlocal.getAudioTracks();
		if (videoTracks.length > 0) {
			console.log('[CFE] Using video device:', videoTracks[0].label);
		}
		if (audioTracks.length > 0) {
			console.log('[CFE] Using audio device:', audioTracks[0].label);
		}
    /*
		for (i = 0; i < audioTracks.length; i++) {
			audioTracks[i].enabled = true;
		  }
    */
    
		this._streamlocal.getTracks().forEach(track => this.pc.addTrack(track, this._streamlocal));

		this.pc.createOffer(this.mediaConstraints).then(function(sessionDescription) {
			if(streamer._debug === true) console.log("[CFE] Create answer:" + JSON.stringify(sessionDescription));
			
			streamer.pc.setLocalDescription(sessionDescription
				, function() 
				{ 
					if(streamer._debug === true) console.log("[CFE] ProcessOffer createAnswer", sessionDescription);
					
					var offer = sessionDescription;
					if(streamer._debug === true) console.log('[CFE] createOffer ', JSON.stringify(offer));
					var j = {};

					j.type = "CFE_CMD_CALL_OFFER";
					
					var msg = {};
					if(streamer._debug === true) console.log('[CFE] createOffer to', streamer._strRemoteId);
					msg.strTo = streamer._strRemoteId;
					msg.msg = offer;
					j.offer = msg;
					streamer.wsSocket.send(JSON.stringify(j));
				}
				, function() {} );
			
		}, function(error) { 
			alert("[CFE ]Create offer error:" + JSON.stringify(error));
		});	
		return;
	}catch (e) {
		this.disconnect();
		alert("connect error: " + e);
	}	 


} 

H5sConference.prototype.ProcessRemoteIce = function(msg)	
{
	if(this._debug === true) console.log("[CFE] ProcessRemoteIce", msg);

	try {
		var candidate = new RTCIceCandidate({
			sdpMLineIndex: msg.sdpMLineIndex,
			candidate: msg.candidate
		  });
		if(this._debug === true) console.log("[CFE] ProcessRemoteIce", candidate);
			
		if(this._debug === true) console.log("[CFE] Adding ICE candidate :" + JSON.stringify(candidate) );
		this.pc.addIceCandidate(candidate
			, function()      {/*console.log ("[CFE] addIceCandidate OK");*/ }
			, function(error) {console.log ("[CFE] addIceCandidate error:" + JSON.stringify(error)); } );

	}catch (e) {
		//this.disconnect();
		alert("connect ProcessRemoteIce error: " + e);
	}
} 

H5sConference.prototype.onWebSocketData = function(msg)	
{
	if(this._debug === true) console.log("[CFE] received ", msg.data);
	var msgrtc = JSON.parse(msg.data);
	if(this._debug === true) console.log("[CFE] Get Message type ", msgrtc.type);
	if (msgrtc.type === 'CFE_CMD_INVITE_REQ')
	{
		return;
	}
	
	if (msgrtc.type === 'CFE_CMD_INVITE_RESP')
	{
		/* begin offer */
		this._strRemoteId = msgrtc.inviteResp.strFrom;
		this.CreateOffer();
		return;
	}
	
	if (msgrtc.type === 'CFE_CMD_CALL_OFFER')
	{
		/* begin answer */
		this.ProcessOffer(msgrtc.offer.msg);
		return;
	}
	
	if (msgrtc.type === 'CFE_CMD_CALL_ANSWER')
	{
		/* begin answer */
		this.ProcessAnswer(msgrtc.answer.msg);
		return;
	}

	if (msgrtc.type === 'CFE_CMD_REMOTE_ICE')
	{
		this.ProcessRemoteIce(msgrtc.remoteIce.msg);
		return;

	}
	
	if (msgrtc.type === 'CFE_EVENT_ID_ASSIGN')
	{
		this._strId = msgrtc.idAssign.strId;
		if (msgrtc.idAssign.bEnableRelay == true)
		{
			this.pcConfig.iceServers = msgrtc.idAssign.iceServers;
			this.pcConfig.iceTransportPolicy = msgrtc.idAssign.iceTransportPolicy;
			if(this._debug === true) console.log("[CFE] Iceserver:", this.pcConfig);			
		}
		var callbackData = {};
		callbackData.type = 'CFE_EVENT_ID_ASSIGN';
		callbackData.idAssign = {};
		callbackData.idAssign.strId = msgrtc.idAssign.strId;
		if (this._conf.callback != undefined)
		{
			this._conf.callback(JSON.stringify(callbackData), this._conf.userdata);
		}
		return;
	}
	
	if (this._conf.callback != undefined)
	{
		this._conf.callback(msg.data, this._conf.userdata);
	}
} 
	

H5sConference.prototype.setupWebSocket = function(token)	
{
	this._videodomlocal.autoplay = true;
	this._videodomremote.autoplay = true;
	
	var h5spath = "api/v1/h5sconference";
	
	if (this._strId === undefined)
	{
		h5spath = this._conf.rootpath + h5spath + "?name=" + this._conf.user + '&session=' + this._conf.session;
	}else
	{
		h5spath = this._conf.rootpath + h5spath + "?name=" + this._conf.user + "?id=" + this._strId + '&session=' + this._conf.session;
	}
	
	if(this._debug === true) console.log(h5spath);
	
	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if(this._debug === true) console.log("[CFE] setupWebSocket", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);
	
	this.wsSocket.onopen = function()
	{
		if(this.h5._debug === true) console.log("[CFE] wsSocket.onopen", this.h5);
		
		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);
		if (this.h5._pbconf != undefined && this.h5._pbconf.autoplay === 'true')
		{
			this.h5.start();
		}

	}
	
	this.wsSocket.onclose = function () {
		if(this.h5._debug === true) console.log("[CFE] wsSocket.onclose", this.h5);
		if (this.h5.bDisConnected === true)
		{
			if(this.h5._debug === true) console.log("[CFE] wsSocket.onclose disconnect");
		}else
		{
			this.h5.bNeedReconnect = true;
		}
		
		this.h5.CleanupWebSocket(this.h5);
	}

}


H5sConference.prototype.CleanupWebSocket = function(h5sPlayer)
{
	if(h5sPlayer._debug === true) console.log('[CFE] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
}


/** 
 * Connect a websocket Stream to videoElement 
*/
H5sConference.prototype.connect = function() {
	/* start connect to server */
	this.setupWebSocket(this._token);
	this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 3000);
}

H5sConference.prototype.call = function(bVideo, strRemoteId, videoin, resolution, audioin){
	if (this._bBusy == true)
	{
		return;
	}
	this._videoin = videoin;
	this._audioin = audioin;
	this._resolution = resolution;
	
	var w = 1280;
	var h = 720;
	if (resolution == 'QVGA'){
		w = 320; h = 240;
	}else if (resolution == 'VGA'){
		w = 640; h = 480;
	}else if (resolution == 'D1'){
		w = 720; h = 576;
	}else if (resolution == '720P'){
		w = 1280; h = 720;
	}else if (resolution == '1080P'){
		w = 1920;h = 1080;
	}else if (resolution == '4K'){
		w = 4096;h = 2160;
	}else if (resolution == '8K'){
		w = 7680;h = 4320;		
	}
	
	try {
		try {
			var videoparam;
			if (bVideo == false)
			{
				videoparam = false;
			}else
			{
				videoparam = {deviceId: {exact: videoin}, width: {exact: w}, height: {exact: h}};
			}
			var h5spalyer = this;
			navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: audioin}}, video: videoparam})
			//navigator.mediaDevices.getUserMedia({audio: { echoCancellation: false }, video: videoparam})
      //navigator.mediaDevices.getUserMedia({audio: true, video: videoparam})
			.then(function(stream) {

				if (bVideo == true)
				{
					h5spalyer._videodomlocal.srcObject = stream;
				}
				h5spalyer._streamlocal = stream;
				var j = {};

				j.type = "CFE_CMD_INVITE_REQ";
				
				var msg = {};
				msg.strFrom = h5spalyer._strId;
				msg.strTo = strRemoteId;
				j.inviteReq = msg;
				h5spalyer.wsSocket.send(JSON.stringify(j));

			})
			.catch(function(err) {
				alert('[CFE] getUserMedia error try HTTPS', e);
				return;
			});
		} catch (e) {
			alert('[CFE] getUserMedia error try HTTPS');
		}
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
	
	this._bBusy = true;
}

H5sConference.prototype.answer = function(bVideo, strRemoteId, videoin, resolution, audioin){
	if (this._bBusy == true)
	{
		return;
	}
	
	this._videoin = videoin;
	this._audioin = audioin;
	this._resolution = resolution;
	
	var w = 1280;
	var h = 720;
	if (resolution == 'QVGA'){
		w = 320; h = 240;
	}else if (resolution == 'VGA'){
		w = 640; h = 480;
	}else if (resolution == 'D1'){
		w = 720; h = 576;
	}else if (resolution == '720P'){
		w = 1280; h = 720;
	}else if (resolution == '1080P'){
		w = 1920;h = 1080;
	}else if (resolution == '4K'){
		w = 4096;h = 2160;
	}else if (resolution == '8K'){
		w = 7680;h = 4320;		
	}
	
	try {
		try {
			var videoparam;
			if (bVideo == false)
			{
				videoparam = false;
			}else
			{
				videoparam = {deviceId: {exact: videoin}, width: {exact: w}, height: {exact: h}};
			}
			var h5spalyer = this;
			navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: audioin}}, video: videoparam})
			//navigator.mediaDevices.getUserMedia({audio: { echoCancellation: false }, video: videoparam})
			.then(function(stream) {
				if (bVideo == true)
				{
					h5spalyer._videodomlocal.srcObject = stream;
				}
				h5spalyer._streamlocal = stream;

				var j = {};

				j.type = "CFE_CMD_INVITE_RESP";
				
				var msg = {};
				msg.strFrom = h5spalyer._strId;
				msg.strTo = strRemoteId;
				h5spalyer._strRemoteId = strRemoteId;
				j.inviteResp = msg;
				h5spalyer.wsSocket.send(JSON.stringify(j));
			})
			.catch(function(err) {
				alert('[CFE] getUserMedia failed try HTTPS', e);
				return;
			});
			
		} catch (e) {
			alert('[CFE] getUserMedia failed try HTTPS');
		}
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
	
	this._bBusy = true;
}



H5sConference.prototype.hangup = function(){
	if (this._bBusy == false)
	{
		return;
	}

	try {
		if (this._bRecordLocal == true)
		{
			this._localRecorder.stop();
		}
		if (this._bRecordRemote == true)
		{
			this._remoteRecorder.stop();
		}
	}catch (e) {
		alert("stop record error: " + e);
	}		

	
	try {
		var j = {};
		j.cmd = "H5_PAUSE";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
	
	if (this._videodomlocal)
	{
		this._videodomlocal.src ="";
	}
	
	if (this._videodomremote)
	{
		this._videodomremote.src ="";
	}
	
	if (this._streamlocal)
	{
		this._streamlocal = null;
	}
	
	if (this.pc) 
	{
		try {
			this.pc.close();
		}
		catch (e) {
			if(this._debug === true) console.log ("[CFE] close peer connection failed:" + e);
		}
		this.pc = null;
	}
	
	
	this._bBusy = false;
}

H5sConference.prototype.disconnect = function() {
	if(this._debug === true) console.log("[CFE] disconnect", this);
	this.bDisConnected = true;
	clearInterval(this.reconnectTimerId);
	
	this.hangup();
	
	if (this.wsSocket != null)
	{
		this.wsSocket.close();
		this.wsSocket = null;
	}

	if(this._debug === true) console.log("[CFE] disconnect", this);
} 

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

function H5sRTCPush(conf)
{
	this.wsSocket;
	this.keepaliveTimerId;
	this.bNeedReconnect = false;
	this.bDisConnected = false;
	
	this._debug = true;	
	if (conf.consolelog !== undefined)
	{
		if (conf.consolelog === 'false')
		{
			this._debug = false;	
		}
	}

	this._conf = conf;
	
	this._videoId = conf.localvideoid;

	this._user = conf.user;
	
	this._nReconnectCnt = 1;
	
	//if(this._debug === true) console.log(conf.token, this._videoId);
	if (this._videoId === undefined)
	{
		this._localvideodom = conf.localvideodom;
		if(this._debug === true) console.log("[PUSH] use dom directly", conf.user);
	}else
	{
		this._localvideodom = document.getElementById(this._videoId);
		if(this._debug === true) console.log("[PUSH] use videoid", conf.user);
	}
	
	this.video = this._localvideodom;

	this.pc               = null;    

	this.pcOptions        = { "optional": [{"DtlsSrtpKeyAgreement": true} ] };

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
	this.pcConfig         = {"iceServers": [] };
  
	this.earlyCandidates = [];
	
	
}

H5sRTCPush.prototype.ReconnectFunction = function() 
{
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
	if (this.bNeedReconnect === true)
	{
		if(this._debug === true) console.log('[PUSH] Reconnect...');
		
		this.setupWebSocket(this._user);
		this.bNeedReconnect = false;
	}
	//if(this._debug === true) console.log('Try Reconnect...', this.bNeedReconnect);
}
	
	
H5sRTCPush.prototype.H5SWebSocketClient = function(h5spath) 
{
	var socket;
	if(this._debug === true) console.log("[PUSH] H5SWebSocketClient");
	try {
		//alert(this._conf.protocol);
		if (this._conf.protocol == "http:") 
		{
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('ws://' + this._conf.host  +  h5spath);
			}else
			{
				socket = new WebSocket('ws://' + this._conf.host +  h5spath);
			}
		}
		if (this._conf.protocol == "https:")
		{	
			//alert(this._conf.host);
			if(this._debug === true) console.log(this._conf.host);
			if (typeof MozWebSocket != "undefined")
			{
				socket = new MozWebSocket('wss://' + this._conf.host +  h5spath);
			}else
			{
				socket = new WebSocket('wss://' + this._conf.host + h5spath);
			}				
		}
		if(this._debug === true) console.log(this._conf.host);
	} catch (e) {
		alert('error');
		return;
	}
	return socket;
}

H5sRTCPush.prototype.keepaliveTimer = function()	
{
	try {
		var j = {};
		j.type = "keepalive";
		this.wsSocket.send(JSON.stringify(j));
	} catch (e) {
	  if(this._debug === true) console.log(e);
	}
}

/*
* RTCPeerConnection IceCandidate callback
*/
H5sRTCPush.prototype.onIceCandidate = function (event) {
	if (event.candidate) {
		if(this._debug === true) console.log("[PUSH] onIceCandidate currentice", event.candidate);
    	//if (this.pc.currentRemoteDescription)  {
				var currentice;
				currentice = event.candidate;
				if(this._debug === true) console.log("[PUSH] onIceCandidate currentice", JSON.stringify(currentice));
				var msgremoteice = JSON.parse(JSON.stringify(currentice));
				msgremoteice.type = 'remoteice';
				if(this._debug === true) console.log("[PUSH] onIceCandidate currentice new", JSON.stringify(msgremoteice));
				this.wsSocket.send(JSON.stringify(msgremoteice));

		//} else {
		//	this.earlyCandidates.push(event.candidate);
		//}
	} 
	else {
		if(this._debug === true) console.log("End of candidates.");
	}
}

/*
* RTCPeerConnection AddTrack callback
*/
H5sRTCPush.prototype.onTrack = function(event) {
	if(this._debug === true) console.log("[PUSH] Remote track added:" +  JSON.stringify(event));
        var stream;
	if (event.streams) {
		stream = event.streams[0];
	} 
	else {
		stream = event.stream;
	}
	
	return;
	//var videoElement = this._localvideodom;

	//videoElement.srcObject = stream;

	//videoElement.play();
}

/*
* create RTCPeerConnection 
*/
H5sRTCPush.prototype.createPeerConnection = function() 
{
	if(this._debug === true) console.log("[PUSH] createPeerConnection  config: " + JSON.stringify(this.pcConfig) + " option:"+  JSON.stringify(this.pcOptions));
	var pc = new RTCPeerConnection(this.pcConfig, this.pcOptions);
	var streamer = this;
	pc.onicecandidate = function(evt) { streamer.onIceCandidate.call(streamer, evt); };
	if (typeof pc.ontrack != "undefined") {
		pc.ontrack        = function(evt) { streamer.onTrack.call(streamer,evt); };
	} 
	else {
		pc.onaddstream    = function(evt) { streamer.onTrack.call(streamer,evt); };
	}
	pc.oniceconnectionstatechange = function(evt) {
		if(streamer._debug === true) console.log("[PUSH] oniceconnectionstatechange  state: " + pc.iceConnectionState);
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
	}
	
	if(this._debug === true) console.log("[PUSH] Created RTCPeerConnnection with config: " + JSON.stringify(this.pcConfig) + "option:"+  JSON.stringify(this.pcOptions) );
	return pc;
}

H5sRTCPush.prototype.SetBitrate = function(pc, bitrate)
{
	if ((adapter.browserDetails.browser === 'chrome' ||
	adapter.browserDetails.browser === 'safari' ||
	(adapter.browserDetails.browser === 'firefox' &&
	adapter.browserDetails.version >= 64)) &&
	'RTCRtpSender' in window &&
	'setParameters' in window.RTCRtpSender.prototype) {
	const senders = pc.getSenders();
	for (let i = 0; i !== senders.length; ++i) {
		
		const sender = senders[i];
		if (sender.track.kind == 'video')
		{
			const parameters = sender.getParameters();
			if (!parameters.encodings) {
			parameters.encodings = [{}];
			}
			//console.log(sender, parameters);
		
			parameters.encodings[0].maxBitrate = bitrate * 1000;
			
			sender.setParameters(parameters)
			.then(() => {
				//console.log(bitrate);
			})
			.catch(e => console.error(e));
				
			}
		}
	}
}

H5sRTCPush.prototype.CreateOffer = function()	
{
	if(this._debug === true) console.log("[PUSH] CreateOffer");
	try {
		this.pc = this.createPeerConnection();
		this.earlyCandidates.length = 0;
		var streamer = this;
		const videoTracks = this._streamlocal.getVideoTracks();
		const audioTracks = this._streamlocal.getAudioTracks();
		if (videoTracks.length > 0) {
			console.log('[PUSH] Using video device:', videoTracks[0].label);
		}
		if (audioTracks.length > 0) {
			console.log('[PUSH] Using audio device:', audioTracks[0].label);
		}
		this._streamlocal.getTracks().forEach(track => this.pc.addTrack(track, this._streamlocal));

		const supportsSetCodecPreferences = window.RTCRtpTransceiver && 'setCodecPreferences' in window.RTCRtpTransceiver.prototype;
	
		if (supportsSetCodecPreferences)
		{
			var codecString = 'video/H264';
			if (this._codec == "VP9")
			{
				codecString = 'video/VP9';
			}else if (this._codec == "H264")
			{
				codecString = 'video/H264';
			}
			//AV1 here

			const ret = window.RTCRtpSender.getCapabilities('video');
			const codecs = ret.codecs;
			var selectedCodec = [];

			for (let i = 0; i !== codecs.length; ++i) {
				const codec = codecs[i];
				if ([codecString].includes(codec.mimeType)) {
					selectedCodec.push(codec);
				}
			}

			if(streamer._debug === true) console.log("[PUSH] Select codec:", selectedCodec);
			const transceiver = this.pc.getTransceivers().find(t => t.sender && t.sender.track === this._streamlocal.getVideoTracks()[0]);
			transceiver.setCodecPreferences(selectedCodec);
		}

		this.pc.createOffer(this.mediaConstraints).then(function(sessionDescription) {
			if(streamer._debug === true) console.log("[PUSH] Create offer:" + JSON.stringify(sessionDescription));
			
			streamer.pc.setLocalDescription(sessionDescription
				, function() 
				{ 	
					var offer = sessionDescription;
					//if(streamer._debug === true) console.log('[PUSH] createOffer ', JSON.stringify(offer));
					streamer.wsSocket.send(JSON.stringify(offer));
				}
				, function() {} );
				
			
		}, function(error) { 
			alert("[PUSH ]Create offer error:" + JSON.stringify(error));
		});	
		return;
	}catch (e) {
		this.disconnect();
		alert("connect error: " + e);
	}	 


} 

H5sRTCPush.prototype.ProcessAnswer = function(msg)
{
	if(this._debug === true) console.log("[PUSH] ProcessAnswer", msg);
	try {
		this.pc.setRemoteDescription(createRTCSessionDescription(msg));
	}catch (e) {
		this.disconnect();
		alert("connect error: " + e);
	}

	this.SetBitrate(this.pc, this._bitrate);
}

H5sRTCPush.prototype.ProcessRemoteIce = function(msg)	
{
	if(this._debug === true) console.log("[PUSH] ProcessRemoteIce", msg);

	try {
		var candidate = new RTCIceCandidate({
			sdpMid: msg.sdpMid,
			sdpMLineIndex: msg.sdpMLineIndex,
			candidate: msg.candidate
		  });
		if(this._debug === true) console.log("[PUSH] ProcessRemoteIce", candidate);
			
		if(this._debug === true) console.log("[PUSH] Adding ICE candidate :" + JSON.stringify(candidate) );
		this.pc.addIceCandidate(candidate
			, function()      { /*console.log ("[PUSH] addIceCandidate OK");*/ }
			, function(error) { console.log ("[PUSH] addIceCandidate error:" + JSON.stringify(error)); console.log (error);} );

	}catch (e) {
		//this.disconnect();
		alert("connect ProcessRemoteIce error: " + e);
	}
} 

H5sRTCPush.prototype.onWebSocketData = function(msg)	
{
	if(msg.data instanceof ArrayBuffer)
	{
		//if(this._debug === true) console.log("ArrayBuffer =====");
	}
	
	if(typeof msg.data === 'string')
	{
		//if(this._debug === true) console.log("String ======");
	}
	
	if(this._debug === true) console.log("[PUSH] RTC received ", msg.data);
	var msgrtc = JSON.parse(msg.data);
	if(this._debug === true) console.log("[PUSH] Get Message type ", msgrtc.type);

	if (msgrtc.type === 'iceserver')
	{
		if(this._debug === true) console.log("[PUSH] Process Message type ", msgrtc.type);
		this.pcConfig.iceServers = msgrtc.iceServers;
		//this.pcConfig.iceTransportPolicy = msgrtc.iceTransportPolicy;
		if(this._debug === true) console.log("[PUSH] Iceserver:", this.pcConfig);
		this.CreateOffer();
		return;

	}

	if (msgrtc.type === 'answer')
	{
		if(this._debug === true) console.log("[PUSH] Process Message type ", msgrtc.type);
		this.ProcessAnswer(msgrtc);
		return;

	}

	if (msgrtc.type === 'remoteice')
	{
		if(this._debug === true) console.log("[PUSH] Process Message type ", msgrtc.type);
		this.ProcessRemoteIce(msgrtc);
		return;

	}

	if (this._conf.callback != undefined)
	{
		this._conf.callback(msg.data, this._conf.userdata);
	}
} 
	

H5sRTCPush.prototype.setupWebSocket = function(token)	
{
	this.video.autoplay = true;
	
	//var h5spath = this.video.getAttribute('h5spath');
	var h5spath = "api/v1/h5srtcpushapi";
	//var token = this.video.getAttribute('token');
	
	
	h5spath = this._conf.rootpath + h5spath + "?token=" + token + "&type=" + this._conf.type + 
					"&audio=" + this._conf.audio + '&session=' + this._conf.session;
	
	
	if(this._debug === true) console.log(h5spath);
	
	this.wsSocket = this.H5SWebSocketClient(h5spath);
	if(this._debug === true) console.log("[PUSH] setupWebSocket", this.wsSocket);
	this.wsSocket.binaryType = 'arraybuffer';
	this.wsSocket.h5 = this;
	this.wsSocket.onmessage = this.onWebSocketData.bind(this);
	
	this.wsSocket.onopen = function()
	{
		if(this.h5._debug === true) console.log("[PUSH] wsSocket.onopen", this.h5);

		var j = {};
		j.type = "open";
		this.h5.wsSocket.send(JSON.stringify(j));
		
		this.h5.keepaliveTimerId = setInterval(this.h5.keepaliveTimer.bind(this.h5), 1000);
		if (this.h5._pbconf != undefined && this.h5._pbconf.autoplay === 'true')
		{
			this.h5.start();
		}

	}
	
	this.wsSocket.onclose = function () {
		if(this._debug === true) console.log("[PUSH] wsSocket.onclose", this.h5);
		if (this.h5.bDisConnected === true)
		{
			if(this.h5._debug === true) console.log("[PUSH] wsSocket.onclose disconnect");
		}else
		{
			this.h5.bNeedReconnect = true;
		}
		
		this.h5.CleanupWebSocket(this.h5);
	}

}


H5sRTCPush.prototype.CleanupWebSocket = function(h5sPlayer)
{
	if(h5sPlayer._debug === true) console.log('[PUSH] CleanupWebSocket', h5sPlayer);
	clearInterval(h5sPlayer.keepaliveTimerId);
}


/** 
 * Connect a websocket Stream to videoElement 
*/
H5sRTCPush.prototype.connect = function(videoin, codec, bitrate, resolution, audioin, bDisplayMedia) {
	/* start connect to server */
	//var bDisplayMedia = false;
	this._videoin = videoin;
	this._codec = codec;
	this._bitrate = bitrate;
	this._resolution = resolution;
	this._audioin = audioin;
	if(this._debug === true) console.log('[PUSH] videoin:', videoin, 'codec:', codec, 'bitrate:', 
					bitrate, 'resolution:', resolution, 'audioin:', audioin);

	var w = 1280;
	var h = 720;
	if (resolution == 'QVGA'){
		w = 320; h = 240;
	}else if (resolution == 'VGA'){
		w = 640; h = 480;
	}else if (resolution == 'D1'){
		w = 720; h = 576;
	}else if (resolution == '720P'){
		w = 1280; h = 720;
	}else if (resolution == '1080P'){
		w = 1920;h = 1080;
	}else if (resolution == '4K'){
		w = 4096;h = 2160;
	}else if (resolution == '8K'){
		w = 7680;h = 4320;		
	}
	var audioConf;
	if (this._conf.audio == 'true')
	{
		audioConf = {deviceId: {exact: audioin}};
	}else
	{
		audioConf = false;
	}
	try {
		const constraints = {
			audio: audioConf,
			//audio: false,
			video: {deviceId: {exact: videoin}, width: {exact: w}, height: {exact: h}}
		  };
		try {
			var h5splayer = this;
			if (bDisplayMedia == false)
			{
				navigator.mediaDevices.getUserMedia(constraints)
				.then(function(stream) {
					h5splayer._localvideodom.srcObject = stream;
					h5splayer._streamlocal = stream;
		
					h5splayer.setupWebSocket(h5splayer._user);
				})
				.catch(function(err) {
					alert('[PUSH] getUserMedia failed try HTTPS', e);
					return;
				});
			}else 
			{
				navigator.mediaDevices.getDisplayMedia({video: true})
				.then(function(stream) {
					h5splayer._localvideodom.srcObject = stream;
					h5splayer._streamlocal = stream;
		
					h5splayer.setupWebSocket(h5splayer._user);
				})
				.catch(function(err) {
					alert('[PUSH] getUserMedia failed try HTTPS', e);
					return;
				});				
			}
			//do need reconnect
			//this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 3000);
		} catch (e) {
			alert('[PUSH] getUserMedia failed try HTTPS', e);
			return;
		}
		
	} catch (e) {
		if(this._debug === true) console.log(e);
		return;
	}
}

H5sRTCPush.prototype.send = function(message) {
	var j = {};
	j.type = "message";
	j.user = this._user;
	j.msg = message;
	this.wsSocket.send(JSON.stringify(j));
}

/** 
 * Disconnect a websocket Stream and clear videoElement source
*/
H5sRTCPush.prototype.disconnect = function() {
	if(this._debug === true) console.log("[PUSH] disconnect", this);
	this.bDisConnected = true;
	clearInterval(this.reconnectTimerId);
	
	if (this.wsSocket != null)
	{
		this.wsSocket.close();
		this.wsSocket = null;
	}
	
	if (this._localvideodom)
	{
		this._localvideodom.src ="";
	}
	
	if (this.pc) 
	{
		try {
			this.pc.close();
		}
		catch (e) {
			if(this._debug === true) console.log ("[PUSH] close peer connection failed:" + e);
		}
		this.pc = null;
	}

	if(this._debug === true) console.log("[PUSH] disconnect", this);
} 


function H5sRTCGetCapability(success, error) 
{
	var capability = {};
	var videocodec = [];
	var audioin = [];
	var audioout = [];
	var videoin = [];

	navigator.mediaDevices.getUserMedia({audio: true, video: true})
	.then(function(stream) {
		if (stream) {
			stream.getTracks().forEach(track => {
				track.stop();
			});
		}
	})
	.catch(function(err) {
		alert('[PUSH] getUserMedia failed try HTTPS', e);
		return;
	});
	
	const supportsSetCodecPreferences = window.RTCRtpTransceiver && 'setCodecPreferences' in window.RTCRtpTransceiver.prototype;
	
	if (supportsSetCodecPreferences)
	{
		const ret = window.RTCRtpSender.getCapabilities('video');
		const codecs = ret.codecs;
		//console.log(codecs);
		var bVP9 = false;
		var bH264 = false;
		for (let i = 0; i !== codecs.length; ++i) {
			const codec = codecs[i];
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
		if (bVP9 == true)
		{
			videocodec.push("VP9");
		}
		if (bH264 == true)
		{
			videocodec.push("H264");
		}
	}else
	{
		videocodec.push("Default");
	}
	
	navigator.mediaDevices.enumerateDevices()
	.then(function(deviceInfos) {
		//console.log(deviceInfos);
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			var dev = {};
			dev['id'] = deviceInfo.deviceId;
			dev['name'] = deviceInfo.label;

			if (deviceInfo.kind === 'audioinput') {
			audioin.push(dev);
			} else if (deviceInfo.kind === 'audiooutput') {
			audioout.push(dev);
			} else if (deviceInfo.kind === 'videoinput') {
			videoin.push(dev);
			} else {

			}
		}

		capability['videocodec'] = videocodec;
		capability['videoin'] = videoin;
		capability['audioin'] = audioin;
		capability['audioout'] = audioout;
		
		//console.log(capability);
		
		success(capability);
	})
	.catch(function(err) {
		alert('[PUSH] enumerateDevices failed', e);
		return;
	});
}






export  {H5sPlayerWS,H5sPlayerHls,H5sPlayerRTC,H5sPlayerAudBack,H5sConference,H5sRTCPush,H5sRTCGetCapability}