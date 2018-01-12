function linkingFunc($injector, $parse) {
  return function (scope, elem, attrs) {
      let model = $parse(attrs.imageModal);
      let modelSetter = model.assign;
      let modelUrl = $parse(attrs.imageModalUrl);
      let modelUrlSetter = modelUrl.assign;
      elem.bind('change', ()=> {
          scope.$apply(() => {
              modelSetter(scope, elem[0].files[0]);
              let reader = new FileReader();

              reader.onload = (event) => {
                  console.log('done reading');
                  modelUrlSetter(scope, event.target.result);
                  scope.$apply();
                  if(attrs.callback) {
                    scope.$eval(attrs.callback, {$event: event});
                  }
              }
              // when the file is read it triggers the onload event above.
              reader.readAsDataURL(elem[0].files[0]);
          });
      });
   
  };
}

class ImageModalDirective {
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

imageModal.$inject = ['$injector', '$parse'];

export function imageModal($injector, $parse) {
  return new ImageModalDirective($injector, $parse);
}