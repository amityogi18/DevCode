
let _activePromise,
  _errorTranslationKey,
  _candidatesList,
  _notificationList,
  _eventsData,
  _positionList,
  _candidatesDetails,
  _candidatesId,
  _recruiterId,
  _notificationCount,
  _totalNotificationList,
  _graphData,
  _candidatesDescriptionList;

/*
 @name DashboardService-Service
 @param {Object}$http  This is a predefined service which is used for ajax call.
 @param {Object} Upload This is predefined service which is used to upload file.
 @param {Object}$state This is a predefined service used for changing the state.
 */

export class DashboardService {
	/** @ngInject  */
  constructor($http, Upload, $state, AuthService, APP_CONSTANTS, UtilsService) {
    this.$http = $http;
    this.Upload = Upload;
    this.$state = $state;
    this.AuthService = AuthService;
    this.APP_CONSTANTS = APP_CONSTANTS;
    this.UtilsService = UtilsService;
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

  get candidatesDetails(){
    return _candidatesDetails;
  }

  set candidatesDetails(value){
    _candidatesDetails = value;
  }

  get candidatesList() {
    return _candidatesList;
  }

  get notificationList() {
    return _notificationList;
  }

  get notificationCount() {
      return _notificationCount;
  }

  get totalNotificationList() {
      return _totalNotificationList;
  }


  get eventsData() {
    return _eventsData;
  }

  get positionList() {
    return _positionList;
  }

  get recruiterId() {
    return _recruiterId;
  }

  get candidatesId() {
    return _candidatesId;
  }

  get candidatesDescriptionList() {
    return _candidatesDescriptionList;
  }

  get graphData(){
      return _graphData;
  }

  set candidatesDescriptionList(value) {
    _candidatesDescriptionList = value;
  }
  /* End getter and setter here */


  /*
   @name getcandidatesList Function - This is return list of candidateslist through mock.
   */
  getCandidatesList(queryURL){
   let tableData = {                       
    "companyId": this.AuthService.user.companyId,
    "userId": this.AuthService.user.userId
    };
    let config  = this.UtilsService.postCofigObj();
    return _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL +'/evaluator/updated-candidates',tableData, config);
   }

   getNotificationCount() {
      var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      };

    let userId = this.AuthService.user.userId;
    let userType = this.AuthService.user.userType;
    let config  = this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/notifications/get-count/'+userId+'?userTypeToId='+userType,config);
    return _activePromise.then(onSuccess, onError);
   }
   getNotifications() {userType
      var onSuccess = (response) => {
        _activePromise = null;
        //return {"notifications":[{"id":15,"notificationFromId":693,"notificationToId":560,"notificationTypeId":11,"actionId":1,"message":"Evaluator Added.","statusId":1,"seenUnseenStatus":1},{"id":16,"notificationFromId":693,"notificationToId":560,"notificationTypeId":12,"actionId":1,"message":"Client information has been updated.","statusId":1,"seenUnseenStatus":1},{"id":17,"notificationFromId":8,"notificationToId":560,"notificationTypeId":13,"actionId":1,"message":"A Slot has been cancelled.","statusId":1,"seenUnseenStatus":1},{"id":18,"notificationFromId":8,"notificationToId":560,"notificationTypeId":14,"actionId":1,"message":"Profile shared with selected portals.","statusId":1,"seenUnseenStatus":1},{"id":19,"notificationFromId":693,"notificationToId":560,"notificationTypeId":15,"actionId":1,"message":"Evaluator updated.","statusId":1,"seenUnseenStatus":1},{"id":20,"notificationFromId":560,"notificationToId":560,"notificationTypeId":16,"actionId":1,"message":"A Slot has been rescheduled.","statusId":1,"seenUnseenStatus":1},{"id":21,"notificationFromId":560,"notificationToId":560,"notificationTypeId":17,"actionId":1,"message":"Candidate has been deleted successfully.","statusId":1,"seenUnseenStatus":1},{"id":22,"notificationFromId":685,"notificationToId":560,"notificationTypeId":18,"actionId":1,"message":"An Interview has been rescheduled.","statusId":1,"seenUnseenStatus":1},{"id":23,"notificationFromId":8,"notificationToId":560,"notificationTypeId":19,"actionId":1,"message":"Two min Intro has been saved.","statusId":1,"seenUnseenStatus":1},{"id":24,"notificationFromId":560,"notificationToId":560,"notificationTypeId":20,"actionId":1,"message":"Candidate has been restored.","statusId":1,"seenUnseenStatus":1}]};
         return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      };
    let userId = this.AuthService.user.userId || 1;
    let userType = this.AuthService.user.userType;
    let config  = this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/notifications/get-notifications/'+userId+'?userTypeToId='+userType,config);
    return _activePromise.then(onSuccess, onError);
   }

  getAllNotification(query){
    var onSuccess = (response) => {
        _activePromise = null;
        return response.data;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
        return error;
      };

        let userId = this.AuthService.user.userId || 1;
        let userType = this.AuthService.user.userType;
        let config  = this.UtilsService.getCofigObj();
        _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/notifications/get-all-notifications/'+userId+'?userTypeToId='+userType+''+query,config);
      return  _activePromise.then(onSuccess, onError);
  }

  getEventsData(queryURL){
    let userId = this.AuthService.user.userId;
    let config  = this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(this.APP_CONSTANTS.SERVER_URL +'/evaluator/upcoming-events/'+userId+ '' +queryURL,config);
    }

  getPositionList(){
    var onSuccess = (response) => {
        _positionList = response.data;
        _activePromise = null;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
      };

    _activePromise = this.$http.get('/test/position');
    _activePromise.then(onSuccess, onError);
  }

  getcandidatesDescription(){
    var onSuccess = (response) => {

        _candidatesDescriptionList = response.data;
        _activePromise = null;
      },
      onError = (error) => {
        if (error.status === 409) {
          _errorTranslationKey = error.data.errorCode;
        }
        _activePromise = null;
      };

    _activePromise = this.$http.get('/test/candidatesDescription');
    _activePromise.then(onSuccess, onError);
  }
  
  
}


