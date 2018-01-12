let _this,
  companyUrlForms = [],
  counter = 0;
let phoneRegex = /^[7-9][0-9]{9}|\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/g;
let urlRegex = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
let zipCodeRegex = new RegExp("^[1-9][0-9]{4,5}$");

/*
 @CompanyInfoController Controller
 @param {object} $state - service that can contain some state.
 @param {object} companyInfoService - returns the object and provides all the values and methods related to the companyInfo.
 @param {object} LoaderService -  It is service which helps in showing the progress bar.
 @param {object} locationService -  It is service which provides the methods for fetching country, state and city list.
 */
export class CompanyInfoController {
  /** @ngInject  */
  constructor($state, $window, $rootScope, companyInfoService, LoaderService, locationService, UtilsService) {
    _this = this;
    _this.$state = $state;
    _this.$rootScope = $rootScope;
    _this.companyInfoService = companyInfoService;
    _this.locationService = locationService;
    _this.LoaderService = LoaderService;
    _this.UtilsService = UtilsService;
    _this.companyInfo = {};
    _this.getCustomUrlList();
    //_this.companyInfoService.getCompanyUrlForms();
    _this.locationService.getCountryList();
    _this.errorTranslationKey = "";
    _this.fileNotSelected = false;
    _this.isStateDisabled = true;
    _this.isCityDisabled = true;
    _this.candidateUrls = [];
    _this.showAddMore = true;
    _this.appTypeId = '';
    _this.$rootScope.companyLogoPath = "./img/logo.png";
    _this.$rootScope.profilePicPath = "./img/user.png";
    _this.geoAddress = {};
  }

  /* getter and setter starts from here */
  get countryList() {
    return _this.locationService.countryList;
  }

  get stateList() {
    return _this.locationService.stateList;
  }

  get cityList() {
    return _this.locationService.cityList;
  }


  get activePromise() {
    return _this.companyInfoService.activePromise;
  }


  get companyInfo() {
    return _this.companyInfoService.companyInfo;
  }

  set companyInfo(value) {
    _this.companyInfoService.companyInfo = value;
  }

  get otherCompanies() {
    return _this.companyInfoService.otherCompanies;
  }

  get companyUrlForms() {
    return _this.companyInfoService.companyUrlForms;
  }

  /* getter and setter ends here */

  /*
   * @name - uploadFile
   * @param {object} file - object for file to be uploaded
   * @description - function for uploading files
   */
  uploadFile(file) {
    _this.companyInfoService.logoFile = file[0];
    _this.companyLogo = file[0];
    _this.UtilsService.checkFileSize(file[0], '512KB');
  }

  /*
   * @name - addCompanyUrlForm
   * @description - function for calling companyInfoService addCompanyUrlForm function
   */
  addCompanyUrlForm() {
    _this.companyInfoService.addCompanyUrlForm();
  }

  /*
   * @name - isFileAdded
   * @param {object} file - object for file to be uploaded
   * @description - function sets the value of fileNotSelected variable based on selected files
   */
  isFileAdded(file) {
    //_this.fileSelected = file.length > 0 ? false : true;
    if (file.length > 0) {
      _this.fileNotSelected = true;
    }
    else {
      _this.fileNotSelected = false;
    }
  }

  /*
   * @name - addUrlField
   * @description - function adds new item to companyUrlForms array.
   */
  addUrlField() {
    counter++;
    companyUrlForms.push({
      "urlTypeId": counter,
      "url": "abc"
    });
  }

  deleteUrlField(index) {
    _this.companyUrlForms.splice(index, 1);
    _this.candidateProfileInfo.candidateUrl.splice(index, 1);
  }
  /*
   * @name - getCityByState
   * @param {int} countryId - this variable stores the country id
   * @description - function fetches the states based on country id
   */
  getStatesByCountry(countryId, type) {
    if (type === 1) {
      _this.companyInfo.state = '';
      _this.companyInfo.city = '';
    }
    _this.isStateDisabled = false;
    _this.isCityDisabled = true;
    _this.locationService.getStateList(countryId);
    //_this.getCityByState(0);
    _this.companyInfoForm.$setPristine();
    _this.companyInfoForm.$setUntouched();
  }

