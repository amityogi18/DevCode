let _this,
  _activePromise;

export class jobDescriptionService {
  /** @ngInject  */
  constructor($http, APP_CONSTANTS, UtilsService, Upload) {
    _this = this;
    _this.$http = $http;
    _this.Upload = Upload;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;

  }

  get activePromise() {
    return _activePromise;
  }

  getAppliedJobList(jobId) {
    let config = _this.UtilsService.getCofigObj();
    return _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/applied/job/' + jobId, config);
  }

  getApplicationformDetails(jobcode) {
    let config = _this.UtilsService.getCofigObj();
    return _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/position/applicationform/details/' + jobcode, config);
  }

  getAppliedJobDescription(jobId) {
    var apiURL = "https://search.jottp.com:8983/solr/jobcollection_solr_index_prod/select?&wt=json&indent=true&q=*&fq=id:";
    var jobId = "\"" + jobId + "\""
    return _this.$http.get(apiURL + jobId);
  }

  applyForJob(applyData, accessToken) {
    let config = {
      "headers": {
        "Authorization": "Bearer " + accessToken,
        "Accept": "application/json",
        "userType": 2
      }
    };

    return _this.Upload.upload({
      url: _this.APP_CONSTANTS.SERVER_URL + '/candidate/apply/jobs',
      data: applyData,
      headers: config.headers
    });

  }

  getCandidateAppliedDetailsById(candidateId, jobCode) {
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/job-application/required/candidate-info/' + candidateId + '/' + jobCode, config);
  }

  updateCandidateDetails(candidateInfo, accessToken) {
    let config = {
      "headers": {
        "Authorization": "Bearer " + accessToken,
        "Accept": "application/json"
      }
    };
    return _this.Upload.upload({
      url: _this.APP_CONSTANTS.SERVER_URL + '/candidate/job-application/required/candidate-info',
      data: candidateInfo,
      headers: config.headers
    });
    //_activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/candidate/job-application/required/candidate-info',candidateInfo, config);
  }

  loginUsingLinkedIn(userData){
    let config = _this.UtilsService.getCofigObj();
    return _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/linkedin/login', userData, config);
  }

}