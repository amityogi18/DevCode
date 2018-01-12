let _this,
  _activePromise,
  _errorTranslationKey;
  
  export class QuickStasticsService {
	/** @ngInject  */
    constructor($http, AuthService, APP_CONSTANTS, UtilsService){
          _this =  this;
          _this.$http = $http;
          _this.AuthService = AuthService;
          _this.APP_CONSTANTS = APP_CONSTANTS;
          _this.UtilsService = UtilsService;
          _this.companyId = 1;
    }

     get activePromise() {
      return _activePromise;
    }

      get errorTranslationKey() {
      return _errorTranslationKey;
    }

     set errorTranslationKey(value) {
      _errorTranslationKey = value;
    }

    getallStastics(){
        _this.companyId = _this.AuthService.user.companyId;
         let config  = _this.UtilsService.getCofigObj();   
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/dashboard/quickstatistics/'+ _this.companyId , config);
      }
      
     getCandidateStatusReportGraphData(){  
      let companyId = _this.AuthService.user.companyId || 1,
       config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/statusreport/'+companyId,config);

    }     
    
    getinterviewTrackingReportGraphData(){
      let query = "/"+ _this.AuthService.user.companyId || 1,
          config = _this.UtilsService.getCofigObj();  
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/company/analytics/invitationtrackingreport'+query, config);
    }

  }
