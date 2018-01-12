
var _email,
    _password,
    _activePromise,
    _errorTranslationKey,
    _emailToken;

export class LoginService {
	/** @ngInject  */
  constructor($q, $http,APP_CONSTANTS) {
    this.$q = $q;
    this.$http = $http;
     _this.APP_CONSTANTS = APP_CONSTANTS;
  }

  get email() {
    return _email;
  }

  set email(value) {
    _email = value;
  }

  get password(){
    return _password;
  }

  set password(value){
    _password = value;
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

  get emailToken() {
    return _emailToken;
  }

  doLogin(options) {
    var onSuccess = (response) => {
          _activePromise = null;
          _emailToken = response.data.accessToken;
        },
        onError = (error) => {
          _errorTranslationKey = error.data.error;
          _activePromise = null;
        };

    var _data = {
      "grant_type": "password",
      "client_id": "assessment_app",
      "client_secret": "assessment_app_s3cr3t",
      "username": options.username,
      "password": options.password,
      "scope": "read,write,trust"
    };

    var _config = {
      headers:  {"content-type": "application/x-www-form-urlencoded"},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      }
    };

    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/oauth/token', _data, _config);
    // _activePromise = this.$http.post('http://54.88.190.151:8080/assessment-api/oauth/token', _data, _config);
    _activePromise.then(onSuccess, onError);
  }

  getApplicationType(appId){
    let config = _this.UtilsService.getCofigObj(),
    companyId = _this.AuthService.user.companyId,
    candidateId = _this.AuthService.user.userId;
    let candidateapptype = appId; 
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/analytics/candidateapptype/'+companyId+'/'+candidateId+'/'+appTypeId, config);
  }

}
