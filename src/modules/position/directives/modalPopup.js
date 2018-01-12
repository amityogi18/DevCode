function linkingFunc($injector, $uibModal) {
  return function (scope, elem, attrs) {
      let modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'position/partials/peripheral-check.jade',
          controller: 'modalInstanceController',
          controllerAs: 'modalInstanceCtrl',
          scope: scope,
          windowClass: 'peripheral-modal'
      });

      modalInstance.result.then(() => {
          scope.dismiss();
      });

  };
}

class ModalPopupDirective {
  constructor($injector, $uibModal) {
    this.$injector = $injector;
    this.$uibModal = $uibModal;
    this._instantiateDDO();
  }

  _instantiateDDO() {
    this.restrict = 'E';
    this.scope = {
      text: '=',
      dismiss: '&'
    };
    this.link = linkingFunc(this.$injector, this.$uibModal);
  }
}

modalPopup.$inject = ['$injector', '$uibModal'];

export function modalPopup($injector, $uibModal) {
  return new ModalPopupDirective($injector, $uibModal);
}