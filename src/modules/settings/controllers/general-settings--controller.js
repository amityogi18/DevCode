let _this;
export class GeneralSettingsController {
  /** @ngInject  */
  constructor($timeout, $rootScope, $window, GeneralSettingsService, AuthService, UtilsService, locationService, $storage, $element) {
    _this = this;
    _this.$timeout = $timeout;
    _this.$rootScope = $rootScope;
    _this.$window = $window;
    _this.GeneralSettingsService = GeneralSettingsService;
    _this.AuthService = AuthService;
    _this.UtilsService = UtilsService;
    _this.locationService = locationService;
    _this.$storage = $storage;
    _this.profilePic = '';
    _this.isProfilePicFileAdded = false;
    _this.isPasswordRight = false;
    _this.isFieldBlank = false;
    _this.isNewPasswordRight = false;
    _this.countryList = [];
    _this.stateList = [];
    _this.cityList = [];
    _this.getCountryList();
    _this.searchCountry;
    _this.searchState;
    _this.searchCity;
    _this.$element = $element;
    _this.geoAddress = {};
    _this.fileSelected = false;
    _this.isSizeExceeded = false;

    _this.$element.find('input').on('keydown', function (ev) {
      ev.stopPropagation();
    });


    if (_this.AuthService.user.userType === 2) {
      _this.getCandidateProfile();
      _this.getCandidateProfilePic();
    } else {
      _this.getUserProfile();
      _this.getUserProfilePic();
    }
    _this.clearPasswords();
    _this.message = { text: '', error: false };
    console.log('Inside GeneralSettings Controller');
  }

  clearSearchTerm() {
    _this.searchCountry = '';
  }
  clearSearchStateInput() {
    _this.searchState = '';
  }
  clearSearchCityInput() {
    _this.searchCity = '';
  }

  getCountryList() {
    let onSuccess = (response) => {
      _this.countryList = response.data;
    },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getCountryList();
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getStateList(countryId, isCountryChange) {
    if (isCountryChange) {
      _this.stateList = [];
      _this.settingData.stateId = "";
      _this.cityList = [];
      _this.settingData.cityId = "";
    };
    let onSuccess = (response) => {
      _this.stateList = response.data;
      if (isCountryChange) {
        _this.isStateDisabled = false;
        _this.isCityDisabled = true;
      }
    },
      onError = (error) => {
        console.log(error);
      };

    _this.locationService.getStateList(countryId);
    _this.locationService.activePromise.then(onSuccess, onError);

    _this.settingForm.$setPristine();
    _this.settingForm.$setUntouched();
  }

  getCityList(stateId, isStateChange) {
    if (isStateChange) {
      _this.cityList = [];
      _this.settingData.cityId = "";
    }
    let onSuccess = (response) => {
      _this.cityList = response.data;
      _this.isCityDisabled = false;
    },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getCityList(stateId);
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  checkMandatoryFields() {
    if (_this.settingData.firstName && _this.settingData.firstName !== ''
      && _this.settingData.lastName && _this.settingData.lastName !== ''
      && _this.geoAddress.name && _this.geoAddress.name !== ''
      && _this.geoAddress && _this.geoAddress !== ''
      && _this.settingData.contactNumber && _this.settingData.contactNumber !== ''
    ) {
      return true;
    }
    else {
      _this.settingForm.$setSubmitted();
      return false;
    }
  }


  updateProfile() {
    if (!angular.isDefined(_this.settingData.contactNumber) || _this.settingData.contactNumber.length == '') {
      _this.errmsgcon = "Please Enter Contact Number";
    }
    //      if(!angular.isDefined(_this.settingData.zipCode) || _this.settingData.zipCode.length == 0){
    //          _this.errZipmsg = "Please Enter Zip Code";
    //      }
    if (_this.checkMandatoryFields()) {
      if (_this.AuthService.user.userType === 2) {
        _this.updateCandidateProfile();
      } else {
        _this.updateUserProfile();
      }
    }

  }

  updateUserProfile() {
    _this.settingData.address = _this.geoAddress.name;
    let onSuccess = (response) => {
      _this.UtilsService.notify('User Information Updated Successfully', 's', 2000);
      _this.AuthService.updateCurrentUser(_this.settingData, true);

    },
      onError = (error) => {
        console.log(error);
      };

    _this.GeneralSettingsService.updateUserProfile(_this.settingData);
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);

  }

  updateCandidateProfile() {
    _this.settingData.address = _this.geoAddress.name;
    let onSuccess = (response) => {
      _this.UtilsService.notify('Candidate Information Updated Successfully', 's', 2000);
      _this.AuthService.updateCurrentUser(_this.settingData, true);
    },
      onError = (error) => {
        console.log(error);
      };

    _this.GeneralSettingsService.updateCandidateProfile(_this.settingData);
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);

  }

