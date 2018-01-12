let _this,
_activePromise ;

export class ContactService {
	/** @ngInject  */
    constructor($http, $state, AuthService, APP_CONSTANTS, UtilsService, Upload) {
        _this =  this;
        _this.$http = $http;
        _this.$state = $state;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
        _this.Upload = Upload;
    }

    get activePromise(){
    return _activePromise;
    }

     getContactData(query){
        let config  = _this.UtilsService.getCofigObj();
        let companyId = _this.AuthService.user.companyId;
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/conference/contacts/list/all/'+companyId  +query, config);
    }
    getAllContactList() {
        let config  = _this.UtilsService.getCofigObj();
        let companyId = _this.AuthService.user.companyId;
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/conference/contacts/list/all/'+companyId, config);
    }
    addContact(data){
      let config  = _this.UtilsService.postCofigObj();
      data.companyId = _this.AuthService.user.companyId;
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/conference/contacts/create', data, config);
    }
    
    deleteContact(data){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/conference/contacts/delete',data ,config);
    }
    
    
     updateContact(id, data) {
        let config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/conference/contacts/update/'+ id , data, config);
    }
    
    
    importContactList(data){
        data.companyId = _this.AuthService.user.companyId;
        let config  = _this.UtilsService.postCofigObj();
        _activePromise =
          _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/conference/contacts/import',
            data : data,
            headers: config.headers
          });
  }
}
