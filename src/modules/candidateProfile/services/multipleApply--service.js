let _this,
     _activePromise;

export class multipleApplyService {
	/** @ngInject  */
    constructor($q,$http, AuthService,APP_CONSTANTS,UtilsService) {
        _this =  this;
        _this.$http = $http;
        _this.$q = $q;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
}  

   get activePromise() {
    return _activePromise;
  }

   getPortals(){
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/share-profile-portals', config);
   }

    shareProfilePortals(data){
      console.log(data);
      let config  = _this.UtilsService.postCofigObj();
     _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/share-profile-portals', data, config);
   }

   getShareProfilePortals(id){
     let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/profile/share-portals/'+id, config);
   }


}

