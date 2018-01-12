
class VideoRecorderDirective {
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
    this.templateUrl = 'settings/partials/videoRecorder.jade',
    this.controller = 'VideoRecorderController',
    this.controllerAs = 'vr'
  }
}

videoRecorder.$inject = ['$injector', '$sce', '$timeout'];

export function videoRecorder($injector, $parse) {
  return new VideoRecorderDirective($injector, $parse);
}