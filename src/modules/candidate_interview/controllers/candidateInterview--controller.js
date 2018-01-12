let _this;
const EMAIL_REGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
//const PHONE_REGEX = /^(\d{10}|\d{11}|\d{12}|\d{13}|\d{14})$/; ///   /^\d{10}$/;

export class candidateInterviewController {
  /** @ngInject  */
  constructor($rootScope, $window, $state, $stateParams, CandidateInterviewService, AuthService, GrowlerService, UtilsService, LoaderService, GeneralSettingsService, $storage) {
    _this = this;
    _this.initUI();
    _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.LoaderService = LoaderService;
    _this.LoaderService.show();
    _this.CandidateInterviewService = CandidateInterviewService;
    _this.AuthService = AuthService;
    _this.GrowlerService = GrowlerService;
    _this.UtilsService = UtilsService;
    _this.GeneralSettingsService = GeneralSettingsService;
    _this.$storage = $storage;
    _this.interviewCode = _this.$stateParams.interviewCode;
    _this.$storage.setItem('interviewCode', _this.interviewCode);
    _this.interviewDetails = {};
    _this.getInterviewDetailsByCode();
    _this.isInvalidLink = false;
    _this.isNextEnable = true;
    _this.passwordMismatch = false;
    _this.isPasswordRight = false;
    _this.invalidCandidateEmail = "";
    _this.invalidCompanyEmail = "";
    _this.invalidRegisterEmail = "";
    _this.isRegisterPasswordRight = true;
    _this.isCandidatePasswordRight = true;
    _this.isUserPasswordRight = true;
    _this.isPhoneValid = false;
    _this.geoAddress = {};
    _this.options = [
      { id: 1, name: 'Facebook' },
      { id: 2, name: 'LinkedIn' },
      { id: 3, name: 'Twitter' },
      { id: 4, name: 'Email' },
      { id: 6, name: 'Others' }
    ];
    _this.candidateData = {
      interviewId: 1,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      address: "",
      candidateOrganization: ""
    };

    _this.registerError = {
      firstNameError: false,
      lastNameError: false,
      passwordError: false,
      passwordMismatchError: false,
      emailError: false,
      emailInvalidError: false,
      phoneError: false,
      locationError: false,
      reachUsError: false
    }

  }

