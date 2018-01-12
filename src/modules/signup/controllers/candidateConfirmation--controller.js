let _this;

export class CandidateConfirmationController {
	/** @ngInject  */
  constructor($state, $rootScope, $window, $timeout, AuthService, $storage) {
    _this = this;
    _this.$state = $state;
     _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.$timeout = $timeout;
    _this.AuthService = AuthService;
    _this.$storage = $storage;
    _this.$rootScope.companyLogoPath = "./img/logo.png";
    _this.$rootScope.profilePicPath = "./img/user.png";
    _this.$storage.setItem('companyLogoPath', "./img/logo.png");
    _this.$storage.setItem('profilePicPath', "./img/user.png");
    _this.$timeout( function(){ _this.doAutoLoginForCandidate(); }, 1000);
  }

  doAutoLoginForCandidate(){
    let token = _this.$state.params.token;

    let onSuccess = (response) => {
           _this.$state.go('candidateProfile.home');
        },
        onError = (error) => {
            console.log(error);
        };

    let activePromise = _this.AuthService.doAutoLoginForCandidate(token);
    _this.AuthService.activePromise.then(onSuccess, onError);
  }
}
