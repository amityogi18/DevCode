let _this,
    _activePromise;
export class AdminDepartmentService {
	/** @ngInject  */
    constructor($q, $http, APP_CONSTANTS, AuthService, UtilsService) {
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


    saveDepartment(data){
        let config  = _this.UtilsService.postCofigObj();
         data.userId = _this.AuthService.user.userId;        
        return _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/setting/department', data, config);
    }
    
    getDepartmentforUser(){
        let companyId = _this.AuthService.user.companyId;
        let config  = _this.UtilsService.getCofigObj();
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+"/position/company/department/"+companyId, config);
   
  }
  getCompanyDepartment(){
       let companyId = _this.AuthService.user.companyId || 1;
         let config  = _this.UtilsService.getCofigObj();
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/departments/'+companyId, config);
    }
  
    getDepartment(){
         let config  = _this.UtilsService.getCofigObj();
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/departments', config);
    }
    
    getSkillSet(departmentId){
        let config  = _this.UtilsService.getCofigObj();
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/skillsets/'+ departmentId, config);
    } 

    getDepartmentByCompanyId(query){
        let config  = _this.UtilsService.getCofigObj(),
        userId = _this.AuthService.user.userId;
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/admin/department/' + userId +query, config);
    }

    updateDepartment(data){
        let config  = _this.UtilsService.putCofigObj();
        data.userId = _this.AuthService.user.userId;
        return _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/setting/department', data, config);
    }
    
    removeDepartment(departmentId){
        let userId = _this.AuthService.user.userId,
        config  = _this.UtilsService.putCofigObj();
        return _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/setting/department/' + userId+'/'+departmentId, config);
    }
}

