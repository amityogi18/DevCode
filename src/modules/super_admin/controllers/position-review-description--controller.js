let _this;

export class PositionReviewDescriptionSaController {
  /** @ngInject  */
  constructor($stateParams, $state, locationService, SocialMediaService, GrowlerService, positionService) {
    _this = this;
    _this.locationService = locationService;
    _this.$stateParams = $stateParams;
    _this.$state = $state;
    _this.SocialMediaService = SocialMediaService;
    _this.positionService = positionService;
    _this.GrowlerService = GrowlerService;
    _this.jobId = _this.$stateParams.jobId;
    _this.portalId = _this.$stateParams.portalId;
    _this.getJobDescription(_this.jobId, _this.portalId);
    _this.getDepartments();
    _this.getCountryList();
    _this.departmentList = [];
    _this.skillsetList = [];
    _this.countryList = [];
    _this.stateList = [];
    _this.cityList = [];
    _this.companyDetails = {};
    _this.iscomment = {
      content: '',
      selected: 'bottom-left',
      templateUrl: 'super_admin/partials/modals/reject-comment.jade',
      title: 'Comment'
    };
  }

  goBack() {
      _this.$state.go('sa.position-review',{portalId:_this.portalId})
    }

  getCountryList() {
    let onSuccess = (response) => {
      _this.countryList = response.data;
      if (_this.JobDescription
        && _this.JobDescription.additionalOptions
        && _this.JobDescription.additionalOptions.country) {
        _this.countrySetName = _.find(_this.countryList, function (country) {
          return country.id === _this.JobDescription.additionalOptions.country;
        });
      }

    },
      onError = (error) => {
        console.log(error);
      };
    _this.locationService.getCountryList();
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getStateList(countryId) {
    let onSuccess = (response) => {
      _this.stateList = response.data;
      _this.stateSetName = _.find(_this.stateList, function (state) {
        return state.id === _this.JobDescription.additionalOptions.state;
      });
    },
      onError = (error) => {
        console.log(error);
      };
    _this.locationService.getStateList(countryId);
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getCityList(stateId) {
    let onSuccess = (response) => {
      _this.cityList = response.data;
      _this.citySetName = _.find(_this.cityList, function (city) {
        return city.id === _this.JobDescription.additionalOptions.city;
      });
    },
      onError = (error) => {
        console.log(error);
      };
    _this.locationService.getCityList(stateId);
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getDepartments() {
    let onSuccess = (response) => {
      _this.departmentList = response.data;
      if (_this.JobDescription
        && _this.JobDescription.departmentId) {
        _this.departmentNameId = _.find(_this.departmentList, function (department) {
          return department.id === _this.JobDescription.departmentId;
        });
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.positionService.getDepartments();
    _this.positionService.activePromise.then(onSuccess, onError);
  }

  getSkillSet(departmentId) {
    let onSuccess = (response) => {
      _this.skillsetList = response.data;
      _this.primarySkillName = _.find(_this.skillsetList, function (skill) {
        return skill.id === _this.JobDescription.primarySkillsetId;
      });
      _this.secondrySkillName = _.find(_this.skillsetList, function (skill) {
        return skill.id === _this.JobDescription.secondarySkillsId;
      });
      _this.tertiarySkillName = _.find(_this.skillsetList, function (skill) {
        return skill.id === _this.JobDescription.tertiarySkillsId;
      });
    },
      onError = (error) => {
        console.log(error);
      };
    _this.positionService.getSkills(departmentId);
    _this.positionService.activePromise.then(onSuccess, onError);
  }

  getJobDescription(jobId, portalId) {
    let onSuccess = (response) => {
      _this.JobDescription = response.data;
      if (_this.JobDescription.departmentId !== ""
        && _this.JobDescription.departmentId !== null) {
        _this.getDepartments();
      }
      if (_this.JobDescription.primarySkillsetId !== ""
        && _this.JobDescription.primarySkillsetId !== null) {
        _this.getSkillSet(_this.JobDescription.departmentId);
      }
      if (_this.JobDescription.additionalOptions && _this.JobDescription.additionalOptions.country !== ""
        && _this.JobDescription.additionalOptions.country !== null) {
        _this.getCountryList();
      }
      if (_this.JobDescription.additionalOptions && _this.JobDescription.additionalOptions.state !== ""
        && _this.JobDescription.additionalOptions.state !== null) {
        _this.getStateList(_this.JobDescription.additionalOptions.country);
      }
      if (_this.JobDescription.additionalOptions && _this.JobDescription.additionalOptions.city !== ""
        && _this.JobDescription.additionalOptions.city !== null) {
        _this.getCityList(_this.JobDescription.additionalOptions.state);
      }
      if (_this.JobDescription.additionalOptions.positionExpiryDate !== ""
        && _this.JobDescription.additionalOptions.positionExpiryDate !== null
        && _this.JobDescription.additionalOptions.positionExpiryDate !== "0000-00-00 00:00:00") {
        let positionExpiryDate = new Date(moment.utc(_this.JobDescription.additionalOptions.positionExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
        _this.JobDescription.additionalOptions.positionExpiryDate = positionExpiryDate;//moment(positionExpiryDate).format('MM-DD-YYYY');
      }
    },
      onError = (error) => {
        console.log(error);
      };
    _this.SocialMediaService.getJobDetailsByJobAndPortalId(jobId, portalId);
    _this.SocialMediaService.activePromise.then(onSuccess, onError);
  }

  getCompanyDetails(companyId) {    
    let onSuccess = (response) => {
      _this.companyDetails = response.data;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.SocialMediaService.getCompanyDetails(companyId);
    _this.SocialMediaService.activePromise.then(onSuccess, onError);
  }

  checkRequiredComment() {
    if (_this.comment && _this.comment !== '') {
      return true;
    }
    else {
      _this.rejectForm.$setSubmitted();
      return false;
    }
  }

  positionReview(statusId) {
    let onSuccess = (response) => {
      _this.GrowlerService.growl({ type: 'success', message: "Position Reviewed Sucessfully", delay: 1000 });
    },
      onError = (error) => {
        console.log(error);
      },
      data = {
        id: _this.jobId,
        statusId: statusId,
        comment: _this.comment,
        portalId: _this.portalId
      };
    _this.SocialMediaService.positionReview(data);
    _this.SocialMediaService.activePromise.then(onSuccess, onError);
  }


}