  getUserProfile() {
    let onSuccess = (response) => {
      _this.settingData = response.data;
      _this.addressData(_this.settingData.address);
    },
      onError = (error) => {
        console.log(error);
      }
    _this.GeneralSettingsService.getUserProfile();
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
  }

  getCandidateProfile() {

    let onSuccess = (response) => {
      _this.settingData = response.data;
      _this.addressData(_this.settingData.address);
    },
      onError = (error) => {
        console.log(error);
      }

    _this.GeneralSettingsService.getCandidateProfile();
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
  }

  clearPasswords() {
    _this.password1 = '';
    _this.password2 = '';
  }

  saveSettings() {
    if (_this.newPassword && _this.password2) {
      if (_this.newPassword != _this.password2) {
        _this.message.error = true;
        _this.message.text = "Error! Password Mismatch";
        return;
      } else {
        _this.message.error = false;
        _this.settings.newPassword = _this.password2;
        _this.GeneralSettingsService.saveGeneralSettings(_this.settings).then((data) => {
          _this.message.text = "Data Saved Successfully";
          _this.clearPasswords();
          _this.settings = _this.GeneralSettingsService.generalSettings;
        }, (error) => {
          _this.message.error = true;
          _this.message.text = "Error! Server Request Failed";
        })

      }
    }
  }

  confirmPassword() {
    _this.isPasswordMatched = (_this.newPassword === _this.password2) ? true : false;
    _this.showErrorMsg = '';
  }

  reset(passwordForm) {
    //passwordForm.$setPristine();
    // passwordForm.$setUntouched();
    _this.currentPassword = '';
    _this.newPassword = '';
    _this.password2 = '';
    _this.passwordForm.$setPristine();
    _this.passwordForm.$setUntouched();
    _this.showErrorMsg = '';
  };

  checkPasswordFieldBlank() {
    if (_this.currentPassword == "") {
      _this.isFieldBlank = true;
    } else {
      _this.isFieldBlank = false;
    }
  }

  checkNewPasswordFieldBlank() {
    if (_this.newPassword == "") {
      _this.isNewFieldBlank = true;
    } else {
      _this.isNewFieldBlank = false;
    }
  }

  changePassword() {
    if (_this.password2 == '' || !angular.isDefined(_this.password2)) {
      _this.showErrorMsg = 'Please Confirm Password';
    }
    if (_this.checkrequiredField()) {
      let onSuccess = (response) => {
        _this.UtilsService.notify('Password Changed Successfully', 's', 2000);
        _this.currentPassword = '';
        _this.newPassword = '';
        _this.password2 = '';
        _this.passwordForm.$setPristine();
        _this.passwordForm.$setUntouched();
      },
        onError = (error) => {
          console.log(error);
        },
        password = {
          currentPassword: _this.currentPassword,
          newPassword: _this.newPassword
        }


      _this.GeneralSettingsService.changePassword(password);
      _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
    }
  }
  uploadProfilePic(file) {
    if (_this.AuthService.user.userType === 2) {
      _this.uploadCandidateProfilePic(file);
    } else {
      _this.uploadUserProfilePic(file);
    }
  }

