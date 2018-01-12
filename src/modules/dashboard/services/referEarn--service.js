
var _activePromise,
  _errorTranslationKey,
  _referEarnList,
  _refrenceId;

/*
 @name ReferEarnService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */
export class ReferEarnService {
	/** @ngInject  */
  constructor($http,Upload,$state) {
    this.$http = $http;
    this.Upload = Upload;
    this.$state = $state;
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

  get referEarnList() {
    return _referEarnList;
  }

  /*
   * @name - gettransactionList:This return the list of transaction
  */

  getreferEarnList(){
    var onSuccess = (response) => {
        _referEarnList = response.data;
        _activePromise = null;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
      };

    _activePromise = this.$http.get('/test/refer-earn-details');
    _activePromise.then(onSuccess, onError);
  }

}

