let _this,
    _activePromise;

export class CandidateProfileService {
	/** @ngInject  */
  constructor($http, $state, AuthService, Upload, APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.$state = $state;
     _this.Upload = Upload;
    _this.AuthService = AuthService;
    _this.UtilsService = UtilsService;
    _this.APP_CONSTANTS = APP_CONSTANTS;
  }

  get activePromise(){
    return _activePromise;
  }

   getCandidateUrl(){
     let config  = _this.UtilsService.getCofigObj();
      _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/url-types', config);
    }

  getSkillSet(departmentId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/skillsets/'+ departmentId, config);
   }

  getCandidateProfileAll(){
    let id = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/candidateprofile/'+id, config);
  }

  getCandidateProfileData(activeId) {
     let id = _this.AuthService.user.userId || 1,
     config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/' + id + '/profile/' + activeId, config);
  }

  setActiveProfile(id,status){
    let data= { "candidateProfileId":id, "statusId":status };
    let config  = _this.UtilsService.putCofigObj();
    _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/candidates/status',data, config);
  }

  createProfile(candidateData){
     let candidateId = _this.AuthService.user.userId || 1,
     config  = _this.UtilsService.postCofigObj();
    _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/candidate/profile/'+candidateId, candidateData, config);
  }

  updateProfile(candidateData, profileId){
    let candidateId = _this.AuthService.user.userId || 1;
    let config  = _this.UtilsService.putCofigObj();
    _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/candidate/'+candidateId+'/profile/'+ profileId, candidateData, config);
  }

  addToMyProfile(shareData){
    shareData.candidateId = _this.AuthService.user.userId || 1;
    let config  = _this.UtilsService.postCofigObj();
    _activePromise = this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/candidate/update-share-link-privilege', shareData, config);
  }

  getShareLink(){
     let candidateId = _this.AuthService.user.userId || 1,
     config  = _this.UtilsService.getCofigObj();
     _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/view-share-link-privilege/'+ candidateId, config);
  }
  
  getLanguage(){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/criteriavalues/3', config);
  }

  getQualification(){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/profile/qualification', config);
    
  }
 
  getSpecializationData(qualificationId){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/profile/qualification/'+qualificationId+'/specialization', config);
  }

  uploadResume(file, profileId) {
        var onSuccess = (response) => {
            console.log(response.data);
            },
            onError = (error) => {
                _errorTranslationKey = error.data.errorCode;
                _activePromise = null;
            };
        // code to upload file
         let candidateId = _this.AuthService.user.userId || 1;
         let config  = _this.UtilsService.postCofigObj();
        return _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/candidate/uploadResume/'+candidateId+'/profile/'+ profileId,
            data: {resume: file},
            headers: config.headers
        });
       // _activePromise.then(onSuccess, onError);
    }
    
  viewCandidateProfile(profileId) {
     let candidateId = _this.AuthService.user.userId || 1;
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/'+candidateId+'/profile/'+ profileId+'/view', config);
  }

  getActiveProfileAndSkill(){
     let candidateId = _this.AuthService.user.userId || 1;
     let config  = _this.UtilsService.getCofigObj();
     _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/activeprofile/skillset/'+candidateId, config);
  }

  getProfileCompletenessStatus(){
    let config  = _this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/profile-completeness-ratio', config);
  }

  getCandidateSkillsSuggestion() {
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/skillsets/sentences/suggestions', config)
  }

  initialResumeUpload(file){
    var onSuccess = (response) => {
            console.log(response.data);
            },
            onError = (error) => {
                _errorTranslationKey = error.data.errorCode;
                _activePromise = null;
            };
        // code to upload file
         let candidateId = _this.AuthService.user.userId || 1;
         let config  = _this.UtilsService.postCofigObj();
        return _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/candidate/parseResume/'+candidateId,
            data: {
                   resume: file,
                   parseResume: true, 
                  },
            headers: config.headers
        });
  }

  skillSuggestions(profileId) {
    let config = _this.UtilsService.getCofigObj();
    _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/skillsets/sentences/suggestions/' + profileId, config);    
  }
}
