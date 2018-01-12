let _this;
let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
let phoneRegex = /^[7-9][0-9]{9}|\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/g;
let zipCodeRegex = new RegExp("^[1-9][0-9]{4,5}$");
let strongRegex=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,15}$/;
let nameRegex=/^[a-zA-Z ]{1,25}$/;


export class CandidateSignupController {
	/** @ngInject  */
  constructor($window, $http, $state, CandidateSignupService, LoaderService, locationService, AdminDepartmentService, AuthService, CandidateProfileService,APP_CONSTANTS, GrowlerService) {
    _this = this;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.SITEKEY = _this.APP_CONSTANTS.RECAPTCHA_KEY;
    _this.$window = $window;
    _this.$http = $http;
    _this.$state = $state;
    _this.candidateSignupService = CandidateSignupService;
    _this.LoaderService = LoaderService;
    _this.adminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.locationService = locationService;
    _this.AuthService = AuthService;
    _this.GrowlerService=GrowlerService;
    _this.locationService.getCountryList();
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
    _this.isAgree=false;
    _this.geoAddress = {};
    _this.selectedGender = {
      gender : "Male"
    };
    console.log('Candidate Signup Controller Loaded');
  }

  get activePromise() {
    return _this.adminDepartmentService.activePromise;
  }

  get countryList(){
    return this.locationService.countryList;
  }

  get stateList(){
    return this.locationService.stateList;
  }

  get cityList(){
    return this.locationService.cityList;
  }

  /*
  * @name - getCityByState
  * @param {int} countryId - this variable stores the country id
  * @description - function fetches the states based on country id
  */
  getStatesByCountry(countryId){
    this.isStateDisabled = false;
    this.isCityDisabled = true;
    this.locationService.getStateList(countryId);
    if(angular.isDefined(this.cityList) && this.cityList !== null && this.cityList.cityId){
      this.cityList.cityId = '';
    }
    //this.getCityByState(0);
    _this.candidateSignupForm.$setPristine();
    _this.candidateSignupForm.$setUntouched();
  }

  /*
  * @name - getCityByState
  * @param {int} stateId - this variable stores the state id
  * @description - function fetches the city based on state id
  */
  getCityByState(stateId){
    this.isCityDisabled = false;
    this.locationService.getCityList(stateId);
  }

    checkMandatoryFields() {     
        _this.address = _this.geoAddress.name;
        if(_this.firstName && _this.firstName !== ''
            && _this.lastName && _this.lastName !== ''
            && _this.address && _this.address !== ''
            && _this.contactNumber && _this.contactNumber !== ''
            && _this.password && _this.password !== ''
            && _this.confirmPassword && _this.confirmPassword !== ''
            && _this.confirmPassword == _this.password
            && _this.departmentId && _this.departmentId !== ''
            && _this.designationId && _this.designationId !== ''
            && _this.isAgree && _this.isAgree !== false           
           
        ) {
            return true;
        }
        else{_this.candidateSignupForm.$setSubmitted();
            return false;
        }
    }

  doCandidateSignup(){

      // if(!angular.isDefined( _this.email) ||  _this.email == ''){
      //     _this.errormessage = "Enter Email Id";
      // }

      // if(!angular.isDefined(_this.zipCode) || _this.zipCode === "" || _this.zipCode === null){
      //     _this.errormessagezip = "Please Enter Zip Code";
      // }

      // if(!angular.isDefined(_this.contactNumber) || _this.contactNumber === "" || _this.contactNumber === null){
      //     _this.errmsgcon = "Please Enter Contact Number";
      // }

      if (!angular.isDefined(_this.confirmPassword) || _this.confirmPassword === '') {
          _this.message='Password Mismatch';
      }

    if(_this.checkMandatoryFields()) {
      let onSuccess = (response) => {
          console.log(response.data);
          _this.$window.sessionStorage.emailToken =  response.data.token;
          _this.$window.sessionStorage.email =  response.data.email;
          _this.$window.sessionStorage.userType = response.data.userType || 2;
          _this.$state.go('signup.candidate-email-confirmation');
        },
        onError = (error) => {
          console.log(error);
        };

      let candidate = {};
      candidate.firstName = _this.firstName;
      candidate.lastName = _this.lastName;
      candidate.email = _this.email;
      candidate.password = _this.password;
      candidate.contactNumber = _this.contactNumber;
      candidate.address = _this.geoAddress.name;
      candidate.departmentId = parseInt(_this.departmentId);
      candidate.designationId = parseInt(_this.designationId);
      candidate.gender = _this.selectedGender.gender;

      _this.LoaderService.show();
      _this.candidateSignupService.doCandidateSignup(candidate);
      _this.candidateSignupService.activePromise.then(onSuccess, onError)['finally'](_this.LoaderService.hide);
    }
  }


