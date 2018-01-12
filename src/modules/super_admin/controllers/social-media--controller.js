let _this;
export class SocialMediaController {
	/** @ngInject  */
  constructor(NgTableParams, SocialMediaService, $timeout, GrowlerService, $state, dataTableService) {
    
    _this = this;
    _this.SocialMediaService = SocialMediaService;
    _this.$timeout = $timeout;
    _this.GrowlerService = GrowlerService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.$state = $state;
    _this.selectedSocialId = [];
    _this.socialTableFilter ={};
    
    _this.socialTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.socialTableFilter
        }, 
             {
                counts: [5, 10, 20],
                getData: function(params) {
                    let filter = params.filter(),
                        sorting = params.sorting(),
                        count = params.count(),
                        page = params.page(),
                        filterFields = [],
                        sortFields = [],
                        queryString = '',
                        queryURL = '?';
                    angular.forEach(sorting, (value, key) => {
                        sortFields.push(`${key}&order=${value}`);
                    });
                    angular.forEach(filter, (value, key) => {
                        filterFields.push(`${key}=${value}`);
                    });
                    if (sortFields.length) {
                        queryString += `orderBy=${sortFields.join('&')}&`;
                    }
                    if (filterFields.length) {
                        queryString += filterFields.join('&');
                    }
                    queryURL += `${queryString}&limit=${count}&page=${page}`;
                    let onSuccess = (response) => {

                            _this.socialMediaList = response.data;
                            if (_this.socialMediaList &&
                                _this.socialMediaList.length > 0) {                              
                                params.total(_this.socialMediaList);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.socialTableParams);  
                            }
                            return (_this.socialMediaList);
                            }
                            
                        },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.SocialMediaService.getSocialPortal(queryURL);
                   return  _this.SocialMediaService.activePromise.then(onSuccess, onError);
                }
            });
        }
        
         addSocialId(element, socialId){
            if(element.currentTarget.checked){
                _this.selectedSocialId.push(socialId);
            }else{
                if(_this.selectedSocialId.length > 0){
                 for(var i =0; _this.selectedSocialId.length > i; i++){
                     if(_this.selectedSocialId[i] == socialId){
                        _this.selectedSocialId.splice(i, 1);
                     }                  
                 }   
                }            
            }            
    }  
    
    
    updateSocialMedia(){
        let onSuccess = (response) => {
             _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Social Portal Updated Successfully',
                  delay: 2000
              });
             _this.onClose();
            },  
            onError = (error) => {
                console.log(error);
            },
            data = {
                statusId : 1,
                id  : _this.selectedSocialId
            };
        _this.SocialMediaService.updateSocialMedia(data);
        _this.SocialMediaService.activePromise.then(onSuccess, onError);
    }
    
    markInActiveSocialMedia(){
        let onSuccess = (response) => {
             _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Social Portal Updated Successfully',
                  delay: 2000
              });
              _this.onClose();
            },  
            onError = (error) => {
                console.log(error);
            },
            data = {
                statusId : 2,
                id  : _this.selectedSocialId
            };
        _this.SocialMediaService.markInActiveSocialMedia(data);
        _this.SocialMediaService.activePromise.then(onSuccess, onError);
    }

    onClose(){
        _this.$state.go(_this.$state.current, {}, {reload: true});
    }

}