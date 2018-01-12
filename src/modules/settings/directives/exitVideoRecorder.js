
class ExitVideoRecorderDirective {
  constructor($injector, $sce, $timeout) {
    this.$injector = $injector;
      this.$sce = $sce;
    this._instantiateDDO();
  }

  _instantiateDDO() {
    this.restrict = 'E';
    this.scope = {
        defaultUrl: '@'
    },
    this.templateUrl = 'settings/partials/exitVideoRecorder.jade',
    this.controller = 'ExitVideoRecorderController',
    this.controllerAs = 'evr'
  }
}

exitVideoRecorder.$inject = ['$injector', '$sce', '$timeout'];

export function exitVideoRecorder($injector, $parse) {
  return new ExitVideoRecorderDirective($injector, $parse);
}