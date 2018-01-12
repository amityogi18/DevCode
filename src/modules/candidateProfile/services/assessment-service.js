let _this,
    _activePromise,
    _errorTranslationKey,
    _questions;

export class AssessmentService {
	/** @ngInject  */
  constructor($http, APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }

  get activePromise() {
    return _activePromise;
  }

  get errorTranslationKey() {
    return _errorTranslationKey;
  }

  set errorTranslationKey(value) {
    _errorTranslationKey = value;
  }

  get questions() {
    return _questions;
  }

  set questions(value) {
    _questions = value;
  }

  getFirstQuestions(interviewId){
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/practicevideoquestions?interviewId='+interviewId, config);

  }

  getQuestions(interviewId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/practicevideoquestions?interviewId='+interviewId, config);
  }
}

