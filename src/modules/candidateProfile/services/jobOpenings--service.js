let _this,
  _activePromise;

export class jobOpeningsService {
  /** @ngInject  */
  constructor($http, $state, UtilsService, AuthService, APP_CONSTANTS) {
    _this = this;
    _this.$http = $http;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    _this.AuthService = AuthService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.queryString = '&qf=jobdetailurl+jobdescription+jobtitle+jobcategory+tertiaryskill+city+primaryskill+contracttype+jobcode+secondaryskill+experience+qualification+company+location+state+jobtype';
  }
  get activePromise() {
    return _activePromise;
  }

  appliedJobPortals(data) {
    let config = _this.UtilsService.postCofigObj(),
      apiUrl = _this.APP_CONSTANTS.SERVER_URL + '/candidate/apply/jobs';
    return _activePromise = _this.$http.post(apiUrl, data, config);
  }

  saveJobAsFavorite(data) {
    let config = _this.UtilsService.postCofigObj(),
      apiUrl = _this.APP_CONSTANTS.SERVER_URL + '/candidate/savefavouritejob';
    _activePromise = _this.$http.post(apiUrl, data, config);
  }

  getAllActiveJobList(query, initialLoad){
//      let config = {
//            headers: {
//                'Access-Control-Allow-Origin':'*.jottp.com,localhost',
//                'Access-Control-Allow-Headers': 'X-Requested-With'
//            }
//      };
      const queryURL = initialLoad 
        ? query 
        : query + _this.queryString;
      _activePromise = initialLoad 
        ? _this.$http.get('https://search.jottp.com:8983/solr/jobcollection_solr_index_prod/select?q='+queryURL+'&sort=_version_+desc') 
        : _this.$http.get('https://search.jottp.com:8983/solr/jobcollection_solr_index_prod/select?&wt=json&indent=true&q='+queryURL);
    }

  getAllCompanyList() {
//     let config = {
//            headers: {
//                'Access-Control-Allow-Origin':'*.jottp.com,localhost',
//                'Access-Control-Allow-Headers': 'X-Requested-With'
//            }
//      };
    _activePromise = _this.$http.get('https://search.jottp.com:8983/solr/jobcollection_solr_index_prod/select?q=*&wt=json&indent=true&fl=company&rows=10000&df=company');
  }

  getJobList() {
//     let config = {
//            headers: {
//                'Access-Control-Allow-Origin':'*.jottp.com,localhost',
//                'Access-Control-Allow-Headers': 'X-Requested-With'
//            }
//      };
    _activePromise = _this.$http.get('https://search.jottp.com:8983/solr/jobcollection_solr_index_prod/select?q=*&wt=json&indent=true&fl=jobtitle&rows=10000&df=jobtitle');
  }

  getSkillList() {
    let config = this.UtilsService.getCofigObj();
    return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/get/all/skillsets?search=', config);
  }

  getCandidateDetailsById(jobId) {
    let candidateId = _this.AuthService.user.userId;
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/public/candidate/candidate-details/' + candidateId);
  }

  getCandidateCardDetails() {
    let config = this.UtilsService.getCofigObj(),
      url = this.APP_CONSTANTS.SERVER_URL + '/setting/company/card-details';
    return _activePromise = this.$http.get(url, config);
  }

  candidateAppliedDetailsById(jobCode){
    let candidateId = _this.AuthService.user.userId;
    let  config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/job-application/required/candidate-info/'+candidateId +'/'+jobCode, config);


  }

}