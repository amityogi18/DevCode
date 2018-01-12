// const imageAddr = './img/speedtest.jpg';
const imageAddr = "img/speedtest.jpg";
const downloadSize = 4995374;
const WIDTH=500;
const HEIGHT=50;
let _this;
export class HelpController
{
  /** @ngInject */
  constructor($sce, $rootScope, mediaRecorderService, volumeMeterService, $scope, $window, $storage) {
    _this =  this;
    _this.imageAddr = $rootScope.appPath+imageAddr;
    _this.$sce = $sce;
    _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.$storage = $storage;
    _this.videoUrl = 'https://www.youtube.com/embed/mcixldqDIEQ';
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    _this.mediaRecorderService = mediaRecorderService;
    _this.recordingMode = false;
    _this.mediaRecorder = null;
    _this.options = null;
    _this.chunks = [];
    _this.canvasContext = document.getElementById('volume-meter-block').getContext('2d');
    _this.grd = _this.canvasContext.createLinearGradient(0,0,200,0);
    _this.grd.addColorStop(0,"#71eb34");
    _this.grd.addColorStop(0.5,"#cfeb34");
    _this.grd.addColorStop(1,"red");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    _this.audioContext = new AudioContext();
    _this.gainNode = _this.audioContext.createGain();
    _this.mediaStreamSource = null;
    _this.rafID = null;
    _this.meter = null;
    _this.selectedVolume = 0.5;
    _this.volumeMeterService = volumeMeterService;
    _this.acceptedSpeed = 0.5;
    _this.measureConnectionSpeed();
    _this.speed = '';
    _this.$scope = $scope;
    _this.localStream = '';
    _this.deviceList = [];
    _this.deviceListAudio = [];
    _this.isWebcamCheckOpen = false;
    _this.isAudioCheckOpen = false;
    _this.isExtensionAdded = false;
    _this.extensionCheck();
    _this.interviewTypeId = 1;
    if(_this.$storage.getItem('interviewDetails')){
       let interviewDetails = JSON.parse(_this.$storage.getItem('interviewDetails'));
       _this.interviewTypeId = interviewDetails.interviewTypeId;
    }
    navigator.mediaDevices.enumerateDevices().then(_this.gotDevices).catch(_this.handleError1);
  }
  
