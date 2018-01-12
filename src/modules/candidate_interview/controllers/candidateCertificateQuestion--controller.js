let _this;
export class candidateCertificateQuestionController {
	/** @ngInject  */
  constructor($window, $location, $timeout, $state, $stateParams, CandidateCertificateService,$storage) {
    _this = this;
    _this.$window = $window;
    _this.$location = $location;
    _this.$timeout = $timeout;
    _this.$state =  $state;
    _this.$stateParams = $stateParams;
    _this.CandidateCertificateService = CandidateCertificateService;
    _this.$storage = $storage;
    _this.questionList = [];
    _this.answer = [];
    _this.quesNumber = 0;
    _this.showQuesNumber = 0;
    _this.isFirstQuestion = true;
    _this.isLastQuestion = false;
    _this.isSaving = false;
    _this.saveButtonText = "Save & Next";
    _this.markButton = "Mark for Review & Next";
    _this.init();
  }

  init(){
     _this.skillName = _this.$storage.getItem('skillName') || "Certification";
     _this.questionIdList = JSON.parse(_this.$storage.getItem('questionIdList'));
     _this.certificateId = JSON.parse(_this.$storage.getItem('certificateId'));
     _this.totalQuestions = JSON.parse(_this.$storage.getItem('totalQuestions'));
     _this.getFirstQuestion();
  }

