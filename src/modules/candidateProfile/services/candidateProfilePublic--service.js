let _this,
    _activePromise;

export class candidateProfilePublicService {
	/** @ngInject  */
  constructor($http, $state, AuthService,Upload,APP_CONSTANTS, UtilsService) {
    _this = this;
    _this.$http = $http;
    _this.$state = $state;
    _this.AuthService = AuthService;
    _this.Upload = Upload;
    _this.APP_CONSTANTS = APP_CONSTANTS;
    _this.UtilsService = UtilsService;
  }

  get activePromise(){
    return _activePromise;
  }  

  getCandidateTwoMinIntro(){
     let userId = _this.AuthService.user.userId || 1,
         config  = _this.UtilsService.getCofigObj(),
         url = _this.APP_CONSTANTS.SERVER_URL + '/candidate/twominintro/'+ userId;
    _activePromise = _this.$http.get(url, config);
    
  }


    updateCandidateTwoMinIntro(data, fileId, isVideo) {
        let videoData, userId, config;
        userId = _this.AuthService.user.userId || 1;
        config  = _this.UtilsService.postCofigObj();
        if(isVideo){
            videoData = { 
                            candidateId: userId,
                            videoPath: data,
                            backgroundMusicId : fileId
                        }
        }else {
            videoData = { 
                            candidateId: userId,
                            videoPathLink: data,
                            backgroundMusicId : fileId
                        }
        }
        return _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/candidate/savetwominintro',
            data: videoData,
            headers: config.headers
        });
       
    }

  shareProfile(type, data){
     let config  = _this.UtilsService.postCofigObj();
     data.candidateId = _this.AuthService.user.userId || 1;
    if(type === "public" || type === "off"){     
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/update-profile-share-link', data, config);
    }else{
      _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/update-profile-share-link', data, config);
    }
  } 
  
 viewSharedProfile(token, emailId){
   let url = emailId === "" ? token : token + "?&emailId="+emailId;
   //config  = _this.UtilsService.getCofigObj();
   let api = _this.APP_CONSTANTS.SERVER_URL + '/candidate/view-shared-profile/' + url;
   console.log(api);
   _activePromise = _this.$http.get(api);   
 }
 
 viewPrivateProfile(data){
   let config  = _this.UtilsService.postCofigObj();
   _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/candidate/view-private-profile', data, config);
 }

 addBackgroundMusic(data, isAudio){
        let audioData, userId, config;
        userId = _this.AuthService.user.userId || 1;
        config  = _this.UtilsService.postCofigObj();
          if(isAudio){
              audioData = { 
                              candidateId: userId,
                              filePath: data,
                          }
            }
          return _this.Upload.upload({
              url: _this.APP_CONSTANTS.SERVER_URL +'/candidate/savebackgroundmusic',
              data: audioData,
              headers: config.headers
          });
       }
 
  getAllBackgroundMusic(){
    let userId = _this.AuthService.user.userId || 1,
        config  = _this.UtilsService.getCofigObj(),
        url = _this.APP_CONSTANTS.SERVER_URL + '/candidate/getallbackgroundmusics/'+ userId;
    _activePromise = _this.$http.get(url, config);
  }

  getCandidatePoints(){
     let config  = _this.UtilsService.getCofigObj();
    _activePromise = this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/candidate/points', config);
  }
}

