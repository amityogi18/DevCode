function linkingFunc($injector, $parse) {
  console.log('this is loaded');
  return function (scope, elem, attrs) {
      var onFileSelectHandler = scope.$eval(attrs.onFileSelect);
      element.bind('change', onFileSelectHandler);
   
  };
}

class FileSelectDirective {
  constructor($injector, $parse) {
    this.$injector = $injector;
    this.$parse = $parse;
    this._instantiateDDO();
    console.log('in constructor');
  }

  _instantiateDDO() {
    this.restrict = 'A';
    this.link = linkingFunc(this.$injector, this.$parse);
  }
}

onFileSelect.$inject = ['$injector', '$parse'];

export function onFileSelect($injector, $parse) {
  return new FileSelectDirective($injector, $parse);
}