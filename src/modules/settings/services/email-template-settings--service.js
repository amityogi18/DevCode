
let _this;
let _activePromise,
  _errorTranslationKey,
  _emailTemplateList;
  
 
  
export class EmailTemplateSettingsService {
	/** @ngInject  */
    constructor($q, $http, AuthService, APP_CONSTANTS, UtilsService) {
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

    get errorTranslationKey() {
      return _errorTranslationKey;
    }
    
     get emailTemplateList(){
		return _emailTemplateList;
	}


    getemailTemplateList(){
      let companyId = _this.AuthService.user.companyId || 1,
      userId = _this.AuthService.user.userId || 1,
       config  = _this.UtilsService.getCofigObj();   
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/user/setting/alltemplates/'+ companyId+ '/'+ userId, config);
    }
    
    getTemplate(id){
      var onSuccess = (response) => {
          _activePromise = null;
          console.log(response.data);
          return response.data;
        },
        onError = (error) => {
          if (error.status === 409) {
            _errorTranslationKey = error.data.errorCode;
          }
          _activePromise = null;
        },
        config  = _this.UtilsService.getCofigObj(); 

      _activePromise = this.$http.get('/test/settings/email/template/'+id, config);
      return _activePromise.then(onSuccess, onError);
    }
    
    saveNewTemplate(data){
        let config  = _this.UtilsService.postCofigObj();
        data.companyId = this.AuthService.user.companyId || 1;  
        data.userId = _this.AuthService.user.userId || 1;  
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/user/setting/template', data, config);
    }  
   
    getTemplateType(){ 
       let config  = _this.UtilsService.getCofigObj();   
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/user/setting/template-types', config);
    }
    
    deleteTemplate(id){
       let config  = _this.UtilsService.deleteConfigObj();
        _activePromise = this.$http.delete(this.APP_CONSTANTS.SERVER_URL+'/user/setting/template/' +id, config);
    }
    
    updateTemplate(data){
        let config  = _this.UtilsService.putCofigObj();
        data.companyId = this.AuthService.user.companyId || 1; 
        data.userId = _this.AuthService.user.userId || 1;  
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/user/setting/update-template', data, config);
    }
}
