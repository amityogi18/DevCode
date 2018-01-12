let _this;

export class PracticeVideoQuestionService {
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
  
  getPracticeQuestion(skillId){
      let  config  = _this.UtilsService.getCofigObj();
      let url = _this.APP_CONSTANTS.SERVER_URL + "/practicevideoquestions?skillId="+skillId;
      _activePromise = this.$http.get(url, config);
  }
}

