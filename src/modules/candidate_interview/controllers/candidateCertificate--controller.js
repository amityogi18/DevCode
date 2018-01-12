let _this;
export class candidateCertificateController {
	/** @ngInject  */
  constructor($window, $location, $timeout, $state, $stateParams, CandidateCertificateService,$storage) {
    _this = this;
    _this.$window = $window;
    _this.$location = $location;
    _this.$timeout = $timeout;
    _this.$state =  $state;
    _this.$stateParams = $stateParams;
    _this.CandidateCertificateService = CandidateCertificateService;
    _this.$storage = $storage;
    _this.questionList = [];
    _this.init();
  }

  init(){
     _this.skillId = _this.$stateParams.skillId || 1;
     _this.getQuestionIdList(_this.skillId);
  }

  getQuestionIdList(skillId){
      let onSuccess = (response) => {
         _this.$storage.setItem('questionIdList', JSON.stringify(response.data.questionIds) || []);
         _this.$storage.setItem('certificateId', JSON.stringify(response.data.certificateId) || 1);
         _this.$storage.setItem('totalQuestions', JSON.stringify(response.data.totalQuestions) || 0);
      },
      onError = (error) =>{
         console.log(error);
      };
      _this.CandidateCertificateService.getQuestionIdList(skillId);
      _this.CandidateCertificateService.activePromise.then(onSuccess, onError);
  }

}


