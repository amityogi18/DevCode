let _timeZoneList,
  _activePromise;

export class TimeZoneService {
  /** @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  get timeZoneList(){
    return _timeZoneList;
  }

  get activePromise(){
    return _activePromise;
  }

  getTimeZoneList(){
    var onSuccess = (response) => {
        _timeZoneList = response.data;
      },
      onError = (error) => {
      };

    _activePromise = this.$http.get('/test/timeZones');
    _activePromise.then(onSuccess, onError);
  }
}