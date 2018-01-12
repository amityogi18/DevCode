
var _activePromise,
  _errorTranslationKey,
  _transactionList,
  _transactionId;

/*
 @name TransactionDetailService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */
export class TransactionDetailService {
	/** @ngInject  */
  constructor($http, Upload, $state, AuthService, APP_CONSTANTS, $q, UtilsService) {
    this.$http = $http;
    this.Upload = Upload;
    this.$state = $state;
    this.AuthService = AuthService;
    this.APP_CONSTANTS = APP_CONSTANTS;
    this.$q = $q;
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

  get transactionList() {
    return _transactionList;
  }

  /*
   * @name - gettransactionList:This return the list of transaction
  */

  gettransactionList(query){
    var onSuccess = (response) => {
        _transactionList = response.data.data;
        _activePromise = null;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
      };
    let companyId = this.AuthService.user.companyId || 1,
     config  = this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/setting/admin/company/payment/'+companyId + query, config);
    _activePromise.then(onSuccess, onError);
  }

}

