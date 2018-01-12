var _this;
export class LandingImageController {
    /** @ngInject  */
    constructor(AdminCompanyInfoService, $timeout, AuthService, LoaderService, UtilsService) {
        console.log('Inside landing image controller constructor');
        _this = this;
        _this.AdminCompanyInfoService = AdminCompanyInfoService;
        _this.$timeout = $timeout;
        _this.AuthService = AuthService;
        _this.LoaderService = LoaderService;
        _this.UtilsService = UtilsService;
        _this.noLandingImage = false;
        _this.landingImageList = [];
        _this.getAllLandingImage();

    }

    getAllLandingImage() {
        let onSuccess = (response) => {
            console.log(response.data);
            if (response.data.successMessage === 'no_record_found') {
                _this.noLandingImage = true;
            } else {
                _this.noLandingImage = false;
                _this.landingImageList = _this.addImageName(response.data);
                for (var i = 0; i < _this.landingImageList.length; i++) {
                    if (_this.landingImageList[i].statusId === 1) {
                        _this.landingPageUrl = _this.landingImageList[i].thumbnailUrl;
                    }
                }
            }
        },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminCompanyInfoService.getAllLandingImage();
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
    }

    isFileAdded(file) {
        //this.fileSelected = file.length > 0 ? false : true;
        if (file.length > 0) {
            this.fileNotSelected = true;
        }
        else {
            this.fileNotSelected = false;
        }
    }

    addLandingImage() {
        _this.LoaderService.show();
        let data = {
            companyId: _this.AuthService.user.companyId || 1,
            imageFilePath: _this.landingImageFile
        };

        let onSuccess = (response) => {
            _this.landingImageFile = "";
            _this.landingPageUrl = response.data.landingImage;
            _this.thumbnailUri = response.data.thumbnailUri;
            _this.getAllLandingImage();
            _this.UtilsService.notify('Landing Image Uploaded Successfully');
            _this.$timeout(function () {
                //_this.LoaderService.hide();
            }, 2000);
        },
            onError = (error) => {
                _this.LoaderService.hide();
                console.log(error);
            };
        _this.AdminCompanyInfoService.addLandingImage(data);
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);

    }

    uploadLandingImage(file) {
        _this.landingImageFile = file[0];
        _this.UtilsService.checkFileSize(file[0], '512KB');
    }

    addImageName(inputArray) {
        let returnArray = [];
        for (var i = 0; inputArray.length > i; i++) {
            let imageData = inputArray[i];
            imageData.imagePath = "Image_" + (i + 1);
            returnArray.push(imageData);
        }
        return returnArray;
    }

    deleteLandingImage(image) {
        if (image.statusId === 1) {
            _this.UtilsService.notify('Can Not Delete An Active Profile Image', 'd');
        }
        else {
            let onSuccess = (response) => {
                _this.getAllLandingImage();
                _this.UtilsService.notify('Landing Image Removed Successfully');
            },
                onError = (error) => {
                    console.log(error);
                };
            _this.AdminCompanyInfoService.deleteLandingImage(image.landingImageId);
            _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
        }
    }

    getActiveLandingImage(landingImageId) {
        let onSuccess = (response) => {
            _this.getAllLandingImage();
            _this.landingPageUrl = response.data.landingImageURI;
            _this.thumbnailUri = response.data.landingImageThumbnailUri;
            _this.UtilsService.notify('Landing Image Activated Successfully');
        },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminCompanyInfoService.getActiveLandingImage(landingImageId);
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
    }

}

