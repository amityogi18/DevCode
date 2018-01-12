import _ from 'lodash';

function linkingFunc($injector) {
  return function (scope, elem, attrs) {
    var modalService = $injector.get('$uibModal'),
      modalConfig = $injector.get(scope.id),
      modalScope = {
        scope:scope
      },
      modalInstance;

    function execute(fn) {
      _.isFunction(fn);
    }

    scope.open = () => {
      modalConfig = _.extend(modalConfig, modalScope);
      //console.log(modalConfig);
      modalInstance = modalService.open(modalConfig);
      modalInstance.opened.then(() => {
        execute(scope.onOpen);
      });

      modalInstance.result.then(() => {
        execute(scope.onClose);
      }, () => {
        execute(scope.onDismiss);
      });
    };
    scope.close = () =>{
        modalInstance.close('save');
        scope.onClose();
    };

    scope.dismiss = () =>{
        modalInstance.dismiss('cancel');
    };
  };

}

class AsmModalDirective {
  constructor($injector) {
    this.$injector = $injector;
    this._instantiateDDO();
  }

  _instantiateDDO() {
    this.restrict = 'A';
    this.transclude = true;
    this.template = '<button class="{{btnClass}}" data-ng-transclude data-ng-click="open()"></button>';
    this.scope = {
      id: '@asmModal',
      onClose: '&',
      onDismiss: '&',
      onOpen: '&',
      data:'=modalData',
      infoData:'@',
      btnClass:'@'
    };
    this.link = linkingFunc(this.$injector);
  }
}

asmModal.$inject = ['$injector'];
export function asmModal($injector) {
  return new AsmModalDirective($injector);
}