  initUI(){
    // to disable right click
    document.addEventListener("contextmenu", function (e) {
      alert('Right Click is Not Allowed.');
      e.preventDefault();
    }, false);

    // to show tooltip
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  isInvalidCandidateEmail(email) {
    if (angular.isDefined(email) && !EMAIL_REGEX.test(email)) {
      _this.invalidCandidateEmail = "Enter Valid Email Id";
    }
    else if (!angular.isDefined(email) || email === "" || email === null) {
      _this.invalidCandidateEmail = " Please Enter Email Id";
    } else {
      _this.invalidCandidateEmail = "";
    }
  }

  isInvalidCompanyEmail(email) {
    if (angular.isDefined(email) && !EMAIL_REGEX.test(email)) {
      _this.invalidCompanyEmail = "Enter Valid Email Id";
    }
    else if (!angular.isDefined(email) || email === "" || email === null) {
      _this.invalidCompanyEmail = " Please Enter Email Id";
    } else {
      _this.invalidCompanyEmail = "";
    }
  }

  isRegisterInvalidEmail(email) {
    if (angular.isDefined(email) && !EMAIL_REGEX.test(email)) {
      _this.registerError.emailError = true;
    }
    else if (!angular.isDefined(email) || email === "" || email === null) {
      _this.registerError.emailError = true;
    } else {
      _this.registerError.emailError = false;
    }
  }

  confirmPasswords() {
    _this.registerError.passwordMismatchError = _this.candidateData.password !== _this.confirmPassword ? true : false;
  }

  analyzePassword(value, type) {
    const strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (type == "R") {
      if (value == "") {
        _this.registerError.passwordError = true;
        return false;
      } else if (!strongPasswordRegex.test(value)) {
        _this.registerError.passwordError = true;
        return false;
      } else {
        _this.registerError.passwordError = false;
        return false;
      }
    }
    else if (type == "CL") {
      if (value == "") {
        _this.isCandidatePasswordRight = false;
      } else {
        _this.isCandidatePasswordRight = strongPasswordRegex.test(value);
      }
    }
    else if (type == "UL") {
      if (value == "") {
        _this.isUserPasswordRight = false;
      } else {
        _this.isUserPasswordRight = strongPasswordRegex.test(value);
      }
    }
  }

    analyzePhoneNumber(value) {
        _this.errmsgcon = "";
        if (angular.isDefined(value) && value.length < 10) {
            _this.errmsgcon = "Enter Valid Contact Number";
            _this.contactCriteria = false;
        } else if (!angular.isDefined(value) || value === "" || value === null) {
            _this.errmsgcon = "Please Enter Contact Number";
        } else {
            _this.errmsgcon = "";
            return true;
        }
    };
//  analyzePhoneNumber(value) {
//      _this.registerError.phoneError = "";
//    if (angular.isDefined(value) && value.length < 10) {
//      _this.registerError.phoneError = "Enter Valid Contact Number";
//      return false;
//    }  else if (!angular.isDefined(value) || value === "" || value === null) {
//       _this.registerError.phoneError = "Please Enter Contact Number";
//    }else {
//      _this.registerError.phoneError = true;
//      return true;
//    }
//  }

  getInterviewDetailsByCode() {
    let onSuccess = (response) => {
      _this.LoaderService.hide();
      _this.interviewDetails = response.data;

      if (angular.isDefined(_this.interviewDetails)) {
        _this.interviewDetails.interviewCode = _this.interviewCode;

        // Changing background image
        _this.changeLandingImage();

        // checking for expired position        
        if (_this.interviewDetails.positionStatusId == 2) {
          _this.isNextEnable = false;
          _this.UtilsService.notify('Thanks for showing interest in position of ' + _this.interviewDetails.positionName + '. Its not active for now, We will notify once it is activated again.');
        }

        // checking for closed position        
        if (_this.interviewDetails.positionStatusId == 3) {
          _this.isNextEnable = false;
          _this.UtilsService.notify('Thanks for showing interest in position of ' + _this.interviewDetails.positionName + ', But this position is already closed now.');
        }

        // checking for on hold position
        else if (_this.interviewDetails.positionStatusId == 14) {
          _this.isNextEnable = false;
          _this.UtilsService.notify('Thanks for showing interest in position of ' + _this.interviewDetails.positionName + '. Its on hold for now, We will notify once it is activated again.');
        }
        // checking for filled position
        else if (_this.interviewDetails.positionStatusId == 16) {
          _this.isNextEnable = false;
          _this.UtilsService.notify('Thanks for showing interest in position of ' + _this.interviewDetails.positionName + ', But this position is already filled.');
        }
        // checking for expired position
        else if (_this.interviewDetails.positionStatusId == 20) {
          _this.isNextEnable = false;
          _this.UtilsService.notify('This position has expired.');
        }
        // checking for after date (expired) interview 
        else if (_this.checkForExpiredInterview()) {
          _this.isNextEnable = false;
          _this.UtilsService.notify('Interview already expired on ' + _this.interviewDetails.localInterviewExpiryDateTime);
        }
        // checking for before date interview       
        else if (_this.checkForBeforeDateInterview()) {
          _this.isNextEnable = false;
          _this.UtilsService.notify('Interview still not started. Please join on ' + _this.interviewDetails.localInterviewStartDateTime);
        }
        else {
          // saving interview details to the local storage
          _this.$storage.setItem('interviewDetails', JSON.stringify(_this.interviewDetails));
          _this.$storage.setItem('interviewType', _this.interviewDetails.interViewTypeId);
          _this.$storage.setItem('interviewId', _this.interviewDetails.interviewId);
        }
      }
      else {
        _this.isNextEnable = false;
        _this.isInvalidLink = true;
        _this.UtilsService.notify('Invalid interview link.');
      }
    },
      onError = (error) => {
        _this.isInvalidLink = true;
        _this.LoaderService.hide();
      };
    _this.CandidateInterviewService.getInterviewDetailsByCode(_this.interviewCode);
    _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  }

  goToInterviewProfile() {
    if (angular.isDefined(_this.AuthService.user)) {
      if (_this.AuthService.user.userType === 1 && _this.interviewDetails.interViewTypeId === 3) {
        _this.UtilsService.notify('You are not allowed to give this interview.');
      } else {
        let additionalInfo = _this.filterBlankOption(_this.interviewDetails.criteria.options);
        if (angular.isDefined(additionalInfo) && additionalInfo.length > 0) {
          _this.$state.go('ci.profile');
        } else {
          _this.$state.go('ci.prepare');
        }
      }
    } else {
      _this.$state.go('ci.interview', { 'interviewCode': _this.interviewCode }, { reload: true });
    }
  }

  filterBlankOption(additionalInfoArray) {
    let criteriaOption = [];
    if (angular.isDefined(additionalInfoArray) && additionalInfoArray.length > 0) {
      for (var i = 0; additionalInfoArray.length > i; i++) {
        if (additionalInfoArray[i].option != "") {
          criteriaOption.push(additionalInfoArray[i]);
        }
      }
    }
    return criteriaOption;
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
    // else if(_this.$window.navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/Chrome/i) || navigator.userAgent.match(/Firefox/i) ){
    //   _this.appTypeId = 3;
    // }
    // else if(_this.$window.navigator.userAgent.match(/iPhone|iPad|iPod/i)){
    //   _this.appTypeId = 1;
    // }
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
      }
    _this.GeneralSettingsService.getApplicationType(appId).then(onSuccess, onError);
  }