  startTimer(){
        let display = document.getElementById("clock");
        let duration =  _this.questionIdList.length*60;
        var timer = duration, minutes, seconds;
        var clockTimer = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            if(parseInt(minutes) === 0 && parseInt(seconds) === 0){
                //clearInterval(clockTimer);
                _this.submitCertification();
            }
            display.textContent = 'Time Left : '+ minutes + ":" + seconds;
            if(minutes == 0){
              $(display).css("color", "red");
            }
            if (--timer < 0) {
                timer = 0;
            }
        }, 1000);
  }
  
  getFirstQuestion(){
      _this.showQuestionPaper = true;
      let onSuccess = (response) => {
             _this.questions = response.data.questionData;
             _this.answer =  response.data.answerData;
             _this.activeQuestion = _this.questions;
             _this.showQuesNumber = 1;
             _this.showHideButton('FIRSTQUESTION');
             _this.startTimer();
      },
      onError = (error) => {
          console.log(error);
      },
      questionId = _this.questionIdList[_this.quesNumber].questionId || 1;
      _this.CandidateCertificateService.getCertificationQuestion(_this.certificateId, questionId);
      _this.CandidateCertificateService.activePromise.then(onSuccess, onError);
  }

  goToQuestion(question, questionIndex){
    _this.showQuesNumber  = questionIndex + 1;
    _this.quesNumber = questionIndex;
    let onSuccess = (response) => {
               _this.questions = response.data.questionData;
               _this.answer =  response.data.answerData;
               _this.activeQuestion = _this.questions;
               _this.setOptionChecked(_this.questions.questionType);
               _this.showHideButton('GOTOQUESTION');
        },
        onError = (error) => {
            console.log(error);
        };
    _this.CandidateCertificateService.getCertificationQuestion(_this.certificateId, question.questionId);
    _this.CandidateCertificateService.activePromise.then(onSuccess, onError);
  }
  
  saveAnswer(answerType){
      if(answerType === 'MARKED'){
         _this.markButton = 'Marking and Saving...';
      }else{
         _this.saveButtonText = "Saving...";
      }
      let onSuccess = (response) => {
           if(_this.showQuesNumber < _this.questionIdList.length){
             _this.quesNumber++;
             _this.showQuesNumber++;
           }
           _this.showHideButton(answerType);
           _this.getNextQuestion();
           _this.markButton = 'Mark for Review & Next';
           _this.saveButtonText = "Save & Next";

      },
      onError = (error) => {
          _this.markButton = 'Mark for Review & Next';
          _this.saveButtonText = "Save & Next";
          console.log(error);
      },
      candidateAnswerData = {
         questionId :  _this.activeQuestion.questionId,
         answerId : _this.getAnswerArray(),
         candidateCertificationId : _this.certificateId
      };
      if(answerType){
          if(candidateAnswerData.answerId.length === 0){
             _this.changeColorOfQuestionPalette("NOT ANSWERED");
          }else{
          _this.changeColorOfQuestionPalette(answerType);
          }
      }
      _this.CandidateCertificateService.saveAnswer(candidateAnswerData);
      _this.CandidateCertificateService.activePromise.then(onSuccess, onError);
  }

  getNextQuestion(){
     if(_this.quesNumber < _this.questionIdList.length){
        let onSuccess = (response) => {
               _this.questions = response.data.questionData;
               _this.answer =  response.data.answerData;
               _this.activeQuestion = _this.questions;
               _this.setOptionChecked(_this.questions.questionType);
        },
        onError = (error) => {
            console.log(error);
        },
        questionId = _this.questionIdList[_this.quesNumber].questionId || 1;
        _this.CandidateCertificateService.getCertificationQuestion(_this.certificateId, questionId);
        _this.CandidateCertificateService.activePromise.then(onSuccess, onError);
     }
  }

  getAnswerArray(){
      let ansArr = [];
      if(_this.activeQuestion.options.length > 0){
          for(let i = 0; _this.activeQuestion.options.length > i; i++){
              let optionId = _this.activeQuestion.options[i].optionId;
              let element = _this.activeQuestion.questionType === 4 ? "#cb_"+optionId : "#rb_"+optionId;
              if ($(element).is(':checked')){
                 ansArr.push(optionId);
              }
          }
      }
      return ansArr;
  }

  getPreviousQuestion(){
    _this.quesNumber-- ;
    _this.showQuesNumber--;
    _this.showHideButton('PREVIOUS');
    let onSuccess = (response) => {
           _this.questions = response.data.questionData;
           _this.answer =  response.data.answerData;
           _this.activeQuestion = _this.questions;
           _this.setOptionChecked(_this.questions.questionType);
    },
    onError = (error) => {
        console.log(error);
    },
    questionId = _this.questionIdList[_this.quesNumber].questionId;
    _this.CandidateCertificateService.getCertificationQuestion(_this.certificateId, questionId);
    _this.CandidateCertificateService.activePromise.then(onSuccess, onError);

  }
  
  submitCertification(){
      let onSuccess = (response) => {
          _this.$storage.removeItem('skillName');
          _this.$storage.removeItem('skillId');
          _this.$storage.removeItem('questionIdList');
          _this.$storage.removeItem('certificateId');
          _this.$storage.removeItem('totalQuestions');
          //_this.$window.close();
          if(_this.$window.opener){
             let domainUrl = _this.$location.$$host == 'localhost' ? "/#/" : "/app/#/";
            _this.$window.opener.location.replace(domainUrl + 'candidateProfile/certificate-exit/' +_this.certificateId);
            _this.$window.close();
          }else{
            _this.$state.go('candidateProfile.certificate-exit', { certificateId : _this.certificateId });
          }
      },
      onError = (error) => {
          console.log(error);
      },
      certificateId = _this.certificateId || _this.$storage.getItem('certificateId');
      _this.CandidateCertificateService.submitCertification(certificateId);
      _this.CandidateCertificateService.activePromise.then(onSuccess, onError);
  }

  showHideButton(answerType){
     if(angular.isDefined(answerType) && answerType === 'SUBMIT' && _this.showQuesNumber >= _this.questionIdList.length){
         _this.submitCertification();
     }
     if(_this.showQuesNumber >= _this.questionIdList.length){
          _this.isLastQuestion = true;
     }else{
          _this.isLastQuestion = false;
     }
     if(_this.showQuesNumber === 1){
         _this.isFirstQuestion = true;
     }else{
         _this.isFirstQuestion = false;
     }
  }

  changeColorOfQuestionPalette(answerType){
     for(let i = 0; _this.questionIdList.length > i; i++){
        if( _this.activeQuestion.questionId == _this.questionIdList[i].questionId){
           _this.questionIdList[i].status = answerType;
        }
     }
  }

  setOptionChecked(questionType){
      _this.$timeout(function () {
          for(let i = 0; _this.answer.length > i; i++){
              let answered = _this.answer[i];
              let element = questionType === 4 ? "#cb_"+answered : "#rb_"+answered;
              $(element).attr('checked', 'checked');
              $(element).prop('checked', true);
          }
      },100);
  }
}