  confirmPasswords(value){
    if(_this.password !== value){
      _this.passwordMismatch = true;
    }else {
      _this.passwordMismatch = false;
    }
  }

  analyzePassword(value) {
    //let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    _this.isPasswordRight = strongRegex.test(value);
  }

  /*
  analyzeEmail(value) {
    let strongEmail = new RegExp("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$");
    _this.isEmailValid = strongEmail.test(value);
  }*/

  isInvalidEmail(email){
    _this.errormessage = "";
   if(angular.isDefined(email) && !reg.test(email)){
      _this.errormessage = "Enter Valid Email Id";
      _this.emailCriteria = false;
    }
    else if(!angular.isDefined(email) || email === "" || email === null){
      _this.errormessage = " Please Enter Email Id";
    }else {
      _this.errormessage = "";
      _this.emailCriteria = true;
    }


  };

  getDepartment(){
    let onSuccess = (response) => {
          _this.departmentList = response.data.data;
        },
        onError = (error) => {
        };
      _this.adminDepartmentService.getDepartment();
      _this.adminDepartmentService.activePromise.then(onSuccess, onError);
  }
  
  getDesignation(departmentId,type){
    if(type === 1){
      _this.designationId='';
    }
    let onSuccess = (response) => {
         _this.isDesignationDisabled = false;
          _this.designationList = response.data;
        },
        onError = (error) => {
        };
      _this.candidateSignupService.getDesignation(departmentId);
      _this.candidateSignupService.activePromise.then(onSuccess, onError);
      _this.candidateSignupForm.$setPristine();
      _this.candidateSignupForm.$setUntouched();
  }

  resendEmail(){
      let onSuccess = (response) => {
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
                _this.isEmailReSent = null;
        };
      _this.candidateSignupService.resendEmail();
      _this.candidateSignupService.activePromise.then(onSuccess, onError);
  }

  analyzePhoneNumber(value){
    _this.errmsgcon = "";
    if(angular.isDefined(value) && value.length < 10){
      _this.errmsgcon = "Enter Valid Contact Number";
      _this.contactCriteria = false;
    }
    else if(!angular.isDefined(value) || value === "" || value === null){
      _this.errmsgcon = "Please Enter Contact Number";
    }else {
      _this.errmsgcon = "";
      _this.contactCriteria = true;
    }
    }
    
  analyzeName(firstName){
    _this.errormessageName = "";
    if(angular.isDefined(firstName) && !nameRegex.test(firstName)){
      _this.errormessageName= "Enter Name";
    }
  }

  removeInvalidFirstName(firstName) {
     if (angular.isDefined(firstName)) {
       for (var i = 0; i < firstName.length; i++) {
         var code = firstName.charCodeAt(i);
         if (!(code >= 65 && code <= 91) && !(code >= 97 && code <= 122) && !(code == 32)) {
           _this.firstName = "";
           return;
         }
       }
     }
   }

  removeInvalidLastName(lastName) {
    if (angular.isDefined(lastName)) {
      for (var i = 0; i < lastName.length; i++) {
        var code = lastName.charCodeAt(i);
        if (!(code >= 65 && code <= 91) && !(code >= 97 && code <= 122) && !(code == 32)) {
          _this.lastName = "";
          return;
        }
      }
    }
  }

  checkPasswordEquality() {
        if (angular.isDefined(_this.confirmPassword) && _this.confirmPassword!==_this.password) {
            _this.message='Password Mismatch';
            _this.passMismatch=true;
        }
        else{
            _this.passMismatch=false;
            _this.message='';
        }
    }

    clearSearchDepartment(){
        _this.searchDepartment = '';
    }
    
    clearSearchSkill(){
        _this.searchSkill = '';
    }
}
