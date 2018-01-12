let _this,
    _activePromise;

export class coverLetterService {
	/** @ngInject  */
  constructor($http, $state, AuthService,APP_CONSTANTS,UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.$state = $state;
    _this.AuthService = AuthService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }

  get activePromise(){
    return _activePromise;
  }

  getProfileList(){       
    let id = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/candidateprofile/'+id, config);
   
  }
  
  getCoverLetter(profileId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/profile/'+profileId+'/coverletter', config);
   
  }
  
  updateCoverLetter(data,profileId,coverletterTitle){
      let userId = _this.AuthService.user.userId || 1,
      config  = _this.UtilsService.postCofigObj(),
      coverLetter= {
            "candidateId":userId,
            "candidateProfileId":profileId,
            "content":data,
            "coverletterTitle" : coverletterTitle
        };
    
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/coverletter',coverLetter, config);
  }

  addCoverLetter(data){
    data.candidateId = _this.AuthService.user.userId || 1;
    let config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/coverletter',data, config);

  }

  getAllCoverLetter(){
    let config  = _this.UtilsService.getCofigObj();
    let candidateId = _this.AuthService.user.userId || 1;
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/candidate/'+candidateId+'/coverletter', config);
  }
  
}
