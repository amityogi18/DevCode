let _this,
    _activePromise;

export class CertificationTemplateService {
	/** @ngInject  */
  constructor($http, $state, AuthService, APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.$state = $state;
    _this.AuthService = AuthService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }

  get activePromise(){
    return _activePromise;
  }

  getCertificationDetails(certificateId){
     let candidateId = _this.AuthService.user.userId || 1,
      config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/certification/'+candidateId+'/'+certificateId, config);
  }

  getAllCertificates(){
    let candidateId = _this.AuthService.user.userId || 1,
     config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/avaliable/certification/'+candidateId, config);
  }

  getCertificationResult(certificateId){
     let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/scorecard/certification/'+certificateId, config);
  }
}

