var _activePromise,
  _errorTranslationKey,
  _companycandidateList,
  _companycandidateDetails,
  _companycandidateId,
  _recruiterId,
  _companycandidateDescriptionList;

/*
@name companycandidateService-Service
@param {Object}$http  This is a predefined service which is used for ajax call.
  @param {Object} Upload This is predefined service which is used to upload file.
  @param {Object}$state This is a predefined service used for changing the state.
*/

export class companycandidateService {
	 /** @ngInject  */
  constructor($http, Upload, $state, APP_CONSTANTS, AuthService, UtilsService) {
    this.$http = $http;
    this.Upload = Upload;
    this.$state = $state;
    this.APP_CONSTANTS = APP_CONSTANTS;
    this.AuthService = AuthService;
    this.UtilsService = UtilsService;
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

  get companycandidateDetails(){
    return _companycandidateDetails;
  }

  set companycandidateDetails(value){
    _companycandidateDetails = value;
  }

  get companycandidateList() {
    return _companycandidateList;
  }

  get recruiterId() {
    return _recruiterId;
  }

  get companycandidateId() {
    return _companycandidateId;
  }

  get companycandidateDescriptionList() {
    return _companycandidateDescriptionList;
  }

  set companycandidateDescriptionList(value) {
    _companycandidateDescriptionList = value;
  }

  /* End getter and setter here */


  /*
   @name getcompanycandidateList Function - This is return list of companycandidates through mock.
   */
    getcandidateList(query){
        let config  = this.UtilsService.getCofigObj();
      _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/superadmin/company/candidates'+query, config);
    }
    
    getCandidateData(candidateId, companyId){
        let config  = this.UtilsService.getCofigObj();
      _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/superadmin/candidate/'+candidateId + '/'+companyId, config);
    }
  
    getInactiveCandidateList(query){
        let config  = this.UtilsService.getCofigObj();
        let statusQuery = (query == "") ? "?status=inactive" : "&status=inactive";
      _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/superadmin/company/candidates'+query + statusQuery, config);
    }
    
    addCandidate(candidate){
	let config  = this.UtilsService.postCofigObj();
	   _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/company/addcandidate', candidate, config);
       }

  
  changeStatus(data){
     let config  = this.UtilsService.postCofigObj();
    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/superadmin/companies/delete-candidates',data, config);
  }
  /*
   @name getcompanycandidateDescription Function - This is return list of companycandidates through mock.
   */

  getcompanycandidateDescription(){
    var onSuccess = (response) => {

        _companycandidateDescriptionList = response.data;
        _activePromise = null;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
      };

    _activePromise = this.$http.get('/test/companycandidateDescription');
    _activePromise.then(onSuccess, onError);
  }
}
