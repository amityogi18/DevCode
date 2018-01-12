export class videoTestAccordionController {
	/** @ngInject  */
  constructor($sce, mediaRecorderService) {
      this.$sce = $sce;
      this.videoUrl = 'https://www.youtube.com/embed/mcixldqDIEQ';
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      this.mediaRecorderService = mediaRecorderService;
      this.recordingMode = false;
      this.mediaRecorder = null;
      this.options = null;
      this.chunks = [];
  }

  startRecording() {
      navigator.getUserMedia({video: true}, this.onStream.bind(this), this.onFailedStream.bind(this));
  }

  onStream(stream) {
      this.recordingMode = true;
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
    //   this.mediaRecorder.start(10);
    //   let url = window.URL || window.webkitURL;
    //   this.videoElement = document.getElementById('videoTestElement');
    //   this.videoElement.src = url ? url.createObjectURL(stream) : stream;
    //   this.videoElement.controls = false
    //   this.videoElement.play();

    var mediarecorderoptions =  this.mediaRecorderService.initializeStartMediaRecorder(stream, 'videoTestElement');
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

}

