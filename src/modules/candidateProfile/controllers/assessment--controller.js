let _this, modalInstanceOnBlur;
const modalCloseSeconds = 5;
export class assessmentController {
	/** @ngInject  */
  constructor($interval, $window, $timeout, $location, $uibModal, AssessmentService,$sce, $storage) {
    _this = this;
    _this.$interval = $interval;
    _this.$window = $window;
    _this.$timeout = $timeout;
    _this.$location = $location;
    _this.$sce = $sce;
    _this.$storage = $storage;
    _this.modal = $uibModal;
    _this.AssessmentService = AssessmentService;
    _this.interviewId  = _this.$storage.getItem('interviewId') || 1;
    _this.showQuestionPaper = true;
    _this.init();
    _this.watchBlur();
    _this.watchWindowClose();
    _this.timeoutStarted = false;
  }

  markReviewAndGetNextQuestion(){
    _this.activeQuestion.status = "Marked";
    if(_this.questions.length != _this.activeQuestionNumber+1) {
      _this.activeQuestionNumber += 1;
      _this.activeQuestion = _this.questions[_this.activeQuestionNumber];
    }
  }

  clearResponse(){
    _this.activeQuestion.answer = null;
    _this.activeQuestion.status = "Not Answered";
  }

  getPreviousQuestion(){
    if(_this.activeQuestionNumber > 0) {
      _this.activeQuestion.status = _this.activeQuestion.answer ? "Answered" : "Not Answered";
      _this.activeQuestionNumber -= 1;
      _this.activeQuestion = _this.questions[_this.activeQuestionNumber];
    }
  }

  answerSelected(){
    angular.forEach(_this.questions, function(question){
        question.answer = _this.activeQuestion.answer;
    });
  }

  saveAndGetNextQuestion(){
     let onSuccess = (response) => {
        _this.questions = response.data;
        _this.activeQuestionNumber += 1;
        _this.activeQuestion = _this.questions;
        },
        onError = (error) => {

        };
      _this.activeQuestion.status = _this.activeQuestion.answer ? "Answered" : "Not Answered";
      if(_this.questions.length != _this.activeQuestionNumber+1) {

      }
  }

  goToQuestion(question){
    _this.activeQuestion = question;
    _this.activeQuestionNumber = parseInt(_this.activeQuestion.questionId) - 1;
  }

  unsubscribePageUnloadHandler(){
    let detachPageUnloadEventListener = _this.$window.detachEvent || _this.$window.removeEventListener;
    detachPageUnloadEventListener(_this.pageUnloadEvent, _this.pageUnloadEventHandlerWrapper);
  }

  saveResultsToLocalStorage(){
    _this.$storage.setItem('assessment-result', JSON.stringify(_this.questions));
  }

  submitAssessment(){
    let modalInstance = _this.modal.open({
      animation: true,
      ariaDescribedBy: 'modal-body',
      templateUrl: 'candidateProfile/partials/assessment-confirm-submission.jade',
      controller: 'assessmentConfirmSubmissionController',
      controllerAs: '$ctrl',
      size: 'sm'
    });

    let self = _this;
    modalInstance.result.then(function () {
      self.saveResultsToLocalStorage();
      self.$window.opener.assessmentSubmissionHandler();
      self.$window.close();
    });
  }
  
  bindWindowClose() {
    $(window).on('beforeunload', function(){
      return 'Are you sure you want to leave?';
    });
  }

  watchWindowClose() {
    var self = _this;
    self.bindWindowClose();
    $(window).on('unload', function(){
      self.saveResultsToLocalStorage();
      self.$window.opener.assessmentSubmissionHandler();
    });
  }

