let _this;
export class candidateInterviewQuestionController {
  /** @ngInject  */
  constructor($rootScope, $window, $location, $timeout, $sce, $state, $stateParams, $filter, mediaRecorderService, candidateQuestionService, CandidateInterviewService, LoaderService, AuthService, $storage) {
    _this = this;
    document.addEventListener("contextmenu", function (e) {
      alert('Right Click is Not Allowed.');
      e.preventDefault();
    }, false);
    _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.$location = $location;
    _this.$timeout = $timeout;
    _this.$sce = $sce;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.$filter = $filter;
    _this.LoaderService = LoaderService;
    _this.AuthService = AuthService;
    _this.$storage = $storage;
    _this.quesNumber = 1;
    _this.candidateQuestionService = candidateQuestionService;
    _this.mediaRecorderService = mediaRecorderService;
    _this.candidateInterviewService = CandidateInterviewService;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    _this.interviewId = _this.$storage.getItem('interviewId') || 1;
    _this.interviewCode = _this.$storage.getItem('interviewCode') || 1;
    _this.interviewDetails = {};
    _this.isFirstQuestion = true;
    _this.isInterviewFinish = false;
    _this.showQuestionPaper = true;
    _this.finishRecording = false;
    _this.isNext = false;
    _this.saveButtonText = "Save & Next";
    _this.init();
    _this.countdownFinish = false;
    _this.$rootScope.$on("countdownFinish", function () {
      _this.countdownFinish = true;
    });
  }

  init() {
    _this.activeQuestionNumber = 0;
    _this.getFirstQuestion();
  }

  onQuestionUpdate(question) {
    _this.activeQuestion.answerFile = question.answerFile;
    console.log(question.answerFile);
  }

  getFirstQuestion() {
    let onSuccess = (response) => {
      if (response.data.successMessage) {
        _this.showQuestionPaper = false;
      } else {
        _this.showQuestionPaper = true;
        _this.questionData = response.data;
        _this.questions = response.data;
        _this.questions.questionFile = _this.questions.questionFile.substr(_this.questions.questionFile.lastIndexOf('https'), _this.questions.questionFile.length)
        _this.activeQuestion = _this.questions;
        _this.initializeCountdownFinish();
        _this.startTimer();
        _this.implimentTestValidation();

      }
    },
      onError = (error) => {
        console.log(error);
      },
      initialQuestionData = {
        interviewId: _this.interviewId,
        questionId: 0,
        answerType: '',
        answerOptions: '',
        answerFile: ''
      };
    _this.candidateQuestionService.saveAndGetNextQuestion(initialQuestionData);
    _this.candidateQuestionService.activePromise.then(onSuccess, onError);
  }

  implimentTestValidation() {
    if (_this.$location.$$path.indexOf("question") >= 0) {
      window.onbeforeunload = function () {
        $('#payment-model-popup').show();
        _this.submitInterview();
        return false;
      };
      window.location.hash = "!";
      window.location.hash = "!";
      window.onhashchange = function () { window.location.hash = "!"; }
      function disableBack() { window.history.forward(); }
      window.onload = disableBack();
      window.onpageshow = function (evt) { if (evt.persisted) { window.alert("As"); disableBack(); } }
    }
  }

  popupwindow(url, title, width, height, left, top) {
    if (!width) { width = screen.width; }
    if (!height) { height = (screen.height * 90) / 100; }
    if (!left) { left = 0; }
    if (!top) { top = 0; }
    return _this.$window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  }

  startInterview() {
    if (!window.childWindow) {
      window.childWindow = _this.popupwindow(_this.$window.location.origin + "/#/ci/question", "question");
      window.childWindow.openedFromCandidateInstructionPage = true;
    }
    else {
      window.childWindow.focus();
    }
  }

  closeAssessmentWindow() {
    window.childWindow.close();
    window.childWindow = null;
  }

