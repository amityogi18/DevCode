let _this,
    _activePromise,
    _errorTranslationKey;
    
export class NotificationSettingsService {
	/** @ngInject  */
  constructor($q, $http, AuthService, APP_CONSTANTS, UtilsService) {
      _this=  this;
      _this.$q = $q;
      _this.$http = $http;
      _this.AuthService = AuthService;
      _this.APP_CONSTANTS = APP_CONSTANTS;
      _this.UtilsService = UtilsService;
  }
  
  get activePromise() {
    return _activePromise;
  }

  get errorTranslationKey() {
    return _errorTranslationKey;
  }

  
  getNotifications(){
    let userId = _this.AuthService.user.userId,
        userType = _this.AuthService.user.userType,
    config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/user/notification/'+ userId +'/'+userType, config );   
  }
  
  toggleNotification(data){
    data.userCandidateId = _this.AuthService.user.userId || 1;
    data.userType = _this.AuthService.user.userType;
    let config  = _this.UtilsService.putCofigObj();
    let apiUrl = _this.APP_CONSTANTS.SERVER_URL +'/user/notification';
    _activePromise = _this.$http.put(apiUrl,data, config);    
  }
}