  /*
   * @name - getCityByState
   * @param {int} stateId - this variable stores the state id
   * @description - function fetches the city based on state id
   */
  getCityByState(stateId, type) {
    if (type === 1) {
      _this.companyInfo.city = '';
    }
    _this.isCityDisabled = false;
    _this.locationService.getCityList(stateId);
    _this.companyInfoForm.$setPristine();
    _this.companyInfoForm.$setUntouched();
  }

  checkMandatoryFields() {
    _this.companyInfo.address = _this.geoAddress.name;
    if (_this.companyInfo.firstName && _this.companyInfo.firstName !== ''
      && _this.companyInfo.lastName && _this.companyInfo.lastName !== ''
      && _this.companyInfo.jobTitle && _this.companyInfo.jobTitle !== ''
      && _this.companyInfo.companyName && _this.companyInfo.companyName !== ''
      && _this.companyInfo.companySize && _this.companyInfo.companySize !== ''
      && _this.companyInfo.address && _this.companyInfo.address !== ''
      && _this.companyInfo.companyContactNo && _this.companyInfo.companyContactNo !== ''
      && _this.companyInfo.companyWebsite && _this.companyInfo.companyWebsite !== ''
      && _this.companyInfo.isAgree && _this.companyInfo.isAgree !== false
      && _this.contactCriteria === true
      && _this.urlCriteria === true
    ) {
      return true;
    }
    else {
      _this.companyInfoForm.$setSubmitted();
      return false;
    }
  }

  /*
   * @name - saveCompanyInfo
   * @description - function calls the companyInfoService service's saveCompanyInfo method that saves the company data.
   */
  saveCompanyInfo() {

    if (!angular.isDefined(_this.companyInfo.companyContactNo) || _this.companyInfo.companyContactNo === "" || _this.companyInfo.companyContactNo === null) {
      _this.errmsgcon = "Contact Number Is Required";
    }

    //if(!angular.isDefined(_this.companyInfo.zipCode) || _this.companyInfo.zipCode === "" || _this.companyInfo.zipCode === null){
    //   _this.errormessagezip = "Zip Code Is Required";
    //}

    if (!angular.isDefined(_this.companyInfo.companyWebsite) || _this.companyInfo.companyWebsite === "" || _this.companyInfo.companyWebsite === null) {
      _this.errormessageurl = "Please Enter Company Url";

    }

    if (_this.checkMandatoryFields()) {
      let onSuccess = () => {
        if (angular.isDefined(_this.companyLogo)) {
          _this.companyInfoService.uploadFile(_this.companyLogo);

        }
        _this.detectApplicationType();
      },
        onError = (error) => {
          console.log(error);
        };
        console.log(_this.$state);
      _this.companyInfo.emailToken = _this.$state.params.token;
      _this.companyInfo.companyUrlForms = _this.candidateUrls;

      _this.companyInfoService.saveCompanyInfo(_this.companyInfo);
      _this.LoaderService.show();
      _this.companyInfoService.activePromise.then(onSuccess, onError)['finally'](_this.LoaderService.hide);
    }
  }

  analyzePhoneNumber(companyContactNo) {
    _this.errmsgcon = "";
    if (angular.isDefined(companyContactNo) && companyContactNo.length < 10) {
      _this.errmsgcon = "Enter Valid Contact Number";
      _this.contactCriteria = false;
    }
    else if (!angular.isDefined(companyContactNo) || companyContactNo === "" || companyContactNo === null) {
      _this.errmsgcon = "Contact Number Is Required";
    } else {
      _this.errmsgcon = "";
      _this.contactCriteria = true;
    }
  }

  analyzeZipCode(zipCode) {
    _this.errormessagezip = "";
    if (angular.isDefined(zipCode) && !zipCodeRegex.test(zipCode)) {
      _this.errormessagezip = "Enter Valid Zip Code";
      _this.zipCriteria = false;
    }
    else if (!angular.isDefined(zipCode) || zipCode === "" || zipCode === null) {
      _this.errormessagezip = "Zip Code Is Required";
    }
    else {
      _this.errormessagezip = "";
      _this.zipCriteria = true;
    }
  }

  analyzeUrl(companyWebsite) {
    _this.errormessageurl = "";
    if (!angular.isDefined(companyWebsite) || companyWebsite === "" || companyWebsite === null) {
      _this.errormessageurl = "Please Enter Company Url";
      _this.urlCriteria = false;
    }
    else if (angular.isDefined(companyWebsite) && !urlRegex.test(companyWebsite)) {
      _this.errormessageurl = " Enter Valid Company Url";
    }
    else {
      _this.errormessageurl = "";
      _this.urlCriteria = true;
    }
  }

