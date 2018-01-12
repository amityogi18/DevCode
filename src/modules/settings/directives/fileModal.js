function linkingFunc($injector, $parse) {
  console.log('this is loaded');
  return function (scope, elem, attrs) {
      let model = $parse(attrs.fileModal);
      let modelSetter = model.assign;
      let urlModel = $parse(attrs.fileModalUrl);
      let urlModelSetter = urlModel.assign;
      elem.bind('change', (event)=> {
          scope.$apply(() => {
              console.log(elem[0].files[0]);
              modelSetter(scope, elem[0].files[0]);
              urlModelSetter(scope, URL.createObjectURL(elem[0].files[0]));
              if(attrs.callback) {
                scope.$eval(attrs.callback, {$event: event});
              }
          });  
      });
   
  };
}

class FileModalDirective {
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

fileModal.$inject = ['$injector', '$parse'];

export function fileModal($injector, $parse) {
  return new FileModalDirective($injector, $parse);
}