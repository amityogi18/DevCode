let _this;
const strongRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,15}$/;
const reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export class jobDescriptionController {
  /** @ngInject  */
  constructor(socialLoginService, $storage, $window, $rootScope, $interval, jobDescriptionService, UtilsService, $stateParams, $location, $state, AuthService, locationService, AdminDepartmentService, CandidateProfileService, CandidateSignupService, LoaderService, APP_CONSTANTS, jobOpeningsService, AdminPaymentPlanService) {
    _this = this;
    $(window).scroll(function () {
      var yPos = -($(window).scrollTop() / 6);
      if ($(window).scrollTop() > 100) {
        $(".main-header").addClass("sticky");
      }
      if ($(window).scrollTop() < 100) {
        $(".main-header").removeClass("sticky");
      }
    });

    _this.socialLoginService = socialLoginService;
    _this.$storage = $storage;
    _this.$window = $window;
    _this.$rootScope = $rootScope;
    _this.$interval = $interval;
    _this.jobDescriptionService = jobDescriptionService;
    _this.$stateParams = $stateParams;
    _this.$location = $location;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    let url = _this.UtilsService.getDomainUrl()
    _this.domainUrl = url + "site/careerpage.html";
    _this.AuthService = AuthService;
    _this.locationService = locationService;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.CandidateSignupService = CandidateSignupService;
    _this.AdminPaymentPlanService = AdminPaymentPlanService;
    _this.LoaderService = LoaderService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.jobOpeningsService = jobOpeningsService;
    _this.SITEKEY = _this.APP_CONSTANTS.RECAPTCHA_KEY;
    _this.isLoginShow = true;
    _this.isExpired = false;
    _this.isRegisterShow = false;
    _this.jobDescription = {};
    _this.jobId = _this.$stateParams.jobId || 1;
    _this.countryList = [];
    _this.stateList = [];
    _this.cityList = [];
    _this.departmentList = [];
    _this.designationList = [];
    _this.getDepartment();
    _this.isDesignationDisabled = true;
    _this.isEmailReSent = false;
    _this.passwordMismatch = false;
    _this.isPasswordRight = false;
    _this.isEmailValid = false;
    _this.resumeRequired = "";
    _this.isAgree = false;
    _this.isApplied = false;
    _this.isShowApplyForm = false;
    _this.candidateData = [];
    _this.searchCountry;
    _this.searchState;
    _this.searchCity;
    _this.searchDepartment;
    _this.searchRole;
    _this.additionalSection = false;
    _this.registerData = {};
    _this.geoAddress = {};
    _this.candidateDetails = {};
    _this.formDetailsList = { phoneNumber: 1, photo: 3, coverLetter: 3, resume: 1, email: 1, registerPhoneNumber: 1, };
    _this.transactionId = "";
    _this.isClicked = false;
    _this.loginAdditionalData = { applyCandidate: false, isApplied: false, candidateProfile: true, contactNumber: "", resume: "", coverLetter: "", candidateLogo: "" };
    _this.registerAdditionalData = { applyCandidate: true, isApplied: false, candidateProfile: false, contactNumber: "", resume: "", coverLetter: "", candidateLogo: "" }
    _this.linkedinAdditionalData = { applyCandidate: true, isApplied: false, candidateProfile: false, contactNumber: "", resume: "", coverLetter: "", candidateLogo: "" }
    _this.loginFormValidation = { coverLetterRequired: false, photoRequired: false, resumeRequired: false, phoneNumberRequired: false }
    _this.linkedinFormValidation = { coverLetterRequired: false, photoRequired: false, resumeRequired: false, phoneNumberRequired: false }
    _this.cardDetails = { status: false };

    if (_this.$rootScope.isLoggedIn && _this.$rootScope.user.userType == 2) {
      _this.getCardDetail();
    }

    if (_this.$location.$$path.indexOf("applied") >= 0) {
      _this.getJobDescriptionDetails(_this.jobId);
      if (_this.$rootScope.isLoggedIn && _this.$rootScope.user.userType == 2) {
        _this.getCandidateAppliedDetailsById(_this.$rootScope.user.userId);
        _this.isClicked = false;
      }
    } else {
      _this.getJobDescriptionDetails(_this.jobId);
    }

    _this.isLinkedinDetailsFound = false;
    _this.userDetails = {};


    $rootScope.$on('event:social-sign-in-success', (event, userDetails) => {
      _this.isLinkedinDetailsFound = true;
      _this.userDetails = userDetails;
      _this.$rootScope.$apply();
    });

    $rootScope.$on('event:social-sign-out-success', function (event, userDetails) {
      _this.userDetails = {};
      _this.isLinkedinDetailsFound = false;
      _this.$rootScope.$apply();
    });
  }

  showApplyForm() {
    _this.isShowApplyForm = !_this.isShowApplyForm;
    $('html, body').animate({
      scrollTop: $("#job-detail").offset().top * 3
    }, 1000);
  }

  hideApplyForm() {
    _this.isShowApplyForm = !_this.isShowApplyForm;
    $('html, body').animate({
      scrollTop: 100
    }, 1000);
  }

  loginUsingLinkedIn() {
    if (_this.checkValidationBeforeApplyingUsingLinkedin()) {
      let onSuccess = (response) => {
        _this.$rootScope.isLoggedIn = true;
        _this.$rootScope.user = { userType: 2 };
        _this.candidateDetails = response.data;
        _this.applyForJob(_this.linkedinAdditionalData, 'LIN');

      },
        onError = (error) => {
          console.log(error);
        };
      _this.jobDescriptionService.loginUsingLinkedIn(_this.userDetails).then(onSuccess, onError);
    }
  }

  clearLinkedinForm() {
    _this.linkedinAdditionalData.applyCandidate = true;
    _this.linkedinAdditionalData.isApplied = false;
    _this.linkedinAdditionalData.candidateProfile = false;
    _this.linkedinAdditionalData.contactNumber = "";
    _this.linkedinAdditionalData.resume = "";
    _this.linkedinAdditionalData.coverLetter = "";
    _this.linkedinAdditionalData.candidateLogo = "";
  }

  checkValidationBeforeApplyingUsingLinkedin() {
    let returnValue = true;
    if (_this.jobDescription.isOnDemandJob) {

      if (_this.formDetailsList.coverLetter == 1) {
        if (_this.linkedinAdditionalData.coverLetter === undefined || _this.linkedinAdditionalData.coverLetter == "" || _this.linkedinAdditionalData.coverLetter === "null") {
          _this.linkedinFormValidation.coverLetterRequired = true;
          returnValue = false;
          _this.isClicked = false;
        } else {
          _this.linkedinFormValidation.coverLetterRequired = false;
        }
      }

      if (_this.formDetailsList.phoneNumber == 1) {
        if (_this.linkedinAdditionalData.contactNumber === undefined || _this.linkedinAdditionalData.contactNumber == "" || _this.linkedinAdditionalData.contactNumber === "null") {
          _this.linkedinFormValidation.phoneNumberRequired = true;
          returnValue = false;
          _this.isClicked = false;
        } else {
          _this.linkedinFormValidation.phoneNumberRequired = false;
        }
      }

      if (_this.formDetailsList.photo == 1) {
        if (_this.linkedinAdditionalData.candidateLogo == "" && _this.linkedinAdditionalData.candidateLogo == './img/user.png') {
          _this.linkedinFormValidation.photoRequired = true;
          _this.isClicked = false;
          returnValue = false;
        } else {
          _this.linkedinFormValidation.photoRequired = false;
        }
      }

      if (_this.formDetailsList.resume == 1) {
        if (_this.linkedinAdditionalData.resume === undefined || _this.linkedinAdditionalData.resume == "") {
          _this.linkedinFormValidation.resumeRequired = true;
          _this.isClicked = false;
          returnValue = false;
        } else {
          _this.linkedinFormValidation.resumeRequired = false;
        }
      }
    } else {

      _this.linkedinFormValidation.phoneNumberRequired = false;
      _this.linkedinFormValidation.photoRequired = false;
      _this.linkedinFormValidation.coverLetterRequired = false;

      if (_this.linkedinAdditionalData.resume === undefined || _this.linkedinAdditionalData.resume == "") {
        _this.linkedinFormValidation.resumeRequired = true;
        _this.isClicked = false;
        returnValue = false;
      } else {
        _this.linkedinFormValidation.resumeRequired = false;
      }
    }

    return returnValue;
  }

  signoutLinkedIn() {
    _this.$rootScope.isLoggedIn = false;
    _this.socialLoginService.logout();
  }

  getJobDescriptionDetails(jobId) {
    let onSuccess = (response) => {
      _this.parseJobDescription(response.data.response.docs[0]);
      if (_this.jobDescription.isOnDemandJob) {
        _this.getApplicationformDetails(_this.jobDescription.jobCode);
      }
      var currentTime = new Date();
      _this.isExpired = _this.jobDescription.jobExpiryDate > currentTime ? true : false;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.jobDescriptionService.getAppliedJobDescription(jobId).then(onSuccess, onError);
  }

  getApplicationformDetails(jobCode) {
    let onSuccess = (response) => {
      if (response.data) {
        _this.formDetailsList.phoneNumber = response.data.phoneNumber;
        //_this.formDetailsList.registerPhoneNumber = response.data.phoneNumber;
        _this.formDetailsList.photo = response.data.photo;
        _this.formDetailsList.coverLetter = response.data.coverLetter;
        _this.formDetailsList.resume = response.data.resume;
        _this.formDetailsList.email = response.data.email;
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.jobDescriptionService.getApplicationformDetails(jobCode).then(onSuccess, onError);
  }

  loginToApplyForJob() {
    _this.isClicked = !_this.isClicked;
    let onSuccess = (response) => {
      _this.AuthService.saveCurrentUser(response.data, false);
      _this.loginAdditionalData.candidateProfile = true;
      _this.candidateDetails = response.data;
      _this.getCandidateAppliedDetailsById(_this.candidateDetails.userId);
    },
      onError = (error) => {
        console.log(error);
        _this.isClicked = false;
      };

    _this.loginData.userType = 2;
    _this.AuthService.loginToApplyForJob(_this.loginData).then(onSuccess, onError);
  }

  checkValidationBeforeApplyingUsingLogin() {
    let returnValue = true;
    if (_this.jobDescription.isOnDemandJob) {

      if (_this.formDetailsList.coverLetter == 1) {
        if (_this.loginAdditionalData.coverLetter == "" || _this.loginAdditionalData.coverLetter == "null") {
          _this.loginFormValidation.coverLetterRequired = true;
          returnValue = false;
          _this.isClicked = false;
        } else {
          _this.loginFormValidation.coverLetterRequired = false;
        }
      }

      if (_this.formDetailsList.phoneNumber == 1) {
        if (_this.loginAdditionalData.contactNumber == "" || _this.loginAdditionalData.contactNumber === undefined) {
          _this.loginFormValidation.phoneNumberRequired = true;
          returnValue = false;
          _this.isClicked = false;
        } else {
          _this.loginFormValidation.phoneNumberRequired = false;
        }
      }

      if (_this.formDetailsList.photo == 1) {
        if (_this.loginAdditionalData.candidateLogo == "" && _this.loginAdditionalData.candidateLogo == './img/user.png') {
          _this.loginFormValidation.photoRequired = true;
          _this.isClicked = false;
          returnValue = false;
        } else {
          _this.loginFormValidation.photoRequired = false;
        }
      }

      if (_this.formDetailsList.resume == 1) {
        if (_this.loginAdditionalData.resume === undefined || _this.loginAdditionalData.resume == "") {
          _this.loginFormValidation.resumeRequired = true;
          _this.isClicked = false;
          returnValue = false;
        } else {
          _this.loginFormValidation.resumeRequired = false;
        }
      }
    } else {

      _this.loginFormValidation.phoneNumberRequired = false;
      _this.loginFormValidation.photoRequired = false;
      _this.loginFormValidation.coverLetterRequired = false;

      if (_this.loginAdditionalData.resume === undefined || _this.loginAdditionalData.resume == "") {
        _this.loginFormValidation.resumeRequired = true;
        _this.isClicked = false;
        returnValue = false;
      } else {
        _this.loginFormValidation.resumeRequired = false;
      }
    }



    return returnValue;
  }

  getCandidateAppliedDetailsById(candidateId) {
    _this.isClicked = !_this.isClicked;
    let onSuccess = (response) => {
      _this.isClicked = false;
      _this.loginAdditionalData = response.data;

      if (_this.loginAdditionalData.isApplied) {
        return false;
      } else {
        _this.additionalSection = true;
      }

      let paymentInfo = window.localStorage.getItem('paymentResponse');
      if (angular.isDefined(paymentInfo) && paymentInfo != null && paymentInfo != "") {
        paymentInfo = JSON.parse(paymentInfo);
        _this.transactionId = paymentInfo.transactionId;
        window.localStorage.removeItem('paymentResponse');
        _this.applyForJob(_this.loginAdditionalData, 'L');
      } else if (_this.loginAdditionalData.isApplyLimitExceeded) {
        $('#payment-model-popup').show();
      }
    },
      onError = (error) => {
        _this.isClicked = false;
        console.log(error);
      };
    let jobCodeOrId = _this.jobDescription.isOnDemandJob ? _this.jobDescription.jobCode : _this.jobDescription.id;
    _this.jobDescriptionService.getCandidateAppliedDetailsById(candidateId, jobCodeOrId);
    _this.jobDescriptionService.activePromise.then(onSuccess, onError);
  }

  updateCandidateDetails() {
    if (_this.checkValidationBeforeApplyingUsingLogin()) {
      _this.isClicked = !_this.isClicked;
      let onSuccess = (response) => {
        _this.applyForJob(_this.loginAdditionalData, 'L');
      },
        onError = (error) => {
          _this.isClicked = !_this.isClicked;
          console.log(error);
        },
        accessToken = _this.candidateDetails.accessToken || _this.$rootScope.user.accessToken;
      _this.jobDescriptionService.updateCandidateDetails(_this.loginAdditionalData, accessToken).then(onSuccess, onError);
    }
  }

  applyForJob(inputData, type) {
    let onSuccess = (response) => {
      _this.isClicked = false;
      if (angular.isDefined(type)) {
        if (type == 'L') {
          _this.loginAdditionalData.isApplied = true;
        }
        else if (type == 'R') {
          _this.registerAdditionalData.isApplied = true;
        }
        else if (type == 'LIN') {
          _this.linkedinAdditionalData.isApplied = true;
        }
      }
      _this.additionalSection = false;

      _this.clearLinkedinForm();
      _this.UtilsService.notify("Thanks for applying for this position, please check your email for further details.");
      _this.hideApplyForm();
    },
      onError = (error) => {
        _this.isClicked = false;
        _this.isApplied = true;
        _this.additionalSection = false;
        _this.loginAdditionalData.isApplied = true;
        _this.hideApplyForm();
      },

      jobApplyData = {
        transactionId: _this.transactionId,
        jobId: _this.jobDescription.id,
        jobTitle: _this.jobDescription.jobTitle,
        jobDescription: _this.jobDescription.jobDescription,
        jobUrl: _this.jobDescription.jobDetailURL,
        companyName: _this.jobDescription.companyName,
        jobLocation: _this.jobDescription.location,
        jobCreatedDate: _this.jobDescription.jobCreatedDate,
        jobCode: _this.jobDescription.jobCode,
        additionalInfo: {
          "contactNumber": inputData.contactNumber,
          "resume": inputData.resume,
          "coverLetter": inputData.coverLetter,
          "candidateLogo": inputData.candidateLogo,
          "applyCandidate": true
        }
      },
      accessToken = _this.candidateDetails.accessToken || _this.$rootScope.user.accessToken;
    _this.jobDescriptionService.applyForJob(jobApplyData, accessToken).then(onSuccess, onError);

  }

  registerToApplyForJob() {
    _this.isClicked = true;
    if (_this.checkValidationBeforeApplyingUsingRegister()) {
      let onSuccess = (response) => {
        _this.clearRegisterFields();
        _this.isClicked = false;
        _this.candidateDetails = response.data;
        _this.registerAdditionalData.contactNumber = _this.registerData.contactNumber;
        _this.candidateSignupForm.$setPristine();
        _this.candidateSignupForm.$setUntouched();
        _this.applyForJob(_this.registerAdditionalData, 'R');
      },
        onError = (error) => {
          _this.isClicked = false;
          console.log(error);
        };
      _this.registerData.applyCandidate = true;
      _this.CandidateSignupService.doCandidateSignup(_this.registerData);
      _this.CandidateSignupService.activePromise.then(onSuccess, onError);

    }
  }

  checkValidationBeforeApplyingUsingRegister() {
    let returnValue = true;

    if (!angular.isDefined(_this.registerData.email) || _this.registerData.email === '') {
      _this.errormessage = "Enter Email Id";
      _this.isClicked = false;
      returnValue = false;
    }

    if (_this.formDetailsList.coverLetter == 1) {
      if (_this.registerAdditionalData.coverLetter === undefined || _this.registerAdditionalData.coverLetter == "" || _this.registerAdditionalData.coverLetter == "null") {
        _this.isClicked = false;
        returnValue = false;
      }
    }

    if (_this.formDetailsList.resume == 1) {
      if ((angular.isDefined(_this.registerAdditionalData.resume) && _this.registerAdditionalData.resume == "")) {
        _this.resumeRequired = "Please upload resume file.";
        _this.isClicked = false;
        returnValue = false;
      }
    }

    if (_this.formDetailsList.registerPhoneNumber == 1) {
      if ((!angular.isDefined(_this.registerData.contactNumber) || _this.registerData.contactNumber === "" || _this.registerData.contactNumber === null)) {
        _this.errmsgcon = "Please Enter Contact Number";
        _this.isClicked = false;
        returnValue = false;
      }
    }

    if (!angular.isDefined(_this.confirmPassword) || _this.confirmPassword === '') {
      _this.confirmPasswordMessage = 'Password Mismatch';
      _this.isClicked = false;
      returnValue = false;
    }

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
      console.log('all mandatory fields are filled');
      //return true;
      //_this.isClicked = false;
    }
    else {
      _this.isClicked = false;
      _this.candidateSignupForm.$setSubmitted();
      returnValue = false;
    }

    return returnValue;
  }

  clearRegisterFields() {
    _this.registerData.firstName =
      _this.registerData.lastName =
      _this.registerData.email =
      _this.registerData.contactNumber =
      _this.registerData.password =
      _this.registerData.departmentId =
      _this.registerData.designationId =
      _this.registerData.address =
      _this.registerAdditionalData.coverLetter =
      _this.registerAdditionalData.resume =
      _this.confirmPassword = '';
    _this.clearData();
    _this.geoAddress.name = ".";
    //_this.clearData = "";
    //$('span.highlight').text('');
    //$('[name="autocomplete"]').text('');
    _this.candidateSignupForm.$setPristine();
    _this.candidateSignupForm.$setUntouched();
  }

  clearSuggestions(clearData) {
    _this.clearData = clearData;
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

  isLoginCoverLaterBlank() {
    _this.loginFormValidation.coverLetterRequired = _this.logininAdditionalData.coverLetter === "" ? true : false;
  }

  isLinkedinCoverLaterBlank() {
    _this.linkedinFormValidation.coverLetterRequired = _this.linkedinAdditionalData.coverLetter === "" ? true : false;
  }

  isLinkedinPhoneNumberBlank() {
    _this.linkedinFormValidation.coverLetterRequired = _this.linkedinAdditionalData.coverLetter === "" ? true : false;
  }

  confirmPasswords(value) {
    if (_this.password !== value) {
      _this.passwordMismatch = true;
    } else {
      _this.passwordMismatch = false;
    }
  }

  checkPasswordEquality() {
    if (angular.isDefined(_this.confirmPassword) && _this.confirmPassword !== _this.registerData.password) {
      _this.confirmPasswordMessage = 'Password Mismatch';
      _this.passMismatch = true;
    }
    else {
      _this.passMismatch = false;
      _this.confirmPasswordMessage = '';
    }
  }

  analyzePassword(value) {
    _this.isPasswordRight = strongRegex.test(value);
  }

  analyzeLoginPhoneNumber(value) {
    if (angular.isDefined(value) && value.length < 10) {
      _this.loginFormValidation.phoneNumberRequired = true;
      _this.contactCriteria = false;
    }
    else if (!angular.isDefined(value) || value === "" || value === null) {
      _this.loginFormValidation.phoneNumberRequired = true;
    } else {
      _this.loginFormValidation.phoneNumberRequired = false;
      _this.contactCriteria = true;
    }
  }

  analyzeLinkedinPhoneNumber(value) {
    if (angular.isDefined(value) && value.length < 10) {
      _this.linkedinFormValidation.phoneNumberRequired = true;
      _this.contactCriteria = false;
    }
    else if (!angular.isDefined(value) || value === "" || value === null) {
      _this.linkedinFormValidation.phoneNumberRequired = true;
    } else {
      _this.linkedinFormValidation.phoneNumberRequired = false;
      _this.contactCriteria = true;
    }
  }

  analyzeRegisterPhoneNumber(value) {
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

  uploadLoginLogoFile(file) {
    _this.loginAdditionalData.candidateLogo = file[0];
    _this.UtilsService.checkFileSize(file[0], '512KB');
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
    _this.UtilsService.checkFileSize(file[0], '512KB');

    if (_this.loginAdditionalData.resume === '') {
      _this.loginAdditionalData.resume = _this.loginResumeUrl;
      _this.loginFormValidation.resumeRequired = true;
    } else {
      _this.loginAdditionalData.resume = _this.loginAdditionalData.resume;
      _this.loginFormValidation.resumeRequired = false;
    }
  }

  uploadLinkedinResumeFile(file) {
    _this.linkedinAdditionalData.resume = file[0];
    _this.UtilsService.checkFileSize(file[0], '512KB');
  }

  isLinkedinResumeFileAdded(file) {
    _this.linkedinFormValidation.resumeRequired = file.length > 0 ? false : true;
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
    _this.UtilsService.checkFileSize(file[0], '512KB');
  }

  isRegisterResumeFileAdded(file) {
    if (file.length > 0) {
      _this.fileNotSelected = true;
      _this.resumeRequired = "";
    }
    else {
      _this.fileNotSelected = false;
      _this.resumeRequired = "Please Select Resume";
    }
  }

  uploadRegisterResumeFile(file) {
    _this.registerAdditionalData.resume = file[0];
    _this.UtilsService.checkFileSize(file[0], '512KB');
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
  }

  parseJobDescription(jobDescription) {
    if (angular.isDefined(jobDescription)) {

      if (_this.UtilsService.isValidString(jobDescription.jobcode)) {
        _this.jobDescription.isOnDemandJob = true;
      } else {
        _this.jobDescription.isOnDemandJob = false;
      }

      //------------- Salary and Currency

      _this.jobDescription.salary = "Salary Not Disclosed";

      if (_this.UtilsService.isValidString(jobDescription.maxsalary)) {
        _this.jobDescription.salary = "Salary : " + jobDescription.maxsalary
      }

      if (_this.UtilsService.isValidString(jobDescription.minsalary)) {
        if (_this.UtilsService.isValidString(_this.jobDescription.salary) && _this.jobDescription.salary !== "Salary Not Disclosed") {
          if (!_this.jobDescription.isOnDemandJob) {
            _this.jobDescription.salary += ' To - ' + jobDescription.minsalary;
          }
        } else {
          _this.jobDescription.minSalary = jobDescription.minsalary;
        }
      }

      if (_this.UtilsService.isValidString(jobDescription.currencytype)) {
        _this.jobDescription.currencyType = "(" + jobDescription.currencytype + ")";
      } else {
        _this.jobDescription.currencyType = "";
      }

      //------------- Skills
      if (_this.UtilsService.isValidString(jobDescription.primaryskill)) {
        _this.jobDescription.primarySkill = jobDescription.primaryskill
      } else {
        _this.jobDescription.primarySkill = 'NA'
      }
      if (_this.UtilsService.isValidString(jobDescription.secondaryskill)) {
        _this.jobDescription.secondarySkill = jobDescription.secondaryskill
      } else {
        _this.jobDescription.secondarySkill = 'NA'
      }
      if (_this.UtilsService.isValidString(jobDescription.tertiaryskill)) {
        _this.jobDescription.tertiarySkill = jobDescription.tertiaryskill
      } else {
        _this.jobDescription.tertiarySkill = 'NA'
      }

      //------------- Expiry date
      if (_this.UtilsService.isValidString(jobDescription.jobexpirydate)) {
        _this.jobDescription.jobExpiryDate = _this.UtilsService.getLocalTimeFromGMT(jobDescription.jobexpirydate + "z", 24, 'YMD');
      } else {
        _this.jobDescription.jobExpiryDate = _this.UtilsService.getLocalTimeFromGMT(jobDescription.jobcreationdate + "z", 24, 'YMD');
      }

      //------------- Qualification
      if (_this.UtilsService.isValidString(jobDescription.qualification)) {
        _this.jobDescription.qualification = jobDescription.qualification
      } else {
        _this.jobDescription.qualification = 'NA'
      }

      //------------- Job Type
      if (_this.UtilsService.isValidString(jobDescription.jobtype)) {
        _this.jobDescription.jobType = jobDescription.jobtype;
      } else {
        _this.jobDescription.jobType = "Full Time";
      }

      //------------- Job Location
      _this.jobDescription.jobLocation = "NA";
      if (_this.UtilsService.isValidString(jobDescription.country)) {
        _this.jobDescription.jobLocation = jobDescription.country;
      }

      if (_this.UtilsService.isValidString(jobDescription.state)) {
        if (_this.UtilsService.isValidString(_this.jobDescription.jobLocation) && _this.jobDescription.jobLocation !== "NA") {
          _this.jobDescription.jobLocation += ", " + jobDescription.state
        } else {
          _this.jobDescription.jobLocation = jobDescription.state
        }
      }
      if (_this.UtilsService.isValidString(jobDescription.city)) {
        if (_this.UtilsService.isValidString(_this.jobDescription.jobLocation) && _this.jobDescription.jobLocation !== "NA") {
          _this.jobDescription.jobLocation += ", " + jobDescription.city
        } else {
          _this.jobDescription.jobLocation = jobDescription.city
        }
      }
      _this.jobDescription.location = jobDescription.location;
      if (_this.jobDescription.jobLocation == "NA") {
        _this.jobDescription.jobLocation = jobDescription.location;
      }
      _this.jobDescription.country = jobDescription.country;
      _this.jobDescription.city = jobDescription.city;
      _this.jobDescription.state = jobDescription.state;

      if (_this.UtilsService.isValidString(jobDescription.jobdetailurl)) {
        _this.jobDescription.isJobUrlAvailable = true;
      } else {
        _this.jobDescription.isJobUrlAvailable = false;
      }

      _this.jobDescription.jobDetailURL = jobDescription.jobdetailurl;
      _this.jobDescription.id = jobDescription.id;
      _this.jobDescription.jobId = jobDescription.jobid;
      _this.jobDescription.currencyType = jobDescription.currencytype;
      _this.jobDescription.jobCategory = jobDescription.jobcategory;
      _this.jobDescription.minSalary = jobDescription.minsalary;
      //_this.jobDescription.salary = jobDescription.minSalary + "-" + jobDescription.maxSalarys;
      _this.jobDescription.jobStatus = jobDescription.jobstatus;
      _this.jobDescription.contractType = jobDescription.contracttype;
      _this.jobDescription.jobTitle = jobDescription.jobtitle;
      _this.jobDescription.jobCode = jobDescription.jobcode;
      _this.jobDescription.experience = jobDescription.experience;


      _this.jobDescription.jobCreatedDate = jobDescription.jobcreationdate;
      _this.jobDescription.companyName = jobDescription.company;
      _this.jobDescription.jobDescription = jobDescription.jobdescription;
      //_this.jobDescription.primarySkill = jobDescription.primaryskill;
      //_this.jobDescription.secondarySkill = jobDescription.secondaryskill;
      //_this.jobDescription.tertiarySkill = jobDescription.tertiaryskill;
      //_this.jobDescription.qualification = jobDescription.qualification;
    }
  }

  goBack() {
    if (_this.isLinkedinDetailsFound) {
      _this.socialLoginService.logout();
    }
    _this.loginAdditionalData.isApplied = false;
    _this.$rootScope.isLoggedIn = false;
    _this.additionalSection = false;
  }

  logout() {
    _this.AuthService.user = null;
    _this.$storage.removeItem('user');
    _this.$window.sessionStorage.removeItem('user');
    _this.$window.localStorage.removeItem('user');
    _this.$rootScope.user = {};
    _this.$rootScope.isLoggedIn = false;
    _this.additionalSection = false;
    _this.loginAdditionalData.isApplyLimitExceeded = false;
    _this.loginAdditionalData.isApplied = false;
    if (angular.isDefined(this.$rootScope.notification)) {
      this.$interval.cancel(this.$rootScope.notification);
      this.$rootScope.notification = undefined;
    }
  }

  closeDialogBox() {
    $('#payment-model-popup').hide();
  }

  goToProfile() {
    _this.$state.go('candidateProfile.home');
  }

  // Navigate to Payment Page
  updateCardDetails() {
    _this.$state.go('candidateProfile.admin-payment', { planId: _this.jobId, type: "paymentByPublicCandidate" });
  }

  goToPayment() {
    _this.paymentCallback(_this.cardDetails.threeDsecure, _this.jobId);
  }

  // Callback function for payment
  paymentCallback(isThreeD, jobId) {
    let product = "",
      portal = [],
      candidateId = _this.AuthService.user.userId,
      type = "paymentByPublicCandidate";

    let data = {
      "paymentType": type,
      "sourceId": "",
      "portalPlans": portal,
      "productPlan": product,
      "candidateId": candidateId,
      "positionId": "",
      "jobCode": jobId,
      "cardStatus": "x1ssdf1112dfdf1111df",
      "cardExpMonth": "",
      "cardExpYear": "",
      "cardLast4digit": "",
      "threed_secure": "",
      "owner": {
        "address": {
          "city": "",
          "country": "",
          "line1": "",
          "line2": "",
          "postal_code": "",
          "state": ""
        },
        "email": "",
        "name": "",
        "phone": "",
        "verified_address": null,
        "verified_email": null,
        "verified_name": null,
        "verified_phone": null
      }
    };
    let onSuccess = (response) => {
      console.log(response.data);
      if (isThreeD === "supported") {
        _this.paymentIframeCallback(response.data);
      } else {
        _this.makePayment(response.data);
      }
    },
      onError = (error) => {
        console.log(error);
        _this.UtilsService.notify('Something went wrong, Please try again in sometime. If problem persist please contact customer support.', true, 6000);
      };
    if (isThreeD === "supported") {
      _this.AdminPaymentPlanService.getThreeDSecureSource(data);
      _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    } else {
      _this.AdminPaymentPlanService.getPaymentObject(data);
      _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }

  }

  // Callback function for payment iframe
  paymentIframeCallback(response) {
    let windowWidth = _this.$window.innerWidth,
      windowHeight = _this.$window.innerHeight,
      windowStyle = 'width:' + windowWidth + 'px;height:' + windowHeight + 'px;overflow: hidden;border:0px;position:absolute;top:-65px;left:-133px;z-index:9999;';

    //window.location.replace(response.redirect.url);
    let paymentContainer = document.querySelector('#payment-public-job-apply');
    paymentContainer.style.display = 'none';

    var iframe = document.createElement("iframe");
    iframe.src = response.redirect.url;
    iframe.setAttribute('style', windowStyle);
    iframe.className = "secure-iframe";
    $("#payment-public-job-apply-iframe").append(iframe);
  }

  makePayment(token) {
    let onSuccess = (response) => {
      _this.UtilsService.notify('Transaction Successfull !!', "s", 4000);
      _this.transactionId = response.data.transactionId;
      $('#payment-model-popup').hide();
      _this.isClicked = false;
      _this.loginAdditionalData.isApplyLimitExceeded = false;
    },
      onError = (error) => {
        console.log(error);
        _this.UtilsService.notify('Something went wrong, Please try again in sometime. If problem persist please contact customer support.', "d", 6000);
      };
    _this.AdminPaymentPlanService.makePayment({ "autoRenew": "1", "customerCode": token.customerCode });
    _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
  }

  // fetch cradit/dabit card details of candidate
  getCardDetail() {
    let onSuccess = (response) => {
      _this.cardDetails = response.data;
      //_this.cardDetails = { status: true };
    },
      onError = (error) => {
        _this.cardDetails = [];
      };
    _this.jobOpeningsService.getCandidateCardDetails();
    _this.jobOpeningsService.activePromise.then(onSuccess, onError);
  }

}

