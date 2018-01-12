var _activePromise,
  _errorTranslationKey,
  _ticketList,
  _ticketDetails,
  _ticketId,
  _recruiterId,
  _ticketDescriptionList,
  _this;

/*
 @name ticketingSystemSaService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */

export class TicketingSystemSaService {
	 /** @ngInject  */
  constructor($http, Upload, $state, UtilsService, APP_CONSTANTS, AuthService) {
    _this = this;   
    _this.$http = $http;
    _this.Upload = Upload;
    _this.$state = $state;
    _this.UtilsService = UtilsService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.AuthService = AuthService;
   
  }

  get activePromise() {
    return _activePromise;
  }

  get errorTranslationKey() {
    return _errorTranslationKey;
  }

  set errorTranslationKey(value) {
    _errorTranslationKey = value;
  }
 
getTicketDetails(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/getAllTickets' +query, config);
    }
    
    
 addIssueTicket(ticketData){
    let config  = _this.UtilsService.postCofigObj();
    ticketData.userId = _this.AuthService.user.userId;
    _activePromise =
      _this.Upload.upload({
        url: _this.APP_CONSTANTS.SERVER_URL +'/createticket',
        data : ticketData,
        headers: config.headers
      });
  }
  
  
  getReasonType(){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/ticket/type', config);
  }

}
