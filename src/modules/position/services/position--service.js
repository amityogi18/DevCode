let _this,
   _activePromise,
  _errorTranslationKey;

export class positionService {
	/** @ngInject  */
  constructor($http,APP_CONSTANTS, AuthService, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.AuthService = AuthService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.api = APP_CONSTANTS.SERVER_URL;
    _this.UtilsService = UtilsService;
    _this.selectedPlan = {};
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
   
  getpositionList(queryParams){
    let companyId = _this.AuthService.user.companyId || 1,
    config  = _this.UtilsService.getCofigObj();  
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/position/company/'+companyId+'/positions'+queryParams, config);
  }
  
  getPositionCandidateList(interviewId, queryUrl){
    let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/position/interviews/'+interviewId+'/candidates'+ queryUrl, config);
  }
  
  getCandidateList(interviewId, queryUrl){
    let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/position/interview/'+interviewId+'/candidates'+ queryUrl, config);
  }

  updateDeletedRows(selectedIds){
    var payload = {
      "positionIds" : selectedIds.toString()
    },
    config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/position/updatestatus',payload, config);   
  }

  changeStatus(selectedIds, status){
    var payload = 
      {
          "statusId" : status,
          "positionIds" : selectedIds
      },
     config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/position/changestatus',payload, config);
  }

  updateCandidateStatus(data){
    let config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/position/interview/candidate/updatestatus',data, config);
  }

  sendToRedirect(selectedIds){
    var payload = 
      {
        "candidateIds" : selectedIds
      },
     config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/position/changestatus',payload, config);
  }

  getDepartments(){
//    let companyId = _this.AuthService.user.companyId || 1,
//    config  = _this.UtilsService.getCofigObj();
//    _activePromise = _this.$http.get(_this.api+"/position/company/department/"+companyId, config);
      
        let config  = _this.UtilsService.getCofigObj(),
        userId = _this.AuthService.user.userId;
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/admin/department/' + userId+"?limit=100&page=1", config);
  }

  getRecruiters(){
    let companyId = _this.AuthService.user.companyId || 1,
    config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.api+"/company/recruiters", config);
    
  }

  saveNewPosition(position){
    let companyId = _this.AuthService.user.companyId || 1,
        userId = _this.AuthService.user.userId || 1,
        config  = _this.UtilsService.postCofigObj();   
        position.companyId = companyId; 
        _activePromise = _this.$http.post(_this.api+'/position/addposition/'+userId, position, config);    
  }  

  getSkills(departmentId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.api+"/position/skills/"+departmentId, config);
  }  

  getInterviewBasedOnPositionId(id){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/position/allpositionforfilter/'+id+'/interview', config);
 
  }

  saveInterview(interviewData){
    let config  = _this.UtilsService.postCofigObj(); 
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/position/interview/create', interviewData, config);
  }

  updateInterview(interviewData){
      let config  = _this.UtilsService.putCofigObj(); 
       _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/position/interview/update-interview', interviewData, config);
  }

  getInterviewDetails(id){
    let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/position/interview/getinterviewdetails/'+ id, config);
  }
 
 getPositionDetails(id){
    let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/position/'+id+'/positiondetail', config);
 }

 getPositionCount(id){
    let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/positions/position-count-statics/' + id, config);
 }
 
 updatePositionDetails(positionId, data){
    let config  = _this.UtilsService.putCofigObj(); 
     _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/position/updateposition/'+positionId , data, config);
 }
 
 getInterviews(positionId){  
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/position/allpositionforfilter/'+positionId+'/interview', config);
    
  }
  activatePosition(positionId){  
       let payload = 
      {
        "id": positionId,
        "statusId": 1
      },
      config  = _this.UtilsService.postCofigObj(); 
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/position/status/change', payload, config);
    
  }
  
  getliveNowCandidateList(positionId, query){
      let config  = _this.UtilsService.getCofigObj();   
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/position/livenowinterview/'+positionId+''+query, config);
    }    
    
  getliveNowEmail(query){
       _this.companyId = _this.AuthService.user.companyId || 1;
        let config  = _this.UtilsService.getCofigObj();   
       _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/position/livenowinterview/candidatesp/'+ _this.companyId+query , config);
      }
      
  portalDetail(portalId){
      let config  = _this.UtilsService.getCofigObj();   
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/company/portal/plans/'+portalId, config);
    }

  setSelectedPlan(detail) {
    _this.selectedPlan = detail;
  }

  getSelectedPlan() {
    return _this.selectedPlan;
  }
    
  getApplicationDetails(jobCode){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.api+"/position/applicationform/details/"+jobCode, config);
    
  }
  
  saveApplicationDetails(positionId, data){
    let config = _this.UtilsService.postCofigObj(),
    apiUrl = this.APP_CONSTANTS.SERVER_URL + '/company/position/applicationform/'+positionId;
    _activePromise = this.$http.put(apiUrl, data, config);
  }
  
  //getApplication form details APi
  getApplicationFormDetails(jobCode){
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/position/applicationform/details/'+jobCode, config);
  }
  
  //get job portals
  getJobPortalsDetails(positionId){
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/position/portals/'+positionId, config);
  }

  //publish job portals
    publishJobs(data){
      let config = _this.UtilsService.postCofigObj(),
      apiUrl = this.APP_CONSTANTS.SERVER_URL + '/job/post-job';
      _activePromise = this.$http.post(apiUrl, data, config);
    }

}


