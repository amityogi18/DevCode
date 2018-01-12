let _this,
    _activePromise;
export class AdminCompanyInfoService {
	/** @ngInject  */
    constructor($q, $http, AuthService, APP_CONSTANTS, Upload, UtilsService) {
        _this=  this;
        _this.$q = $q;
        _this.$http = $http;
        _this.AuthService = AuthService;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.Upload = Upload;
        _this.profile = {};
        _this.UtilsService = UtilsService;
    }

    get activePromise() {
        return _activePromise;
    }

    getCompanyProfile(cId) {
        let companyId = cId || _this.AuthService.user.companyId,
        config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/company/profile/'+ companyId, config);

    }

    getCompanyLogo() {
        let companyId = _this.AuthService.user.companyId,
        config  = _this.UtilsService.getCofigObj();
        return _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/logo/'+ companyId, config);

    }

    setProfile(profile) {
        _this.profile = profile;
    }
    
    addCompanyLogo(data) {
            let config  = _this.UtilsService.postCofigObj();
            _activePromise = _this.Upload.upload({
                url: _this.APP_CONSTANTS.SERVER_URL+'/logo/upload',
                data: data,
                headers: config.headers
            });
        }
        
    getAllTimeZone() {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/time-zones', config);

    }
    
    getAllLandingImage() {
        let companyId = _this.AuthService.user.companyId,
        config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/setting/listlandingimages/'+ companyId, config);

    }
    
    addLandingImage(data) {
             let config  = _this.UtilsService.postCofigObj();
            _activePromise = _this.Upload.upload({
                url: _this.APP_CONSTANTS.SERVER_URL+'/setting/uploadcompanylandingimage',
                data: data,
                headers: config.headers
            });
        }
        
    deleteLandingImage(fileId) {
        let companyId = _this.AuthService.user.companyId,
        config  = _this.UtilsService.deleteConfigObj();
        _activePromise = _this.$http.delete(_this.APP_CONSTANTS.SERVER_URL +'/setting/landingimage/'+ companyId + '/' +fileId, config);

    }
    
    updateCompanyProfile(data) {
        let companyId = _this.AuthService.user.companyId,
        config  = _this.UtilsService.putCofigObj();
        _activePromise = _this.$http.put(_this.APP_CONSTANTS.SERVER_URL +'/company/profile/'+ companyId , data, config);
    }


    saveWelcomeVideos(data, isVideo) {
        let videoData, companyId, config;
        companyId = _this.AuthService.user.companyId || 1,
        config  = _this.UtilsService.postCofigObj();
        if(isVideo){
            videoData = { 
                            companyId: companyId,
                            companyVideoPath: data,
                           
                        }
        }else {
            videoData = { 
                            companyId: companyId,
                            companyVideoPathLink: data,
                            
                        }
        }
       return _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/company/welcomevideos',
            data: videoData,
            headers: config.headers
        });
    }

    saveExitVideos(data, isVideo){
         let videoData, companyId, config;
        companyId = _this.AuthService.user.companyId || 1,
        config  = _this.UtilsService.postCofigObj();
        if(isVideo){
            videoData = { 
                            companyId: companyId,
                            companyVideoPath: data,
                           
                        }
        }else {
            videoData = { 
                            companyId: companyId,
                            companyVideoPathLink: data,
                            
                        }
        }
      return _this.Upload.upload({
            url: _this.APP_CONSTANTS.SERVER_URL +'/company/exitvideos',
            data: videoData,
            headers: config.headers
        });
    }

    getActiveLandingImage(landingImageId) {
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/setting/activelandingimage/' +landingImageId, config);


    }

    getSaveVideos(){
       let companyId = _this.AuthService.user.companyId || 1,
       config  = _this.UtilsService.getCofigObj(),
       url = _this.APP_CONSTANTS.SERVER_URL + '/company/welcomevideos/'+ companyId;
       _activePromise = _this.$http.get(url, config);
    }

    getExitVideos(){
        let companyId = _this.AuthService.user.companyId || 1,
        config  = _this.UtilsService.getCofigObj(),
        url = _this.APP_CONSTANTS.SERVER_URL + '/company/exitvideos/'+ companyId;
       _activePromise = _this.$http.get(url, config);
    }
    
     getSocialPortals() {
        let companyId = _this.AuthService.user.companyId || 1,
        //userType = this.AuthService.user.userType;
        config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL +'/settings/getcompanysocialmedia/'+ companyId, config);
    }
    
    savePortal(data) {
        let config  = _this.UtilsService.postCofigObj();
        data.companyId = _this.AuthService.user.companyId;        
        _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL +'/settings/savesocialmedia', data, config);

    }
}

