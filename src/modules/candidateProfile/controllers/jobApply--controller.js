let _this;
let strongRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,15}$/;
let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export class jobApplyController {
  /** @ngInject  */
  constructor(jobDescriptionService, $stateParams, $location, $state, AuthService, locationService, AdminDepartmentService, CandidateProfileService, APP_CONSTANTS, CandidateSignupService, LoaderService, UtilsService) {
    _this = this;
    _this.jobDescriptionService = jobDescriptionService;
    _this.$stateParams = $stateParams;
    _this.$location = $location;
    _this.$state = $state;
    _this.AuthService = AuthService;
    _this.locationService = locationService;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.CandidateSignupService = CandidateSignupService;
    _this.LoaderService = LoaderService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
    _this.SITEKEY = _this.APP_CONSTANTS.RECAPTCHA_KEY;
    _this.jobId = _this.$stateParams.jobId || 1;
    _this.isLoginShow = true;
    _this.isRegisterShow = false;
    _this.jobDescription = {};
    _this.getJobDescription(_this.jobId);
    _this.countryList = [];
    _this.stateList = [];
    _this.cityList = [];
    _this.getCountryList();
    _this.departmentList = [];
    _this.designationList = [];
    _this.getDepartment();
    _this.isStateDisabled = true;
    _this.isCityDisabled = true;
    _this.isDesignationDisabled = true;
    _this.isEmailReSent = false;
    _this.passwordMismatch = false;
    _this.isPasswordRight = false;
    _this.isEmailValid = false;
    _this.isAgree = false;
    _this.isApplied = false;
    _this.candidateData = [];
    _this.searchCountry;
    _this.searchState;
    _this.searchCity;
    _this.searchDepartment;
    _this.searchRole;
    _this.additionalSection = false;
    _this.loginAdditionalData = {};
    _this.registerData = {};
    _this.geoAddress = {};
    _this.tempToken = "";
    _this.isSizeExceeded = false;
  }

  clearSearchTerm() {
    _this.searchCountry = '';
  }

  clearSearchStateInput() {
    _this.searchState = '';
  }

  clearSearchCityInput() {
    _this.searchCity = '';
  }

  clearSearchDepartment() {
    _this.searchDepartment = '';
  }

  clearSearchDesignation() {
    _this.searchRole = '';
  }

  confirmPasswords(value) {
    if (_this.password !== value) {
      _this.passwordMismatch = true;
    } else {
      _this.passwordMismatch = false;
    }
  }

  analyzePassword(value) {
    _this.isPasswordRight = strongRegex.test(value);
  }

  analyzePhoneNumber(value) {
    _this.errmsgcon = "";
    if (angular.isDefined(value) && value.length < 10) {
      _this.errmsgcon = "Enter Valid Contact Number";
      _this.contactCriteria = false;
    }
    else if (!angular.isDefined(value) || value === "" || value === null) {
      _this.errmsgcon = "Please Enter Contact Number";
    } else {
      _this.errmsgcon = "";
      _this.contactCriteria = true;
    }
  }

  isInvalidEmail(email) {
    _this.errormessage = "";
    if (angular.isDefined(email) && !reg.test(email)) {
      _this.errormessage = "Enter Valid Email Id";
      _this.emailCriteria = false;
    }
    else if (!angular.isDefined(email) || email === "" || email === null) {
      _this.errormessage = " Please Enter Email Id";
    } else {
      _this.errormessage = "";
      _this.emailCriteria = true;
    }
  }

  isLoginFileAdded(file) {
    if (file.length > 0) {
      _this.fileNotSelected = true;
    }
    else {
      _this.fileNotSelected = false;
    }
  }

  checkMandatoryFields() {
    _this.registerData.address = _this.geoAddress.name;
    if (_this.registerData.firstName && _this.registerData.firstName !== ''
      && _this.registerData.lastName && _this.registerData.lastName !== ''
      && _this.registerData.address && _this.registerData.address !== ''
      && _this.registerData.contactNumber && _this.registerData.contactNumber !== ''
      && _this.registerData.password && _this.registerData.password !== ''
      && _this.confirmPassword && _this.confirmPassword !== ''
      && _this.confirmPassword === _this.registerData.password
      && _this.registerData.departmentId && _this.registerData.departmentId !== ''
      && _this.registerData.designationId && _this.registerData.designationId !== ''
      && _this.isAgree && _this.isAgree !== false
      && _this.contactCriteria === true
      && _this.emailCriteria === true
    ) {
      return true;
    }
    else {
      _this.candidateSignupForm.$setSubmitted();
      return false;
    }
  }

  uploadLoginFile(file) {
    _this.fileSelected = file.length > 0 ? true : false;
    _this.isSizeExceeded = _this.UtilsService.checkFileSize(file[0], '512KB');
    _this.loginAdditionalData.candidateLogo = file[0];

  }

  isLoginResumeFileAdded(file) {
    if (file.length > 0) {
      _this.fileNotSelected = true;
    }
    else {
      _this.fileNotSelected = false;
    }
  }

  uploadLoginResumeFile(file) {
    _this.loginAdditionalData.resume = file[0];
  }

  isRegisterFileAdded(file) {
    if (file.length > 0) {
      _this.fileNotSelected = true;
    }
    else {
      _this.fileNotSelected = false;
    }
  }

  uploadRegisterFile(file) {
    _this.registerAdditionalData.candidateLogo = file[0];
  }

  isRegisterResumeFileAdded(file) {
    if (file.length > 0) {
      _this.fileNotSelected = true;
    }
    else {
      _this.fileNotSelected = false;
    }
  }

  uploadRegisterResumeFile(file) {
    _this.registerAdditionalData.resume = file[0];
  }

  getJobDescription(jobId) {
    let onSuccess = (response) => {
      _this.jobDescription1 = response.data.response.docs[0];
      _this.jobDescription.jobTitle = _this.jobDescription1.jobtitle;
      _this.jobDescription.jobDescription = _this.jobDescription1.jobdescription;
      _this.jobDescription.jobUrl = _this.jobDescription1.jobdetailurl;
      _this.jobDescription.companyName = _this.jobDescription1.company;
      _this.jobDescription.location = _this.jobDescription1.location;
      _this.jobDescription.jobCreatedDate = _this.jobDescription1.jobcreationdate;
      _this.jobDescription.jobExpiryDate = _this.jobDescription1.jobexpirydate;
      _this.jobDescription.jobCode = _this.jobDescription1.jobCode;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.jobDescriptionService.getAppliedJobDescription(jobId).then(onSuccess, onError);
  }

  loginToApplyForJob() {
    let onSuccess = (response) => {
      _this.candidateUserId = response.data.userId;
      _this.tempToken = response.data.accessToken;
      _this.candidateAppliedDetailsById(_this.candidateUserId);
      _this.additionalSection = true;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.loginData.userType = 2;
    _this.AuthService.loginToApplyForJob(_this.loginData).then(onSuccess, onError);
  }

  registerToApplyForJob() {

    if (!angular.isDefined(_this.registerData.email) || _this.registerData.email === '') {
      _this.errormessage = "Enter Email Id";
    }

    if (!angular.isDefined(_this.registerData.contactNumber) || _this.registerData.contactNumber === "" || _this.registerData.contactNumber === null) {
      _this.errmsgcon = "Please Enter Contact Number";
    }

    if (!angular.isDefined(_this.confirmPassword) || _this.confirmPassword === '') {
      _this.message = 'Password Mismatch';
    }

    if (_this.checkMandatoryFields()) {
      _this.LoaderService.show();
      let onSuccess = (response) => {
        _this.registerAdditionalData.contactNumber = _this.registerData.contactNumber;
        _this.registerAdditionalData.applyCandidate = true;
        _this.applyForJob(response.data.accessToken, _this.registerAdditionalData);
      },
        onError = (error) => {
          console.log(error);
        };
      _this.registerData.applyCandidate = true;
      _this.CandidateSignupService.doCandidateSignup(_this.registerData);
      _this.CandidateSignupService.activePromise.then(onSuccess, onError)['finally'](_this.LoaderService.hide);

    }
  }

  applyForJob(accessToken, additionalData) {
    if (angular.isDefined(additionalData.candidateProfile)) {
      delete additionalData.candidateProfile;
    }
    let onSuccess = (response) => {
      _this.isApplied = true;
      _this.UtilsService.notify("Thanks for applying for this position, please check your email for further details.");
    },
      onError = (error) => {
        console.log(error);
      },
      jobId = _this.$stateParams.jobId || 1,
      applyData = {
        jobId: jobId,
        jobTitle: _this.jobDescription.jobTitle,
        jobDescription: _this.jobDescription.jobDescription,
        jobUrl: _this.jobDescription.jobUrl,
        companyName: _this.jobDescription.companyName,
        jobLocation: _this.jobDescription.location,
        jobCreatedDate: _this.jobDescription.jobCreatedDate,
        jobCode: _this.jobDescription.jobCode,
        additionalInfo: additionalData
      };
    _this.jobDescriptionService.applyForJob(applyData, accessToken).then(onSuccess, onError);
  }
  picselected() {
    console.log(_this.loginAdditionalData.candidateLogo);
  }
  toggleUI() {
    _this.isLoginShow = !_this.isLoginShow;
    _this.isRegisterShow = !_this.isRegisterShow;
  }

  getDepartment() {
    let onSuccess = (response) => {
      _this.departmentList = response.data.data;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.AdminDepartmentService.getDepartment();
    _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
  }

  getDesignation(departmentId) {
    let onSuccess = (response) => {
      _this.isDesignationDisabled = false;
      _this.designationList = response.data;
    },
      onError = (error) => {
      };
    _this.CandidateSignupService.getDesignation(departmentId);
    _this.CandidateSignupService.activePromise.then(onSuccess, onError);
    // _this.CandidateSignupService.$setPristine();
    // _this.CandidateSignupService.$setUntouched();
  }

  getCountryList() {
    let onSuccess = (response) => {
      _this.countryList = response.data;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.locationService.getCountryList();
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getStateList(countryId) {
    let onSuccess = (response) => {
      _this.stateList = response.data;
      _this.isStateDisabled = false;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.locationService.getStateList(countryId);
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getCityList(stateId) {
    let onSuccess = (response) => {
      _this.cityList = response.data;
      _this.isCityDisabled = false;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.locationService.getCityList(stateId);
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  candidateAppliedDetailsById(candId) {

    let onSuccess = (response) => {
      _this.loginAdditionalData = response.data;
      _this.isApplied = response.data.isApplied;

      if (_this.isApplied) {
        _this.UtilsService.notify("You are already applied for this job");
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.jobDescriptionService.candidateAppliedDetailsById(candId, _this.jobId);
    _this.jobDescriptionService.activePromise.then(onSuccess, onError);
  }

  updateCandidateDetails() {
    _this.loginAdditionalData.resume = _this.candidateResume;
    let onSuccess = (response) => {
      _this.applyForJob(_this.tempToken, _this.loginAdditionalData);
    },
      onError = (error) => {
        console.log(error);
      };
    _this.loginAdditionalData.applyCandidate = true;
    _this.jobDescriptionService.updateCandidateDetails(_this.loginAdditionalData, _this.tempToken);
    _this.jobDescriptionService.activePromise.then(onSuccess, onError);
  }
}

