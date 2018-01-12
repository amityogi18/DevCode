var _activePromise,
  _errorTranslationKey;

let _this;
export class feedbackService {
    /** @ngInject */
    constructor($http,Upload,$state,APP_CONSTANTS, AuthService) {
        _this =  this;
        _this.$http = $http;
        _this.Upload = Upload;
        _this.$state = $state;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.AuthService = AuthService;
    }
    
    get activePromise() {
    return _activePromise;
    }

    get errorTranslationKey() {
      return _errorTranslationKey;
    } 
  
    getfeedback(feedbackData){
         _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/sendfeedback', feedbackData);

    }
  
    
//    setInterviewActiviyReportData(reportData){
//      let companyId = _this.AuthService.user.companyId || 1;  
//      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/interviewreport/'+companyId,reportData);
//
//    }
//  
//    getpositionList(){
//      let companyId = _this.AuthService.user.companyId || 1;   
//      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/position/allpositionforfilter/'+companyId);
//    }

}

