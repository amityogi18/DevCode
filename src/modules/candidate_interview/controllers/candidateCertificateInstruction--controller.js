let _this;
export class candidateCertificateInstructionController {
	/** @ngInject  */
  constructor($window, $location, $timeout, $state, $stateParams, CandidateCertificateService) {
    _this = this;
    _this.$state =  $state;
  }

  startCertificateQuestion(){
    _this.$state.go('ci.certification-question');
  }
}


