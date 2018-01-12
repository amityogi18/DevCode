import _ from 'lodash';
const allowedSecs = 120;
let _this,
  reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/,
  zipCodeRegex = new RegExp("^[1-9][0-9]{4,5}$"),
  expRegex = new RegExp("^[0-9]{1,10}$"),
  currencyRegex = new RegExp("^[a-zA-Z]*$"),
  urlRegex = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/,
  docRegex = new RegExp("(.?)\.(docx|doc)$");
export class CandidateProfileController {
  /** @ngInject  */
  constructor($scope, $compile, candidateProfilePublicService, $state, $location, $stateParams, LoaderService, AuthService, CandidateProfileService, AdminDepartmentService, locationService, CandidateSignupService, $timeout, $window, UtilsService) {
    _this = this;
    _this.skillMap = {};
    _this.$state = $state;
    _this.$scope = $scope;
    _this.$compile = $compile;
    _this.LoaderService = LoaderService;
    _this.LoaderService.show();
    _this.$timeout = $timeout;
    _this.$location = $location;
    _this.$stateParams = $stateParams;
    _this.$timeout(function () { _this.LoaderService.hide(); }, 2000);
    _this.CandidateProfileService = CandidateProfileService;
    _this.candidateProfilePublicService = candidateProfilePublicService;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.$window = $window;
    _this.locationService = locationService;
    _this.AuthService = AuthService;
    _this.UtilsService = UtilsService;
    _this.CandidateSignupService = CandidateSignupService;
    _this.mode = '';
    _this.isProfileAdded = true;
    _this.showAddMore = true;
    _this.invalidDateRange = false;
    _this.isCurrentselected = false;
    _this.isOtherSkillsetSelected = false;
    _this.isProjectSummary = false;
    _this.candidateProfileInfo = {};
    _this.candidateProfile = {};
    _this.candidateProfileInfo.candidateSkillset = [];
    _this.candidateSkillset = [];
    _this.candidateProfileInfo.candidateExperience = [];
    _this.candidateProfileInfo.candidatePortfolios = [];
    _this.candidateExperience = [];
    _this.candidatePortfolios = [];
    _this.candidateProfileInfo.candidateEducation = [];
    _this.candidateEducation = [];
    _this.candidateProfileInfo.candidatePreferredLocation = [];
    _this.candidatePreferredLocation = [];
    _this.candidateProfileInfo.candidateCriteria = {};
    _this.candidateProfileInfo.candidateUrl = [];
    _this.candidateUrls = [];
    _this.departmentList = [];
    _this.skillsetList = [];
    _this.countryList = [];
    _this.stateList = [];
    _this.cityList = [];
    _this.isActiveProfile = false;
    _this.shareProfile = false;
    _this.editSummaryIndex = -1;
    _this.getDepartment();
    _this.getCountryList();
    _this.getCandidateUrl();
    _this.getShareProfile();
    _this.profileId = '';
    _this.onLoad();
    _this.currentDate = false;
    _this.willingToTravel = {};
    _this.language = [];
    _this.availableToStart = {};
    _this.workAuthorization = {};
    _this.candidateProfile.experience = 0;
    _this.candidateProfileInfo.candidateProfile = {};
    _this.updateSkillSuggestion = 0;
    //_this.candidateProfileInfo.candidateProfile.disable = false;
    _this.submittedOnce = false;
    _this.isStateDisabled = true;
    _this.isCityDisabled = true;
    _this.ispreferredStateDisabled = true;
    _this.ispreferredCity = true;
    _this.isEducationStateDisabled = true;
    _this.isEducationCity = true;
    _this.isRoleDisabled = true;
    _this.today = new Date();
    _this.getLanguage();
    _this.qualifications = [];
    _this.languageInputs = [];
    _this.specializationData = [];
    _this.getQualification();
    _this.openFromTop();
    _this.geoAddress = {};
    _this.maxStartDate = new Date();
    _this.minEndDate;
    _this.maxEndDate = new Date();
    _this.isCurrentWorkExperienceAdded = false;
    _this.getProfileCompletenessStatus();
    _this.isAddSkillsetSelected = false;
    var maxDate = new Date();
    _this.maxDate = maxDate.toISOString();
    _this.selectedSkill = [];
    _this.selectedSuggestion = "";
    _this.targetSentenceToReplace = "";
    _this.replaceSentenceArray = [];
    _this.replaceSentenceArrayIndex = 0;
    _this.keytechword = [];
    _this.currentSkillSelected = "";
    _this.suggestionForSkill = {};
    _this.isSkillSuggestion = false;
    _this.currentTextToReplace = "";
    _this.currentTextToRemove = "";
    _this.currentElmToRemove = "";
    _this.updateButtonObj = {};
    _this.textElmHoldingObj = {};
    _this.ResumeNotSelected = true;
    _this.showSuggestions = false;
    // _this.skillSuggestionsedit = [
    //   "suggestion 1. ",
    //   "suggestion 2. ",
    //   "suggestion 3. ",
    //   "suggestion 4. ",
    //   "suggestion 5. ",
    //   "suggestion 6. ",
    // ];
    _this.getSkillSuggestions();
    _this.skillLevelArray = [{
      "levelId": 1,
      "levelName": "Primary"
    }, {
      "levelId": 2,
      "levelName": "Secondary"
    }, {
      "levelId": 3,
      "levelName": "Tertiary"
    }, {
      "levelId": 4,
      "levelName": "Add Skill"
    }, {
      "levelId": 5,
      "levelName": "Other"
    }];

    _this.skillLevels = [{
      "levelId": 1,
      "levelName": "Primary"
    }, {
      "levelId": 2,
      "levelName": "Secondary"
    }, {
      "levelId": 3,
      "levelName": "Tertiary"
    }, {
      "levelId": 4,
      "levelName": "Add Skill"
    }, {
      "levelId": 5,
      "levelName": "Other"
    }];
    _this.availableToStartInputs = [{
      "id": 3,
      "value": "immediately"
    }, {
      "id": 4,
      "value": "within 15 days"
    }, {
      "id": 15,
      "value": "within 30 days"
    }, {
      "id": 16,
      "value": "within 3 months"
    }, {
      "id": 17,
      "value": "more than 3 months"
    }];
    _this.workAuthorizationInputs = [{
      "id": 7,
      "value": "Green Card Holder "
    }, {
      "id": 8,
      "value": "US Citizen"
    }, {
      "id": 18,
      "value": "Canadian Citizen"
    }, {
      "id": 19,
      "value": "Need H1 visa"
    }, {
      "id": 20,
      "value": "Have H1 visa  "
    }, {
      "id": 21,
      "value": "Employment Auth Document "
    }, {
      "id": 22,
      "value": "TN Permit Holder"
    }, {
      "id": 46,
      "value": "Indian Citizen"
    }];
    _this.willingToTravelInputs = [{
      id: 1,
      value: "No Travel "
    }, {
      id: 2,
      value: "Upto 25% Travel"
    }, {
      id: 13,
      value: "Upto 50% Travel"
    }, {
      id: 14,
      value: "Upto 100% Travel"
    }];

    _this.salaryList = [
      { id: 1, name: '0 To 300000' },
      { id: 2, name: '300000 To 500000' },
      { id: 3, name: '500000 To 700000' },
      { id: 4, name: '700000 To 1000000' },
      { id: 5, name: 'above 1000000' }
    ];
    _this.currencyList = [
      { id: 1, name: 'INR' },
      { id: 2, name: 'USD' }
    ];
    _this.experienceData = {};
  }

  clearSearchDepartment() {
    _this.searchDepartment = '';
  }

  clearSearchSkill() {
    _this.searchSkill = '';
  }
  clearSearchCountry() {
    _this.searchCountry = '';
  }
  clearSearchStateInput() {
    _this.searchState = '';
  }
  clearSearchCityInput() {
    _this.searchCity = '';
  }

  clearSearchPreferredCountry() {
    _this.searchPreferredCountry = '';
  }
  clearSearchPreferredState() {
    _this.searchPreferredState = '';
  }
  clearSearchPreferredCity() {
    _this.searchPreferredCity = '';
  }

