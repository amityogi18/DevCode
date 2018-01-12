let _this;
export class assessmentConfirmSubmissionController {
	/** @ngInject  */
  constructor($uibModalInstance) {
    _this = this;
    _this.$uibModalInstance = $uibModalInstance;
  }

  ok() {
    _this.$uibModalInstance.close();
  }

  cancel() {
    _this.$uibModalInstance.dismiss('cancel');
  }

};