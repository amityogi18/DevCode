let _email,
    _password,
    _errorTranslationKey,
    _emailToken,
    _this,
    _activePromise;

export class AuthService {
    /** @ngInject */
    constructor($q, $http, $window, $interval, $rootScope, $state, UtilsService, APP_CONSTANTS, $storage) {
        _this = this;
        _this.$q = $q;
        _this.$http = $http;
        _this.$window = $window;
        _this.$storage = $storage;
        _this.$interval = $interval;
        _this.$rootScope =  $rootScope;
        _this.$state = $state;
        _this.UtilsService = UtilsService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.noRoute = false;
        _this.TOKEN_LIFESPAN = 1000 * 60 * 5; //Token refreshes after every 5 minutes

        let user = _this.$storage.getItem('user') || $window.sessionStorage.user;
        if(user) {
            _this.user = JSON.parse(user);
        }
    }

    get activePromise() {
        return _activePromise;
    }

    get email() {
        return _email;
    }

    set email(value) {
        _email = value;
    }

    get password() {
        return _password;
    }

    set password(value) {
        _password = value;
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

    refreshToken(refresh) {
        if(!_this.user) {
            return;
        }

        let _data = {
            "grant_type": "refresh_token",
            "client_id": "assessment_app",
            "client_secret": "assessment_app_s3cr3t",
            "username": _this.user.email,
            "refresh_token": _this.user.refreshToken,
            "scope": "read,write,trust",
            "userType" : _this.user.userType
        };

        let _config = {
            headers: {"content-type": "application/x-www-form-urlencoded"},
            transformRequest: _this.UtilsService.transformRequestForFormEncoded
        };

        let onSuccess = (response) => {
            let user = response.data;
            _this.saveCurrentUser(user);
        };
        if(_this.user && _this.user.email){
            //let dateDiff = ((new Date().getTime()  - _this.user.tokenCreatedAt));
            //if( (dateDiff > _this.TOKEN_LIFESPAN) || refresh) {
            if(refresh) {
                let promise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/oauth/token', _data, _config);
                return promise.then(onSuccess);
            }
        }        
    }

    saveCurrentUser(user, rememberMe) {
        //let storage = rememberMe ? _this.$window.localStorage : _this.$window.sessionStorage;
        //let storage = _this.$window.localStorage;
        user.tokenCreatedAt = new Date().getTime();
        user.userRoles = user.authorities;
        _this.$storage.setItem('user',JSON.stringify(user));
        _this.user = user;
        _this.$rootScope.isLoggedIn = true;
        _this.$rootScope.user = user;
        _this.$storage.setItem('email', user.username);
    }

    removeCurrentUser(userType){
       _this.user = null;
       _this.$storage.removeItem('user');
       _this.$window.sessionStorage.removeItem('user');
       _this.$storage.removeItem('profilePicPath');
       _this.$storage.removeItem('companyLogoPath');
       _this.$storage.removeItem('theme');
       _this.$rootScope.user = "";
       _this.$rootScope.companyLogoPath = "./img/logo.png";
       _this.$rootScope.profilePicPath = "./img/user.png";
       _this.$rootScope.isLoggedIn = false;
        if (angular.isDefined(_this.$rootScope.notification)) {
            _this.$interval.cancel(_this.$rootScope.notification);
            _this.$rootScope.notification = undefined;
        }
        if(!_this.noRoute) {
            if(userType == 1){
                _this.$state.go('app.user-login');
            }else{
                _this.$state.go('app.candidate-login');
            }
        }
       
    }

    updateCurrentUser(updatedUser, rememberMe) {
        let storage = rememberMe ? _this.$window.localStorage : _this.$window.sessionStorage;
        let user = _this.user;
        user.fullName = updatedUser.firstName + " " + updatedUser.lastName;
        user.tokenCreatedAt = new Date().getTime();
        user.userRoles = _this.user.authorities;
        _this.$storage.setItem('user', JSON.stringify(user));
        _this.user = user;
        _this.$rootScope.isLoggedIn = true;
        _this.$rootScope.user = user;
        _this.$storage.setItem('email', user.username);
    }

    logout() {
        let userType =  _this.user.userType;
        let onSuccess = () => {
           _this.removeCurrentUser(userType);
        },
        onError = (error) => {
           _this.removeCurrentUser(userType);
           console.log(error);
        },
        config = _this.UtilsService.getCofigObj();
        _this.$storage.setItem('userLoggedOff', Math.random());
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/logout/'+ userType, config);
        _activePromise.then(onSuccess, onError);
    }
    logoutForSignup() {
        _this.noRoute = true;
        _this.logout();
    }
    
    doLogin(options) {
        let onSuccess = (response) => {
                _emailToken = response.data.accessToken;
                _this.saveCurrentUser(response.data, options.rememberMe);
            },
            onError = (error) => {
              console.log(error);
            };

        let _data = {
            "grant_type": "password",
            "client_id": "assessment_app",
            "client_secret": "assessment_app_s3cr3t",
            "username": options.username,
            "password": options.password,
            "scope": "read,write,trust",
            "userType" : options.userType
        };

        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/oauth/token', _data);
        //_activePromise.then(onSuccess, onError);
    }
    
    loginToApplyForJob(options) {
        let _data = {
            "grant_type": "password",
            "client_id": "assessment_app",
            "client_secret": "assessment_app_s3cr3t",
            "username": options.username,
            "password": options.password,
            "scope": "read,write,trust",
            "userType" : options.userType
        };

        return _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/oauth/token', _data);
    }

    doAutoLoginForCandidate(token){
         let onSuccess = (response) => {
                 _emailToken = response.data.accessToken;
                 _this.saveCurrentUser(response.data, false);
             },
             onError = (error) => {
                  console.log(error);
             };

        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate-confirmation/'+token);
        _activePromise.then(onSuccess, onError);
    }

    getFullName(){
        let fullName = _this.user ? _this.user.fullName : "";
        return fullName;
    }

    getAccessToken(){
        return _this.user ?  _this.user.tokenType + " " + _this.user.accessToken : "";
    }

    isUserLoggedIn(){
        return _this.user ?  true : false;
    }

    getUserType(){
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/userTypes');
    }
}