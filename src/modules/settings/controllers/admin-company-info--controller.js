let _this;
let modalInstance;

export class AdminCompanyInfoController {
	/** @ngInject  */
    constructor(AdminCompanyInfoService, mediaRecorderService, $timeout, $sce, $scope, AuthService, GrowlerService) {
        _this = this;
        _this.$sce = $sce;
        _this.$timeout = $timeout;
        _this.$scope = $scope;
        _this.AdminCompanyInfoService = AdminCompanyInfoService;
        _this.AuthService = AuthService;
        _this.GrowlerService = GrowlerService;
        _this.imageUrl = './img/Tulips.jpg';
        _this.landingPageUrl = './img/Tulips.jpg';
        _this.images = [
            {
                'name': 'Image1',
                'url': './img/Tulips.jpg'
            },
            {
                'name': 'Image2',
                'url': './img/logo.png'
            }
        ];
        _this.selectedImage = _this.images[0];
    }

    preview() {
        console.log(_this.selectedImage);
        _this.landingPageUrl = _this.selectedImage.url;
    }

    addImage() {
        _this.images.push({'name': _this.addImageFile.name, 'url': _this.addImageUrl});
        _this.$scope.$apply();
    }

    removeImage() {
        let index = _this.images.indexOf(_this.selectedImage);
        _this.images.splice(index, 1);
        if(_this.images.length) {
            _this.selectedImage = _this.images[0];
            _this.preview();
        }
    }

}
