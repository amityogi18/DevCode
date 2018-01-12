let _this,
    _activePromise;
export class AdminUserDetailService {
	/** @ngInject  */
    constructor($q, $http, AuthService, APP_CONSTANTS, UtilsService) {
        _this=  this;
        _this.$q = $q;
        _this.$http = $http;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.AuthService = AuthService;
        _this.UtilsService = UtilsService;
    }
    
    get activePromise() {
        return _activePromise;
    }
    
    getAllUser(query){
        let userId = _this.AuthService.user.userId,
        config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/user/setting/' + userId +query, config);
    }

    getUser(query){
        let config  = _this.UtilsService.getCofigObj();
        let companyId = _this.AuthService.user.companyId;
        let statusQuery = '&companyId='+ companyId;
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/users' + query + statusQuery, config);
    }
    
    addUser(data){
        data.companyId = _this.AuthService.user.companyId;
        let userId = _this.AuthService.user.userId,
        config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/setting/user/add/' +userId, data, config);
    }
    
    removeUser(id){
        let userId = _this.AuthService.user.userId,
         config  = _this.UtilsService.deleteConfigObj();
        _activePromise = _this.$http.delete(_this.APP_CONSTANTS.SERVER_URL + '/user/delete/' +userId +'/'+id, config);
    }
    
    updateUser(id, data){
        let config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/user/' +id, data, config);
    }
    
    getDepartmentByCompanyId(){
        let config  = _this.UtilsService.getCofigObj(),
        userId = _this.AuthService.user.userId;
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/admin/department/' + userId+"?limit=100&page=1", config);
    }
    
    getRoles(){
      let config  = _this.UtilsService.getCofigObj(),
      userId = _this.AuthService.user.userId;
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/user/roles/' +userId, config);
      //http://localhost:8000/assessment-api/setting/user/roles/{userId}
      
    }

    setDefaultUser(data){
        let config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/set/evaluator/default',data, config);
    }
}