  lastNameChanged(lastName) {
    if (lastName !== "") {
      _this.lastNameError = false;
    }
  }

  loginCandidate(userType) {
    let onSuccess = (response) => {
      _this.AuthService.saveCurrentUser(response.data);
      _this.checkCandidateForInterview();
    },
      onError = (error) => {
        console.log(error);
      },
      email = (userType === 1) ? _this.companyEmail : _this.candidateEmail;
    _this.AuthService.doLogin({ username: email, password: _this.password, userType: userType });
    _this.AuthService.activePromise.then(onSuccess, onError);
  }

  registerCandidate() {
    if (_this.checkValidationForRegister()) {
      let onSuccess = (response) => {
        _this.AuthService.saveCurrentUser(response.data);
        _this.checkCandidateForInterview();
        _this.detectApplicationType();
      },
        onError = (error) => {
          console.log(error);
        };
      _this.candidateData.address = _this.geoAddress.name;
      _this.candidateData.interviewId = _this.interviewDetails.interviewId;
      _this.CandidateInterviewService.registerCandidate(_this.candidateData);
      _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
    }
  }

  checkValidationForRegister() {
    let returnValue = true;
    if (!_this.UtilsService.isValidString(_this.candidateData.firstName)) {
      _this.registerError.firstNameError = true;
      returnValue = false;
    } else {
      _this.registerError.firstNameError = false;

    }

    if (!_this.UtilsService.isValidString(_this.candidateData.lastName)) {
      _this.registerError.lastNameError = true;
      returnValue = false;
    } else {
      _this.registerError.lastNameError = false;
    }

    if (!_this.UtilsService.isValidString(_this.candidateData.email)) {
      _this.registerError.emailError = true;
      returnValue = false;
    } else {
      _this.registerError.emailError = false;
    }

    if (!angular.isDefined(_this.candidateData.phone) || _this.candidateData.phone === '') {
      _this.errmsgcon = 'Enter Contact Number';
    } 

    if (!_this.UtilsService.isValidString(_this.candidateData.password)) {
      _this.registerError.passwordError = true;
      returnValue = false;
    } else {
      _this.registerError.passwordError = false;
    }

    if (!_this.UtilsService.isValidString(_this.confirmPassword)) {
      _this.registerError.passwordMismatchError = true;
      returnValue = false;
    } else {
      _this.registerError.passwordMismatchError = false;
    }

    if (_this.candidateData.password !== _this.confirmPassword) {
      _this.registerError.passwordMismatchError = true;
      returnValue = false;
    } else {
      _this.registerError.passwordMismatchError = false;
    }

    if (!_this.UtilsService.isValidString(_this.geoAddress.name)) {
      _this.registerError.locationError = true;
      returnValue = false;
    } else {
      _this.registerError.locationError = false;
    }

    if (angular.isDefined(_this.candidateData.candidateOrganization) && _this.candidateData.candidateOrganization !== "") {
      _this.registerError.reachUsError = false;
    } else {
      _this.registerError.reachUsError = true;
      returnValue = false;
    }

    return returnValue;
  }

  checkForOrg() {
    if (angular.isDefined(_this.candidateData.candidateOrganization) && _this.candidateData.candidateOrganization !== "") {
      _this.registerError.reachUsError = false;
    } else {
      _this.registerError.reachUsError = true;
    }
  }

  checkForLocation() {
    _this.registerError.locationError = false;
  }

  checkFirstName() {
    if (!_this.UtilsService.isValidString(_this.candidateData.firstName)) {
      _this.registerError.firstNameError = true;
    } else {
      _this.registerError.firstNameError = false;
    }
  }

  checkLastName() {
    if (!_this.UtilsService.isValidString(_this.candidateData.lastName)) {
      _this.registerError.lastNameError = true;
    } else {
      _this.registerError.lastNameError = false;
    }
  }

