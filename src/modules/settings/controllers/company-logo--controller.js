var _this;
export class CompanyLogoController {
	/** @ngInject  */
  constructor($rootScope, $window, $timeout, AdminCompanyInfoService, AuthService, GrowlerService, $storage) {
    console.log('Inside company logo controller constructor');
    _this = this;
    _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.AdminCompanyInfoService = AdminCompanyInfoService;
    _this.AuthService = AuthService;
    _this.GrowlerService = GrowlerService;
    _this.$storage = $storage;
    _this.getCompanyLogo();
  }
  
    getCompanyLogo(){
        let onSuccess = (response) => {
                _this.companyLogoPath = response.data.logo;
                _this.$rootScope.companyLogoPath = _this.companyLogoPath;
                _this.$storage.setItem('companyLogoPath', _this.companyLogoPath);
            },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminCompanyInfoService.getCompanyLogo();
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
    }
    
    isFileAdded(file){
        //this.fileSelected = file.length > 0 ? false : true;
        if(file.length > 0){
          this.fileNotSelected = true;
        }
        else{
          this.fileNotSelected = false;
        }
     }
     
    addCompanyLogo(){
        if(angular.isDefined(_this.importCompanyFile)){
        let data = {
               companyId : _this.AuthService.user.companyId || 1,
               companyLogo :  _this.importCompanyFile
            }; 
        
        let onSuccess = (response) => {
                _this.companyLogoPath = response.data.logo;
                _this.$rootScope.companyLogoPath = _this.companyLogoPath;
                _this.$storage.setItem('companyLogoPath', _this.companyLogoPath);
                _this.thumbnailPath = response.data.thumbnailUrl;
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Company Logo Uploaded Successfully",
                    delay: 2000
                });
              },
            onError = (error) => {
                   console.log(error);
            };
           _this.AdminCompanyInfoService.addCompanyLogo(data);
           _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
         }
         else{
           _this.GrowlerService.growl({
                    type: 'warning',
                    message: "Please select image to upload",
                    delay: 2000
                });
         }

    }
  
    uploadCompnayLogo(file) {
        _this.importCompanyFile = file[0];  
        _this.UtilsService.checkFileSize(file[0], '50KB');
    }
}