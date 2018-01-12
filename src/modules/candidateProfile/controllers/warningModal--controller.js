export class warningModalController {
	/** @ngInject  */
    constructor($uibModalInstance) {
        this.$uibModalInstance = $uibModalInstance;
    }

    ok() {
        this.$uibModalInstance.close();
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }

};
