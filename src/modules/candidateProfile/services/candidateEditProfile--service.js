let _this,
_activePromise;

export class candidateEditProfileService {
	/** @ngInject  */
    constructor($http, AuthService, APP_CONSTANTS, UtilsService) {
        _this = this;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
		_this.UtilsService = UtilsService;
    }

	get activePromise() {
		return _activePromise;
	}

	updatecandidateinfo(data) { 
		let userId = _this.AuthService.user.userId || 1,
		 config  = _this.UtilsService.postCofigObj();
		_activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/' + userId + '/profile/' + {CandiadteProfileId}, data, config);	
	}

	getcandidateprofileall() {
		let userId = _this.AuthService.user.userId || 1,
		config  = _this.UtilsService.getCofigObj();
		_activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/candidateprofile/' + userId, config);

	}
	uploadresume() {
		let config  = _this.UtilsService.getCofigObj();
		_activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/candidateprofile/' + userId, config);
	}
}	
