function linkingFunc() {
 
  return function (scope, element, attr) {
      element.attr('src', attr.dynamicUrlSrc);
   
  };
}

class videoSrcDirective {
  constructor() {
    this._instantiate();
  }

  _instantiate() {
    this.restrict = 'A';
    this.link = linkingFunc();
  }
}


export function videosrcdir() {
  return new videoSrcDirective();
}