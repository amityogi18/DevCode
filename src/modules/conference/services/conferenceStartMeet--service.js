let _this,
_activePromise;
export class conferenceStartMeetService {
	/** @ngInject  */
    constructor($http, $state, APP_CONSTANTS, UtilsService) {
        _this = this;
        _this.$http = $http;
        _this.$state = $state;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
    }

    get activePromise(){
    return _activePromise;
    }

    MeetingInfo(data) {
        let config  = _this.UtilsService.getCofigObj();
   		_activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/conference/meeting/'+ data, config);
    }
}