  checkCandidateForInterview() {
    if (_this.checkForExpiredInterview()) {
      _this.isNextEnable = false;
      _this.UtilsService.notify('Interview already expired on ' + _this.interviewDetails.localInterviewExpiryDateTime);
    }
    // checking for before date interview       
    else if (_this.checkForBeforeDateInterview()) {
      _this.isNextEnable = false;
      _this.UtilsService.notify('Interview still not started. Please join on ' + _this.interviewDetails.localInterviewStartDateTime);
    }
    else {
      let onSuccess = (response) => {
        if (response.data.isLinked) {
          let status = response.data.candidateInterviewStatus;
          if (status == 6) {
            _this.UtilsService.notify("You have already given this interview and you were hired");
          }
          else if (status == 11) {
            _this.UtilsService.notify("Interview already completed");
          }
          else if (status == 23) {
            _this.UtilsService.notify("Interview is already given and it has been evaluated");
          }
          else {


            // updating candicate's interview status
            if (_this.$rootScope.user.userType == 2) {
              _this.updateCandidateInterviewStatus();
            }

            let interviewRole = response.data.interviewRole || 'participant';
            _this.$storage.setItem('interviewRole', interviewRole.toLowerCase());
            _this.$storage.setItem('interviewDetails', JSON.stringify(_this.interviewDetails));
            _this.$storage.setItem('interviewType', _this.interviewDetails.interViewTypeId);
            _this.$storage.setItem('interviewId', _this.interviewDetails.interviewId);
            _this.goToInterviewProfile();
          }
        } else {
          _this.UtilsService.notify(_this.AuthService.user.fullName + ", you are not allowed to give " + _this.interviewDetails.interviewName + " interview.");
        }
      },
        onError = (error) => {
          console.log(error);
        },
        checkData = {
          interviewCode: _this.interviewCode
        };
      _this.CandidateInterviewService.checkCandidateForInterview(checkData);
      _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
    }
  }

  goBack() {
    let user = _this.$rootScope.user;
    if (user !== null) {
      if (_this.AuthService.user.userType == 2) {
        _this.$state.go('candidateProfile.home');
      }
      else {
        _this.$state.go('app.dashboard');
      }
    } else {
      window.location = "https://jottp.com";
    }
  }

  checkForBeforeDateInterview() {
    let interviewDetails = _this.interviewDetails;
    let currentDate = moment();
    let interviewStartDate = interviewDetails.startDate;
    let interviewStartTime = (interviewDetails.startTime === "") ? "00:00:00" : interviewDetails.startTime;
    let interviewStartDateTime = interviewStartDate + " " + interviewStartTime;
    let localInterviewStartDateTime = _this.UtilsService.getLocalTimeFromGMT(interviewStartDateTime);
    let format = (_this.interviewDetails.interviewTypeId == 3) ? '24' : '24H';
    _this.interviewDetails.localInterviewStartDateTime = _this.UtilsService.getLocalTimeFromGMT(interviewStartDateTime, format);
    if (localInterviewStartDateTime > currentDate) {
      return true;
    } else {
      return false;
    }
  }

  checkForExpiredInterview() {
    let currentDate = moment();
    let interviewExpiryDate = _this.interviewDetails.endDate;
    let interviewExpiryTime = (_this.interviewDetails.endTime === "") ? "00:00:00" : _this.interviewDetails.endTime;
    let interviewExpiryDateTime = interviewExpiryDate + " " + interviewExpiryTime;
    let localInterviewExpiryDateTime = _this.UtilsService.getLocalTimeFromGMT(interviewExpiryDateTime);
    if (_this.interviewDetails.interviewTypeId == 3) {
      localInterviewExpiryDateTime = moment(localInterviewExpiryDateTime).add(1, 'days');
    }
    let format = (_this.interviewDetails.interviewTypeId == 3) ? '24' : '24H';
    _this.interviewDetails.localInterviewExpiryDateTime = _this.UtilsService.getLocalTimeFromGMT(interviewExpiryDateTime, format);
    if (localInterviewExpiryDateTime < currentDate) {
      return true;
    } else {
      return false;
    }
  }

  changeLandingImage() {
    if(!window.mobile){
    $('.candidate-view-steps').css('background-image', 'url(' + _this.interviewDetails.landingImage + ')');
    }
  }

  //function for geolocation
  onSelectGoogleAddress(value) {
    console.log(value);
  }

  updateCandidateInterviewStatus() {
    let onSuccess = (response) => {
      console.log('***-----------Candidate Interview Status Updated To Has Started------------***');
    },
      onError = (error) => {
        console.log(error);
      },
      statusData = { statusId: 10, interviewId: _this.interviewDetails.interviewId };
    _this.CandidateInterviewService.updateCandidateInterviewStatus(statusData);
    _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
  }
}

