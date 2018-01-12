let _this;

export class googleOutlookAuthController {
	/** @ngInject  */
  constructor($state, $stateParams, DashboardService, calendarService) {
      
      _this = this;
      _this.$state = $state;
      _this.$stateParams = $stateParams;
      _this.DashboardService = DashboardService;
      _this.calendarService = calendarService;
      _this.mailClient = _this.$stateParams.mailClient;
      if(_this.mailClient === 'google') {
        _this.saveGoogleAuthCode(_this.$stateParams.code);
      }
      else if(_this.mailClient === 'outlook') {
        _this.saveOutlookAuthCode(_this.$stateParams.code);
      }
      
  } 
  saveGoogleAuthCode(authCode) {
    let onSuccess = (response) => {
        _this.$state.go('settings.calendar');   
    },
    onError = (error) => {
        console.log(error);
    }
  _this.calendarService.googleAuthCode(authCode);
  _this.calendarService.activePromise.then(onSuccess, onError);
  }

  saveOutlookAuthCode(authCode) {
    let onSuccess = (response) => {
        _this.$state.go('settings.calendar');   
    },
    onError = (error) => {
        console.log(error);
    }
  _this.calendarService.outlookAuthCode(authCode);
  _this.calendarService.activePromise.then(onSuccess, onError);
  }
}