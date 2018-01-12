let _activePromise,
  _errorTranslationKey,
  _clientsList,
  _clientsDetails,
  _clientsId,
  _recruiterId,
  _clientsDescriptionList,
  _this;

/*
 @name clientsService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */

export class ClientsService {
	 /** @ngInject  */
  constructor($http,Upload,$state, APP_CONSTANTS, UtilsService) {
    _this = this;  
    _this.$http = $http;
    _this.Upload = Upload;
    _this.$state = $state;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
    
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

  get clientsDetails(){
    return _clientsDetails;
  }

  get recruiterId() {
    return _recruiterId;
  }

  get clientsId() {
    return _clientsId;
  }

  get clientsDescriptionList() {
    return _clientsDescriptionList;
  }

  set clientsDescriptionList(value) {
    _clientsDescriptionList = value;
  }
  /* End getter and setter here */


  /*
   @name getclientsList Function - This is return list of clientslist through mock.
   */
  
   getClientsList(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/clients/getallclients' +query, config);
    }

    getActiveClientsList(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/clients/getallclients' +query, config);
    }
  
  addClient(data){
      let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/client/signup', data, config);
    }
    
  deleteClient(id){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/commpany/changestatus',id ,config);
    }
    
  changeClientStatus(data){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/commpany/changestatus',data ,config);
    }
    
  updateClientProfile(companyId, data) {
        let config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/client/'+ companyId , data, config);
    }
}
