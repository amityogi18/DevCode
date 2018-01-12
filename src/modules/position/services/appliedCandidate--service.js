var _this,
    _activePromise;     

export class appliedCandidateService {
  /** @ngInject  */
  constructor($http,$state,APP_CONSTANTS, UtilsService, AuthService) {
    _this =  this;
    _this.$http = $http;
    _this.$state = $state;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.AuthService = AuthService;
    _this.UtilsService = UtilsService;
  }
  
  get activePromise() {
		return _activePromise;
	}
  
  getAllAppliedCandidates(query, jobCode) {
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/admin/job/applied-candidates/'+jobCode + query,config);
  }
  
  candidateAppliedDetailsById(candId, jobCodes){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/private/candidate/candidate-details/' + candId + '?jobCode='+ jobCodes , config);
 
  }
  addCommentForRejected(commentInfo){
    //commentInfo.userTypeId = _this.AuthService.user.userType;
    let config  = _this.UtilsService.putCofigObj();
    _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/admin/admin-section/candidate/applied-change-job-status',commentInfo, config);
  }
  
  getCommentForAppliedCandidate(jobCode, candidateId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/candidate-profile/applied-job-status-comment/'+jobCode+'/'+candidateId , config);
  }
  
  getAllHiredCandidates(query, jobId){
   let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/positions/hired-candidates/'+jobId + query,config);
  }
}