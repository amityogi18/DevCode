let _activePromise,
    _errorTranslationKey,
    _emailToken,
    _companyId,
    _logoFile,
    _otherCompanies,
    _companyUrlForms = [],
    _this;

/*
 @CompanyInfoService Service
 @param {object} $http - service that enable us to make ajax calls
 @param {object} $state -  service that can contain some state.
 @param {object} Upload -  It is service which helps in uploading files.
 @param {object} AuthService -  It is service provides methods related to login and logout and saving user.
 */
export class CompanyInfoService {
	/** @ngInject  */
    constructor($http, $state,Upload, AuthService,APP_CONSTANTS, UtilsService,$rootScope,$window, $storage) {
        _this = this;
        _this.$http = $http;
        _this.Upload = Upload;
        _this.$state = $state;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService =UtilsService;
       _this.$rootScope=$rootScope;
       _this.$window=$window;
       _this.$storage = $storage;
    }

    /* getters and setters starts from here*/
    get logoFile() {
        return _logoFile;
    }

    set logoFile(file) {
        _logoFile = file;
    }

    get otherCompanies() {
        return _otherCompanies;
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

    get companyUrlForms() {
        return _companyUrlForms;
    }

    get emailToken() {
        return _emailToken;
    }

    get companyId() {
        return _companyId;
    }
    /* getters and setters ends here*/


    /*
     * @name - getCompanyUrlForms
     * @description - This method calls an api and uploadsthe file to server.
     */
    getCompanyUrlForms() {
      //let config  = _this.UtilsService.getCofigObj();
     
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/url-types');
    }

    /*
    * @name - addCompanyUrlForm
    * @description - This method adds userId and url to the _companyUrlForms array.
    */
    addCompanyUrlForm() {
        _companyUrlForms.push({
            urlTypeId: 1,
            url: ''
        });
    }

    /*
     * @name - uploadFile
     * @description - This method call an api that uploads file to server.
     */
    uploadFile(logo) {
      let config  = _this.UtilsService.postCofigObj();
        var onSuccess = (response) => {
            console.log(response.data);
            _this.$rootScope.companyLogoPath = response.data.logo;
            _this.$storage.setItem('companyLogoPath', response.data.logo);
            },
            onError = (error) => {
                _errorTranslationKey = error.data.errorCode;
                _emailToken = error.data.emailToken;
                _activePromise = null;
            };
        // code to upload file
        _activePromise = _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL+'/logo/upload',
            data: {companyLogo: logo, companyId: _companyId},
            headers: config.headers
        });
        _activePromise.then(onSuccess, onError);
    }

    /*
     * @name - saveCompanyInfo
     * @param {object} companyInfo - this object contains the company details.
     * @description - This method call an api that saves the company details.
     */
    saveCompanyInfo(companyInfo) {
        var onSuccess = (response) => {
               _companyId = response.data.companyId;
               _this.AuthService.saveCurrentUser(response.data, false);
               _activePromise = null;
               if(response && response.data 
                       && response.data.products 
                       && response.data.products.length === 1
                       && response.data.products[0] === 2){
                 _this.$state.go('conference.conference-home');
               }else
               {
                 _this.$state.go('app.dashboard',{introParam:true});
               }               
            },
            onError = (error) => {
               _errorTranslationKey = error.data.errorCode;
               _emailToken = error.data.emailToken;
                _activePromise = null;
            };


        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL+'/signup/complete', companyInfo);
        _activePromise.then(onSuccess, onError);
    }
}

