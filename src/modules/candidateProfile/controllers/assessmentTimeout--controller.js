let _this;
export class assessmentTimeoutController {
	/** @ngInject  */
  constructor($uibModalInstance) {
    _this = this;
    _this.$uibModalInstance = $uibModalInstance;
  }

  ok() {
    _this.$uibModalInstance.close();
  }

};