  /*showCameraPopUp(){
    var options = {
            'buttonLabels': ['Camera', 'Gallery']
        };
        window.plugins.actionsheet.show(options, function (_btnIndex) {
            if (_btnIndex === 1) {
                doGetCameraPhoto();
            } else if (_btnIndex === 2) {
                doGetGalleryPhoto();
            }
        });
    }
    
    doGetCameraPhoto(){
    var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true  //Corrects Android orientation quirks
        }
    
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
            console.log(imageUri);
            _this.uploadProfilePic(imageUri);

    
        }, function cameraError(error) {
            console.log("Unable to obtain picture: " + error, "app");
    
        }, options);
    }
    
    doGetGalleryPhoto(){
    var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType. PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true  //Corrects Android orientation quirks
        }
    
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
                   console.log(imageUri)
                   _this.uploadProfilePic(imageUri);
        }, function cameraError(error) {
            console.log("Unable to obtain picture: " + error, "app");
    
        }, options);
    
    } */
  uploadCandidateProfilePic(file) {
    debugger;
    if (file && file.length > 0) {
      let onSuccess = (response) => {
        console.log("file " + file);
        console.log("response data" + response.data.Path);
        _this.profilePic = response.data.Path;
        _this.$rootScope.profilePicPath = _this.profilePic;
        _this.$storage.setItem('profilePicPath', _this.profilePic);
        _this.isProfilePicFileAdded = true;
        _this.UtilsService.notify("Profile Picture Uploaded Successfully", 's', 2000);
      },
        onError = (error) => {

          console.log(error);
        },
        uploadData = {
          candidateLogo: file[0]
        }

      _this.GeneralSettingsService.uploadCandidateProfilePic(uploadData);
      _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
    }

  }

  uploadUserProfilePic(file) {
    if (file && file.length > 0) {
      let onSuccess = (response) => {
        _this.profilePic = response.data.profileImage;
        _this.$rootScope.profilePicPath = _this.profilePic;
        _this.$storage.setItem('profilePicPath', _this.profilePic);
        _this.isProfilePicFileAdded = true;
        _this.UtilsService.notify("Profile Picture Uploaded Successfully", 's', 2000);
      },
        onError = (error) => {
          console.log(error);
        },
        uploadData = {
          imaageFilePath: file[0]
        }
      _this.GeneralSettingsService.uploadUserProfilePic(uploadData);
      _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
    }

  }

  isFileAdded(file) {
    _this.fileSelected = file.length > 0 ? true : false;
    _this.isSizeExceeded = _this.UtilsService.checkFileSize(file[0], '512KB');
    // _this.profilefile = file[0];
  }

  getUserProfilePic() {
    let onSuccess = (response) => {
      _this.profilePic = response.data.profileImage;
      console.log(_this.profilePic);
      _this.$rootScope.profilePicPath = _this.profilePic;
      _this.$storage.setItem('profilePicPath', _this.profilePic);
      if (response.data.profileImage) {
        _this.isProfilePicFileAdded = true;
      }
      else {
        _this.isProfilePicFileAdded = false;
      }
      if (_this.profilePic === "https://s3.amazonaws.com/internalprojectstorage/public/company/DummyLogo/Dummy_Logo.jpg") {
        _this.isProfilePicFileAdded = false;
      }

    },
      onError = (error) => {
        _this.isProfilePicFileAdded = false;
        console.log(error);
      };
    _this.GeneralSettingsService.getUserProfilePic();
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
  }

  getCandidateProfilePic() {
    let onSuccess = (response) => {
      var profilePicPath = "./img/user.png";
      if (response.data.profileImage) {
        profilePicPath = response.data.profileImage !== "" ? response.data.profileImage : "./img/user.png";
        _this.isProfilePicFileAdded = true;
      }
      _this.$rootScope.profilePicPath = profilePicPath;
      _this.$storage.setItem('profilePicPath', profilePicPath);
      _this.profilePic = profilePicPath;
      if (_this.profilePic === "https://s3.amazonaws.com/internalprojectstorage/public/company/DummyLogo/Dummy_Logo.jpg") {
        _this.isProfilePicFileAdded = false;
      }
    },
      onError = (error) => {
        _this.isProfilePicFileAdded = false;
        console.log(error);
      };
    _this.GeneralSettingsService.getCandidateProfilePic();
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
  }

