let _this,
    _activePromise;

export class conferenceMeetingService {
	/** @ngInject  */
    constructor($http, AuthService, APP_CONSTANTS, UtilsService) {
    	_this = this;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
    }

    get activePromise(){
      return _activePromise;
    }

    fetchUpcomingMeetings() {
    	var userId = _this.AuthService.user.userId || 1;
        var config  = _this.UtilsService.getCofigObj();
    	_activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/conference/meeting/upcoming/'+ userId, config);
    }

    fetchAllMeetings() {
        var userId = _this.AuthService.user.userId || 1;
        var config  = _this.UtilsService.getCofigObj();
        console.log('userid is:', userId);
       return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/conference/meeting/past/list/'+ userId, config);
    }

}
