let _this,
    loginAttemptCountForCompany = 0,
    loginAttemptCountForCandidate = 0;
let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
let regExp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export class LoginController {
	/** @ngInject  */
    constructor($http, $state, $window, $rootScope, LoaderService, AuthService, AdminCompanyInfoService, GeneralSettingsService,ThemeSettingsService, APP_CONSTANTS, $storage) {
        _this = this;
        _this.$window = $window;
        _this.$storage = $storage;
        _this.$storage.clear();
        _this.$state = $state;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.SITEKEY = _this.APP_CONSTANTS.RECAPTCHA_KEY;
        _this.AdminCompanyInfoService = AdminCompanyInfoService;
        _this.GeneralSettingsService = GeneralSettingsService;
        _this.LoaderService = LoaderService;
        _this.$rootScope = $rootScope;
        _this.ThemeSettingsService= ThemeSettingsService;
        _this.$rootScope.user = null;
       // _this.deviceDetector = deviceDetector;
        _this.$rootScope.isLoggedIn = false;
        _this.$rootScope.companyLogoPath = "./img/logo.png";
        _this.$rootScope.profilePicPath = "./img/user.png";
        _this.$rootScope.smallLogo = "";
        _this.email = "";
        _this.isEmailValid = false;
        let email = _this.$storage.getItem('email');
        if(email !== "undefined" && email !== undefined && email !== null){
           _this.email = email;
        }
        _this.showRecaptchaForCandidate = false;
        _this.showRecaptchaForCompany = false;
        _this.errorTranslationKey = "";
        _this.userType = 1;
        _this.showHeaderContain = false;
        _this.userTypeList = [];
        _this.appTypeId = '';

        console.log('current state: ' + _this.$state.current);
        console.log('current state: ' + _this.$state.current.name);
      //  _this.getUserType();
        console.log('Login Controller Loaded');

    }

    get errorTranslationKey() {
        return _this.AuthService.errorTranslationKey;
    }

    set errorTranslationKey(errorTranslationKey) {
        _this.AuthService.errorTranslationKey = errorTranslationKey;
    }

    checkMandatoryFields() {
        if( _this.email  && _this.email!== ''
            && _this.password && _this.password!==''
        )
        {
            return true;
        }else
        {
            _this.form.$setSubmitted();
            return false;
        }
    }
    clearFormValue() {
        _this.email='';
        _this.password='';
        _this.errormessage = "";
        _this.errormessageUser = "";
        _this.form.$setPristine();
        _this.form.$setUntouched();
        _this.candidateForm.$setPristine();
        _this.candidateForm.$setUntouched();
    }
    
    doLogin(userType) {
       
        _this.userType = userType;
        if(!angular.isDefined( _this.email) ||  _this.email == '' && userType == 1) {
            //_this.errormessage = "Please Enter Email Id";
            _this.errormessageUser = " Please Enter Email Id";
        }
        if(!angular.isDefined( _this.email) ||  _this.email == '' && userType == 2){
            _this.errormessage = "Please Enter Email Id";

        }

        if (_this.checkMandatoryFields()) {

            let onSuccess = (response) => {
                _this.AuthService.saveCurrentUser(response.data);
                let type = response.data.userType;
                let role = response.data.userRoles;
                let firstLogin = response.data.firstLogin;

                if (type !== 2) {
                    _this.getCompanyLogo();
                    _this.getUserProfilePic();
                } else {
                    _this.getCandidateProfilePic();
                }
                _this.getThemeList();
                _this.detectApplicationType();

                if (role === 7 || role === 8 || role === 9 || role === 10 || role === 11 || role === 12 || role === 13 || role === 14 || role === 15 || role === 16 || role === 17) {
                    _this.$state.go('sa.home');
                }
                else if (role === 5) {
                    _this.$state.go('candidateProfile.home');
                }
                else if (role === 18) {
                      if(firstLogin === true){
                        _this.$state.go('conference.conference-home',{introConferenceParam:true} );
                      }else
                      {
                           _this.$state.go('conference.conference-home');
                      }                   
                }
                else {
                    let products = response.data.products;
                    if (products
                        && products.length === 1
                        && products[0] === 2) {
                       
                         if(firstLogin === true){
                          _this.$state.go('conference.conference-home',{introConferenceParam:true} );
                        }
                        else {
                          _this.$state.go('conference.conference-home');
                        }
                    } else {
                        if(firstLogin === true){
                          _this.$state.go('app.dashboard',{introParam:true} );
                        }
                        else {
                          _this.$state.go('app.dashboard');
                        }
                    }
                }

            };

            let onError = (response) => {
                if (response !== null) {
                    _this.showCaptcha(_this.userType);
                    _this.form && _this.form.$setPristine();
                    _this.candidateForm && _this.candidateForm.$setPristine();
                }
            };
            // if (_this.$state.current.name == 'app.candidate-login') {
            //     _this.userType = 2;
            //     console.log('user value : ' + _this.userType);
            // }
            // else if (_this.$state.current.name == 'app.user-login') {
            //     _this.userType = 1;
            //     console.log('user value : ' + _this.userType);
            // }
            _this.LoaderService.show();


            _this.AuthService.doLogin({
                username: _this.email,
                password: _this.password,
                userType: _this.userType
                //rememberMe: _this.isRemember
            });
            _this.AuthService.activePromise.then(onSuccess, onError)['finally'](_this.LoaderService.hide);
        }
    }

    //rememberFunc(){
      //if(isRemember==true){
         //localStorage.setItem(_this.email , _this.password);
      //}
    //}
    showCaptcha(type){
        if(type === 1){
            loginAttemptCountForCompany++;
            if (loginAttemptCountForCompany >= 3) {
                _this.showRecaptchaForCompany = true;
            }
        }else{
            loginAttemptCountForCandidate++;
            if (loginAttemptCountForCandidate >= 3) {
                _this.showRecaptchaForCandidate = true;
            }
        }

    }

    getUserType(){
        let onSuccess = (response) => {
           _this.userTypeList = response.data;
        },
        onError = (error) => {
            console.log(error);
        };
        _this.AuthService.getUserType();
        _this.AuthService.activePromise.then(onSuccess, onError);
    }

    getCompanyLogo(){
        let onSuccess = (response) => {
               var companyLogoPath = "./img/logo.png";
                if(response.data.logo){
                    companyLogoPath = response.data.logo !== "" ? response.data.logo : "./img/logo.png";
                }
                _this.$rootScope.companyLogoPath = companyLogoPath;
                _this.$storage.setItem('companyLogoPath' , companyLogoPath);
          },
          onError = (error) => {
              console.log(error);
          };
        _this.AdminCompanyInfoService.getCompanyLogo();
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
    }

    getUserProfilePic(){
        let onSuccess = (response) => {
            let profilePicPath = "./img/user.png";
            if(response.data.profileImage){
               profilePicPath = response.data.profileImage !== "" ? response.data.profileImage : "./img/user.png";
            }
            _this.$rootScope.profilePicPath = profilePicPath;
            _this.$storage.setItem('profilePicPath' , profilePicPath);
          },
          onError = (error) =>{
            console.log(error);
          };
        _this.GeneralSettingsService.getUserProfilePic();
        _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
      }

    getCandidateProfilePic(){
       let onSuccess = (response) => {
            let profilePicPath = "./img/user.png";
            if(response.data.profileImage){
               profilePicPath = response.data.profileImage !== "" ? response.data.profileImage : "./img/user.png";
            }
            _this.$rootScope.profilePicPath = profilePicPath;
            _this.$storage.setItem('profilePicPath', profilePicPath);
          },
          onError = (error) =>{
            console.log(error);
          };
        _this.GeneralSettingsService.getCandidateProfilePic();
        _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
    }

    isInvalidEmail(email){
      _this.errormessage = "";
     if(!angular.isDefined(email) || email === "" || email === null){
        _this.errormessage = "Please Enter Email Id";
      }
      else if(angular.isDefined(email) && !reg.test(email)){
        _this.errormessage = "Enter Valid Email Id";
      }
     else {
        _this.errormessage = "";
      }

    };

    isInvalidEmailUser(email){
      _this.errormessageUser = "";
    if(!angular.isDefined(email) || email === "" || email === null){
        _this.errormessageUser = "Please Enter Email Id";
      }
    else if(angular.isDefined(email) && !regExp.test(email)){
        _this.errormessageUser = "Enter Valid Email Id";
      }
      else {
        _this.errormessageUser = "";
      }


    };

    changeTheme(){
      console.log(_this.theme);
      if(angular.isDefined(_this.theme) && _this.theme !== null && _this.theme.name){
        _this.$rootScope.themeClass =_this.theme.name;
        if (typeof(Storage) !== "undefined") {
          // Code for localStorage/session$storage.
          _this.$storage.setItem('theme',_this.$rootScope.themeClass );
        } else {
          console.log('Local Storage not supported')
        }
      }
    }

    getThemeList() {
      let onSuccess = (response) => {
          _this.themes = response.data;
          _this.getThemeByUserId();
        },
        onError = (error) => {
          console.log(error);
        };
      _this.ThemeSettingsService.getThemeList();
      _this.ThemeSettingsService.activePromise.then(onSuccess, onError);
    }

    getThemeByUserId(){
      let onSuccess = (response) => {
          _this.userThemes = response.data;
          for(var i = 0; i < _this.userThemes.length; i++){
            _this.theme = _.find(_this.themes, function (theme) {
              return theme.id == _this.userThemes[i].id;
            });
          }
        _this.changeTheme();
        },
        onError = (error) => {
          console.log(error);
        };
      _this.ThemeSettingsService.getThemeByUserId();
      _this.ThemeSettingsService.activePromise.then(onSuccess, onError);
    }

    detectApplicationType(){
      // if(_this.$window.navigator.userAgent.match(/iPhone|iPad|iPod/i)){
      //   _this.appTypeId = 1;
      // }
      if(_this.$window.navigator.userAgent.indexOf("Mac") !== -1 || _this.$window.navigator.userAgent.match(/iPhone|iPad|iPod/i)){
        _this.appTypeId = 1;
      }
      else if(_this.$window.navigator.userAgent.indexOf("Android") !== -1){
        _this.appTypeId = 2;
      }
      // else if(_this.$window.navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/Chrome/i) || navigator.userAgent.match(/Firefox/i) ){
      //   _this.appTypeId = 3;
      // }
      else if(_this.$window.navigator.userAgent.indexOf("Win")!== -1){
        _this.appTypeId = 3;
      }
      else{
        _this.appTypeId = 4;
      }

      _this.getAppType(_this.appTypeId);
    }

    getAppType(appId){
       let onSuccess = (response) => {

        },
        onError = (error) => {
            console.log(error);
        }
        _this.GeneralSettingsService.getApplicationType(appId).then(onSuccess,onError);
    }
    showCandidateImage(){
        
        //document.getElementById('canImg').style.opacity="1";
        document.getElementById('usertext').style.display = "none";
        document.getElementById('cantext').style.display = "block";
       // document.getElementById('userimg').style.opacity="0"
    }
    showUserImage(){
       

      //  document.getElementById('canImg').style.opacity="0";
       // document.getElementById('userimg').style.opacity="1";
        document.getElementById('cantext').style.display="none";
        document.getElementById('usertext').style.display="block";
    }

    // showProcess() {
    //     $('#target').show(500);
    //     $('.Show').hide(0);
    //     $('.Hide').show(0);
    // }

    // hideProcess() {
    //     $('#target').hide(500);
    //     $('.Show').show(0);
    //     $('.Hide').hide(0);
    // }
}


