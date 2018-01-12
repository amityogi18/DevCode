let _this;
export class ExitVideoController {
  /** @ngInject  */
  constructor($window, $location, $sce, $state, $stateParams, $timeout, CandidateInterviewService, $storage) {
    _this = this;
    window.onbeforeunload = null;
    _this.$window = $window;
    _this.$location = $location;
    _this.$sce = $sce;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.$timeout = $timeout;
    _this.CandidateInterviewService = CandidateInterviewService;
    _this.$storage = $storage;
    _this.isYoutubeLink = false;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    _this.interviewId = _this.$storage.getItem('interviewId') || 1;
    _this.interviewCode = _this.$storage.getItem('interviewCode') || 1;
    _this.interviewDetails = {};
    _this.getExitVideo();
  }

  getExitVideo() {
    let onSuccess = (response) => {
      _this.videoUrl = response.data.videoPath;
      _this.redirectUrl = response.data.redirectUrl;
      _this.checkForYouTube(_this.videoUrl);
      _this.showExitVideo(response.data.videoPath);
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateInterviewService.getExitVideo(_this.interviewId);
    _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  };


  showVideo() {
    navigator.getUserMedia({ video: true }, this.onStream.bind(this), this.onFailedStream.bind(this));
    _this.movie = { src: _this.videoUrl };
    _this.$window.assessmentSubmissionHandler = _this.assessmentSubmissionHandler;
    _this.$window.closeAssessmentWindow = _this.closeAssessmentWindow;
  };

  exitInterview() {
    _this.$storage.removeItem('interviewId');
    _this.$storage.removeItem('interviewCode');
    _this.$storage.removeItem('redirectUrl');
    _this.$storage.removeItem('numberOfRetries');
    _this.$storage.removeItem('interviewRole');
    _this.$storage.removeItem('interviewType');
    _this.$storage.removeItem('totalDuration');

    if (window.mobile) {
      _this.$state.go('candidateProfile.interview-request');
    }
    else if (_this.redirectUrl && _this.redirectUrl != "") {
      _this.$window.location.replace(_this.redirectUrl);
    }
    else {
      if (_this.$window.opener) {
        _this.$window.opener.location.replace('#/candidateProfile/interview-request');
        _this.$window.close();
      } else {
        _this.$state.go('candidateProfile.interview-request')
      }
    }
  }

getInterviewDetailsByCode(interviewCode) {
  let onSuccess = (response) => {
    _this.interviewDetails = response.data;
  },
    onError = (error) => {
      console.log(error);
    };
  _this.CandidateInterviewService.getInterviewDetailsByCode(interviewCode);
  _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
}

trustSrc(src) {
  return _this.$sce.trustAsResourceUrl(src);
}

checkForYouTube(videoPath) {
  if (angular.isDefined(videoPath)) {
    _this.isYoutubeLink = videoPath.indexOf('youtube');
  }
}


showExitVideo(stream) {
  _this.videoElement = document.getElementById('exitVideo');
  if (angular.isDefined(_this.videoElement)) {
    _this.videoElement.src = stream;
    _this.videoElement.controls = false;
    _this.videoElement.play();
  }
}
}

