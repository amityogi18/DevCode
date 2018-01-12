let _this;
export class CertificateExitController {
	/** @ngInject  */
  constructor($window, $state, $stateParams, CertificationTemplateService) {
    _this = this;
    _this.$window = $window;
    _this.$state = $state;
    _this.$stateParams = $stateParams;
    _this.CertificationTemplateService = CertificationTemplateService;
    _this.certificateId = _this.$stateParams.certificateId;
    _this.certificationResult = {};
    _this.getCertificationResult();
  }

  getCertificationResult(){
   let onSuccess = (response) => {
       _this.certificationResult = response.data;
     },
     onError = (error) =>{
       console.log(error);
     };

   _this.CertificationTemplateService.getCertificationResult(_this.certificateId);
   _this.CertificationTemplateService.activePromise.then(onSuccess, onError);
 }
};