  startRecording() {
    _this.recordingMode = true;
    _this.isWebcamCheckOpen = !_this.isWebcamCheckOpen;
    _this.isAudioCheckOpen = false;
    if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
          track.stop();
        });
    }
    if(_this.isWebcamCheckOpen) {
      _this.changeVideoFeed();
    }
    //var videoSelect = document.querySelector('select#videoSource');
    
    
   }
  changeVideoFeed() {
        var videoSource = _this.videosourceselect.id;
        _this.$storage.setItem('video', _this.videosourceselect.id);
        var constraints = {
          video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        };
        navigator.mediaDevices.getUserMedia(constraints).then(_this.onStream.bind(_this)).catch(_this.handleError2());
      // navigator.getUserMedia(constraints, _this.gotStream(), _this.onFailedStream.bind(_this));
  }

  changeAudioFeed() {
        var audioSource = _this.audiosourceselect.id;
        _this.$storage.setItem('audio', _this.audiosourceselect.id);
        var constraints = {
          audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
        };
        navigator.mediaDevices.getUserMedia(constraints).then(_this.onAudioStream.bind(_this)).catch(_this.handleError3());
      // navigator.getUserMedia(constraints, _this.gotStream(), _this.onFailedStream.bind(_this));
  }


  gotStream(stream) {
    window.stream = stream; 
    var videoElement = document.getElementById('videoTestElementCertIns');
    videoElement.srcObject = stream;
    // Refresh button list in case labels have become available
    //return navigator.mediaDevices.enumerateDevices();
  }

  gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
      // var values = selectors.map(function(select) {
      //   return select.value;
      // });
      // selectors.forEach(function(select) {
      //   while (select.firstChild) {
      //     select.removeChild(select.firstChild);
      //   }
      // });
      // let videoSelect = document.querySelector('select#videoSource');
      // for (var i = 0; i !== deviceInfos.length; ++i) {
      //   var deviceInfo = deviceInfos[i];
      //   var option = document.createElement('option');
      //   option.value = deviceInfo.deviceId;
      //   if (deviceInfo.kind === 'videoinput') {
      //     option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
      //     videoSelect.appendChild(option);
      //   } else {
      //     console.log('Some other kind of source/device: ', deviceInfo);
      //   }
      // }
      let videoSelect = document.querySelector('select#videoSource');
      let audioSelect = document.querySelector('select#audioSource');
      var deviceListHolder = [];
      var deviceListHolderAudio = [];
      var deviceListHolderAudioId = [];
      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === 'videoinput') {
          deviceInfo.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
          deviceInfo.id = deviceInfo.deviceId;
          deviceListHolder.push(deviceInfo);
        } else if (deviceInfo.kind === 'audioinput') {
          if(deviceListHolderAudioId.indexOf(deviceInfo.deviceId) < 0) {
             deviceInfo.text = deviceInfo.label || 'microphone ' + (audioSelect.length + 1);
             deviceInfo.id = deviceInfo.deviceId;
             deviceListHolderAudio.push(deviceInfo);
             deviceListHolderAudioId.push(deviceInfo.deviceId);
          }
         
         }
        // else {
        //   console.log('Some other kind of source/device: ', deviceInfo);
        // }
      }
      
      _this.videosourceselect = deviceListHolder[0];
      _this.audiosourceselect = deviceListHolderAudio[0];
      _this.deviceList = deviceListHolder;
      _this.deviceListAudio = deviceListHolderAudio;
     // _this.deviceListAudio = deviceListHolderAudio;
      // selectors.forEach(function(select, selectorIndex) {
      //   if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      //     return n.value === values[selectorIndex];
      //   })) {
      //     select.value = values[selectorIndex];
      //   }
      // });
}


  startRecordingAudio() {
     _this.isWebcamCheckOpen = false;
     _this.isAudioCheckOpen = !_this.isAudioCheckOpen;
    if(_this.localStream) {
        if(angular.isDefined(_this.mediaRecorder) && _this.mediaRecorder
            && angular.isDefined(_this.mediaRecorder.state) 
            && _this.mediaRecorder.state !== 'inactive'){
                _this.mediaRecorder.stop();
                _this.recordingMode = false;
                _this.localStream.getTracks()[0].stop();
            }
    }
    if(_this.isAudioCheckOpen) {
        _this.changeAudioFeed();
    }
    
   // navigator.getUserMedia({audio: true}, _this.onAudioStream.bind(_this), _this.onFailedStream.bind(_this));
  }
  
  onAudioStream(stream) {
    navigator.mediaDevices.enumerateDevices().then(_this.gotDevices).catch(_this.handleError1);
    _this.mediaStreamSource = _this.audioContext.createMediaStreamSource(stream);
    _this.mediaStreamSource.connect(_this.gainNode);
    _this.meter = _this.volumeMeterService.createAudioMeter(_this.audioContext);
    _this.gainNode.gain.value = _this.selectedVolume;
    _this.gainNode.connect(_this.meter);
    _this.drawLoop();
    _this.$rootScope.$emit("audioCheckOk", {});
  }
 
  drawLoop( time ) {
    _this.canvasContext.clearRect(0,0,WIDTH,HEIGHT);
    _this.canvasContext.fillStyle = _this.grd;
    _this.canvasContext.fillRect(0, 0, _this.getWidth(_this.meter.getVolumeLevel()), HEIGHT);
    _this.rafID = window.requestAnimationFrame( _this.drawLoop.bind(_this));
  }
  
  getWidth(volumeLevel) {
    return WIDTH*volumeLevel;
  }
  
  onStream(stream) {
    _this.localStream = stream;
     window.stream = stream;
     navigator.mediaDevices.enumerateDevices().then(_this.gotDevices).catch(_this.handleError1);
    if (typeof MediaRecorder.isTypeSupported == 'function'){
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        _this.options = {mimeType: 'video/webm;codecs=vp9'};
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        _this.options = {mimeType: 'video/webm;codecs=vp8'};
      }
      _this.mediaRecorder = new MediaRecorder(stream, _this.options);
    }else{
      _this.mediaRecorder = new MediaRecorder(stream);
    }
    _this.mediaRecorder.start(10);
    let url = window.URL || window.webkitURL;
    _this.videoElement = document.getElementById('videoTestElementCertIns');
    _this.videoElement.src = url ? url.createObjectURL(stream) : stream;
    _this.videoElement.controls = false
    _this.videoElement.play();
    
    _this.mediaRecorder.ondataavailable = e => {
      _this.chunks.push(e.data);
    };
    _this.$rootScope.$emit("videoCheckOk", {});
  }
  
  onFailedStream() {
    console.error('Unable to get stream');
  }

  handleError1(error) {
    console.log('error in first call to get device: ', error);
  }
  handleError2(error) {
    console.log('error in video change: ', error);
  }
  handleError3(error) {
    console.log('error in audio change: ', error);
  }
  
  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }
  
  measureConnectionSpeed() {
    let THIS = this;
    let startTime, endTime;
    let download = new Image();
    startTime = (new Date()).getTime();
    download.onload = ()=> {
      console.log('download complete');
      endTime = (new Date()).getTime();
      _this.calculateSpeed(startTime, endTime);
    }
    
    download.onerror = function (err, msg) {
      console.log("Invalid image, or error downloading");
    }
    
    var cacheBuster = "?nnn=" + startTime;
    download.src = THIS.imageAddr + cacheBuster;
    console.log('image address set');
  }
  
  calculateSpeed(startTime, endTime) {
    console.log('calculate speed');
    let duration = (endTime - startTime) / 1000;
    let bitsLoaded = downloadSize * 8;
    let speedBps = (bitsLoaded / duration).toFixed(2);
    let speedKbps = (speedBps / 1024).toFixed(2);
    let speedMbps = (speedKbps / 1024).toFixed(2);
    _this.speed = speedMbps;
    _this.connectionStatus = (_this.speed >= _this.acceptedSpeed) ? 'Fine' : 'Bad';
    _this.$scope.$apply();
    _this.$rootScope.$emit("speedCheckOk", {});
  }

  openNav() {
    document.getElementById("mySidenav").style.left = "55%";
  }

  closeNav() {
    document.getElementById("mySidenav").style.left = "100%";
  }

  extensionCheck(){
      if($('#extajloadedd').length > 0){
        _this.isExtensionAdded = true;
      }else{
       _this.isExtensionAdded = false;
      }
  }

  installExtension() {
      console.log('in hte install');
      let appUrl = 'https://chrome.google.com/webstore/detail/mipnbheeimfogijebnebgnlljhndlame';
      if(!!navigator.webkitGetUserMedia && !!window.chrome && !!chrome.webstore && !!chrome.webstore.install) {
         chrome.webstore.install(appUrl,
             function() {
                 console.log('Extension installed');
                 //location.reload();
             },
             function(e) {
                console.log(e);
             }
         );
      }
   }
}
