const WIDTH=500;
const HEIGHT=50;
export class audioTestAccordionController {
	/** @ngInject  */
  constructor(volumeMeterService) {
      this.canvasContext = document.getElementById('volume-meter').getContext('2d');
      this.grd = this.canvasContext.createLinearGradient(0,0,200,0);
      this.grd.addColorStop(0,"#71eb34");
      this.grd.addColorStop(0.5,"#cfeb34");
      this.grd.addColorStop(1,"red");
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      this.mediaStreamSource = null;
      this.rafID = null;
      this.meter = null;
      this.selectedVolume = 0.5;
      this.volumeMeterService = volumeMeterService;
  }

  startRecording() {
      console.log('clicked');
      navigator.getUserMedia({audio: true}, this.onStream.bind(this), this.onFailedStream.bind(this));
  }

  onStream(stream) {
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
    this.mediaStreamSource.connect(this.gainNode);
    this.meter = this.volumeMeterService.createAudioMeter(this.audioContext);
    console.log('in stream', this.selectedVolume);
    this.gainNode.gain.value = this.selectedVolume;
    this.gainNode.connect(this.meter);
    this.drawLoop();
  }

  onFailedStream() {
      console.error('Unable to get stream');
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
 
}
