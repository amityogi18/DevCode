let _activePromise,
    _this;

export class CandidateCredentialsService {
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

    getCandidateCredentials(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/ondemand-candidates/official-email-password'+ query, config);
    }

    getCandidateCredentialsById(id){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/ondemand-candidates/official-email-password/'+ id, config);
    }

    addCandidateCredentials(data){
        let config  = _this.UtilsService.postCofigObj();
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/ondemand-candidates/official-email-password',data, config);
        
    }

    updateCandidateCredentials(data){
        let config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/ondemand-candidates/official-email-password',data, config);
        
    }
    

}