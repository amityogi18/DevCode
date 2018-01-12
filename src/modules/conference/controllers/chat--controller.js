let _this;

export class ChatController {
	/** @ngInject  */
  constructor($scope, $uibModalInstance){
    _this =  this;
    _this.$scope = $scope;
    _this.$uibModalInstance = $uibModalInstance;
    console.log("Chat Controller Loaded");
  }

  ok(){
    _this.$uibModalInstance.close(_this.$scope.selected.item);
  };

  cancel() {
    _this.$uibModalInstance.dismiss('cancel');
  };

}

