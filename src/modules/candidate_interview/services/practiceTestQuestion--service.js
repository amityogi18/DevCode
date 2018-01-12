let _this,
    _activePromise;

export class PracticeTestQuestionService {
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
  
  getPracticeQuestion(skillId, interviewId){
      let config = _this.UtilsService.getCofigObj();
      let url = _this.APP_CONSTANTS.SERVER_URL + "/practicevideoquestions?limit=10&page=1&skillId="+ skillId +"&interviewId="+ interviewId;
      _activePromise = this.$http.get(url, config);
  }
}

