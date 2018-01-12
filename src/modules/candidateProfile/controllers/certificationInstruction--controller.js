const imageAddr = 'http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg';
const downloadSize = 4995374;
const WIDTH=500;
const HEIGHT=50;
export class CertificationInstructionController{
	/** @ngInject  */
  constructor($sce, mediaRecorderService, volumeMeterService, $scope) {
    this.$sce = $sce;
    this.videoUrl = 'https://www.youtube.com/embed/mcixldqDIEQ';
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    this.mediaRecorderService = mediaRecorderService;
    this.recordingMode = false;
    this.mediaRecorder = null;
    this.options = null;
    this.chunks = [];
    this.canvasContext = document.getElementById('volume-meter').getContext('2d');
    this.grd = this.canvasContext.createLinearGradient(0,0,200,0);
    this.grd.addColorStop(0,"#71eb34");
    this.grd.addColorStop(0.5,"#cfeb34");
    this.grd.addColorStop(1,"red");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.mediaStreamSource = null;
    this.rafID = null;
    this.meter = null;
    this.selectedVolume = 0.5;
    this.volumeMeterService = volumeMeterService;
    this.acceptedSpeed = 0.5;
    this.measureConnectionSpeed();
    this.speed = '';
    this.$scope = $scope;
    this.localStream = '';
  
  }
  
  startRecording() {
    console.log('in this');
    this.recordingMode = true;
    navigator.getUserMedia({video: true}, this.onStream.bind(this), this.onFailedStream.bind(this));
  }
  
  startRecordingAudio() {
    if(this.localStream) {
      this.mediaRecorder.stop();
      this.recordingMode = false;
      console.log(this.localStream.getTracks().length);
      this.localStream.getTracks()[0].stop();
    }
    navigator.getUserMedia({audio: true}, this.onAudioStream.bind(this), this.onFailedStream.bind(this));
  }
  
  onAudioStream(stream) {
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
    this.mediaStreamSource.connect(this.gainNode);
    this.meter = this.volumeMeterService.createAudioMeter(this.audioContext);
    this.gainNode.gain.value = this.selectedVolume;
    this.gainNode.connect(this.meter);
    this.drawLoop();
  }
 
  drawLoop( time ) {
    this.canvasContext.clearRect(0,0,WIDTH,HEIGHT);
    this.canvasContext.fillStyle = this.grd;
    this.canvasContext.fillRect(0, 0, this.getWidth(this.meter.getVolumeLevel()), HEIGHT);
    this.rafID = window.requestAnimationFrame( this.drawLoop.bind(this));
  }
  
  getWidth(volumeLevel) {
    return WIDTH*volumeLevel;
  }
  
  onStream(stream) {
    this.localStream = stream;
    // if (typeof MediaRecorder.isTypeSupported == 'function'){
    //   if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    //     this.options = {mimeType: 'video/webm;codecs=vp9'};
    //   } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    //     this.options = {mimeType: 'video/webm;codecs=vp8'};
    //   }
    //   this.mediaRecorder = new MediaRecorder(stream, this.options);
    // }else{
    //   this.mediaRecorder = new MediaRecorder(stream);
    // }
    // this.mediaRecorder.start(10);
    // let url = window.URL || window.webkitURL;
    // this.videoElement = document.getElementById('videoTestElementCertIns');
    // this.videoElement.src = url ? url.createObjectURL(stream) : stream;
    // this.videoElement.controls = false
    // this.videoElement.play();

    var mediarecorderoptions =  this.mediaRecorderService.initializeStartMediaRecorder(stream, 'videoTestElementCertIns');
    this.mediaRecorder = mediarecorderoptions.mediaRecorder;
    this.options = mediarecorderoptions.options;
    this.videoElement = mediarecorderoptions.element;

    this.mediaRecorder.ondataavailable = e => {
      this.chunks.push(e.data);
    };
  }
  
  onFailedStream() {
    console.error('Unable to get stream');
  }
  
  trustSrc(src) {
    return this.$sce.trustAsResourceUrl(src);
  }
  
  measureConnectionSpeed() {
    let startTime, endTime;
    let download = new Image();
    startTime = (new Date()).getTime();
    download.onload = ()=> {
      console.log('download complete');
      endTime = (new Date()).getTime();
      this.calculateSpeed(startTime, endTime);
    }
    
    download.onerror = function (err, msg) {
      console.log("Invalid image, or error downloading");
    }
    
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    console.log('image address set');
  }
  
  calculateSpeed(startTime, endTime) {
    console.log('calculate speed');
    let duration = (endTime - startTime) / 1000;
    let bitsLoaded = downloadSize * 8;
    let speedBps = (bitsLoaded / duration).toFixed(2);
    let speedKbps = (speedBps / 1024).toFixed(2);
    let speedMbps = (speedKbps / 1024).toFixed(2);
    this.speed = speedMbps;
    this.connectionStatus = (this.speed >= this.acceptedSpeed) ? 'Fine' : 'Bad';
    this.$scope.$apply();
  }

  
}

