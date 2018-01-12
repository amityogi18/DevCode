let _activePromise,
    _errorTranslationKey,
    _logoFile,
    _this;

/*
 @SignupHomeService Service
 @param {object} $http - service that enable us to make ajax calls
 @param {object} $state -  service that can contain some state.
 @param {object} $window -  A reference to the browser's window object in angular.
 @param {object} AuthService -  It is service provides methods related to login and logout and saving user.
 */
export class CompanySignupService {
	/** @ngInject  */
    constructor($http, $state, $window,AuthService,APP_CONSTANTS,GrowlerService) {
        _this = this;
        _this.$http = $http;
        _this.$state = $state;
        _this.$window = $window;
        _this.AuthService = AuthService;
        _this.GrowlerService=GrowlerService;
        _this.isEmailReSent = false;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.resendObject ={};
    }

    /* getters and setters starts from here*/
    get logoFile() {
        return _logoFile;
    }

    set logoFile(file) {
        _logoFile = file;
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
    /* getters and setters ends here*/

    /*
     * @name - doSignup
     * @param {object} companyInfo - this object contains the company details.
     * @description - This method call an api that saves the company details.
     */
    doSignup(companyInfo) {
        var onSuccess = (response) => {
               _this.resendObject = response.data;
                _this.$window.sessionStorage.emailToken =   response.data.token;
                _this.$state.go('signup.email-confirmation')
            },
            onError = (error) => {
                if (error.status === 409) {
                    _errorTranslationKey = error.data.errorCode;
                }
                _activePromise = null;
            };
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/signup/initiate', companyInfo);
        _activePromise.then(onSuccess, onError);
    }

    /*
     * @name - resendEmail
     * @description - This function calls an api that sends the mail.
     */
    resendEmail() {
        var onSuccess = (response) => {
            _this.GrowlerService.growl({
                type:'success',
                message : 'Email Send Successfully.',
                delay :500
              });
                _this.isEmailReSent = true;
            },
            onError = (error) => {
                if (error.status === 409) {
                    _this.isEmailReSent = false;
                    _errorTranslationKey = error.data.errorCode;
                }
                _activePromise = null;
            };
            var _data = {
                "emailId": _this.resendObject.email,
                "userType": _this.resendObject.userType
             };
       // let emailToken = _this.$window.sessionStorage.emailToken || '',
        //    userType = _this.AuthService.user.userType;
        let api = _this.APP_CONSTANTS.SERVER_URL+'/resend';
        _activePromise = _this.$http.post(api,_data);
        _activePromise.then(onSuccess, onError);
    }
}
