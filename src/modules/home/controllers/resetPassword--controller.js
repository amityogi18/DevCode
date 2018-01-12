export class ResetPasswordController {
	/** @ngInject  */
  constructor($http,resetPasswordService, $state, $stateParams, GrowlerService) {
    this.$http = $http;
    this.resetPasswordService = resetPasswordService;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.GrowlerService = GrowlerService;
    this.userType = this.$stateParams.userType;
    this.password = "";
    console.log('Home Controller Loaded');
    this.errorTranslationKey = "";
    this.passwordMismatch = false;
    this.passMismatch=false;
    this.user = {};
  }

  get email() {
    return this.resetPasswordService.email;
  }

  set email(value) {
    this.resetPasswordService.email = value;
  }

  get errorTranslationKey() {
    return this.resetPasswordService.errorTranslationKey;
  }

  set errorTranslationKey(errorTranslationKey) {
    this.resetPasswordService.errorTranslationKey = errorTranslationKey;
  }

  get user() {
    return this.resetPasswordService.user;
  }

  set user(value) {
    this.resetPasswordService.user = value;
  }

  resetPassword(form) {
      if (this.checkRequireFields()) {
          var onSuccess = (response) => {
                  this.GrowlerService.growl({
                      type: 'success',
                      message: 'Password Changed Successfully.',
                      delay: 500
                  });
                  console.log('success');
                  this.errorTranslationKey = response.data.message;
                  if (this.userType == '2') {
                      this.$state.go('app.candidate-login');
                  }
                  else if (this.userType == '1') {
                      this.$state.go('app.user-login');
                  }
                  //this.showConfirmation = true;
              },
              onError = (response) => {
                  console.log('failure', response);
                  if (response !== null) {
                      this.errorTranslationKey = response.data.errorCode;
                      form && form.$setPristine();
                  }
              };
          var resetUser = {};
          resetUser.emailToken = this.$stateParams.token;
          resetUser.newPassword = form.password;
          resetUser.userType = this.$stateParams.userType;
          console.log(resetUser.userType);
          this.resetPasswordService.resetPassword(resetUser);
          this.resetPasswordService.activePromise.then(onSuccess, onError);
      }
  }
  confirmPassword(value){
    if(this.user.password !== value){
      this.passwordMismatch = true;
    }else {
      this.passwordMismatch = false;
    }
  }

  analyzeResetPassword(value) {
    let strongRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$");
    this.isPasswordRight = strongRegex.test(value);
  }
   analyzePasswordEquality() {
     if (angular.isDefined(this.user.confirmPassword) && this.user.confirmPassword!==this.user.password) {
      this.message='Password Mismatch';
      this.passMismatch=true;
       }
       else{
        this.passMismatch=false;
         this.message='';
       }
     }
    checkRequireFields(){
    if( this.user.password && this.user.password !== ''
    &&  this.user.confirmPassword && this.user.confirmPassword !== ''
    && this.passMismatch == false
    && this.isPasswordRight == true){
    return true;
    }
   else{
     this.resetPasswordForm.$setSubmitted();
        return false;
}
}
}

