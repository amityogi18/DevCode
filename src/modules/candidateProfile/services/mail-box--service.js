let _this,
    _activePromise;

export class mailBoxService{
  /** @ngInject  */
  constructor($q,$http,AuthService,APP_CONSTANTS, UtilsService){
    _this= this;
    _this.$q = $q;
    _this.$http = $http;
    _this.AuthService = AuthService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }  
  get activePromise() {
    return _activePromise;
  }
  
  getMailList(query){
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/imap/inbox'+query, config);   
  }
}



