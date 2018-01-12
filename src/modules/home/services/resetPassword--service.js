
var _email,
    _activePromise,
    _errorTranslationKey,
    _emailToken;

export class ResetPasswordService {
	/** @ngInject  */
  constructor($q, $http, APP_CONSTANTS) {
    this.$q = $q;
    this.$http = $http;
     this.APP_CONSTANTS = APP_CONSTANTS;
  }

  get activePromise() {
    return _activePromise;
  }

  resetPassword(resetUser) {
    let onSuccess = (response) => {
          _activePromise = null;
        },
        onError = (error) => {
          if (error.status === 409) {
            _errorTranslationKey = error.data.errorCode;
          }
          _activePromise = null;
        };
    
    let _url = this.APP_CONSTANTS.SERVER_URL+'/password/reset';
    //let _url = 'https://54.209.30.211/assessment-api/password/reset';

    let _config = {
      headers:  {"content-type": "application/json"}
    };

    _activePromise = this.$http.put(_url, resetUser, _config);

    _activePromise.then(onSuccess, onError);
  }

}
