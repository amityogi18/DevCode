let _activePromise,
  _errorTranslationKey,
  _usersList,
  _usersDetails,
  _usersId,
  _recruiterId,
  _usersDescriptionList,
  _this;

/*
 @name userRoleSaService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */

export class UserRoleService {
	 /** @ngInject  */
  constructor($http, Upload, $state, UtilsService, APP_CONSTANTS, AuthService) {
    _this = this;  
    _this.$http = $http;
    _this.Upload = Upload;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.AuthService = AuthService;
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

  
  getusersList(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/users' +query, config);
    }

  getActiveUsersList(query){
      let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/users' + query, config);
  }

  addUser(data){
        let userId = _this.AuthService.user.userId,
        config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/setting/user/add/' +userId, data, config);
    }
    
    updateUser(id, data){
        let config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/user/' +id, data, config);
    }
    
    deleteUser(id){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/clients/changestatus',id ,config);
    }
    
    changeUserStatus(data){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/clients/changestatus',data ,config);
    }
    
    getRoles(){
      let config  = _this.UtilsService.getCofigObj(),
      userId =  1;
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/user/roles/' +userId, config);
      //http://localhost:8000/assessment-api/setting/user/roles/{userId}
      
    }
}
