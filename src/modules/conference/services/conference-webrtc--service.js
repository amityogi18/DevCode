let _this,_activePromise;

export class ConferenceWebrtcService {
	/** @ngInject  */
    constructor($http, $state, APP_CONSTANTS, UtilsService) {
        _this =  this;
        _this.$http = $http;
        _this.$state = $state;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;

  }


  get activePromise(){
      return _activePromise;
  }

   saveConference(data) {
   	console.log('data getting', data);
   	console.log(data);
   	let config  = _this.UtilsService.getCofigObj();
   	return _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/conference/meeting/complete/save', data, config);
   }

   saveInterview(data) {
    let config  = _this.UtilsService.getCofigObj();
    return _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/conference/interview/complete/save', data, config);
   }

   sendMailToParticipant(data) {
      let config  = _this.UtilsService.getCofigObj();
      return _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/conference/meeting/addparticipants', data, config);
   }

   sendMailToParticipantI(data) {
      let config  = _this.UtilsService.getCofigObj();
      return _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/conference/add/participant', data, config);
   }

   getRecommendedQuestions(recommendedQuestionData){
    	let config = _this.UtilsService.postCofigObj();
    	return _activePromise = this.$http.post(this.APP_CONSTANTS.SERVER_URL + '/position/getinterviewquestions', recommendedQuestionData, config);
   }
}

