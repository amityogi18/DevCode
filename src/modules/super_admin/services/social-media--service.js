let _activePromise,
  _errorTranslationKey,
  _clientsList,
  _clientsDetails,
  _clientsId,
  _recruiterId,
  _clientsDescriptionList,
  _this;

/*
 @name clientsService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */

export class SocialMediaService {
  /** @ngInject  */
  constructor($http, Upload, $state, APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.Upload = Upload;
    _this.$state = $state;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;

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

  getSocialPortal(query) {
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/socialmedia' + query, config);
  }

  updateSocialMedia(data) {
    let config = _this.UtilsService.putCofigObj();
    _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/socialmedia', data, config);
  }

  markInActiveSocialMedia(data) {
    let config = _this.UtilsService.putCofigObj();
    _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/socialmedia', data, config);
  }

  getJobPortalsList(queryURL, portalId) {
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/company/approval/posted-jobs' + queryURL + '& portalId=' + portalId, config);
  }

  getJobDescription(jobId) {
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/job/details/reveiw/' + jobId, config);
  }

  getJobDetailsByJobAndPortalId(jobId, portalId){
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/job/details/reveiw/'+ jobId +'/'+ portalId, config);
  }

  getCompanyDetails(companyId){
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/profile/'+ companyId, config);    
  }

  positionReview(data) {
    let config = _this.UtilsService.postCofigObj(),
      apiUrl = this.APP_CONSTANTS.SERVER_URL + '/job/review';
    _activePromise = this.$http.post(apiUrl, data, config);

  }


}
