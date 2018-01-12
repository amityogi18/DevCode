export class infoModalController {
	/** @ngInject  */
    constructor($uibModalInstance) {
        this.$uibModalInstance = $uibModalInstance;
    }

    ok() {
        this.$uibModalInstance.close();
    }

};
