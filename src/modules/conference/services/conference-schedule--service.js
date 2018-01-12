let _this,
    _activePromise;
export class ConferenceScheduleService {
	/** @ngInject  */
    constructor($http, $state, AuthService, APP_CONSTANTS, UtilsService) {
        _this = this;
        _this.$http = $http;
        _this.$state = $state;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
         _this.UtilsService = UtilsService;
    }

    get activePromise(){
      return _activePromise;
    }

    scheduleMeetingInvitation(data) {
    	console.log(data);
    	data.userId = _this.AuthService.user.userId || 1;
        data.companyId = _this.AuthService.user.companyId || 1;
        let config  = _this.UtilsService.postCofigObj();
    	_activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/conference/meeting/create', data, config);
    }	
}
