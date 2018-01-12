let _this,
    _activePromise,
    _errorTranslationKey;
    
export class AdminPaymentPlanService {
	/** @ngInject  */
    constructor($http, Upload, $state, APP_CONSTANTS, AuthService, UtilsService) {
        _this=  this;
        _this.$http = $http;
        _this.Upload = Upload;
        _this.$state = $state;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.AuthService = AuthService;
        _this.UtilsService = UtilsService;
    }
    
    set activePromise(value) {
     _activePromise = value;
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
  
    getPlansData(){ 
      let companyId = _this.AuthService.user.companyId || 1,
      config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/plans/myplans/'+companyId, config);

    }
    getPlansDataUsage(){ 
      let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/plan/company/remaining-plan-detail', config);

    }
    getPlanDetails(planId){
       let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/setting/plan/'+planId, config);

    }
    
    getThreeDSecureSource(data){
       let config  = _this.UtilsService.postCofigObj();
      return _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/stripe/threedsecure',data , config);
    }
    
    getPaymentObject(data){
       let config  = _this.UtilsService.postCofigObj();
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/stripe/non-threedsecure',data , config);
    }
    
    makePayment(data){
       let config  = _this.UtilsService.postCofigObj();
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/stripe/payment',data , config);
    }
    
    getTrial(data){
       let userId = _this.AuthService.user.userId,
           config  = _this.UtilsService.postCofigObj();
        data.userId = userId;
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/setting/plan/purchasefreeplan', data, config);
    }
    
    getOwnerInfo(){
        let  config = _this.UtilsService.getCofigObj(),
            url = _this.APP_CONSTANTS.SERVER_URL+'/setting/company/card-details';
       return _activePromise = _this.$http.get(url,config);
    }
}

