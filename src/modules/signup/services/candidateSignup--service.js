let _this,
    _activePromise;

export class CandidateSignupService {
	/** @ngInject  */
  constructor($window, $q, $http,APP_CONSTANTS) {
    _this = this;
    _this.$q = $q;
    _this.$http = $http;
    _this.$window = $window;
    _this.APP_CONSTANTS = APP_CONSTANTS;
  }


  get activePromise() {
    return _activePromise;
  }
  
  doCandidateSignup(data) {
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/candidate-signup', data);
   // _activePromise = _this.$http.post('https://54.209.30.211/assessment-api/candidate-signup', data);
  }
  
  getDesignation(departmentId){
          _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/candidate/designation/'+ departmentId);
    //    _activePromise = _this.$http.get('https://54.209.30.211/assessment-api/candidate/designation/'+ departmentId);
    }
    
    resendEmail() {
         let data = {
           emailId : _this.$window.sessionStorage.email,
           userType: _this.$window.sessionStorage.userType
         };
         let api = _this.APP_CONSTANTS.SERVER_URL+'/resend';
        //  let api = 'https://54.209.30.211/assessment-api/resend';
        _activePromise = _this.$http.post(api,data);
    }

}

