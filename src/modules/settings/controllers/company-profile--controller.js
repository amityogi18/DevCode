let _this;
let urlRegex = /^(https?:\/\/)?[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-‌​]+$/;
export class CompanyProfileController {
    /** @ngInject  */
    constructor($rootScope, AdminCompanyInfoService, $timeout, $uibModal, AuthService, CandidateProfileService, GrowlerService, $state) {
        console.log('Inside company logo controller constructor');
        _this = this;
        _this.companyProfile = [];
        _this.$uibModal = $uibModal;
        _this.$rootScope = $rootScope;        
        _this.$state = $state;
        _this.AdminCompanyInfoService = AdminCompanyInfoService;
        _this.$timeout = $timeout;
        _this.AuthService = AuthService;
        _this.CandidateProfileService = CandidateProfileService;
        _this.GrowlerService = GrowlerService;
        _this.getCompanyProfile();
        _this.companyProfile.companyUrlForms = [];
        _this.companyUrls = [];
        _this.getCompanyUrl();
        _this.companyProfile.companyAddress = {};
         _this.customUrlList = {};
    }

    getCompanyProfile() {
        let onSuccess = (response) => {
            _this.companyProfile = response.data;         
            if (response.data.companyUrlForms) {
                if (response.data.companyUrlForms.length > 0) {
                    _this.companyUrls = response.data.companyUrlForms;
//                    for (var i = 0; i < response.data.companyUrlForms.length; i++) {
//                        let companyUrlForms = {};
//                        companyUrlForms.url = response.data.companyUrlForms[i].url;
//                        companyUrlForms.urlTypeId = response.data.companyUrlForms[i].urlTypeId;
//                        _this.companyUrls.push(companyUrlForms);
//                    }
                }
            }
        },
                onError = (error) => {
            console.log(error);
        };
        _this.AdminCompanyInfoService.getCompanyProfile();
        _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
    }   

    openCompanyProfileModal() {
        $("#companyInfoModal").modal("show");
        _this.addressData(_this.companyProfile.companyAddress);
//        _this.$rootScope.modalInstance = _this.$uibModal.open({
//            animation: true,
//            ariaLabelledBy: 'modal-title',
//            ariaDescribedBy: 'modal-body',
//            templateUrl: 'settings/partials/admin-company-info-directive.jade',
//            controller: 'CompanyProfileController',
//            controllerAs: 'companyProfileCtrl',
//            windowClass: 'company-profile-modal',
//            size: 'lg',
//            resolve: {
//                companyProfile: function () {
//                    return _this.companyProfile;
//                }
//            }
//        });
//        _this.$timeout(function () {
//            _this.$rootScope.modalInstance.result.then((companyProfile) => {
//                console.log(companyProfile);
//                if (companyProfile) {
//                    this.dummy.dummyProfile = angular.copy(companyProfile);
//                } else {
//                    _this.companyProfile = angular.copy(this.dummy.dummyProfile);
//                }
//            });
//
//        }, 20);
    }

    save() {
        $("#companyInfoModal").modal("hide");
        //_this.$rootScope.modalInstance.close(_this.companyProfile);
    }

    cancel() {
        $("#companyInfoModal").modal("hide");
       _this.getCompanyProfile();
        //_this.$rootScope.modalInstance.close();
    }

    dismiss() {
        $("#companyInfoModal").modal("hide");
        _this.getCompanyProfile();
        //_this.$rootScope.modalInstance.close();
    }

    onClose() {
        console.log("Table reload successfully");
        $("#companyInfoModal").modal("hide");
        _this.$state.go(_this.$state.current, {}, {reload: true});

    }

    checkMandatoryFields() {
        if (_this.companyProfile.firstName && _this.companyProfile.firstName !== ''
                && _this.companyProfile.lastName && _this.companyProfile.lastName !== ''
                && _this.companyProfile.jobTitle && _this.companyProfile.jobTitle !== ''
                && _this.companyProfile.companyContactNo && _this.companyProfile.companyContactNo !== ''
                && _this.companyProfile.companyName && _this.companyProfile.companyName !== ''
                && _this.companyProfile.companySize && _this.companyProfile.companySize !== '' && _this.companyProfile.companySize !== 'Please Select'
                && _this.companyProfile.companyWebsite && _this.companyProfile.companyWebsite !== ''
                && _this.companyProfile.companyAddress && _this.companyProfile.companyAddress !== ''
                ) {
            return true;
        } else {
            _this.companyProfileForm.$setSubmitted();
            return false;
        }
    }