  removeProfilePic() {
    if (_this.AuthService.user.userType === 2) {
      _this.removeCandidateProfilePic();
    } else {
      _this.removeUserProfilePic();
    }
  }

  removeUserProfilePic() {
    let onSuccess = (response) => {
      _this.profilePic = 'https://s3.amazonaws.com/internalprojectstorage/public/company/DummyLogo/Dummy_Logo.jpg';
      _this.$rootScope.profilePicPath = "./img/user.png";
      _this.$storage.removeItem('profilePicPath');
      _this.isProfilePicFileAdded = false;
      _this.UtilsService.notify("Profile Picture Deleted Successfully");
    },
      onError = (error) => {
        console.log(error);
      }
    _this.GeneralSettingsService.removeUserProfilePic();
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
  }

  removeCandidateProfilePic() {
    let onSuccess = (response) => {
      _this.profilePic = 'https://s3.amazonaws.com/internalprojectstorage/public/company/DummyLogo/Dummy_Logo.jpg';
      _this.$rootScope.profilePicPath = "./img/user.png";
      _this.$storage.removeItem('profilePicPath');
      _this.isProfilePicFileAdded = false;
      _this.UtilsService.notify("Profile Picture Deleted Successfully");
    },
      onError = (error) => {
        console.log(error);
      }
    _this.GeneralSettingsService.removeCandidateProfilePic();
    _this.GeneralSettingsService.activePromise.then(onSuccess, onError);
  }

  analyzePassword(value) {
    _this.checkPasswordFieldBlank();
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    _this.isPasswordRight = strongRegex.test(value);
  }

  analyzeNewPassword(value) {
    _this.checkNewPasswordFieldBlank();
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    _this.isNewPasswordRight = strongRegex.test(value);
  }

  // analyzePhoneNumber(value){
  //   let phoneRegex = /^[7-9][0-9]{9}|\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/g;
  //   _this.isPhoneNumberValid = phoneRegex.test(value);
  // }
  //
  // analyzeZipCode(value){
  //   let zipCodeRegex = new RegExp("^[1-9][0-9]{4,5}$");
  //   _this.isZipCodeValid = zipCodeRegex.test(value);
  // }

  analyzePhoneNumber(contactNumber) {
    _this.errmsgcon = "";
    if (angular.isDefined(contactNumber) && contactNumber.length < 10) {
      _this.errmsgcon = "Enter Valid Contact Number";
    }
    else if (!angular.isDefined(contactNumber) || contactNumber === "" || contactNumber === null) {
      _this.errmsgcon = "Please Enter Contact Number";
    } else {
      _this.errmsgcon = "";
    }
  }

  analyzeZipCode(zipCode) {
    _this.errZipmsg = "";
    if (angular.isDefined(zipCode) && zipCode.length < 5) {
      _this.errZipmsg = "Enter Valid Zip Code";
    }
    else if (!angular.isDefined(zipCode) || zipCode === "" || zipCode === null) {
      _this.errZipmsg = "Please Enter Zip Code";
    } else {
      _this.errZipmsg = "";
    }
  }

  checkrequiredField() {
    if (_this.currentPassword && _this.currentPassword !== ''
      && _this.newPassword && _this.newPassword !== ''
      && _this.password2 && _this.password2 !== ''
      && _this.isPasswordRight == true
      && _this.isNewPasswordRight == true
      && _this.isPasswordMatched == true
    ) { return true; }
    else {
      _this.passwordForm.$setSubmitted();
      return false;
    }
  }

  setAddressValue(addressData) {
    _this.addressData = addressData;
  }

}


