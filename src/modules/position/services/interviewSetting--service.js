let _this,
    _activePromise;

export class interviewSettingService {
	/** @ngInject  */
  constructor($http, AuthService, Upload, APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.AuthService = AuthService;
    _this.Upload = Upload;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }

  get activePromise(){
    return _activePromise;
  }
  
  getWelcomeVideo(fileId){       
    let id = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/media-file/'+fileId, config);
   
  }
  
  getExitVideo(fileId){       
    let id = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/media-file/'+fileId, config);
   
  }

  getWelcomeVideoList(){       
     let companyId = _this.AuthService.user.companyId || 1,
     config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/welcomevideos/'+companyId, config);
   
  }
  
  getExitVideoList(){
    let companyId = _this.AuthService.user.companyId || 1,
    config  = _this.UtilsService.getCofigObj(); 
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/exitvideos/'+companyId, config);
   
  }
  
  saveInterviewSetting(data){
     let config  = _this.UtilsService.postCofigObj();     
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/position/saveinterviewadvancesetting',data, config);
  }
  
  getInterviewSetting(interviewId){  
    let config  = _this.UtilsService.getCofigObj();  
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/position/interview/getinterviewsetting/'+interviewId, config);
  }
  
  uploadVideo(data, isVideo, type) {
        let videoData, companyId, url, config;
        companyId = _this.AuthService.user.companyId || 1,
        config  = _this.UtilsService.postCofigObj(); 
        if(type == 1){
            url =  _this.APP_CONSTANTS.SERVER_URL+'/company/welcomevideos';
        }else
        {
            url =  _this.APP_CONSTANTS.SERVER_URL+'/company/exitvideos';
        }
        if(isVideo){
            videoData = { 
                            companyId: companyId,
                            companyVideoPath: data
                        }
        }else {
            videoData = { 
                            companyId: companyId,
                            companyVideoPathLink: data
                        }
        }
        return _this.Upload.upload({
            url: url,
            data: videoData,
            headers: config.headers
        });
    }
    
    saveResumeParsing(payload){
        let config  = _this.UtilsService.postCofigObj();     
       _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/company/resume-parse-default-setting',payload, config);
    }
    
    saveOndemandData(payload){
        let config  = _this.UtilsService.postCofigObj();     
       _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/company/ondemand-default-interview-setting',payload, config);
    }
    
    saveAutomationLive(payload){
        let config  = _this.UtilsService.postCofigObj();     
       _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/company/live-default-interview-setting',payload, config);
    }
    
    getAllCertificateList(data){        
        let config  = _this.UtilsService.getCofigObj(); 
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/external-certificates'+data, config);

    }
    
    getResumeParsingData(){
        let config  = _this.UtilsService.getCofigObj(); 
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/resume-parse-default-setting', config);

    }
    
    getOndemandData(){
        let config  = _this.UtilsService.getCofigObj(); 
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/ondemand-default-interview-setting', config);
    }
    
    getLiveData(){
        let config  = _this.UtilsService.getCofigObj(); 
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/live-default-interview-setting', config);
    }
    
    getUserList(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/users'+query , config);
    }
}