    updateCompanyProfile() {
        _this.companyProfile.companyAddress = _this.companyProfile.companyAddress.name;
        if (_this.checkMandatoryFields()) {
            let onSuccess = (response) => {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: 'Company Profile Updated successfully',
                    delay: 2000
                });
                _this.getCompanyProfile();
                _this.onClose();
                $("body").removeClass("modal-open");
                _this.cancel();
            },
                    onError = (error) => {
                console.log(error);
            },
                    data = {
                        userId: _this.AuthService.user.userId,
                        firstName: _this.companyProfile.firstName,
                        lastName: _this.companyProfile.lastName,
                        jobTitle: _this.companyProfile.jobTitle,
                        companyName: _this.companyProfile.companyName,
                        companySize: _this.companyProfile.companySize,
                        address: _this.companyProfile.companyAddress,
                        companyContactNo: _this.companyProfile.companyContactNo,
                        companyWebsite: _this.companyProfile.companyWebsite,
                        companyUrlForms: _this.companyUrls
                    };
            _this.AdminCompanyInfoService.updateCompanyProfile(data);
            _this.AdminCompanyInfoService.activePromise.then(onSuccess, onError);
        }
    }
    getCompanyUrl() {
        let onSuccess = (response) => {
            _this.customUrlList = response.data;
        },
                onError = (error) => {
            console.log(error);
        };
        _this.CandidateProfileService.getCandidateUrl();
        _this.CandidateProfileService.activePromise.then(onSuccess, onError);

    }

    addCompanyUrl() {
        let companyUrlForms = {};
        if (_this.companyUrlForms
                && _this.companyUrlForms.url
                && _this.companyUrlForms.url.length > 0
                && _this.companyUrlForms.urlType
                && _this.companyUrlForms.urlType.urlTypeId) {
            companyUrlForms.url = _this.companyUrlForms.url;
            companyUrlForms.urlTypeId = _this.companyUrlForms.urlType.urlTypeId;
            if (_this.companyUrls.length < 4) {
                _this.companyUrls.push(companyUrlForms);
                _this.companyUrlForms = {};
            } else {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: 'You Can Add Only 4 Urls.',
                    delay: 2000
                });
            }
            _this.companyUrlForms = {};
        }

    }

    deleteCandidateUrl(index) {
        _this.companyUrls.splice(index, 1);
    }

    isValid() {
        if (_this.companyUrlForms && _this.companyUrlForms.url && _this.companyUrlForms.url.length > 0 && _this.companyUrlForms.urlTypeId) {
            return true;
        } else {
            return false;
        }
    }

    analyzePhoneNumber(companyContactNo) {
        _this.errmsgcon = "";
        if (angular.isDefined(companyContactNo) && companyContactNo.length < 10) {
            _this.errmsgcon = "Enter Valid Contact Number";
            _this.isvalidContactNumber = false;
        } else if (!angular.isDefined(companyContactNo) || companyContactNo === "" || companyContactNo === null) {
            _this.errmsgcon = "Please Enter Contact Number";
        } else {
            _this.errmsgcon = "";
            _this.isvalidContactNumber = true;
        }
    }

    analyzeZipCode(zipCode) {
        _this.errZipmsg = "";
        if (angular.isDefined(zipCode) && zipCode.length < 6) {
            _this.errZipmsg = "Enter Valid Zip Code";
            _this.isvalidZipCode = false;
        } else if (!angular.isDefined(zipCode) || zipCode === "" || zipCode === null) {
            _this.errZipmsg = "Please Enter Zip Code";
        } else {
            _this.errZipmsg = "";
            _this.isvalidZipCode = true;
        }
    }

    analyzeUrl(url) {
        _this.errormessageurl = "";
        if (!angular.isDefined(url) || url === "" || url === null) {
            _this.errormessageurl = "Please Enter Company Url";
        } else if (angular.isDefined(url) && !urlRegex.test(url)) {
            _this.errormessageurl = " Enter Valid Company Url";
        } else {
            _this.errormessageurl = "";
        }
    }

    analyzeWebsiteUrl(companyWebsite) {
        _this.errorMessageWebsiteUrl = "";
        if (!angular.isDefined(companyWebsite) || companyWebsite === "" || companyWebsite === null) {
            _this.errorMessageWebsiteUrl = "Company Website Required";

        } else if (angular.isDefined(companyWebsite) && !urlRegex.test(companyWebsite)) {
            _this.errorMessageWebsiteUrl = " Enter Valid Company Url";
            _this.isvalidUrl = false;
        } else {
            _this.errorMessageWebsiteUrl = "";
            _this.isvalidUrl = true;
        }
    }

    setAddressValue(addressData) {
        _this.addressData = addressData;
    };
    
    clearSuggestions(clearData) {
        _this.clearData = clearData;
    };
}