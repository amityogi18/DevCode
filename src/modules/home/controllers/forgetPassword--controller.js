let _this;
let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
export class ForgetPasswordController {
	/** @ngInject  */
  constructor($http,forgetPasswordService, $state, $stateParams) {
    _this = this;
    _this.$http = $http;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.forgetPasswordService = forgetPasswordService;
    _this.message = "";
    _this.userType = _this.$stateParams.userType;
    _this.isMailSent = false;
    _this.isShowError = false;
    console.log('Forget Password Controller Loaded');

  }

  forgetPassword(form) {
    if(form !== undefined && form !== ""){
    var onSuccess = (response) => {
        if(response.data.successMessage === "USER_NOT_REGISTERED"){
          _this.isMailSent = false;
          _this.isShowError = true;
        }else{
          _this.isMailSent = true;
        }

         
      },
      onError = (response) => {
        if (response !== null) {
          _this.isMailSent = false;
          _this.message = response.data.errorCode;
        }
      };
      _this.forgetPasswordService.forgotPassword({emailId:form, userType : _this.userType});
      _this.forgetPasswordService.activePromise.then(onSuccess, onError);
  }
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
}

