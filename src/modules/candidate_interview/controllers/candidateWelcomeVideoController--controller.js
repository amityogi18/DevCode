let _this;
export class CandidateWelcomeVideoController {
	/** @ngInject  */
  constructor($window, $location, $sce, $state, $stateParams, CandidateInterviewService, $storage) {
    _this = this;
    _this.$window = $window;
    _this.$location = $location;
    _this.$sce = $sce;
    _this.$state =  $state;
    _this.$stateParams = $stateParams;
    _this.CandidateInterviewService = CandidateInterviewService;
    _this.$storage = $storage;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    _this.interviewId  = _this.$storage.getItem('interviewId') || 1;
    _this.interviewCode  = _this.$storage.getItem('interviewCode') || 1;
    _this.interviewDetails = {};
    _this.getWelcomeVideo();
  }

  showVideo(){
      navigator.getUserMedia({video: true}, this.onStream.bind(this), this.onFailedStream.bind(this));
      _this.movie = {src:_this.videoUrl};
      _this.$window.assessmentSubmissionHandler = _this.assessmentSubmissionHandler;
      _this.$window.closeAssessmentWindow = _this.closeAssessmentWindow;
  }

  onStream(stream) {
      if (typeof MediaRecorder.isTypeSupported == 'function'){
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          this.options = {mimeType: 'video/webm;codecs=vp9'};
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          this.options = {mimeType: 'video/webm;codecs=vp8'};
        }
        this.mediaRecorder = new MediaRecorder(stream, this.options);
      }else{
        this.mediaRecorder = new MediaRecorder(stream);
      }
      this.mediaRecorder.start(10);
      let url = window.URL || window.webkitURL;
      this.videoElement = document.getElementById('webCamInterviewWelcome');
      this.videoElement.src = url ? url.createObjectURL(stream) : stream;
      this.videoElement.controls = false
      this.videoElement.play();

      this.mediaRecorder.ondataavailable = e => {
        if(this.chunks !== undefined){
         this.chunks.push(e.data);
        }
      };
    }

  onFailedStream() {
    console.error('Unable to get stream');
  }

  getWelcomeVideo(){
      let onSuccess = (response) => {
         _this.videoUrl = response.data.videoPath;
         _this.showVideo();
      },
      onError = (error) =>{
         console.log(error);
      };
      _this.CandidateInterviewService.getWelcomeVideo(_this.interviewId);
      _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  }

  getInterviewDetailsByCode(interviewCode){
      let onSuccess = (response) => {
         _this.interviewDetails = response.data;
      },
      onError = (error) =>{
         console.log(error);
      };
      _this.CandidateInterviewService.getInterviewDetailsByCode(interviewCode);
      _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  }

  trustSrc(src) {
      return _this.$sce.trustAsResourceUrl(src);
  }

  startInterview(){
      //if(!window.childWindow) {
      //  window.childWindow = _this.popupwindow(_this.$window.location.origin + "/#/ci/question", "question");
      //  window.childWindow.openedFromCandidateInstructionPage = true;
      //}
      //else{
      //  window.childWindow.focus();
      //}

      _this.$state.go('ci.question');
  }

  popupwindow(url, title, width, height, left, top) {
      if(!width){
        width = screen.width;
      }
      if(!height){
        height = (screen.height * 90)/100;
      }
      if(!left){
        left = 0;
      }
      if(!top){
        top = 0;
      }

      return _this.$window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);
    }

  checkForYouTube(videoPath){
       return videoPath.indexOf('youtube');
  }
}

