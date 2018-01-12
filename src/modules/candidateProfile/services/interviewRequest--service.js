let _this,
  _activePromise;

export class interviewRequestService {
	/** @ngInject  */
  constructor($q,$http,AuthService,APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.$q = $q;
    _this.AuthService = AuthService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }

  get activePromise() {
    return _activePromise;
  }

  getAllInterviewRequest(query){
    let candidateId = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/candidate-profile/'+candidateId+'/interviews'+query, config);
  }

}

