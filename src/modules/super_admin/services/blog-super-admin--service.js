let _activePromise,
    _this;

export class BlogService {
    /** @ngInject  */

    constructor($http, $rootScope, APP_CONSTANTS, UtilsService, Upload) {
        _this = this;
        _this.$http = $http;
        _this.APP_CONSTANTS = APP_CONSTANTS;
        _this.UtilsService = UtilsService;
        _this.$rootScope = $rootScope;
        _this.Upload = Upload;

    }

    get activePromise() { 
        return _activePromise; 
    }

    getBlogDetails(query){
        let config  = _this.UtilsService.getCofigObj();
        _activePromise = _this.$http.get(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/get-blogs-list' +query, config);
    }

    addBlog(blogData) {
          return _this.Upload.upload({
                      url: _this.APP_CONSTANTS.SERVER_URL + '/superadmin/add-blog',
                      data: blogData,
                      headers: {
                                    "Authorization": "Bearer " + _this.$rootScope.user.accessToken,
                                    "Accept": "application/json",
                                    "userType": _this.$rootScope.user.userType
                                }
                });
    }

    updateBlog(blogDdata, blogId){
        return _this.Upload.upload({
                      url: _this.APP_CONSTANTS.SERVER_URL + '/superadmin/edit-blog/'+blogId,
                      data: blogDdata,
                      headers: {
                                    "Authorization": "Bearer " + _this.$rootScope.user.accessToken,
                                    "Accept": "application/json"
                                }
                });
        // let config  = _this.UtilsService.postCofigObj();
        // _activePromise = _this.$http.post(_this.APP_CONSTANTS.SERVER_URL + '/superadmin/edit-blog/'+blogId, data, config);
        
    }
    

}