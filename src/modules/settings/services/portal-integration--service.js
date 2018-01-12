let _this,
_activePromise;

export class PortalIntegartionService {
    /** @ngInject  */
    constructor($http, AuthService, APP_CONSTANTS, UtilsService) {
        _this = this;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
        
    }

	get activePromise() {
		return _activePromise;
	}
  
  addupdateportalIntegration(data){
    let userId = _this.AuthService.user.userId,
    config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/settings/portalkeyinfo', data, config);
  }
  
  getPortalInfo(portalId){
    let config  = _this.UtilsService.getCofigObj();
    return  _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/settings/portalkeyinfo/'+portalId, config );
  }

  getJobPortalList(){
        let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/position/job-portals', config);
  }
	
}	
