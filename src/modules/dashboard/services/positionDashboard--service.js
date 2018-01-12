let _this,
  _activePromise,
  _errorTranslationKey;
  
  export class PositionDashboardService {
	/** @ngInject  */
    constructor($http, AuthService, APP_CONSTANTS, UtilsService){
          _this =  this;
          _this.$http = $http;
          _this.AuthService = AuthService;
          _this.APP_CONSTANTS = APP_CONSTANTS;
          _this.UtilsService = UtilsService;
          _this.companyId = 1;
    }

     get activePromise() {
      return _activePromise;
    }

      get errorTranslationKey() {
      return _errorTranslationKey;
    }

     set errorTranslationKey(value) {
      _errorTranslationKey = value;
    }

    getlatestPositionList(){
        _this.companyId = _this.AuthService.user.companyId;
         let config  = _this.UtilsService.getCofigObj();   
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/position/updated-position/'+ _this.companyId , config);
      }

  }
