let _this;
export class PracticeTestQuestionController {
  /** @ngInject  */
  constructor($window, $location, $timeout, $sce, $state, $stateParams, $filter, mediaRecorderService, LoaderService, AuthService, PracticeTestQuestionService, $storage) {
    _this = this;
    _this.LoaderService = LoaderService;
    _this.LoaderService.show();
    _this.AuthService = AuthService;
    _this.$window = $window;
    _this.$location = $location;
    _this.$timeout = $timeout;
    _this.$sce = $sce;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.skillsetId = _this.$stateParams.skillsetId || 1;
    _this.quesNumber = 1;
    _this.mediaRecorderService = mediaRecorderService;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    _this.showQuestionPaper = true;
    _this.finishRecording = false;
    _this.isQuestionFinished = false;
    _this.isNext = false;
    _this.PracticeTestQuestionService = PracticeTestQuestionService;
    _this.$storage = $storage;
    _this.practiceVideoQuestions = [];
    _this.questionIndex = 0;
    _this.getPracticeVideoQuestion();

  }

  getPracticeVideoQuestion() {
    let onSuccess = (response) => {
      debugger;
      _this.practiceVideoQuestions = response.data.data;
      _this.showQuestionPaper = (_this.practiceVideoQuestions.length === 0) ? false : true;
      _this.startTimer();
      _this.questionData = _this.practiceVideoQuestions[_this.questionIndex];
      _this.questions = _this.practiceVideoQuestions[_this.questionIndex];
      _this.questions.questionFile = _this.questions.videoUrl.substr(_this.questions.videoUrl.lastIndexOf('https'), _this.questions.videoUrl.length)
      _this.activeQuestion = _this.questions;
      if (window.mobile) {
        //$(".saveNextMobile").hide();
    }
    },
    onError = (error) => {
      console.log(error);
    },
    oldPage = _this.$storage.getItem('oldPage') || "cp";
    if (oldPage === "ci") {
      _this.interviewId = _this.$storage.getItem('interviewId') || 1;
      _this.PracticeTestQuestionService.getPracticeQuestion("", _this.interviewId);
    } else {
      _this.PracticeTestQuestionService.getPracticeQuestion(_this.skillsetId, "");
    }
    _this.PracticeTestQuestionService.activePromise.then(onSuccess, onError);
  };

  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

  onStream(stream) {
    var mediarecorderoptions = _this.mediaRecorderService.initializeStartMediaRecorder(stream, 'webCamInterviewWelcome');
    _this.mediaRecorder = mediarecorderoptions.mediaRecorder;
    _this.options = mediarecorderoptions.options;
    _this.videoElement = mediarecorderoptions.element;

    _this.mediaRecorder.ondataavailable = e => {
      if (_this.chunks !== undefined) {
        _this.chunks.push(e.data);
      }
    };
  }

  onFailedStream() {
    console.error('Unable to get stream');
  }

  startTimer() {
    let display = document.getElementById("clock");
    let duration = _this.practiceVideoQuestions.length * 60;
    var timer = duration, minutes, seconds;
    var clockTimer = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (parseInt(minutes) === 0 && parseInt(seconds) === 0) {
        _this.isQuestionFinished = true;
      }
      display.textContent = 'Time Left : ' + minutes + ":" + seconds;
      if (minutes == 0) {
        $(display).css("color", "red");
      }
      if (--timer < 0) {
        timer = 0;
      }
    }, 1000);
  }

  saveAndGetNextQuestion() {
    _this.questionIndex++;
    _this.quesNumber++;
    if (_this.practiceVideoQuestions.length > _this.questionIndex) {
      _this.questionData = _this.practiceVideoQuestions[_this.questionIndex];
      _this.questions = _this.practiceVideoQuestions[_this.questionIndex];
      if (_this.questions.questionTypeId === 1 || _this.questions.questionTypeId === 5) {
        _this.questions.questionFile = _this.questions.videoUrl.substr(_this.questions.videoUrl.lastIndexOf('https'), _this.questions.videoUrl.length)
      } else {
        _this.questions.questionOption = _this.questions.options;
      }
      _this.activeQuestion = _this.questions;
      _this.isNext = !_this.isNext;
    } else {
      _this.isQuestionFinished = true;
    }
  }

  goBack() {
    let oldPage = _this.$storage.getItem('oldPage') || "cp";
    if (oldPage == "cp") {
      if (_this.$window.opener) {
        _this.$window.opener.location.replace('/candidateProfile/practice-video');
        _this.$window.close();
      }
      else {
        _this.$state.go('candidateProfile.practice-video');
      }
    } else {
      _this.$state.go('ci.instruction');
    }
  }
}


