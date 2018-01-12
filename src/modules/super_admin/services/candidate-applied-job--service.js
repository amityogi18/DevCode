let _activePromise,
  _this;

export class CandidateAppliedJobService {
  /** @ngInject  */
  constructor($http, APP_CONSTANTS, UtilsService) {
    _this = this;  
    _this.$http = $http;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
    
  }
  
  get activePromise() {
    return _activePromise;
  }
  
  getCandidateAppliedList(queryURL){
        let config  = _this.UtilsService.getCofigObj();
        queryURL = queryURL !== undefined  ? queryURL : "";
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/admin/candidates/applied/jobs' + queryURL, config);
    }
  
  getCandidateAppliedJobDescription(id){
       let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/candidate-profile/applied/jobs/' +id, config);
  }

  getCandidateProfileInfo(id){
       let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/private/candidate/candidate-details/' +id, config);
  }

  getCandidateProfileById(id){
    let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/public/candidate/candidate-details/' +id, config);
  }
      
   getAllAppliedCandidates(query, jobCode) {
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/admin/candidates/applied/jobs/'+jobCode + query,config);
  }

  getAllCandidateList(query, id){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/admin/candidates/appliedjobs/'+id + query,config);
    
  }

  getJobDescription(id){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/applied/job/'+id,config);
    
  }

  getOfficialEmailIdPassowrd(){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/ondemand-candidates/official-email-password',config);
  } 

  changeJobStatus(param){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/admin/admin-section/candidate/applied-change-job-status', param, config);
  } 


  
  

}