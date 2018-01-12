let _this,
    _activePromise;
    
export class SuperAdminService {
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
    
    get activePromise() {
    return _activePromise;
    }

    get errorTranslationKey() {
      return _errorTranslationKey;
    } 
    
    getSaPlansData(){ 
        let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/plans', config);

    }
    
     getSaCustomPlanData(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/plans/customplans' +query, config);
    }
    
    getStatusCount() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/statuscount', config);

    }
    
    getTwoMinStatics() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/dashboard/twominintrostatics', config);

    }
    
    getClient() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/dashboard/clients/counts', config);

    }
    
    getCompanyCandidate() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/super-admin/dashboard/company-candidate/counts', config);

    }
    
    getTicketDetail() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/dashboard/ticketcounts', config);

    }
    
    getProfileSocialDetail() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/profile/socialmediacount', config);

    }
    
    getInterviewSocialDetail() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/interview/socialmediacount', config);

    }
    
    getStorageQuotaDetail() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/analytics/getperformance/1', config);

    }
    
    getDiskUsageDetail() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/analytics/getperformance/2', config);

    }
    
    addCustomPlan(data){
      let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/plans/customplans', data, config);
    }
    
    getCompanyList() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/companies', config);

    }
    
    updateCustomPlan(data) {
        let config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/superadmin/plans/customplans', data, config);
    }
}