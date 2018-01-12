var _activePromise,
  _errorTranslationKey,
  _companycandidateList,
  _companycandidateDetails,
  _companycandidateId,
  _recruiterId,
  _companycandidateDescriptionList,
  _this;


export class PaymentDashboardService {
	 /** @ngInject  */
  constructor($http, Upload, $state, UtilsService, APP_CONSTANTS) {
    _this = this;  
    _this.$http = $http;
    _this.Upload = Upload;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
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


 getPaymentDetails(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/company/payment/all' +query, config);
    }
  
}
