let _this,
    _activePromise;
    
export class CustomQuestionService {
	/** @ngInject  */
    constructor($q, $http, AuthService, APP_CONSTANTS, Upload, UtilsService) {
        _this=  this;
        _this.$q = $q;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.Upload = Upload;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
    }
     
    get activePromise() {
      return _activePromise;
    }
     
    getcustomQuestionList(query){    
      let companyId = _this.AuthService.user.companyId || 1,
      config  = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/questions/getquestions/'+ companyId +query, config);
    }

    getDefaultCustomQuestionList(query){
      let companyId = _this.AuthService.user.companyId || 1,
      config  = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/questions/getquestions/'+ companyId +query, config);
    }
    
    getcustomQuestionTemplateList(query){
      let companyId = _this.AuthService.user.companyId,
      config  = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/settings/template/custom/'+ companyId +query, config);
    }
    
    getExistingTemplateQuestion(id){
        let config  = _this.UtilsService.getCofigObj(); 
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/settings/template/custom/question/' + id, config);  
    }
    
    getQuestionType(){
        let config  = _this.UtilsService.getCofigObj(); 
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/position/question/questiontypes', config);
    }
      
    saveNewCustomeQuesstion(data){
        let config  = _this.UtilsService.postCofigObj();
      //data.companyId = this.AuthService.user.companyId || 1;
       return _this.Upload.upload({
                            url: _this.APP_CONSTANTS.SERVER_URL +'/questions/savequestions',
                            data: data,
                            headers: config.headers
                         });
    }
  
    
    deleteCustomQuestion(removeQuestionObj){
        let apiUrl = _this.APP_CONSTANTS.SERVER_URL+'/questions/delete-questions',
        config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(apiUrl,removeQuestionObj, config);          
    }
        
     updateCustomQuestion(data){
         let config  = _this.UtilsService.postCofigObj();
         _activePromise = _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/questions/update-question',
            data: data,
            headers: config.headers
        });
    
       }   
       
     getQuestionDetailsById(questionId){
         let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/questions/viewquestion/'+ questionId, config);   
     }  
     
     saveNewQuesstionTemplate(data){
        let config  = _this.UtilsService.postCofigObj();
        data.companyId = _this.AuthService.user.companyId || 1;  
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/settings/template/custom/question', data, config);
    }  
     
     deleteQuesstionTemplate(templateId){
        let userType = _this.AuthService.user.userType;
        let config  = _this.UtilsService.putCofigObj();
        let apiUrl = _this.APP_CONSTANTS.SERVER_URL+'/settings/template/custom/question/delete/'+ templateId;
        _activePromise = _this.$http.put(apiUrl,userType, config);
    } 
    
     updateTemplate(templateId,data){
         let config  = _this.UtilsService.putCofigObj();
        data.companyId = _this.AuthService.user.companyId || 1;  
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/settings/template/custom/question/'+ templateId,data, config);
    }
    
     getTemplateDetailsById(templateId){
         let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/settings/template/custom/allquestions/'+ templateId, config);   
     }

    importQuestionList(data){
      let config  = _this.UtilsService.postCofigObj();
      let companyId = _this.AuthService.user.companyId || 1;
      _activePromise =
        _this.Upload.upload({
          url: _this.APP_CONSTANTS.SERVER_URL +'/user/setting/customquestion/import?companyId='+companyId,
          data : data,
          headers: config.headers
        });
    }

    setDefaultQuestion(defaultQuestionIds) {
      let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/questions/set-default-questions',defaultQuestionIds ,config);
    }
}
