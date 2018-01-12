var _activePromise,
  _errorTranslationKey,
  _questionList,
  _questionDetails,
  _questionId,
  _recruiterId,
  _questionDescriptionList,
  _this;

/*
 @name questionBankSaService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */

export class QuestionBankService {
	 /** @ngInject  */
  constructor($http, Upload, $state, UtilsService, APP_CONSTANTS, AuthService) {
    _this = this;  
    _this.$http = $http;
    _this.Upload = Upload;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.AuthService = AuthService;
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

    getGeneralQuestionData(query){
        let config  = _this.UtilsService.getCofigObj();
        let companyId = 1;
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/questions/getquestions/'+companyId+''+query, config);
    }
    
    getCustomQuestionData(query, companyId){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/questions/getquestions/'+companyId+''+query, config);
    }
    
    getPracticeQuestionData(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/practicevideoquestions'+query, config);
    }
  
  importQuestionList(data, companyId){
    let config  = _this.UtilsService.postCofigObj();
    _activePromise =
      _this.Upload.upload({
        url: _this.APP_CONSTANTS.SERVER_URL +'/user/setting/customquestion/import?companyId='+companyId,
        data : data,
        headers: config.headers
      });
  }
  
  importCustomQuestionList(data, companyId){
    let config  = _this.UtilsService.postCofigObj();
    _activePromise =
      _this.Upload.upload({
        url: _this.APP_CONSTANTS.SERVER_URL +'/user/setting/customquestion/import?companyId='+companyId,
        data : data,
        headers: config.headers
      });
  }
  
  deleteQuestion(id){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/questions/delete-questions',id ,config);
    }
    
    setPracticeQuestion(practiceQuestionIds){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/questions/set-practice-questions',practiceQuestionIds ,config);
    }
}
