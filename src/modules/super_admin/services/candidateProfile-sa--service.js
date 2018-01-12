var _activePromise,
  _errorTranslationKey,
  _candidateList,
  _candidateDetails,
  _candidateId,
  _recruiterId,
  _candidateDescriptionList;

/*
 @name candidateprofilesaService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */

export class candidateprofilesaService {
	 /** @ngInject  */
  constructor($http, Upload, $state,  APP_CONSTANTS, AuthService, UtilsService) {
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

  get candidateDetails(){
    return _candidateDetails;
  }

  set candidateDetails(value){
    _candidateDetails = value;
  }

  get candidateList() {
    return _candidateList;
  }

  get recruiterId() {
    return _recruiterId;
  }

  get candidateId() {
    return _candidateId;
  }

  get candidateDescriptionList() {
    return _candidateDescriptionList;
  }

  set candidateDescriptionList(value) {
    _candidateDescriptionList = value;
  }

  /* End getter and setter here */


  /*
   @name getcandidateList Function - This is return list of candidates through mock.
   */

  getcandidateList(query){
        let config  = this.UtilsService.getCofigObj();
      _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL + '/superadmin/candidates/profiles'+query, config);
  }
  
  deleteCandidate(data){
    let config  = this.UtilsService.postCofigObj();
    _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL+'/superadmin/companies/delete-candidates',data, config);
  }
  
  // restoreData(selectedIds){
  //   var payload =
  //     {
  //         "companyId" : this.AuthService.user.companyId || 1,
  //         "candidates" : selectedIds
  //     },
  //    config  = this.UtilsService.postCofigObj();
  //   _activePromise = this.$http.put(this.APP_CONSTANTS.SERVER_URL+'/superadmin/companies/restore-candidates',payload, config);
  // }
  /*
   @name getcandidateDescription Function - This is return list of candidates through mock.
   */

  getcandidateDescription(){
    var onSuccess = (response) => {

        _candidateDescriptionList = response.data;
        _activePromise = null;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
      };

    _activePromise = this.$http.get('/test/candidateDescription');
    _activePromise.then(onSuccess, onError);
  }
}