  analyzeCompanyUrl(url) {
    _this.errormessagecompurl = "";
    if (!angular.isDefined(url) || url === "" || url === null) {
      //_this.errormessagecompurl = "Please Enter Company Url";
    }
    else if (angular.isDefined(url) && !urlRegex.test(url)) {
      _this.errormessagecompurl = " Enter Valid Company Url";
      _this.messageofError = "";
      _this.msg = false;
    }
    else {
      _this.errormessagecompurl = "";
      _this.msg = true;
    }
  }

  addCandidateUrl() {
    let candidateUrlData = {};
    if (!angular.isDefined(_this.candidateUrlData.urlType) || _this.candidateUrlData.urlType === "" || _this.candidateUrlData.urlType === null) {
      _this.errorMessageOtherCompanyUrl = "Please Select Field";
    }
    if (!angular.isDefined(_this.candidateUrlData.url) || _this.candidateUrlData.url === "" || _this.candidateUrlData.url === null) {
      _this.messageofError = "Please Enter Url";
    }

    if (_this.candidateUrlData
      && _this.candidateUrlData.url
      && _this.candidateUrlData.url.length > 0
      && _this.candidateUrlData.urlType
      && _this.candidateUrlData.urlType.urlTypeId
      && _this.msg) {
      candidateUrlData.url = _this.candidateUrlData.url;
      candidateUrlData.urlTypeId = _this.candidateUrlData.urlType.urlTypeId;
      if (_this.candidateUrls.length < 4) {
        _this.candidateUrls.push(candidateUrlData);
        _this.candidateUrlData = {};
      } else {
        _this.UtilsService.notify('You Can Only Add Four Urls.');
      }
      _this.candidateUrlData = {};
      _this.errorMessageOtherCompanyUrl = "";
      _this.messageofError = "";
    }
  }

  deleteCandidateUrl(index) {
    _this.candidateUrls.splice(index, 1);
    //_this.candidateProfileInfo.candidateUrl.splice(index, 1);
  }

  getCustomUrlList() {
    let onSuccess = (response) => {
      _this.customUrlList = response.data;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.companyInfoService.getCompanyUrlForms();
    _this.companyInfoService.activePromise.then(onSuccess, onError);

  }

  removeInvalidFirstNameCi(firstName) {
    if (angular.isDefined(firstName)) {
      for (var i = 0; i < firstName.length; i++) {
        var code = firstName.charCodeAt(i);
        if (!(code >= 65 && code <= 91) && !(code >= 97 && code <= 122) && !(code == 32)) {
          _this.companyInfo.firstName = "";
          return;
        }
      }
    }
  }

  removeInvalidLastNameCi(lastName) {
    if (angular.isDefined(lastName)) {
      for (var i = 0; i < lastName.length; i++) {
        var code = lastName.charCodeAt(i);
        if (!(code >= 65 && code <= 91) && !(code >= 97 && code <= 122) && !(code == 32)) {
          _this.companyInfo.lastName = "";
          return;
        }
      }
    }
  }

  detectApplicationType() {
    if (_this.$window.navigator.userAgent.indexOf("Mac") !== -1 || _this.$window.navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      _this.appTypeId = 1;
    }
    else if (_this.$window.navigator.userAgent.indexOf("Android") !== -1) {
      _this.appTypeId = 2;
    }
    else if (_this.$window.navigator.userAgent.indexOf("Win") !== -1) {
      _this.appTypeId = 3;
    }
    else {
      _this.appTypeId = 4;
    }

    _this.getAppType(_this.appTypeId);
  }

  getAppType(appId) {
    let onSuccess = (response) => {

    },
      onError = (error) => {
        console.log(error);
      };
    _this.GeneralSettingsService.getApplicationType(appId).then(onSuccess, onError);
  }

  analyzeOtherCompany(urlType) {
    _this.errorMessageOtherCompanyUrl = "";
    if (!angular.isDefined(urlType) || urlType === "" || urlType === null) {
      _this.errorMessageOtherCompanyUrl = "Please Select Field";
    }
    else {
      _this.errorMessageOtherCompanyUrl = "";
    }
  }
  clearSearchSize() {
    _this.searchSize = '';
  }
  clearSearchState() {
    _this.searchState = '';
  }
  clearSearchCity() {
    _this.searchCity = '';
  }

}