  assessmentSubmissionHandler() {
    window.childWindow = null;
    window.location.hash = '';
  }

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
    let totalDuration = parseInt(_this.$storage.getItem('totalDuration'));
    let duration = totalDuration * 60;
    var timer = duration, minutes, seconds;
    var clockTimer = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (parseInt(minutes) === 0 && parseInt(seconds) === 0) {
        _this.submitInterview();
      }
      display.textContent = 'Time Left : ' + minutes + ":" + seconds;
      if (minutes == 1 || minutes == 0) {
        $(display).css("color", "red");
      }
      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  }

  goToQuestion(question) {
    _this.activeQuestion = question;
    _this.activeQuestionNumber = parseInt(_this.activeQuestion.questionId) - 1;
  }

  saveAndGetNextQuestion() {
    _this.saveButtonText = "Saving...";
    let onSuccess = (response) => {
      _this.saveButtonText = "Save & Next";
      if (response.data.successMessage) {
        _this.isInterviewFinish = true;
        _this.questions.isLastQuestion = true;
      }
      else {
        _this.questions = response.data;
        _this.questions.questionFile = _this.questions.questionFile.substr(_this.questions.questionFile.lastIndexOf('https'), _this.questions.questionFile.length);
        _this.quesNumber = _this.quesNumber + 1;
        _this.activeQuestion = _this.questions;
        _this.isNext = !_this.isNext;
        _this.initializeCountdownFinish();
      }
    },
      onError = (error) => {
        _this.saveButtonText = "Save & Next";
        console.log(error);
      };
    let answerData = {};
    if (_this.activeQuestion.responseTypeId === 2) {
      answerData = {
        interviewId: _this.interviewId,
        questionId: _this.activeQuestion.questionId,
        answerType: _this.activeQuestion.responseTypeId,
        answerOptions: _this.activeQuestion.answer,
        answerFile: _this.activeQuestion.answerFile,
        answerText: _this.activeQuestion.answer
      };
      _this.candidateQuestionService.saveAndGetNextQuestion(answerData, _this.activeQuestion.responseTypeId);
      _this.candidateQuestionService.activePromise.then(onSuccess, onError);
    }
    else if (_this.activeQuestion.responseTypeId === 1 || _this.activeQuestion.responseTypeId === 5) {
      _this.finishRecording = true;
      _this.isNext = !_this.isNext;
      _this.$timeout(() => {
        answerData = {
          interviewId: _this.interviewId,
          questionId: _this.activeQuestion.questionId,
          answerType: _this.activeQuestion.responseTypeId,
          answerOptions: _this.activeQuestion.answer,
          answerFile: _this.activeQuestion.answerFile,
          answerText: _this.activeQuestion.answer
        };
        _this.candidateQuestionService.saveAndGetNextQuestion(answerData, _this.activeQuestion.responseTypeId);
        _this.candidateQuestionService.activePromise.then(onSuccess, onError);
      }, 1000);
    }
    else {
      answerData = {
        interviewId: _this.interviewId,
        questionId: _this.activeQuestion.questionId,
        answerType: _this.activeQuestion.responseTypeId,
        answerOptions: _this.activeQuestion.answer,
        answerFile: _this.activeQuestion.answerFile
      };

      if (_this.activeQuestion.responseTypeId === 3) {
        let answerOptions = "";
        for (let key in answerData.answerOptions) {
          if (answerData.answerOptions[key]) {
            answerOptions += key + ",";
          }
        }
        answerData.answerOptions = answerOptions.substring(0, answerOptions.length - 1);
      }

      _this.candidateQuestionService.saveAndGetNextQuestion(answerData, _this.activeQuestion.responseTypeId);
      _this.candidateQuestionService.activePromise.then(onSuccess, onError);
    }
  }

  pageUnloadEventHandler(e, windowEvent) {
    let confirmationMessage = ' ';  // a space
    (e || windowEvent).returnValue = confirmationMessage;
    return confirmationMessage;
  }

  subscribePageUnloadHandler() {
    let eventFunc = _this.$window.attachEvent || _this.$window.addEventListener;
    _this.pageUnloadEvent = _this.$window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compatable
    let windowEvent = _this.$window.event;
    let pageUnloadEventHandler = _this.pageUnloadEventHandler;
    _this.pageUnloadEventHandlerWrapper = function (e) {
      pageUnloadEventHandler(e, windowEvent);
    };
    eventFunc(_this.pageUnloadEvent, _this.pageUnloadEventHandlerWrapper);
  }

  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

  submitInterview() {
    let onSuccess = (response) => {
      if (response.data.successMessage) {
        $('#payment-model-popup').show();
        _this.$state.go('ci.exit');
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.candidateInterviewService.submitInterview(_this.interviewId);
    _this.candidateInterviewService.activePromise.then(onSuccess, onError);
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

  goBack() {
    _this.$storage.removeItem('interviewId');
    _this.$storage.removeItem('interviewCode');
    if (_this.$window.opener) {
      _this.$window.opener.location.replace('#/candidateProfile/interview-request');
      _this.$window.close();
    } else {
      _this.$state.go('candidateProfile.interview-request');
    }
  }

  initializeCountdownFinish() {
    _this.countdownFinish = (_this.activeQuestion.responseTypeId === 1 || _this.activeQuestion.responseTypeId === 5) ? false : true;
  };

}


