var _isInLoginPage = false,
    _logoutPromise = "";

export class AppService {
  /** @ngInject */
  constructor($http, $window){
    this.$http = $http;
    this.$window = $window;
  }
  get isInLoginPage() {
    return _isInLoginPage;
  }

  set isInLoginPage(value) {
    _isInLoginPage = value;
  }

  get activePromise(){
    return _logoutPromise;
  }

  set activePromise(value){
    _logoutPromise = value;
  }

}