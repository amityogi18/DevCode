let _this,
    _activePromise,
    _generalSettings;

export class GeneralSettingsService {
	/** @ngInject  */
    constructor($q, $http, Upload, AuthService, APP_CONSTANTS, UtilsService) {
        _this =  this;
        _this.$q = $q;
        _this.Upload = Upload;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;

    }

    get activePromise() {
      return _activePromise;
    }

    get generalSettings(){
      return _generalSettings;
    }

  uploadUserProfilePic(data) {
      data.userId = _this.AuthService.user.userId || 1;
      let config  = _this.UtilsService.postCofigObj();
      _activePromise = _this.Upload.upload({
        url: _this.APP_CONSTANTS.SERVER_URL +'/setting/user/profilepicture',
        data: data,
        headers: config.headers
      });
  }

  uploadCandidateProfilePic(data) {
          let config  = _this.UtilsService.postCofigObj();
          data.candidateId = _this.AuthService.user.userId || 2;
          _activePromise = _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/candidate/profilepicture/upload',
            data: data,
            headers: config.headers
          });
  }

  removeUserProfilePic(){
    let userId = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.deleteConfigObj();
    _activePromise = this.$http.delete(_this.APP_CONSTANTS.SERVER_URL +'/setting/user/profilepicture/'+userId, config );
  }

  removeCandidateProfilePic(){
    let userId = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.deleteConfigObj();
    _activePromise = this.$http.delete(_this.APP_CONSTANTS.SERVER_URL +'/candidate/profilepicture/'+userId, config );
  }
  
  updateUserProfile(data){
     let config  = _this.UtilsService.putCofigObj();
     data.userId = _this.AuthService.user.userId;
    _activePromise = this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/settings/user/information', data, config);
  }

  updateCandidateProfile(data){
       let config  = _this.UtilsService.putCofigObj();
       data.candidateId = _this.AuthService.user.userId;
      _activePromise = this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/settings/candidate/information', data, config);
  }

  getUserProfile(){
    let userId = _this.AuthService.user.userId || 1,
    config  = _this.UtilsService.getCofigObj();
    return  _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/settings/user/information/'+userId, config );
  }

  getUserProfilePic(){
      let userId = _this.AuthService.user.userId || 1,
      config  = _this.UtilsService.getCofigObj();
      return  _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/setting/user/profilepicture/'+userId, config );
  }

  getCandidateProfile(){
    let userId = _this.AuthService.user.userId || 2,
    config  = _this.UtilsService.getCofigObj();
    return _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/settings/candidate/information/'+userId, config );
  }

  getCandidateProfilePic(){
      let userId = _this.AuthService.user.userId || 2,
      config  = _this.UtilsService.getCofigObj();
      return  _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/'+userId+'/profilepic', config );
  }

  changePassword(data){
      data.userType = _this.AuthService.user.userType;
      let config  = _this.UtilsService.putCofigObj();
      _activePromise = this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/password/change', data, config);
  }

  getApplicationType(appId){
    let config = _this.UtilsService.getCofigObj(),
    companyId = _this.AuthService.user.companyId || 1,
    candidateId = _this.AuthService.user.userId,
    userType = _this.AuthService.user.userType,
    candidateapptypeId = appId; 
    return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL+'/company/analytics/candidateapptype/'+companyId+'/'+candidateId+'/'+candidateapptypeId+'/'+userType, config);
   
  }
}


