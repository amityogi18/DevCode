let _this, _activePromise;

export class calendarService {
    /** @ngInject  */
    constructor($http,AuthService,APP_CONSTANTS, UtilsService) {
        _this = this;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
    }

    get activePromise() {
        return _activePromise;
    }

    saveCalendarPrefernce(data) {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/user/canlendar/setting', data, config)
    }

    getCalendarPrefernce() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/user/canlendar/setting', config)
    }

    googleAccess() {
        let config  = this.UtilsService.getCofigObj();
        _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/user/google/calenderAccess',config);
      }

    outlookAccess() {
      let config  = this.UtilsService.getCofigObj();
      _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/user/outlook/calenderAccess',config);
    }  

    googleAuthCode(authCode) {
        let config  = this.UtilsService.getCofigObj();
        _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/user/google/calenderAccess?code='+authCode,config);
      }
    
    outlookAuthCode(authCode) {
        let config  = this.UtilsService.getCofigObj();
        _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/user/outlook/calenderAccess?code='+authCode,config);
    }

    googleEvents() {
       let config  = this.UtilsService.getCofigObj();
      _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/user/google/calenderEvents',config);
    }

    outlookEvents() {
        let config  = this.UtilsService.getCofigObj();
       _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/user/outlook/calenderEvents',config);
     }

     getLocalEvents() {
        let userId = this.AuthService.user.userId;
        let config  = this.UtilsService.getCofigObj();
        _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/evaluator/upcoming-events/'+userId+'/10',config);
      }
}