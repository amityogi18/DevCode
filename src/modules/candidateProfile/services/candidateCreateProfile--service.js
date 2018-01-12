let _this,
	_activePromise;

export class candidateCreateProfileService {
		/** @ngInject  */
	constructor($http, AuthService,APP_CONSTANTS,UtilsService) {
		_this = this;
		_this.$http = $http;
		_this.AuthService = AuthService;
		_this.APP_CONSTANTS = APP_CONSTANTS;
		_this.UtilsService = UtilsService;
	}

	get activePromise() {
		return _activePromise;
	}

	getcandidateinfo(data) {
		console.log(data);
	    let userId = _this.AuthService.user.userId || 1,
		config  = _this.UtilsService.postCofigObj();
		_activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/profile/' + userId, data, config);
		
	}
}	
