let _this,
    _activePromise,
   _errorTranslationKey;
export class ThemeSettingsService {
	/** @ngInject  */
    constructor($q, $http,AuthService,APP_CONSTANTS, UtilsService) {
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

  

  addTheme(data){
    let config  = _this.UtilsService.postCofigObj();
    let userId = _this.AuthService.user.userId;
    data.userType = _this.AuthService.user.userType;
    return _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/setting/theme/user/'+userId+'/add', data, config);
  }

  getThemeList(){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/setting/theme/list', config);
  }

  getThemeByUserId(){
    let config  = _this.UtilsService.getCofigObj();
    let userId = _this.AuthService.user.userId;
    let userType = _this.AuthService.user.userType;
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/setting/theme/list/'+userId+'/'+userType, config);
  }
  
}

