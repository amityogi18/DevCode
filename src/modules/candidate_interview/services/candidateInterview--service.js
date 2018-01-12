let _this,
    _activePromise;

export class CandidateInterviewService {
	/** @ngInject  */
  constructor($http, $window, APP_CONSTANTS, UtilsService, AuthService) {
    _this = this;
    _this.$http = $http;
    _this.$window = $window;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
    _this.AuthService = AuthService;
  }

  get activePromise() {
    return _activePromise;
  }

  getInterviewDetailsByCode(interviewCode){
     let config  = _this.UtilsService.getCofigObj(); 
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/interview/interview_details/'+interviewCode, config);
  }

  getAdditionalInfo(interviewId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/interview/positionadditionalinfo/'+interviewId, config);
  }

  getInterviewQuestionCountDetails(interviewId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate-view/interview/questions-types/counts/'+interviewId, config);
  }

  saveCriteriaReply(criteriaReplyData){
    criteriaReplyData.candidateId = _this.AuthService.user.userId;
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/interview/candidate/additionaloptions', criteriaReplyData, config);
  }

  getWelcomeVideo(interviewId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/interview/'+ interviewId + '/welcomevideo', config);
  }

  getExitVideo(interviewId){
     let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/interview/'+ interviewId + '/exitvideo', config);
  }

  submitInterview(interviewId){
      let config  = _this.UtilsService.getCofigObj();
      let candidateId = _this.AuthService.user.userId;
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/interview/submit/'+ interviewId + '/'+ candidateId , config);
  }

  registerCandidate(candidateData){
      let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/interview/candidate/activation', candidateData , config);
  }

  checkCandidateForInterview(checkData){
      checkData.userId = _this.AuthService.user.userId;
      checkData.userTypeId = _this.AuthService.user.userType;
      let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/interview/checkwith/user-candidate', checkData, config);
  }

  updateCandidateInterviewStatus(statusData){
      statusData.candidateId = _this.AuthService.user.userId
      let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/position/interviewcandidate/1/updatestatus', statusData, config);
  }
}

