let _this,
    _countryList,
    _stateList,
    _cityList,
    _activePromise;

export class LocationService {
  /** @ngInject */
  constructor($http, APP_CONSTANTS) {
    _this = this;
    _this.$http = $http;
    _this.APP_CONSTANTS = APP_CONSTANTS;
  }

  get countryList(){
    return _countryList;
  }

  get stateList(){
    return _stateList;
  }

  get cityList(){
    return _cityList;
  }

  get activePromise(){
    return _activePromise;
  }

  getCountryList(){
    let onSuccess = (response) => {
        _countryList = response.data;
      },
      onError = (error) => {
      };

    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/countries');
    _activePromise.then(onSuccess, onError);
  }

  getStateList(countryId){
    let onSuccess = (response) => {
        _stateList = response.data;
      },
      onError = (error) => {
      };

    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/countries/'+countryId+'/states');
    _activePromise.then(onSuccess, onError);
  }

  getCityList(stateId){
    let onSuccess = (response) => {
        _cityList = response.data;
      },
      onError = (error) => {
      };

    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/states/'+stateId+'/cities');
    _activePromise.then(onSuccess, onError);
  }
}