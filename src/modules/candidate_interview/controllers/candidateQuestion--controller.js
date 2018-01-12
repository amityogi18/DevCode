import _ from 'lodash';
let _this;

export class candidateQuestionController {
	/** @ngInject  */
  constructor(candidateQuestionService, $window, $element, $timeout, $filter, $sce) {
    console.log('In candidate question controller');
    _this = this;
    _this.candidateQuestionService = candidateQuestionService;
    _this.$window = $window;
    _this.$element = $element;
    _this.$timeout = $timeout;
    _this.$filter = $filter;
    _this.$sce = $sce;
    _this.quesNumber = 1;
    _this.init();
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

  goToQuestion(question){
    _this.activeQuestion = question;
    _this.activeQuestionNumber = parseInt(_this.activeQuestion.questionId) - 1;
  }

  saveAndGetNextQuestion(){
      _this.quesConfig = {
        interviewId : 1,
        candidateId : 1,
        questionId : _this.activeQuestion.questionId,
        answerType : _this.activeQuestion.questionType,
        answerOptions : _this.activeQuestion.answer,
        answerFile :  _this.activeQuestion.answerFile
    }
    _this.candidateQuestionService.getQuestions(_this.quesConfig);
    _this.$timeout(function(){
      _this.questions = _this.candidateQuestionService.questions;
      _this.questions.questionFile = _this.questions.questionFile.substr(_this.questions.questionFile.lastIndexOf('https'),_this.questions.questionFile.length)
      _this.questions.isFirstQuestion = false;
      if(_this.questions.successMessage){
          _this.questions.isLastQuestion = true;
      }else{
          _this.questions.isLastQuestion = false;
      }
     _this.quesNumber  = _this.quesNumber  + 1;
      _this.activeQuestion = _this.questions;   
    },1000);
//    if(_this.questions.length != _this.activeQuestionNumber+1) {
//      _this.activeQuestion.status = _this.activeQuestion.answer ? "Answered" : "Not Answered";
//      _this.activeQuestionNumber += 1;
//      _this.activeQuestion = _this.questions[_this.activeQuestionNumber];
//     // _this.disablePreviousButton = disablePreviousButton;
//    }
  }

  getPreviousQuestion(){
       _this.quesConfig = {
        interviewId : 1,
        candidateId : 1,
        questionId : _this.activeQuestion.questionId,
        answerType : _this.activeQuestion.questionType,
        answerOptions : _this.activeQuestion.answer,
        answerFile :  _this.activeQuestion.answerFile
    }
    _this.candidateQuestionService.getQuestions(_this.quesConfig);
    _this.$timeout(function(){
        _this.quesNumber  = _this.quesNumber  - 1;
      _this.activeQuestion = _this.questions;
    },1000);
//    if(_this.activeQuestionNumber > 0) {
//      _this.activeQuestion.status = _this.activeQuestion.answer ? "Answered" : "Not Answered";
//      _this.activeQuestionNumber -= 1;
//      _this.activeQuestion = _this.questions[_this.activeQuestionNumber];
//    }
  }

  pageUnloadEventHandler(e,windowEvent){
    let confirmationMessage = ' ';  // a space
    (e || windowEvent).returnValue = confirmationMessage;
    return confirmationMessage;
  }

  subscribePageUnloadHandler() {
    let eventFunc = _this.$window.attachEvent || _this.$window.addEventListener;
    _this.pageUnloadEvent = _this.$window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compatable
    let windowEvent = _this.$window.event;
    let pageUnloadEventHandler = _this.pageUnloadEventHandler;
    _this.pageUnloadEventHandlerWrapper = function(e){
      pageUnloadEventHandler(e, windowEvent);
    };
    eventFunc(_this.pageUnloadEvent, _this.pageUnloadEventHandlerWrapper );
  }

  init(){
    if(!_this.$window.openedFromCandidateInstructionPage){
      if(_this.$window.opener){
        _this.$window.opener.closeAssessmentWindow();
      }
      else {
        _this.$window.location.href = _this.$window.location.origin;
      }
    }
    _this.subscribePageUnloadHandler();
    _this.activeQuestionNumber = 0;
    _this.showQuestionPaper = true;
    _this.initConfig = {
        interviewId : 1,
        candidateId : 1,
        questionId : 0,
        answerType : '',
        answerOptions : '',
        answerFile : ''
    }
    _this.candidateQuestionService.getQuestions(_this.initConfig);
    _this.$timeout(function(){
      _this.questions = _this.candidateQuestionService.questions;
      _this.questions.questionFile = _this.questions.questionFile.substr(_this.questions.questionFile.lastIndexOf('https'),_this.questions.questionFile.length)
      _this.questions.isFirstQuestion = true;
      _this.quesNumber  = _this.quesNumber ;
      _this.activeQuestion = _this.questions;
    },1000);
  }
  
  trustSrc(src) {
     return _this.$sce.trustAsResourceUrl(src);
  }

  submitInterview(){
    _this.$window.close();
  }
}