  selfInfoPopup() {
    let modalInstance = this.modal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'candidateProfile/partials/info.jade',
      controller: 'infoModalController',
      controllerAs: 'infoModalCtrl',
      windowClass: 'info-modal',
      backdrop: 'static',
      keyboard: false
    });
    var self = _this;
    $(window).off('beforeunload');
    modalInstance.result.then(() => {
      self.saveResultsToLocalStorage();
      self.$window.opener.assessmentSubmissionHandler();
      self.$window.close();
    });
  }

  watchBlur() {
//    $(window).on('blur', ()=>{
//      _this.focus = false;
//      modalInstanceOnBlur = this.modal.open({
//        ariaLabelledBy: 'modal-title',
//        ariaDescribedBy: 'modal-body',
//        templateUrl: 'packages/candidateProfile/partials/warning.html',
//        controller: 'warningModalController',
//        controllerAs: 'warningModalCtrl',
//        windowClass: 'warning-modal',
//        backdrop: 'static',
//        keyboard: false,
//        appendTo: window.childWindow
//      });
//      $(window).off('beforeunload');
//      var self = _this;
//      _this.timeoutStarted = true;
//      self.timeout = _this.$timeout(()=>{
//        _this.timeoutStarted = false;
//        modalInstanceOnBlur.dismiss();
//        self.saveResultsToLocalStorage();
//        self.$window.opener.assessmentSubmissionHandler();
//      }, modalCloseSeconds * 1000);
//
//
//      modalInstanceOnBlur.result.then(function (selectedItem) {
//        _this.$timeout.cancel(self.timeout);
//        _this.timeoutStarted = false;
//        self.saveResultsToLocalStorage();
//        self.$window.opener.assessmentSubmissionHandler();
//        self.$window.close();
//      }, function() {
//        self.bindWindowClose();
//      });
//
//      /* _this.closeAssessmentWindow();
//       _this.assessmentSubmissionHandler();*/
//    });
//    $(window).on('focus', ()=>{
//      if(!_this.focus) {
//        _this.$timeout.cancel(_this.timeout);
//        if(!_this.timeoutStarted) {
//          _this.selfInfoPopup();
//          $(window).off('blur');
//        }
//
//      }
//    });
  }

  submitAssessmentOnTimeout(){
    let modalInstance = _this.modal.open({
      animation: true,
      ariaDescribedBy: 'modal-body',
      templateUrl: 'candidateProfile/partials/assessment-timeout.jade',
      controller: 'assessmentTimeoutController',
      controllerAs: '$ctrl',
      size: 'sm'
    });

    let self = _this;
    let submitAssessment = function(){
      self.unsubscribePageUnloadHandler()
      self.saveResultsToLocalStorage();
      self.$window.opener.assessmentSubmissionHandler();
      self.$window.close();
    };
    modalInstance.result.then(function () {
      submitAssessment();
    }, function(){
      submitAssessment();
    });
  }

  displayContent(args){
    _this.showQuestionPaper = false;
    _this.showInsructions = false;
    _this.showProfile = false;

    if(args === 'questionPaper'){
      _this.showQuestionPaper = true;
    }
    else if(args === 'instructions'){
      _this.showInsructions = true;
    }
    else if(args === 'profile'){
      _this.showProfile = true;
    }
  }

  startTimer() {
    let testDuration = _this.testDuration;
    let self = _this;
    let timer = _this.$interval(function () {
      if(testDuration.minute === 0 && testDuration.second === 0){
        self.$interval.cancel(timer);
        self.submitAssessmentOnTimeout();
      }
      else if(testDuration.second === 0){
        testDuration.minute--;
        testDuration.second = 120;
      }else {
        testDuration.second--;
      }
      _this.timer = "Time Left " +  testDuration;
    },1000);
  }

  getQuestions(){
    _this.AssessmentService.getQuestions();
  }

  init(){
    //if(!_this.$window.openedFromCandidatePage){
    //  if(_this.$window.opener){
    //    _this.$window.opener.closeAssessmentWindow();
    //  }
    //  else {
    //    _this.$window.location.href = _this.$window.location.origin;
    //  }
    //}
    _this.testDuration = {hour: '00', minute: 0, second: 120};
    _this.activeQuestionNumber = 1;
    _this.$storage.setItem('assessment-result', JSON.stringify([{}]));
    _this.getFirstQuestions();
  }

  getFirstQuestions(){
       let onSuccess = (response) => {
           _this.showQuestionPaper = true;
           _this.questions = response.data;
           value['preparationTime'] = 0;
           value['responseTime'] = 0;
           _this.activeQuestion = _this.questions[0];
           _this.startTimer();
        },
        onError = (error) => {
          _this.showQuestionPaper = false;
        };
        _this.AssessmentService.getFirstQuestions(_this.interviewId);
        _this.AssessmentService.activePromise.then(onSuccess, onError);
  }
  
  trustSrc(src) {
     return _this.$sce.trustAsResourceUrl(src);
  }
}