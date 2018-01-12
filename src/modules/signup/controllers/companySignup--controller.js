let _this = "";
let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

/*
@SignupHomeController Controller
@param {object} $state - service that can contain some state.
@param {object} signupHomeService - returns the object and provides all the values and methods related to the signup home.
@param {LoaderService} -  It is service which helps in showing the progress bar.
*/
export class CompanySignupController {
	/** @ngInject  */
  constructor($state, CompanySignupService, LoaderService, APP_CONSTANTS){
    _this = this;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.SITEKEY = _this.APP_CONSTANTS.RECAPTCHA_KEY;
    _this.$state = $state;
    _this.CompanySignupService = CompanySignupService;
    _this.LoaderService = LoaderService;
     console.log("Company signup controller loaded");
    _this.isEmailReSent = false;
    _this.isInterview =  true;
    _this.isConference = false;
    _this.passwordMismatch = false;
    _this.isPasswordRight = false;
    _this.isEmailRight=false;
  }

    checkMandatoryFields() {
        if( _this.email && _this.email !==''
            &&_this.password && _this.password !== ''
            && _this.confirmPassword && _this.confirmPassword !== ''
            && _this.confirmPassword == _this.password
            && _this.isAgree && _this.isAgree !== false
            &&  _this.isEmailRight == true
            && ( _this.isInterview == true || _this.isConference == true)

        ) { _this.productMsg = " ";
            return true;
        }
        else{_this.loginForm.$setSubmitted();
            return false;
        }
    }

    checkProductSelection(){
      if( _this.isInterview || _this.isConference){
          _this.productMsg = " ";
      }
      else{
          _this.productMsg = "Please Select Product"
      }
    }

  /*
   * @name - doSignup
   * @returns {object} - promise object that contains the data which has email id, token and roalId
   * @description - This function calls the api that completes the first step of signup process and returns  the object that cntains email id, token and rolid.
  */
  doSignup() {

      if(!angular.isDefined( _this.email) ||  _this.email == ''){
          _this.errormessage = "Enter Email Id";
      }

      if (!angular.isDefined(_this.confirmPassword) || _this.confirmPassword === '') {
          _this.message='Please Confirm Password';
      }

      if( _this.isInterview == false  &&  _this.isConference == false){
          _this.productMsg = "Please Select Product"
      }
      if (_this.checkMandatoryFields()) {
          let _companyInfo = {};
          _companyInfo.email = this.email;
          _companyInfo.password = this.password;
          if (this.isInterview !== undefined) {
              _companyInfo.interview = this.isInterview;
          }
          if (this.isConference !== undefined) {
              _companyInfo.conference = this.isConference;
          }
          _this.CompanySignupService.doSignup(_companyInfo);
      }
  }

  confirmPasswords(value){
    console.log('in the change pass');
    if(_this.password !== value){
      _this.passwordMismatch = true;
    }else {
      _this.passwordMismatch = false;
    }
  }

  analyzePassword(value) {
    let strongRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$");
    _this.isPasswordRight = strongRegex.test(value);
  }

  /*
   * @name - resendEmail
   * @description - This function calls the method of signupHomeService to resend the mail.
   */
  resendEmail(){
    _this.CompanySignupService.resendEmail();
  }

  isInvalidEmail(email){
    _this.errormessage = "";
  
    if(angular.isDefined(email) && !reg.test(email)){
      _this.errormessage = "Enter Valid Email Id";
      _this.isEmailRight=false;
    }
  else if(!angular.isDefined(email) || email === "" || email === null){
      _this.errormessage = "Please Enter Email Id";
      
    }
    else {
      _this.errormessage = "";
      _this.isEmailRight=true;
    }

  };

  checkPasswordEquality() {
     if (angular.isDefined(this.confirmPassword) && this.confirmPassword!==this.password) {
      this.message='Password Mismatch';
      this.passMismatch=true;
       }
       else{
        this.passMismatch=false;
         this.message='';
       }
     }

   checkproduct(){
      if( _this.isInterview !== 'true' ||  _this.isConference !== 'true'){
          _this.productMsg="Please Select Product"
      }
   }
}

