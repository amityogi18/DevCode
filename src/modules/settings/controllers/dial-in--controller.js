var _this;
export class DialInController {
	/** @ngInject  */
  constructor(AdminCompanyInfoService, $timeout) {
    console.log('Inside dial in controller constructor');
    _this = this;
    _this.AdminCompanyInfoService = AdminCompanyInfoService;
    _this.timeZoneList = [];
    _this.getAllTimeZone();

  }
  
  getAllTimeZone(){
        let onSuccess = (response) => {
                _this.timeZoneList = response.data;
            },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminCompanyInfoService.getAllTimeZone();
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
    }
}

