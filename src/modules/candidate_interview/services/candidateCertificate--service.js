let _this,
    _questions,
    _saveSuccess,
    _answers,
    _submitSucces,
    _activePromise;

export class CandidateCertificateService {
	/** @ngInject  */
  constructor($http, $window, APP_CONSTANTS, UtilsService, AuthService) {
    _this = this;
    _this.$http = $http;
    _this.$window = $window;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
    _this.AuthService = AuthService;
  }

  get activePromise() {
    return _activePromise;
  }
  
  set questions(value) {
    _questions = value;
  }
  
  get questions(){
      return _questions;
  }
  
  get answers() {
    return _answers;
  }
  
  get submitMessage(){
      return _submitSucces;
  }
    
  
  get successMessage(){
      return _saveSuccess;
  }

  getQuestionIdList(skillId){
       let candidateId = _this.AuthService.user.userId;
       let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/certification/questionsids/'+skillId+'/'+candidateId, config);
  }

  getQuestionCertification(certificateId , questionId){
    let  config  = _this.UtilsService.getCofigObj();
    let url = _this.APP_CONSTANTS.SERVER_URL + "/candidate/certification/question/" + certificateId + '/' + questionId;
    _activePromise = this.$http.get(url, config);
  }

  getCertificationQuestion(certificateId , questionId){
      let  config  = _this.UtilsService.getCofigObj();
      let url = _this.APP_CONSTANTS.SERVER_URL + "/candidate/certification/question/" + certificateId + '/' + questionId;
      _activePromise = this.$http.get(url, config);
  }
  
  saveAndGetNextQuestion(candidateAnswerData){
    let config  = _this.UtilsService.postCofigObj();
    let url = _this.APP_CONSTANTS.SERVER_URL + "/candidate/certification/answer";
    _activePromise = this.$http.post(url, candidateAnswerData, config);
  }

  saveAnswer(candidateAnswerData){
      let config  = _this.UtilsService.postCofigObj();
      let url = _this.APP_CONSTANTS.SERVER_URL + "/candidate/certification/answer";
      _activePromise = this.$http.post(url, candidateAnswerData, config);
  }
  
  submitCertification(certificationId){
    let  config  = _this.UtilsService.getCofigObj();
    let url = _this.APP_CONSTANTS.SERVER_URL + "/candidate/certification/score/" + certificationId;
    _activePromise = this.$http.get(url, config);
  }
}

