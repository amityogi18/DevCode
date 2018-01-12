let _this,
_activePromise ;

export class DemoService {
	/** @ngInject  */
    constructor($http, APP_CONSTANTS) {
        _this =  this;
        _this.$http = $http;
        _this.APP_CONSTANTS = APP_CONSTANTS;
    }

    get activePromise(){
    return _activePromise;
    }

    validateConference(confid){

        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/conference/quickmeeting/details/' + confid);
    }

    conferenceEnd(confid) {
        var data = {};
        data.meetingId = confid;
         _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/conference/quickmeeting/status', data);
    }
   invitetoConference(data) {
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/conference/quickmeeting/participants', data);
   }
    
    
}
