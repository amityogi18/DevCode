
export class mediaRecorderService {
	/** @ngInject  */

  constructor() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if(this.getBrowser() == "Chrome"){
      this.constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 320,  "maxWidth": 320, "minHeight": 240,"maxHeight": 240 }, "optional": [] } };//Chrome
    }else if(this.getBrowser() == "Firefox"){
      this.constraints = {audio: true,video: {  width: { min: 320, ideal: 320, max: 1280 },  height: { min: 240, ideal: 240, max: 720 }}}; //Firefox
    }
  }

  getBrowser(){
    const nVer = navigator.appVersion;
    const nAgt = navigator.userAgent;
    let browserName  = navigator.appName;
    let fullVersion  = `${parseFloat(navigator.appVersion)}`;
    let majorVersion = parseInt(navigator.appVersion,10);
    let nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset+6);
      if ((verOffset=nAgt.indexOf("Version"))!=-1)
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset+7);
      if ((verOffset=nAgt.indexOf("Version"))!=-1)
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
        (verOffset=nAgt.lastIndexOf('/')) )
    {
      browserName = nAgt.substring(nameOffset,verOffset);
      fullVersion = nAgt.substring(verOffset+1);
      if (browserName.toLowerCase()==browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
      fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
      fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(`${fullVersion}`,10);
    if (isNaN(majorVersion)) {
      fullVersion  = `${parseFloat(navigator.appVersion)}`;
      majorVersion = parseInt(navigator.appVersion,10);
    }


    return browserName;
  }
  getPeripheralStatusText(audioStatus, videoStatus) {
    let text = 'Please connect ' + ((!audioStatus) ? 'MicroPhone' : '') +
        ((!audioStatus && !videoStatus) ? ' And ' : '') +
        ((!videoStatus) ? 'Webcam' : '') + '.';
    return text;
  }
  initializeMediaRecorder(stream) {
    let options, mediaRecorder;
    if (typeof MediaRecorder.isTypeSupported == 'function'){
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = {mimeType: 'video/webm;codecs=vp9'};
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options = {mimeType: 'video/webm;codecs=vp8'};
      }
        mediaRecorder = new MediaRecorder(stream, this.options);
    }else{
        mediaRecorder = new MediaRecorder(stream);
    }
    return {'options': options, 'mediaRecorder': mediaRecorder};
  }

  initializeStartMediaRecorder(stream, element) {
      let options, mediaRecorder, targetElement;
      if (typeof MediaRecorder.isTypeSupported == 'function'){
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          options = {mimeType: 'video/webm;codecs=vp9'};
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          options = {mimeType: 'video/webm;codecs=vp8'};
        }
          mediaRecorder = new MediaRecorder(stream, this.options);
      }else{
          mediaRecorder = new MediaRecorder(stream);
      }
      
      mediaRecorder.start(10);
      let url = window.URL || window.webkitURL;
      targetElement = document.getElementById(element);
      targetElement.src = url ? url.createObjectURL(stream) : stream;
      targetElement.controls = false
      targetElement.play();
      return {'options': options, 'mediaRecorder': mediaRecorder, 'element': targetElement};
    }

  startMediaRecorder(mediaRecorder) {
    mediaRecorder.start();
  }
  pauseMediaRecorder(mediaRecorder) {
    mediaRecorder.pause();
  }
  resumeMediaRecorder(mediaRecorder) {
    mediaRecorder.resume();
  }
  stopMediaRecorder(mediaRecorder) {
    mediaRecorder.stop();
  }
  getUserMedia(cb) {
    navigator.getUserMedia(this.constraints,cb.bind(this), this.errorCallback);
  }
  getConstrainsts() {
    return this.getConstrainsts();
  }
  
  
}

