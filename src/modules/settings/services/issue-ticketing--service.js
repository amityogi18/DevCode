let _this,
    _activePromise;

export class IssueTicketingService {
	/** @ngInject  */
    constructor($q, $http,AuthService,APP_CONSTANTS,Upload, UtilsService) {
        _this =  this;
        _this.$q = $q;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.Upload = Upload;
        _this.UtilsService = UtilsService;
    }
    get activePromise() {
      return _activePromise;
    }

  getReasonType(){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/ticket/type', config);
  }

  // saveIssueTicket(ticketData){
  //   ticketData.userId = _this.AuthService.user.userId;
  //   _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/createticket',ticketData);
  //
  // }

  saveIssueTicket(ticketData){
    let config  = _this.UtilsService.postCofigObj();
    ticketData.userId = _this.AuthService.user.userId;
    ticketData.companyId = _this.AuthService.user.companyId || 1;
    ticketData.userTypeId = _this.AuthService.user.userType;  
        return _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/createticket',
            data : ticketData,
            headers: config.headers
      });      
  }

  getAllIssueTickets(query){
     let config  = _this.UtilsService.getCofigObj();
     let userId = _this.AuthService.user.userId || 1;
     let userType = _this.AuthService.user.userType;
     let companyId = _this.AuthService.user.companyId || 1;
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/getUserTickets/'+userId+'?userTypeId='+ userType+''+query, config);
  }

  getTicketDetails(ticketId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/ticketComment/get/'+ticketId, config);
  }

  createComment(commentData){
      commentData.commentedBy = _this.AuthService.user.userId;
      commentData.userTypeId = _this.AuthService.user.userType;
      let config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/ticketComment/save',commentData, config);
  }

  changeStatus(ticketId,statusData){
     let config  = _this.UtilsService.putCofigObj();
    _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/ticket/changeStatus/'+ticketId, statusData, config);
  }

  updateIssueTicket(ticketData){
     let config  = _this.UtilsService.postCofigObj();
   // _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/ticket/updateticket', ticketData);
    _activePromise =
      _this.Upload.upload({
        url: _this.APP_CONSTANTS.SERVER_URL +'/ticket/updateticket',
        data : ticketData,
        headers: config.headers
      });
  }

}


