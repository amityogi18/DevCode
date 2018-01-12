let _this;
export class CalendarController {
	/** @ngInject  */
  constructor($rootScope, calendarService, GrowlerService) {
    _this = this;
    _this.calendarService = calendarService;
    _this.GrowlerService = GrowlerService;
    _this.calendarOption = '';
    _this.googleAuthUrl = "";
    _this.outlookAuthUrl = "";
    _this.getPreference();
    _this.getGoogleAccess();
    _this.getOutlookAccess();
    
  }

  saveCalendarSettings(){
    var preferenceCalendar = {};
    preferenceCalendar.isDefaultCanledar = _this.calendarOption;
    

    let onSuccess = (response) => {
        if(_this.calendarOption === 'gmail') {
          window.location.replace(_this.googleAuthUrl);
        }
        else if(_this.calendarOption === 'outlook') {
          window.location.replace(_this.outlookAuthUrl);
        } 
    }, 
    onError = (error) => {
      console.log(error);
    }; 
    _this.calendarService.saveCalendarPrefernce(preferenceCalendar);
    _this.calendarService.activePromise.then(onSuccess, onError);
  }

  getPreference() {
    let onSuccess = (response) => {
      _this.calendarOption = response.data.defaultCalendar;
    },
    onError = (error) => {
      console.log(error);
    };

    _this.calendarService.getCalendarPrefernce();
    _this.calendarService.activePromise.then(onSuccess, onError);
  }

  getGoogleAccess() {
    let onSuccess = (response) => {
        console.log(response);
      _this.googleAuthUrl = response.data.authUrl   
    },
    onError = (error) => {
        console.log(error);
    }
   _this.calendarService.googleAccess();
   _this.calendarService.activePromise.then(onSuccess, onError);
  }

  getOutlookAccess() {
    let onSuccess = (response) => {
        console.log(response);
      _this.outlookAuthUrl = response.data.authUrl   
    },
    onError = (error) => {
        console.log(error);
    }
   _this.calendarService.outlookAccess();
   _this.calendarService.activePromise.then(onSuccess, onError);
  }
    
    
  }
