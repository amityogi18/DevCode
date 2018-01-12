let _this,
    urlRegex = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
export class AdminSocialMediaController {
	/** @ngInject  */
  constructor(AdminCompanyInfoService, $timeout, GrowlerService) {
    console.log('Inside social media controller constructor');
    _this = this;
    _this.AdminCompanyInfoService = AdminCompanyInfoService;
    _this.GrowlerService = GrowlerService;
    _this.$timeout = $timeout;
    _this.correctUrl = false;
    _this.portalList =[];
    _this.selectedPortals = [];
    _this.getSocialPortals();
    _this.selectedCheckboxes = [];
    _this.hideSaveBtn = true;
    _this.socialMediaPortalUrls = [];
    _this.socialMediaPortalChecked = [];
    
  }
  
  
   addPortalId(e, portalData){
        _this.userBoxes = [];
        _this.selectedPortals = {};
        _this.selectedPortals.socialPortalId = portalData.socialPortalId;
        _this.selectedPortals.shareUrl = portalData.shareUrl;
        _this.selectedPortals.status = e ? false : true;
        _this.isFound = false;
        _this.hideSaveBtn = false;
        for(var i =0; i < _this.selectedCheckboxes.length; i++){
            if(_this.selectedCheckboxes[i].socialPortalId === _this.selectedPortals.socialPortalId){
                _this.selectedCheckboxes[i].status = _this.selectedPortals.status;
                _this.selectedCheckboxes[i].shareUrl = _this.selectedPortals.shareUrl;
                _this.isFound = true;
            }
        }
        if(!_this.isFound){
            _this.selectedCheckboxes.push(_this.selectedPortals);
        }
    }
    
  getSocialPortals(){
        let onSuccess = (response) => {
                _this.portalList = response.data;
                if(_this.portalList.length > 0){
                    for(var i=0;i<_this.portalList.length;i++){
                        if(_this.portalList[i].status === 1){
                            _this.portalList[i].status = true;
                        }else{
                            _this.portalList[i].status = false;  
                        }
                    }
                }
            },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminCompanyInfoService.getSocialPortals();
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
    }
    
    analyzeUrl(companyWebsite){
        _this.hideSaveBtn = false;
        
        if(!angular.isDefined(companyWebsite.shareUrl) || companyWebsite.shareUrl === "" || companyWebsite.shareUrl === null){
            companyWebsite.status = false;
            //_this.hideSaveBtn = true;
            _this.GrowlerService.growl({
                type: 'warning',
                message: "Please add Company Url",
                delay: 2000
            });
        }
        else if(angular.isDefined(companyWebsite.shareUrl) && !urlRegex.test(companyWebsite.shareUrl)){
            companyWebsite.status = false;
            //_this.hideSaveBtn = true;
            _this.GrowlerService.growl({
                type: 'warning',
                message: "Please add Valid Company Url",
                delay: 2000
            });
        }
    }
    
  savePortal(){ 
            if(_this.selectedCheckboxes.length > 0){
                  for(var i=0; i < _this.selectedCheckboxes.length; i++){
                      if(_this.selectedCheckboxes[i].status === true){
                          _this.selectedCheckboxes[i].status = 1;
                      }else{
                          _this.selectedCheckboxes[i].status = 2;
                      }
                      if(angular.isDefined(_this.selectedCheckboxes[i].shareUrl) && urlRegex.test(_this.selectedCheckboxes[i].shareUrl)){
                          _this.correctUrl = true;
                      }else{
                           _this.correctUrl = false;
                      }
                  }
            }
            var data = {
                portals : _this.selectedCheckboxes
            };
            if(_this.selectedCheckboxes.length > 0 && _this.correctUrl){ 
                let onSuccess = (response) => {
                    _this.hideSaveBtn = true;
                        _this.GrowlerService.growl({
                            type: 'success',
                            message: "Portal Activated Successfully",
                            delay: 2000
                        });
                      },
                    onError = (error) => {
                           console.log(error);
                    };
                _this.AdminCompanyInfoService.savePortal(data);
                _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
            }else{  
                _this.GrowlerService.growl({
                    type: 'warning',
                    message: "Please Add The Correct URL Portal",
                    delay: 2000
                });
            }

    } 

}
