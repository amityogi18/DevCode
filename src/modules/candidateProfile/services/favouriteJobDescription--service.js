let _this,
    _activePromise;

export class favouriteJobDescriptionService {
	/** @ngInject  */
  constructor($http, APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }

    get activePromise() {
        return _activePromise;
    }



     getFavouriteJobDescription(jobId){
         let  config  = _this.UtilsService.getCofigObj();
         _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/public/position/' + jobId + '/position-details?type=json', config);
  }

}