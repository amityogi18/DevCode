let _this,
    _activePromise;

export class appliedjobListService {
	/** @ngInject  */
  constructor($http, $state, APP_CONSTANTS, UtilsService, AuthService) {
    _this = this;
    _this.$http = $http;
    _this.$state = $state;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
    _this.AuthService = AuthService;

  }

    getAppliedJobList(query){
        let  config  = _this.UtilsService.getCofigObj();
        let  userId = _this.AuthService.user.userId;
        return _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/candidate-profile/applied/jobs/'+userId+ query, config);
    }

    getfavoriteJobList (query){
        let  config  = _this.UtilsService.getCofigObj();
        return _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/getallfavouritejob' +query, config);

    }

    deleteAppliedJob(removeJobObj){
         let config = _this.UtilsService.putCofigObj();
       return  _activePromise = this.$http.put(this.APP_CONSTANTS.SERVER_URL + '/candidate/remove/job' ,removeJobObj , config);

    }


}
