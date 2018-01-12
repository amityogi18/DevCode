var _activePromise,
        _graphData,
  _errorTranslationKey;

let _this;
export class analyticsService {
	/** @ngInject  */
    constructor($http,Upload,$state,APP_CONSTANTS, AuthService,UtilsService) {
        _this =  this;
        _this.$http = $http;
        _this.Upload = Upload;
        _this.$state = $state;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.AuthService = AuthService;
        _this.UtilsService = UtilsService;
    }
    
    get activePromise() {
    return _activePromise;
    }
    
    get graphData(){
        return _graphData;
    }

    get errorTranslationKey() {
      return _errorTranslationKey;
    } 
  
    getAppTypeGraphData(query){ 
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/apptype'+query, config);

    }
    
    getCandidateRatingGraphData(query){ 
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/ratingreport'+query, config );

    }
    
    getInterviewByMonthReportGraphData(query){
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/interviewbymonths'+query, config);

    }
    
    getinterviewTrackingReportGraphData(query){
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/invitationtrackingreport'+query, config);

          }

    getCandidateOrgnGraphData(query){  
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/candidateorganization'+query, config);

    }

     getAvgCompletionTimeGraphData(query){ 
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj(); 
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/averagecompletiontime'+query, config);

    }
    
     getRecruiterWiseReportGraphData(query){ 
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj(); 
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/recruiterwisereport'+query, config);

     }
    
     getDepartmentWiseReportGraphData(query){ 
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj(); 
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/departmentwisereport'+query, config);

    } 
    
    getCandidateStatusReportGraphData(query){  
      let companyId = _this.AuthService.user.companyId || 1,
      config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/statusreport'+query, config);

    }

    setInterviewActiviyReportData(reportData){
      let companyId = _this.AuthService.user.companyId || 1,
      config  = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/interviewreport/'+companyId,reportData, config);

    }
  
    getpositionList(companyId){
      //let companyId = _this.AuthService.user.companyId || 1,
      let config  = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/position/getallpositionsbycompanyid/'+companyId, config);
    }

    getDepartments(){
      let companyId = _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+"/position/company/department/"+companyId, config);
    }
    
    getActivityReport(data, query){
        let companyId =_this.AuthService.user.companyId || 1,
            config  = _this.UtilsService.postXlsCofigObj();
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+"/company/analytics/reports"+query, data, config);
    }
    
    getGraphData() {
    let config  = this.UtilsService.getCofigObj(),
        companyId = _this.AuthService.user.companyId || 1;
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/company/analytics/invitationtrackingreport/'+companyId,config);
  }
  
  getCompanyList() {
    let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/companies', config);

    }
}