  onLoad() {
    let url = _this.$location.path();
    if (url === "/candidateProfile/view-profile") {
      _this.mode = 'view';
      _this.getCandidateProfileAll();
    }
    else if (url.indexOf('/candidateProfile/show-profile') >= 0) {
      _this.mode = 'view';
      _this.profileId = _this.$stateParams.profileId || 1;
      _this.isProfileAdded = true;
      _this.getCandidateProfileData(_this.profileId);
    }
    else if (url.indexOf("/candidateProfile/update-profile") >= 0) {
      _this.mode = 'edit';
      _this.profileId = _this.$stateParams.profileId || 1;
      _this.getCandidateProfileData(_this.profileId);
    }

  }

  openFromTop() {
    _this.$window.scrollTo(0, 0);
  }
  getCandidateUrl() {
    let onSuccess = (response) => {
      _this.customUrlList = response.data;
    },
      onError = (error) => {
        console.log(error);
      }
    _this.CandidateProfileService.getCandidateUrl();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);

  }

  getCountryList() {
    let onSuccess = (response) => {
      _this.countryList = response.data;
      if (_this.mode === 'edit') {
        _this.isStateDisabled = false;
        _this.isCityDisabled = false;
        if (_this.candidateProfileInfo
          && _this.candidateProfileInfo.candidateProfile
          && _this.candidateProfileInfo.candidateProfile.country
          && _this.candidateProfileInfo.candidateProfile.country.id) {
          _this.countryList.countryId = _.find(_this.countryList, function (country) { return country.id === _this.candidateProfileInfo.candidateProfile.country.id; });
        }
      }
    },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getCountryList();
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getStateList(countryId, mode, type) {
    let onSuccess = (response) => {
      _this.stateList = response.data;
      if (type === 1) {
        _this.isStateDisabled = false;
        _this.isCityDisabled = true;
        if (angular.isDefined(_this.candidateProfileInfo.candidateProfile.state)) {
          _this.candidateProfileInfo.candidateProfile.state.id = '';
        }
        if (angular.isDefined(_this.candidateProfileInfo.candidateProfile.city)) {
          _this.candidateProfileInfo.candidateProfile.city.id = '';
        }
      }
      else if (type === 2) {
        _this.ispreferredStateDisabled = false;
        _this.ispreferredCity = true;
        if (angular.isDefined(_this.preferredLocation)) {
          _this.preferredLocation.stateId = '';
        }
        if (angular.isDefined(_this.preferredLocation)) {
          _this.preferredLocation.cityId = '';
        }
      }
      else if (type === 3) {
        _this.isEducationStateDisabled = false;
        _this.isEducationCity = true;
        if (angular.isDefined(_this.educationData)) {
          _this.educationData.stateId = '';
        }
        if (angular.isDefined(_this.educationData)) {
          _this.educationData.cityId = '';
        }
      }
      //        if(mode && mode === 'VIEW-UPDATE'){
      //          _this.candidateProfile.stateName = _this.getStateNameById(_this.candidateProfile.stateId);
      //        }
      if (_this.mode === 'edit' && type !== 1) {
        if (_this.candidateProfileInfo
          && _this.candidateProfileInfo.candidateProfile
          && _this.candidateProfileInfo.candidateProfile.state
          && _this.candidateProfileInfo.candidateProfile.state.id) {
          _this.stateList.stateId = _.find(_this.stateList, function (state) {
            return state.id === _this.candidateProfileInfo.candidateProfile.state.id;
          });
        }
      }
    },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getStateList(countryId);
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getCityList(stateId, mode, type) {
    let onSuccess = (response) => {
      _this.cityList = response.data;
      if (type === 1) {
        _this.isCityDisabled = false;
        if (angular.isDefined(_this.candidateProfileInfo.candidateProfile.city)) {
          _this.candidateProfileInfo.candidateProfile.city.id = '';
        }
      }
      else if (type === 2) {
        _this.ispreferredCity = false;
        if (angular.isDefined(_this.preferredLocation)) {
          _this.preferredLocation.cityId = '';
        }
      }
      else if (type === 3) {
        _this.isEducationCity = false;
        if (angular.isDefined(_this.educationData)) {
          _this.educationData.cityId = '';
        }
      }

      //        if(mode && mode === 'VIEW-UPDATE'){
      //          _this.candidateProfile.cityName = _this.getCityNameById(_this.candidateProfile.cityId);
      //        }
      if (_this.mode === 'edit' && type !== 1) {
        if (_this.candidateProfileInfo
          && _this.candidateProfileInfo.candidateProfile
          && _this.candidateProfileInfo.candidateProfile.city
          && _this.candidateProfileInfo.candidateProfile.city.id) {
          _this.cityList.cityId = _.find(_this.cityList, function (city) { return city.id === _this.candidateProfileInfo.candidateProfile.city.id; });
        }
      }
    },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getCityList(stateId);
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getDepartment() {
    let onSuccess = (response) => {
      _this.departmentList = response.data.data;
      var departmentId = 0;
      if (_this.candidateProfileInfo
        && _this.candidateProfileInfo.candidateProfile
        && _this.candidateProfileInfo.candidateProfile.department
        && _this.candidateProfileInfo.candidateProfile.department.id
        && _this.mode === 'edit') {
        _this.candidateProfileInfo.candidateProfile.department.id = _.find(_this.departmentList, function (department) { return department.id === _this.candidateProfileInfo.candidateProfile.department.id; });
      }
    },
      onError = (error) => {
        console.log(error);
      }
    _this.AdminDepartmentService.getDepartment();
    _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
  }

  getSkillSetAndDesignation(departmentId, shouldUpdate) {
    _this.isRoleDisabled = false;
    //  if(_this.mode === 'edit')
    //  {
    //    if(angular.isDefined(_this.candidateProfileInfo.candidateProfile.candidateDesignation)){
    //           _this.candidateProfileInfo.candidateProfile.candidateDesignation.id ='';
    //       }
    // }
    // _this.candidateProfileInfo.candidateSkillset = [];
    _this.getDesignation(departmentId, shouldUpdate);
    _this.getSkillSet(departmentId, shouldUpdate);
    // _this.emptySkill();
  }

  getDesignation(departmentId, shouldUpdate) {
    let onSuccess = (response) => {
      _this.designationList = response.data;
      if (angular.isDefined(_this.candidateProfileInfo.candidateProfile.candidateDesignation)) {
        _this.candidateProfileInfo.candidateProfile.candidateDesignation.id = !shouldUpdate && _this.designationList ? '' : _this.candidateProfileInfo.candidateProfile.candidateDesignation.id
      }
    },
      onError = (error) => {
      };
    _this.CandidateSignupService.getDesignation(departmentId);
    _this.CandidateSignupService.activePromise.then(onSuccess, onError);
  }

  getSkillSet(departmentId, shouldUpdate) {
    let onSuccess = (response) => {
      _this.skillsetList = response.data;
    },
      onError = (error) => {
        console.log(error);
      }
    _this.CandidateProfileService.getSkillSet(departmentId);
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);

  }

  getCandidateProfileAll() {
    let onSuccess = (response) => {
      _this.profileList = response.data || [];
      if (_this.profileList && _this.profileList.length > 0) {
        _this.isProfileAdded = true;
        for (var i = 0; i < _this.profileList.length; i++) {
          if (_this.profileList[i].statusId === 1) {
            _this.profileId = _this.profileList[i].id;
            _this.getCandidateProfileData(_this.profileList[i].id);
            break;
          }
        }
      }
      else {
        _this.isProfileAdded = false;
      }
    },
      onError = (error) => {
        _this.isProfileAdded = false;
        console.log(error);
      };

    _this.CandidateProfileService.getCandidateProfileAll();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  getVideoUrl() {
    let onSuccess = (response) => {
      if (response && response.data) {
        _this.twoMinIntro = response.data.videoPath;
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.candidateProfilePublicService.getCandidateTwoMinIntro();
    _this.candidateProfilePublicService.activePromise.then(onSuccess, onError);
  }

  getCandidateProfileData(profileId) {
    _this.LoaderService.show();
    let onSuccess = (response) => {
      _this.candidateProfileInfo = response.data;
      //_this.candidateProfileInfo.candidateProfile.department = _this.candidateProfileInfo.candidateProfile.department[0];
      if (_this.candidateProfileInfo.candidateProfile.disable) {
        _this.candidateProfileInfo.candidateProfile.disable = 1;
      }
      else {
        _this.candidateProfileInfo.candidateProfile.disable = 0;
      }
      _this.getVideoUrl();
      _this.isActiveProfile = _this.candidateProfileInfo.candidateProfile.status.status === "ACTIVE" ? true : false;
      if (_this.mode !== 'view') {
        _this.candidateProfile = _this.candidateProfileInfo.candidateProfile;
        _this.candidateExperience = response.data.candidateExperience;
        _this.candidatePortfolios = response.data.candidatePortfolios;
        _this.geoAddress.name = _this.candidateProfileInfo.candidateProfile.address;
        _this.addressData(_this.candidateProfileInfo.candidateProfile.address);
        _this.willingToTravel = _this.candidateProfileInfo.candidateCriteria[0].willingToTravel;
        _this.availableToStart = _this.candidateProfileInfo.candidateCriteria[0].availableToStart;
        _this.workAuthorization = _this.candidateProfileInfo.candidateCriteria[0].workAuthorization;
        _this.language = _this.candidateProfileInfo.candidateCriteria[0].language;
        _this.candidateProfile.experience = parseInt(response.data.candidateProfile.experience);
        if (response.data.candidateUrl) {
          if (response.data.candidateUrl.length > 0) {
            for (var i = 0; i < response.data.candidateUrl.length; i++) {
              let candidateUrlData = {};
              candidateUrlData.url = response.data.candidateUrl[i].url;
              candidateUrlData.urlTypeId = response.data.candidateUrl[i].urlTypeId;
              _this.candidateUrls.push(candidateUrlData);
            }
          }

        }
        if (_this.candidateProfile && _this.candidateProfile.department) {
          _this.getSkillSetAndDesignation(_this.candidateProfile.department.id, true);
        }

        _this.candidateProfile.countryName = _this.getCountryNameById(_this.candidateProfile.country.id);
        _this.getStateList(_this.candidateProfile.country.id, 'VIEW-UPDATE');
        _this.getCityList(_this.candidateProfile.state.id, 'VIEW-UPDATE');
        _this.$timeout(function () {
          _.forEach(response.data.candidateSkillset, function (skill) {
            _this.addRemoveFromSkillLevel(skill.level, "REMOVE", false);
            let tempCandidateSkillset = skill;
            if (skill.level == 4) {
              //tempCandidateSkillset.skillsetText = skill.skillsetText;
              tempCandidateSkillset.skillsetText = skill.otherSkills;

            } else {
              tempCandidateSkillset.skillsetName = _this.getSkillNameById(skill.skillsetId);
              tempCandidateSkillset.skillsetId = skill.skillsetId;

            }
            _this.candidateSkillset.push(tempCandidateSkillset);
          });
        }, 4000);

      }
      _this.LoaderService.hide();
      //_this.candidateSkillsSuggestion()
    },
      onError = (error) => {
        console.log(error);
        _this.LoaderService.hide();
      }
    if (_this.mode === 'view') {
      _this.LoaderService.show();
      _this.CandidateProfileService.viewCandidateProfile(profileId);
      _this.LoaderService.hide();
    } else {
      _this.LoaderService.show();
      _this.CandidateProfileService.getCandidateProfileData(profileId);
      _this.LoaderService.hide();
    }
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }


  editProfile(profileId) {
    _this.$state.go('candidateProfile.update-profile', { profileId: profileId });
  }
  isNotEmpty(prop) {
    if (angular.isDefined(prop) && prop !== "" && prop !== null) {
      return true;
    } else {
      return false;
    }
  }
  checkRequiredFields() {

    /*if( _this.candidateProfileInfo.candidateProfile.hasOwnProperty('name') && _this.candidateProfileInfo.candidateProfile.hasOwnProperty('experience') &&
        _this.candidateProfileInfo.candidateProfile.hasOwnProperty('aboutMe') && _this.candidateProfileInfo.candidateProfile.hasOwnProperty('firstName') &&
        _this.candidateProfileInfo.candidateProfile.hasOwnProperty('lastName') && _this.candidateProfileInfo.candidateProfile.hasOwnProperty('email') &&
        _this.candidateProfileInfo.candidateProfile.hasOwnProperty('phone') && _this.candidateProfileInfo.candidateProfile.hasOwnProperty('country') &&
        _this.candidateProfileInfo.candidateProfile.hasOwnProperty('state') && _this.candidateProfileInfo.candidateProfile.hasOwnProperty('city') && 
        _this.candidateProfileInfo.candidateProfile.hasOwnProperty('zipCode') && _this.candidateProfileInfo.candidateProfile.hasOwnProperty('department') &&
        _this.candidateProfileInfo.candidateProfile.hasOwnProperty('candidateDesignation') && _this.candidateProfileInfo.candidateCriteria.hasOwnProperty('willingToTravel') &&
        _this.candidateProfileInfo.candidateCriteria.hasOwnProperty('language') && _this.candidateProfileInfo.candidateCriteria.hasOwnProperty('availableToStart') &&
        _this.candidateProfileInfo.candidateCriteria.hasOwnProperty('workAuthorization') && _this.candidateProfileInfo.candidateProfile.hasOwnProperty('employmentType') ){
  
        }
        */
    if (_this.candidateProfileInfo && _this.candidateProfileInfo.candidateProfile
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.name)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.experience)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.aboutMe)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.firstName)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.lastName)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.email)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.phone)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.department)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.candidateDesignation)
      && _this.isNotEmpty(_this.willingToTravel)
      && _this.isNotEmpty(_this.language)
      && _this.isNotEmpty(_this.availableToStart)
      && _this.isNotEmpty(_this.workAuthorization)
      && _this.isNotEmpty(_this.candidateProfileInfo.candidateProfile.employmentType)

    ) {
      return true;
    } else {
      if (_this.candidateProfileInfo && _this.candidateProfileInfo.candidateProfile) {
        if (!angular.isDefined(_this.candidateProfileInfo.candidateProfile.email) || _this.candidateProfileInfo.candidateProfile.email === "" || _this.candidateProfileInfo.candidateProfile.email === null) {
          _this.isEmailIdvalid = "Email is required";
        }
        if (!angular.isDefined(_this.candidateProfileInfo.candidateProfile.experience) || _this.candidateProfileInfo.candidateProfile.experience === "" || _this.candidateProfileInfo.candidateProfile.experience === null) {
          _this.errormessageExp = "Experience is required";
        }
        if (!angular.isDefined(_this.candidateProfileInfo.candidateProfile.phone) || _this.candidateProfileInfo.candidateProfile.phone === "" || _this.candidateProfileInfo.candidateProfile.phone === null) {
          _this.errmsgcon = "Please Enter Contact Number";
        }
        if (!angular.isDefined(_this.candidateProfileInfo.candidateProfile.zipCode) || _this.candidateProfileInfo.candidateProfile.zipCode === "" || _this.candidateProfileInfo.candidateProfile.zipCode === null) {
          _this.errormessageZip = "Zip Code is required";
        }
      }
      return false;
    }
  }
  createProfile() {
    _this.candidateProfileInfo.candidateProfile.address = _this.geoAddress.name;
    _this.submitted();
    if (_this.checkRequiredFields()) {
      let onSuccess = (response) => {
        _this.profileId = response.data.candidateProfileId;
        _this.UtilsService.notify('Profile Created successfully', 's', 2000);
        _this.uploadResume(_this.resumeFile, _this.profileId);


      },
        onError = (error) => {
          console.log(error);
        }
      let createdAt = _this.getCurrentDate();
      _this.fillCandidateCriteriaObj();
      _this.candidateProfileInfo.candidateCriteria[0].language = _this.language;
      _this.candidateProfileInfo.candidateProfile.createdAt = createdAt;
      _this.candidateProfileInfo.candidateProfile.updatedAt = createdAt;



      _this.CandidateProfileService.createProfile(_this.candidateProfileInfo);
      _this.CandidateProfileService.activePromise.then(onSuccess, onError);
    }
    else {
      _this.UtilsService.notify('Please fill the required fields', 'd', 500);
    }

    _this.addProfileForm.$setSubmitted();

  }

  isDisabled(value) {
    _this.candidateProfileInfo.candidateProfile.disable = value;
  }


  updateProfile() {
    if (_this.geoAddress.name === undefined) {
      _this.candidateProfileInfo.candidateProfile.address = _this.geoAddress;
    }
    else {
      _this.candidateProfileInfo.candidateProfile.address = _this.geoAddress.name;
    }

    if (_this.checkRequiredFields()) {
      let onSuccess = (response) => {
        _this.UtilsService.notify('Profile Updated successfully', 's', 2000);
        let profileId = _this.$stateParams.profileId || 1;
        _this.uploadResume(_this.resumeFile, _this.profileId)

      },
        onError = (error) => {
          console.log(error);
        }

      _this.fillCandidateCriteriaObj();
      let profileId = _this.$stateParams.profileId || 1;
      // if(_this.candidateProfileInfo.candidateProfile.department.id){
      //   _this.candidateProfileInfo.candidateProfile.department[0].id = _this.candidateProfileInfo.candidateProfile.department.id;
      // }
      _this.candidateProfileInfo.candidateCriteria[0].language = _this.language;
      _this.CandidateProfileService.updateProfile(_this.candidateProfileInfo, profileId);
      _this.CandidateProfileService.activePromise.then(onSuccess, onError);
    }
    else {
      _this.UtilsService.notify('Please Fill the Required Fields', 'd', 500);
    }
    _this.addProfileForm.$setSubmitted();
  }

  discard() {
    $("#cancelModal").modal("hide");
    // _this.$state.go('candidateProfile.view-profile');
    _this.$timeout(function () {
      _this.$state.go('candidateProfile.view-profile', { isCanceled: true });
    }, 500);

  }

  shareMyProfile(value) {
    let profileShare = { "profileShare": value }
    _this.CandidateProfileService.addToMyProfile(profileShare);
    let onSuccess = (response) => {
      _this.UtilsService.notify(response.data.successMessage, 's', 2000);
      // window.alert(response.data.successMessage);
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  getShareProfile() {
    let onSuccess = (response) => {
      _this.shareProfile = response.data.profileShare == 1 ? true : false;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.getShareLink();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  emptySkill() {
    _this.skill = {};
    _this.candidateSkillset = [];
    _this.candidateProfileInfo.candidateSkillset = [];
    _this.skillLevels = [{
      "levelId": 1,
      "levelName": "Primary"
    }, {
      "levelId": 2,
      "levelName": "Secondary"
    }, {
      "levelId": 3,
      "levelName": "Tertiary"
    }, {
      "levelId": 4,
      "levelName": "Add Skill"
    }, {
      "levelId": 5,
      "levelName": "Other"
    }];
  }



  addSkill(skillData) {
    _this.isMatchedskill = false;
    angular.forEach(_this.candidateSkillset, function (value, key) {
      if (skillData.level == 4) {
        if (skillData.skillsetText.toUpperCase() === value.skillsetName.toUpperCase()) {
          _this.isMatchedskill = true;
          _this.UtilsService.notify('You Can Only Add Skill Once', 'd', 2000);
        }
      }
      else
        if (skillData.skillsetId == value.skillsetId) {
          _this.isMatchedskill = true;
          _this.UtilsService.notify('You Can add a skill only once', 'd', 2000);
        }
    })
    if (!_this.isMatchedskill) {
      let tempObj = {};
      angular.copy(skillData, tempObj);
      tempObj.skillsetName = _this.getSkillNameById(tempObj.skillsetId);
      skillData.skillsetName = tempObj.skillsetName;
      _this.candidateSkillset.push(tempObj);
      skillData.createdAt = _this.getCurrentDate();
      skillData.updatedAt = _this.getCurrentDate();
      if (!skillData.hasOwnProperty('skillsetText')) {
        skillData.skillsetText = "";
      }
      if (!skillData.hasOwnProperty('skillsetId')) {
        skillData.skillsetId = null;
      }

      let finalSkilldata = {
        "yearsOfExperience": skillData.yearsOfExperience,
        "lastUse": skillData.yearsOfExperience,
        "level": skillData.level,
        "skillsetId": skillData.skillsetId,
        "skillsetText": skillData.skillsetText
      }

      _this.candidateProfileInfo.candidateSkillset.push(skillData);
      _this.addRemoveFromSkillLevel(skillData.level, "ADD", true);
      _this.skill = {};
    }

  }

  deleteSkill(index, skillData) {
    _this.candidateSkillset.splice(index, 1);
    _this.addRemoveFromSkillLevel(skillData.level, "REMOVE", true);
    _this.candidateProfileInfo.candidateSkillset.splice(index, 1);

  }


  getSkillNameById(id) {
    let skillsetName = "Skill";
    let skill = _.find(_this.skillsetList, function (skill) { return skill.id == id; });
    if (skill && skill.skillsetName !== "") {
      skillsetName = skill.skillsetName;
    }
    return skillsetName;
  }

  compareDate(startDate, endDate) {
    if (Date.parse(startDate) > Date.parse(endDate)) {
      // alert("Invalid Date Range!\nStart Date cannot be after End Date!")
      _this.invalidDateRange = true;
      _this.$timeout(function () {
        _this.invalidDateRange = false;
      }, 10000);
      return false;
    }
    else {
      return true;
    }
  }

  checkDateRange(startDate, endDate) {
    _this.invalidDateRange = false;
    var _startDate = Date.parse(startDate);
    var _endDate = Date.parse(endDate);
    angular.forEach(_this.candidateProfileInfo.candidateExperience, function (value, key) {
      if (!(_startDate >= Date.parse(value.endDate) || _endDate <= Date.parse(value.startDate))) {
        _this.invalidDateRange = true;

      }
    }
    );
    // if(_this.invalidDateRange) {
    //   return false;
    // }
    // else {
    //   return true;
    // }
    return !_this.invalidDateRange;
  }
  isCurrentDate(val) {
    _this.isCurrentSelected = val;
    if (val) {
      _this.experienceData.endDate = new Date();
    }
    else {
      _this.experienceData.endDate = '';
    }
  }

  addWorkExperience(experienceData) {
    if (experienceData
      && experienceData.jobTitle
      && experienceData.companyName
      && experienceData.startDate
      && experienceData.endDate
      && experienceData.startDate !== null
      && experienceData.startDate !== "NaN-NaN-NaN"
      && experienceData.endDate !== null
      && experienceData.endDate !== "NaN-NaN-NaN"
      && experienceData.jobTitle !== ''
      && experienceData.companyName !== ''
    ) {
      if (_this.checkDateRange(experienceData.startDate, experienceData.endDate)) {
        if (_this.compareDate(experienceData.startDate, experienceData.endDate)) {
          experienceData.startDate = _this.getFormatedDate(experienceData.startDate);
          experienceData.endDate = _this.getFormatedDate(experienceData.endDate);

          let tempObj = {};
          angular.copy(experienceData, tempObj);
          //  _this.candidateExperience.push(tempObj);
          experienceData.createdAt = _this.getCurrentDate();
          experienceData.updatedAt = _this.getCurrentDate();
          if (!_this.isCurrentWorkExperienceAdded) {
            _this.isCurrentWorkExperienceAdded = experienceData.isCurrent;
          }
          _this.candidateProfileInfo.candidateExperience.push(experienceData);
          _this.experienceData = {};


        }
      }

    }
  }



  analyzeProjectTitle(title) {
    _this.errorMsgTitle = '';
    if (!angular.isDefined(title) || title === "" || title === null) {
      _this.errorMsgTitle = "Please Enter Project  Title";
    }
    else {
      _this.errorMsgTitle = '';
    }
  }


  analyzeProjectUrl(url) {
    _this.errorMsgUrl = '';
    if (url === "") {
      _this.errorMsgUrl = "Please Enter url";
    }
    else {
      _this.errorMsgUrl = '';
    }

  }
  analyzeProjectDescription(description) {
    _this.errorMsgDescription = '';
    if (!angular.isDefined(description) || description === "" || description === null) {
      _this.errorMsgDescription = "Please Enter Description";
    }
    else {
      _this.errorMsgDescription = '';
    }
  }

  addProfileSummary(portfolioData) {

    if (!_this.addProfileForm.url.$error.url) {
      _this.isProjectSummary = false;
      _this.candidateProfileInfo.candidatePortfolios.push(portfolioData);
      _this.portfolioData = {};
      _this.addProfileForm.title.$error = "";

    }
  }



  deletePrjectSummary(index) {
    // if(_this.candidateProfileInfo.candidateExperience[index].isCurrent) {
    //   _this.isCurrentWorkExperienceAdded = false;
    // }
    //_this.isProjectSummary = false;
    _this.candidatePortfolios.splice(index, 1);
    _this.candidateProfileInfo.candidatePortfolios.splice(index, 1);

  }

  editViewPrjectSummary(editPrjectSummaryData, index) {
    _this.isProjectSummary = true;
    _this.editSummaryIndex = index;
    _this.portfolioData = angular.copy(editPrjectSummaryData);
  }

  editProfileSummary() {
    if (!_this.addProfileForm.url.$error.url) {
      _this.$timeout(function () {
        _this.isProjectSummary = true;
        _this.candidateProfileInfo.candidatePortfolios[_this.editSummaryIndex] = _this.portfolioData;
        _this.portfolioData = {};
        _this.isProjectSummary = false;
        _this.editSummaryIndex = -1;
      }, 0);

    }

  }


  deleteWorkExperience(index) {
    if (_this.candidateProfileInfo.candidateExperience[index].isCurrent) {
      _this.isCurrentWorkExperienceAdded = false;
    }
    _this.candidateExperience.splice(index, 1);
    _this.candidateProfileInfo.candidateExperience.splice(index, 1);

  }

  checkErr(startDate, endDate) {
    _this.errMessage = '';
    let curDate = new Date();

    if (new Date(startDate) > new Date(endDate)) {
      _this.errMessage = 'End Date should be greater than start date';
      return false;
    }
    if (new Date(startDate) < curDate) {
      _this.errMessage = 'Start date should not be before today.';
      return false;
    }
  };

  checkDateFieldBlank() {
    if (_this.date == "") {
      _this.isFieldBlank = true;
    } else {
      _this.isFieldBlank = false;
    }
  }

  addEducation(educationData) {
    if (educationData !== undefined &&
      educationData.qualification !== "" &&
      educationData.university !== '' &&
      educationData.specialization !== '' &&
      educationData.educationAddressField !== '') {
      let tempObj = {};

      //angular.copy(educationData, tempObj);
      tempObj.qualification = {
        name: _this.getQualificationNamebyId(educationData.qualification.id)
      }
      tempObj.createdAt = _this.getCurrentDate();
      tempObj.updatedAt = _this.getCurrentDate();
      tempObj.educationAddress = _this.educationData.educationAddressField.name;
      tempObj.university = _this.educationData.university;
      tempObj.specialization = _this.educationData.specialization;
      _this.candidateEducation.push(tempObj);
      _this.candidateProfileInfo.candidateEducation.push(tempObj);
      _this.educationData = {};
      _this.clearEducationData();
      _this.addProfileForm.$setPristine();
      _this.addProfileForm.$setUntouched();

    }
  }

  deleteEducation(index) {
    _this.candidateEducation.splice(index, 1);
    _this.candidateProfileInfo.candidateEducation.splice(index, 1);
  }

  getCurrentDate() {
    var date = new Date();
    let currDate = ('0' + date.getDate()).slice(-2);
    let currMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    let currYear = date.getFullYear();
    return currYear + "-" + currMonth + "-" + currDate;
  }

  getFormatedDate(date) {
    let d = new Date(date);
    let currDate = ('0' + d.getDate()).slice(-2);
    let currMonth = ('0' + (d.getMonth() + 1)).slice(-2);
    let currYear = d.getFullYear();
    return currYear + "-" + currMonth + "-" + currDate;
  }

  getQualificationNamebyId(id) {
    let qualificationName = '';
    let qualification = _.find(_this.qualifications, function (qualification) { return qualification.id == id; });
    if (qualification && qualification.qualificationName !== '') {
      qualificationName = qualification.name;
    }
    return qualificationName;
  }

  getCountryNameById(id) {

    let countryName = "";
    let country = _.find(_this.countryList, function (country) { return country.id == id; });
    if (country && country.countryName !== '') {
      countryName = country.countryName;
    }
    return countryName;

  }

  getStateNameById(id) {
    this.isStateDisabled = false;
    this.isCityDisabled = true;
    let stateName = "";
    let state = _.find(_this.stateList, function (state) { return state.id == id; });
    if (state && state.stateName !== '') {
      stateName = state.stateName;
    }
    return stateName;
  }

  getCityNameById(id) {
    this.isCityDisabled = false;
    let cityName = "";
    let city = _.find(_this.cityList, function (city) { return city.id == id; });
    if (city && city.cityName !== '') {
      cityName = city.cityName;
    }
    return cityName;
  }

  addCandidateUrl() {
    let candidateUrlData = {};
    if (_this.candidateUrlData
      && _this.candidateUrlData.url
      && _this.candidateUrlData.url.length > 0
      && _this.candidateUrlData.urlType
      && _this.candidateUrlData.urlType.urlTypeId) {
      candidateUrlData.url = _this.candidateUrlData.url;
      candidateUrlData.urlTypeId = _this.candidateUrlData.urlType.urlTypeId;
      if (_this.candidateUrls.length < 4) {
        _this.candidateUrls.push(candidateUrlData);
        candidateUrlData.createdAt = _this.getCurrentDate();
        candidateUrlData.updatedAt = _this.getCurrentDate();
        _this.candidateProfileInfo.candidateUrl.push(candidateUrlData);
        _this.candidateUrlData = {};
      } else {
        _this.UtilsService.notify('You Can Add Only 4 Urls.');
      }

      _this.candidateUrlData = {};
    }

  }

  deleteCandidateUrl(index) {
    _this.candidateUrls.splice(index, 1);
    _this.candidateProfileInfo.candidateUrl.splice(index, 1);
  }

  emptyPreferredLocation() {
    _this.preferredLocation = {};
    _this.candidatePreferredLocation = [];
    _this.candidateProfileInfo.candidatePreferredLocation = [];

  }

  clearSuggestions(clearData) {
    _this.clearData = clearData;
  }

  clearSuggestionsForEducation(clearEducationData) {
    _this.clearEducationData = clearEducationData;
  }

  addPreferredLocation() {
    console.log('address filed ---', _this.preferredLocation.preferredAddressFiled);
    if (_this.preferredLocation.preferredAddressFiled !== "") {
      if (_this.candidatePreferredLocation.length < 4) {
        let tempObj = {};
        tempObj.createdAt = _this.getCurrentDate();
        tempObj.updatedAt = _this.getCurrentDate();
        tempObj.preferredAddress = _this.preferredLocation.preferredAddressFiled.name;
        _this.candidatePreferredLocation.push(tempObj);
        _this.candidateProfileInfo.candidatePreferredLocation.push(tempObj);
        _this.preferredLocation.preferredAddressFiled = "";
        _this.clearData();
        _this.addProfileForm.$setPristine();
        _this.addProfileForm.$setUntouched();
      } else {
        _this.UtilsService.notify('You Can Add Maximum Four Preffered Locations.');
      }
    }
    //  let hasData = _.isEmpty(preferredLocation);    
    //  if(!hasData){
    //    if(preferredLocation.preferredAddressFiled !== ""){

    //            if(_this.candidatePreferredLocation.length<4){
    //            let tempObj;
    //            //angular.copy(preferredLocation, tempObj);
    //            tempObj.createdAt = _this.getCurrentDate();
    //            tempObj.updatedAt = _this.getCurrentDate();
    //            tempObj.preferredAddress =  _this.preferredLocation.preferredAddressFiled.name;

    //            _this.candidatePreferredLocation.push(tempObj);
    //            _this.candidateProfileInfo.candidatePreferredLocation.push(tempObj);
    //            _this.preferredLocation={};
    //            }else{
    //            _this.GrowlerService.growl({
    //            type:'success',
    //            message : 'You Can Add Maximum Four Preffered Locations.',
    //            delay :2000
    //        });

    //     }   

    //   }
    // } 
  }






  deletePreferredLocation(index) {
    _this.candidatePreferredLocation.splice(index, 1);
    _this.candidateProfileInfo.candidatePreferredLocation.splice(index, 1);

  }

  otherSkillChange() {
    _this.isOtherSkillsetSelected = _this.skill.level == 5 ? true : false;
    _this.isAddSkillsetSelected = _this.skill.level == 4 ? true : false;
  }

  fillCandidateCriteriaObj() {
    let candidateCriteriaArray = [];
    let candidateCriteriaObj = {};
    //let languageArray = [];
    //languageArray.push(_this.language);
    //candidateCriteriaObj.language = languageArray;
    candidateCriteriaObj.availableToStart = _this.availableToStart;
    candidateCriteriaObj.workAuthorization = _this.workAuthorization;
    candidateCriteriaObj.willingToTravel = _this.willingToTravel;
    candidateCriteriaArray.push(candidateCriteriaObj);
    _this.candidateProfileInfo.candidateCriteria = candidateCriteriaArray;
  }

  /*
   * @name - isFileAdded
   * @param {object} file - object for file to be uploaded
   * @description - function sets the value of fileNotSelected variable based on selected files
   */
  isFileAdded(file) {
    //this.fileSelected = file.length > 0 ? false : true;
    if (file.length > 0) {
      this.fileNotSelected = true;
    }
    else {
      this.fileNotSelected = false;
    }
  }

  uploadFile(file) {
    _this.resumeFile = file[0];
    _this.isSizeExceeded = _this.UtilsService.checkFileSize(file[0], '512KB');
  }

  uploadResume(file, profileId) {
    let onSuccess = (response) => {
      _this.$state.go('candidateProfile.show-profile', { profileId: _this.profileId });
    },
      onError = (error) => {
        _this.UtilsService.notify('Resume Type Invalid', 'd');
      }
    //let profileId = _this.$stateParams.profileId  || 1;
    _this.CandidateProfileService.uploadResume(file, profileId).then(onSuccess, onError);
    //  _this.CandidateProfileService.activePromise.then(onSuccess, onError);

  }

  submitted() {
    _this.submittedOnce = true;
  }

  addRemoveFromSkillLevel(selectedLevel, type, fromEvent) {
    if (selectedLevel != 5) {
      for (let i = 0; _this.skillLevelArray.length > i; i++) {
        if (selectedLevel == _this.skillLevelArray[i].levelId) {
          if (type === "ADD") {
            for (let idx = 0; idx < _this.skillLevels.length; idx++) {
              if (selectedLevel == _this.skillLevels[idx].levelId) {
                _this.skillLevels.splice(idx, 1);
              }
            }
          } else {
            let levelObj = {
              "levelId": selectedLevel,
              "levelName": _this.getLevelNameById(selectedLevel)
            }
            if (!fromEvent) {
              for (let idx = 0; idx < _this.skillLevels.length; idx++) {
                if (selectedLevel == _this.skillLevels[idx].levelId) {
                  _this.skillLevels.splice(idx, 1);
                }
              }
            }
            else {
              for (let idx = 0; idx < _this.skillLevelArray.length; idx++) {
                if (selectedLevel == _this.skillLevelArray[idx].levelId) {
                  _this.skillLevels.push(_this.skillLevelArray[idx]);
                }
              }
            }
            // if(!_this.skillMap[levelObj.levelId]){
            //     _this.skillMap[levelObj.levelId] = levelObj;
            // }

            //  _this.tempSkillLevels = [];
            // for(let idx=0;idx<_this.skillLevels.length;idx++){
            //     if(_this.skillMap[_this.skillLevels[idx].levelId]){
            //         _this.skillLevels.splice(idx,1);
            //     }
            // }
            _this.skillLevels.sort(function (a, b) { return (a.levelId > b.levelId) ? 1 : ((b.levelId > a.levelId) ? -1 : 0); });


            //                        if (_this.skillLevels.indexOf(levelObj) === -1) {
            //                          _this.skillLevels.push(levelObj);
            //                           _this.skillLevels.sort(function(a,b) {return (a.levelId > b.levelId) ? 1 : ((b.levelId > a.levelId) ? -1 : 0);} );                    
            //                         }  
          }
          _this.skillLevels.sort(function (a, b) { return (a.levelId > b.levelId) ? 1 : ((b.levelId > a.levelId) ? -1 : 0); });
        }
      }

    }
  }

  getLevelNameById(levelId) {
    if (levelId == 1) {
      return "Primary";
    } else if (levelId == 2) {
      return "Secondary";
    } else if (levelId == 3) {
      return "Tertiary";
    }
  }

  // analyzeEmailId(value){
  //   //let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
  //    let emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
  //   _this.isEmailIdvalid = emailRegex.test(value);
  // }

  analyzeEmailId(email) {
    _this.isEmailIdvalid = "";
    if (angular.isDefined(email) && !reg.test(email)) {
      _this.isEmailIdvalid = "Enter Valid Email Id";
    }
    else if (!angular.isDefined(email) || email === "" || email === null) {
      _this.isEmailIdvalid = "This field is required";
    } else {
      _this.isEmailIdvalid = "";
    }
  }

  analyzePhoneNumber(phone) {
    // if(value){
    //   let phoneRegex = /^[7-9][0-9]{9}|\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/g;
    //   _this.isPhoneNumberValid = phoneRegex.test(value);
    // }
    _this.errmsgcon = "";
    if (angular.isDefined(phone) && phone.length < 10) {
      _this.errmsgcon = "Enter Valid Contact Number";
    }
    else if (!angular.isDefined(phone) || phone === "" || phone === null) {
      _this.errmsgcon = "Please Enter Contact Number";
    } else {
      _this.errmsgcon = "";
    }

  }

  analyzeZipCode(zipCode) {

    // _this.isZipCodeValid = zipCodeRegex.test(value);
    _this.errormessageZip = "";
    if (angular.isDefined(zipCode) && !zipCodeRegex.test(zipCode)) {
      _this.errormessageZip = "Enter Valid Zip Code";
    }
    else if (!angular.isDefined(zipCode) || zipCode === "" || zipCode === null) {
      _this.errormessageZip = "Zip Code is required";
    } else {
      _this.errormessageZip = "";
    }
  }


  /*analyzeExperience(experience){
      _this.errormessageExp = "";
   if(angular.isDefined(experience) && !expRegex.test(experience)){
      _this.errormessageExp = "Enter Valid Experience in Months";
    }
    else if(!angular.isDefined(experience) || experience === "" || experience === null){
      _this.errormessageExp = "Experience is required";
    }else {
      _this.errormessageExp = "";
    }
  } */
  analyzeExperience(value) {
    _this.errormessageExp = "";
    if (angular.isDefined(value) && value.length < 0) {
      _this.errormessageExp = "Enter Valid Experience in Months";
      //_this.contactCriteria = false;
    }
    else if (!angular.isDefined(value) || value === "" || value === null) {
      _this.errormessageExp = "Experience is required";
    } else {
      _this.errormessageExp = "";
      //_this.contactCriteria = true;
    }
  }

  analyzeSalary(salary) {
    _this.errormessageSal = "";
    if (angular.isDefined(salary) && !expRegex.test(salary)) {
      _this.errormessageSal = "Please Provide Rounded Integer Figure of Salary";
    }
    else if (!angular.isDefined(salary) || salary === "" || salary === null) {
      _this.errormessageSal = "";
    } else {
      _this.errormessageSal = "";
    }
  }

  analyzeHourlyRate(hourlyRate) {
    _this.errormessageHourlyRate = "";
    if (angular.isDefined(hourlyRate) && !expRegex.test(hourlyRate)) {
      _this.errormessageHourlyRate = "Please Provide Rounded Hourly Rate In Integer";
    }
    else if (!angular.isDefined(hourlyRate) || hourlyRate === "" || hourlyRate === null) {
      _this.errormessageHourlyRate = "";
    } else {
      _this.errormessageHourlyRate = "";
    }

  }

  analyzeAlphabet(currency) {
    _this.errormessageCurrency = "";
    if (angular.isDefined(currency) && !currencyRegex.test(currency)) {
      _this.errormessageCurrency = "Please Fill Currency Code";
    }
    else if (!angular.isDefined(currency) || currency === "" || currency === null) {
      _this.errormessageCurrency = "";
    } else {
      _this.errormessageCurrency = "";
    }
  }

  analyzeDocument(file) {
    _this.errorMessageDocument = "";
    if (angular.isDefined(file) && !docRegex.test(file)) {
      _this.errorMessageDocument = "Please Upload Only Word Document File";
    }
    else if (angular.isDefined(file) || file === "" || file === null) {
      _this.errorMessageDocument = "";
    } else {
      _this.errorMessageDocument = "";
    }
  }

  /*analyzeCompanyUrl(url){
        _this.errormessagecompurl = "";
        if(!angular.isDefined(url) || url === "" || url === null){
            _this.errormessagecompurl = "Please Enter Url";

        }
        else if(angular.isDefined(url) && !urlRegex.test(url)){
            _this.errormessagecompurl = " Enter Valid Url";
        }
        else {
            _this.errormessagecompurl = "";
        }
    } */

  analyzeCompanyUrl(url) {
    _this.errormessagecompurl = "";
    if (!angular.isDefined(url) || url === "" || url === null) {
      _this.errormessagecompurl = "Please Enter Company Url";
    }
    else if (angular.isDefined(url) && !urlRegex.test(url)) {
      _this.errormessagecompurl = " Enter Valid Company Url";
      _this.msg = false;
    }
    else {
      _this.errormessagecompurl = "";
      _this.msg = true;
    }
  }

  analyzeExperienceNumber() {
    let integer = /^\d*$/;
    _this.isValidExperience = integer.test(value);
  }

  reset() {
    if (_this.experienceData.jobTitle == '' && _this.experienceData.endDate == '' &&
      _this.experience.startDate == '' && _this.experience.endDate == '') { }

  }

  getLanguage() {
    let onSuccess = (response) => {
      if (response && response.data.length > 0) {
        _this.languageInputs = response.data;
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.getLanguage();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  getQualification() {
    let onSuccess = (response) => {
      if (response && response.data.length > 0) {
        _this.qualifications = response.data;
        //  for (var i = 0; i < _this.qualifications.length; i++) {
        //       _this.qualificationId = _this.qualifications[i].id;
        //       _this.getSpecializationData(_this.qualificationId);
        //     }
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.getQualification();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

  getSpecializationData(id) {
    let onSuccess = (response) => {
      if (response && response.data.length > 0) {
        _this.specializationData = response.data;
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.getSpecializationData(id);
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);

  }

  endFutureDate() {
    let endDate = angular.element(document.querySelector('#endDate'));
    endDate.datepicker(
      {
        maxDate: '0',
        beforeShow: function () {
          jQuery(this).datepicker('option', 'minDate', jQuery('#startDate').val());
        },
      }
    );
  }

  checkForFutureDate(toDate) {
    if (toDate !== null) {
      let currentDate = new Date();
      _this.isFutureDate = (Date.parse(toDate) > Date.parse(currentDate)) ? true : false;
      if (_this.isFutureDate) {
        _this.experienceData.endDate = "";
      }
    }
  }

  removeInvalidFirstNameCP(firstName) {
    if (angular.isDefined(firstName)) {
      for (var i = 0; i < firstName.length; i++) {
        var code = firstName.charCodeAt(i);
        if (!(code >= 65 && code <= 91) && !(code >= 97 && code <= 122) && !(code == 32)) {
          _this.candidateProfileInfo.candidateProfile.firstName = "";
          return;
        }
      }
    }
  }

  analyzeOtherCompany(urlType) {
    _this.errorMessageOtherCompanyUrl = "";
    if (!angular.isDefined(urlType) || urlType === "" || urlType === null) {
      _this.errorMessageOtherCompanyUrl = "Please Select Field";
    }
    else {
      _this.errorMessageOtherCompanyUrl = "";
    }
  }
  setAddressValue(addressData) {
    _this.addressData = addressData;
  }

  setPreferredAddress(preferredAddressData) {
    _this.preferredAddressData = preferredAddressData;
  }

  setEducationAddressValue(educationAddressData) {
    _this.educationAddressData = educationAddressData;
  }



  isCurrentDateChecked() {
    if (_this.experienceData.isCurrent) {
      _this.experienceData.endDate = new Date();
    }
    else {
      _this.experienceData.endDate = null;
    }
  }

  willingToFunc(travels) {
    _this.candidateProfileInfo.candidateCriteria.willingToTravel = travels;
  }


  availableToStartFunc(available) {
    _this.candidateProfileInfo.candidateCriteria.availableToStart = available;
  }

  workAuthorizationFunc(works) {
    _this.candidateProfileInfo.candidateCriteria.workAuthorization = works;
  }

  //Profile Completeness Api

  getProfileCompletenessStatus() {
    let onSuccess = (response) => {
      _this.profileCompletenessStatus = response.data;
      _this.profileCompletenessCount = response.data.totalProfileCompleteness;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.getProfileCompletenessStatus();
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }
  //  candidateSkillsSuggestion() {
  //   let onSuccess = (response) => {
  //     if(response.data.skills.length > 0) {
  //       _this.keytechword = response.data.skills;
  //       var tempSkillArray = response.data.suggestion;
  //       angular.forEach(tempSkillArray, function(value, key){
  //          var temp = Object.keys(value);
  //          _this.suggestionForSkill[temp] = value[temp];
  //       });
  //       var els = 'about-me-discription';
  //       _this.skillSuggestions(_this.candidateProfileInfo.candidateProfile.aboutMe, els);
  //       _this.skillSuggestionsForProjectExpeirence();
  //     }
  //     else {
  //       _this.isSkillSuggestion = true;
  //       document.querySelector('.about-me-discription').innerHTML = _this.candidateProfileInfo.candidateProfile.aboutMe;
  //     }
  //    },
  //    onError = (error) => {
  //          console.log(error);
  //   };
  //   _this.CandidateProfileService.getCandidateSkillsSuggestion();
  //   _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  //  }

  //  skillSuggestions(text,elm) {

  //   //var descriptionText = _this.candidateProfileInfo.candidateProfile.aboutMe;
  //   var descriptionText = text;
  //   _this.textElmHoldingObj[elm] = text;
  //   var keyObject = {};
  //   angular.forEach(_this.keytechword, function(value, key){
  //       var elems = '<a style="cursor:pointer" ng-click="CandidateProfileCtrl.getSkillSuggestion(\''+value+'\',\''+elm+'\')" data-toggle="modal" data-target="#skillSuggestion"><span style="color: #fda117"><i class="fa fa-lightbulb-o" aria-hidden="true"></i></span>' + value + '</a>';
  //       keyObject[value] = elems;
  //     } 
  //   );
  //   var re = new RegExp(Object.keys(keyObject).join("|"),"gi");
  //   descriptionText = descriptionText.replace(re, function(matched){
  //     matched = matched.toLowerCase();
  //     return keyObject[matched];
  //   });
  //   var els = document.querySelector('.'+elm);
  //   var descriptionHTML = '<div>' + descriptionText + '</div>';
  //   var descriptionHtmlCompiled = _this.$compile(descriptionHTML)(_this.$scope);
  //   angular.element(els).empty();
  //   angular.element(els).append(descriptionHtmlCompiled);


  // }
  // getSkillSuggestion(skill, els) {
  //   var text = document.querySelector('.'+els).innerText;
  //   _this.currentTextToReplace = text;
  //   _this.currentElementToReplace = els;
  //   _this.currentSkillSelected = skill;
  //   _this.selectedSuggestion = "";
  //   _this.selectedSkill = _this.suggestionForSkill[skill]; 
  //   //var descriptionTextReplace = _this.candidateProfileInfo.candidateProfile.aboutMe;
  //   var descriptionTextReplace = text;
  //   _this.suggestions = [];
  //   var keyskill = descriptionTextReplace.indexOf(skill);
  //   var startPoint = descriptionTextReplace.lastIndexOf(".", keyskill);
  //   var endPoint = descriptionTextReplace.indexOf(".", keyskill);
  //   var sentenceToReplace = descriptionTextReplace.substring(startPoint+1,endPoint);
  //   _this.targetSentenceToReplace = sentenceToReplace;

  // }
  // replaceSuggested(){
  //   if(_this.selectedSuggestion != "") {
  //     _this.updateSkillSuggestion++;
  //     _this.updateButtonObj[_this.currentElementToReplace] = _this.updateButtonObj[_this.currentElementToReplace] ? _this.updateButtonObj[_this.currentElementToReplace] + 1 : 1;
  //     console.log(_this.updateButtonObj); 
  //     _.pull(_this.keytechword,_this.currentSkillSelected);
  //     var tempObjForStringsToReplace = {};
  //     tempObjForStringsToReplace.replace = _this.targetSentenceToReplace;
  //     tempObjForStringsToReplace.toBeReplace = _this.selectedSuggestion;
  //     _this.replaceSentenceArray[_this.replaceSentenceArrayIndex] = tempObjForStringsToReplace;
  //     var crosselement = _this.selectedSuggestion + ' <a style="cursor:pointer" ng-click="CandidateProfileCtrl.removeSuggested(\''+_this.replaceSentenceArrayIndex+'\',\''+ _this.currentSkillSelected+'\',\''+ _this.currentElementToReplace+'\')"><span style="color: #ed1c24; position:relative;bottom:10px"><i class="fa fa-times" aria-hidden="true"></i></span></a>'
  //     _this.currentTextToReplace = _this.currentTextToReplace.replace(_this.targetSentenceToReplace,crosselement);
  //     _this.replaceSentenceArrayIndex = _this.replaceSentenceArrayIndex + 1;
  //     _this.currentSkillSelected = "";
  //     _this.updateSkillSuggested(_this.currentTextToReplace,_this.currentElementToReplace);
  //   }
  //   else {
  //     _this.currentSkillSelected = "";
  //   }

  // }
  // removeSuggested(arrayIndex, skill, elm) {
  //   _this.updateSkillSuggestion--;
  //   _this.updateButtonObj[elm] =  _this.updateButtonObj[elm] - 1;
  //   console.log(_this.updateButtonObj);
  //   _this.keytechword.push(skill);
  //   //_this.currentTextToRemove = document.querySelector('.'+elm).innerText;
  //   _this.currentTextToRemove = _this.textElmHoldingObj[elm];
  //   _this.currentElmToRemove = elm;
  //   var replaceString = _this.replaceSentenceArray[arrayIndex].replace;
  //   var targetString = _this.replaceSentenceArray[arrayIndex].toBeReplace;
  //   var tempStringHandle = targetString + ' <a style="cursor:pointer" ng-click="CandidateProfileCtrl.removeSuggested(\''+arrayIndex+'\',\''+skill+'\',\''+elm+'\')"><span style="color: #ed1c24; position:relative;bottom:10px"><i class="fa fa-times" aria-hidden="true"></i></span></a>'
  //   _this.currentTextToRemove = _this.currentTextToRemove.replace(tempStringHandle, replaceString);
  //    _this.updateSkillSuggested(_this.currentTextToRemove,elm);
  // }
  // updateSkillSuggested(text,elm){
  //   var descriptionText = text;
  //   var keyObject = {};
  //   angular.forEach(_this.keytechword, function(value, key){
  //       var elems = '<a style="cursor:pointer" ng-click="CandidateProfileCtrl.getSkillSuggestion(\''+value+'\',\''+elm+'\')" data-toggle="modal" data-target="#skillSuggestion"><span style="color: #fda117"><i class="fa fa-lightbulb-o" aria-hidden="true"></i></span>' + value + '</a>';
  //       keyObject[value] = elems;
  //     } 
  //   );
  //   var re = new RegExp(Object.keys(keyObject).join("|"),"gi");
  //   descriptionText = descriptionText.replace(re, function(matched){
  //     matched = matched.toLowerCase();
  //     return keyObject[matched];
  //   });
  //   //var els = _this.currentElementToReplace;
  //   var els = document.querySelector('.'+elm);
  //   var descriptionHTML = '<div>' + descriptionText + '</div>';
  //   var descriptionHtmlCompiled = _this.$compile(descriptionHTML)(_this.$scope);
  //   angular.element(els).empty();
  //   angular.element(els).append(descriptionHtmlCompiled);
  // }
  // updateSkillSuggestionText(targetClass,from) {
  //    var aboutMeData = {};
  //    aboutMeData.candidateProfile = {};
  //    aboutMeData.candidatePortfolios = [];
  //    aboutMeData.onlyAboutMe = true;
  //    if(from==="aboutMe") {
  //       var updateText = (document.querySelector('.'+targetClass).innerText).replace(" .",".").trim();
  //      // var temp = String(String(updateText).replace(/<[^>]+>/gm, '')).replace(" .",".");
  //       aboutMeData.candidateProfile.aboutMe = updateText;
  //    }
  //    else if(from==='project') {
  //      var val = targetClass.slice(-1);
  //     var projectSummary = _this.candidateProfileInfo.candidatePortfolios[val];
  //     var updateTextProjectSummary  = (document.querySelector('.'+targetClass).innerText).replace(" .",".").trim();
  //     projectSummary.description = updateTextProjectSummary;
  //     aboutMeData.candidatePortfolios.push(projectSummary);
  //    }
  //    let onSuccess = (response) => {
  //       _this.GrowlerService.growl({
  //         type: 'success',
  //         message: 'Profile update Successfully',
  //         delay: 2000
  //       });
  //    }, 
  //    onError = (error) => {
  //      console.log(error);
  //    };

  //   _this.CandidateProfileService.updateProfile(aboutMeData, _this.profileId);
  //   _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  // }
  // skillSuggestionsForProjectExpeirence() {
  //   angular.forEach(_this.candidateProfileInfo.candidatePortfolios, function(value,key){
  //     //var els = document.querySelector('.projectDes_'+key);
  //     var els = 'projectDes_'+key;
  //      _this.skillSuggestions(value.description,els); 
  //   })
  // }

  //Create candidate profile by using upload the resume 

  isResumeFileAdded(file) {
    if (file.length > 0) {
      this.ResumeNotSelected = false;
    }
    else {
      this.ResumeNotSelected = true;
    }
  }

  uploadResumeFile(file) {
    _this.candidateResumeFile = file[0];

  }

  initialResumeUpload(file) {
    let onSuccess = (response) => {
      _this.UtilsService.notify('Resume Upload Successfully');
      _this.candidateProfileInfo = response.data;
      let profileId = _this.candidateProfileInfo.candidateProfile.candidateProfileId;
      _this.$state.go('candidateProfile.view-profile', { profileId: profileId }, { reload: true });
    },
      onError = (error) => {
        _this.UtilsService.notify('Resume Type Invalid', 'd');
      }
    _this.CandidateProfileService.initialResumeUpload(file).then(onSuccess, onError);
  }

  appendSuggestion(suggesiton) {
    _this.showSuggestions = false;
    if(_this.candidateProfileInfo.candidateProfile.aboutMe === undefined) {
      _this.candidateProfileInfo.candidateProfile.aboutMe = suggesiton;
    }
    else 
    _this.candidateProfileInfo.candidateProfile.aboutMe = _this.candidateProfileInfo.candidateProfile.aboutMe + suggesiton;
  }

  getSkillSuggestions() {
    let onSuccess = (response) => {
      console.log(response.data.suggestion);
      _this.skillSuggestionsedit = response.data.suggestion;
    },
    onError = (error) => {
      console.log(error);
    }
    _this.CandidateProfileService.skillSuggestions(_this.profileId);
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }
}

