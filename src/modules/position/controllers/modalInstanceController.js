export class modalInstanceController {
	/** @ngInject  */
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }
  ok() {
    this.$uibModalInstance.close();
  }

}