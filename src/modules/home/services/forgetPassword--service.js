let _this,
    _email,
    _activePromise,
    _errorTranslationKey,
    _emailToken;

export class ForgetPasswordService {
	/** @ngInject  */
  constructor($q, $http, APP_CONSTANTS) {
    _this = this;
    _this.$q = $q;
    _this.$http = $http;
    _this.APP_CONSTANTS = APP_CONSTANTS
  }

  get activePromise() {
    return _activePromise;
  }

  forgotPassword(data) {
    let onSuccess = (response) => {
          _activePromise = null;
        },
        onError = (error) => {
          if (error.status === 409) {
            _errorTranslationKey = error.data.errorCode;
          }
          _activePromise = null;
        };
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/password/forgot', data);
      _activePromise.then(onSuccess, onError);
  }

}

