var _this;
export class addPositionController {
    /** @ngInject  */
    constructor($state, $scope, $location, $stateParams, $rootScope, $timeout, locationService, positionService, AuthService, GrowlerService, InterviewService, $window, LoaderService, $element) {
        _this = this;
        _this.$rootScope = $rootScope;
        _this.$scope = $scope;
        _this.$window = $window;
        _this.locationService = locationService;
        _this.positionService = positionService;
        _this.InterviewService = InterviewService;
        _this.AuthService = AuthService;
        _this.GrowlerService = GrowlerService;
        _this.LoaderService = LoaderService;
        _this.$timeout = $timeout;
        _this.$location = $location;
        _this.$state = $state;
        _this.$stateParams = $stateParams;
        _this.initializeParams();
        _this.currentNavItem = {
            "current": "position",
            "prev": 'app.create-position({positionId: ' + _this.$stateParams.positionId + '})',
            "next": 'app.application({positionId: ' + _this.$stateParams.positionId + '})'
        };
        _this.models = {};
        _this.searchDepartment;
        _this.searchCurrency;
        _this.showPositionCount = false;
        _this.selectedLocation = "";
        _this.positionShareStatusPrivate = 25;
        _this.positionShareStatusPublic = 24;
        _this.selectedLocationDetail = {};
        _this.employmentTypeList = [
            { id: 1, name: 'Full Time' },
            { id: 2, name: 'Part Time' },
            { id: 3, name: 'Contract' }
        ];
        _this.salaryList = [
            { id: 1, name: '0 To 300000' },
            { id: 2, name: '300000 To 500000' },
            { id: 3, name: '500000 To 700000' },
            { id: 4, name: '700000 To 1000000' },
            { id: 5, name: 'above 1000000' },
            { id: 6, name: 'Not Disclosed' }
        ];
        _this.currencyList = [
            { id: 1, name: 'INR' },
            { id: 2, name: 'USD' }
        ];        

        _this.automationOption = [
            {
                id: 1,
                name: "Ondemand Interview",
                type: "Ondemand"
            },
            {
                id: 2,
                name: "Live Interview",
                type: "Live"
            }
        ];

        _this.onLoad();
        _this.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        _this.dateformat = 'MM-dd-yyyy';
        _this.altInputFormats = ['M!/d!/yyyy'];

        $(document).click(function (e) {
            var target = $(e.target);
            if (e.target.id === 'skill') {
                $("#skillContent").show();
            }
            if (e.target.id !== 'skill') {
                if (target.parents("div#skillContent").length) {
                    return false;
                } else {
                    $("#skillContent").hide();
                }
            }
            //$(this).next().toggleClass('close');   
        });
        //    _this.$rootScope.$on("$locationChangeStart", function(event) {
        //      if (!confirm('You have unsaved changes, go back?'))
        //        event.preventDefault();
        //    });
        _this.$rootScope.$on("unauthStateChange", function (event, data) {
            console.log('prevent from add controller called');
            if (data === 'app.create-position') {
                _this.currentNavItem.current = 'position';
            }
            _this.GrowlerService.growl({
                type: 'warning',
                message: "You will be moved to the next step, once the position data is filled and saved",
                delay: 2000
            });
        });

        _this.$scope.$on("saveData", function (event, data) {
            console.log('is changed', _this.addPositionForm.$dirty);
            if (_this.addPositionForm.$dirty) {
                if (data === 'app.create-position') {
                    _this.isEditMode = false;
                    _this.savePosition('SAVE');
                }
                else if (data === 'app.update-position') {
                    _this.isEditMode = true;
                    _this.savePosition('SAVE');
                }
            }

        });

    }
    clearSearchDepartment() {
        _this.searchDepartment = '';
    }
    clearSearchCurrency() {
        _this.searchCurrency = '';
    }
    clearSearchState() {
        _this.searchState = '';
    }
    clearSearchCity() {
        _this.searchCity = '';
    }
    clearPrimarySkill() {
        _this.searchPrimarySkill = '';
    }
    clearSecondarySkill() {
        _this.searchSecondarySkill = '';
    }
    clearTertiarySkill() {
        _this.searchTertiarySkill = '';
    }

    onLoad() {
        let url = _this.$location.path();
        if (url === "/position/add/new") {
            _this.isEditMode = false;
            _this.position.recruiterId = _this.AuthService.user.userId;
            _this.positionId = 'new';
            _this.showPositionCount = false;
        } else {
            _this.isEditMode = true;
            _this.showPositionCount = true;
            _this.LoaderService.show();
            _this.positionId = _this.$stateParams.positionId || 1;
            _this.fetchPositionDetails(_this.positionId);
            _this.$timeout(function () {
                _this.LoaderService.hide();
            }, 2000);
            _this.fetchPositionCount(_this.positionId);
        }

    }

    saveData(mode) {
        _this.savePosition(mode);
    }

    interviewUpdated(value) {
        _this.hasChanges = true;
    }

    openTextBox() {
        this.showSkillCollapse = !_this.showSkillCollapse;
    }

    initializeParams() {
        _this.position = {
            isResumeParse : false,
            defaultInterviewAllowed : true,
            defaultInterviewSequence : "Ondemand",
            primarySkillsetId: '',
            tertiarySkillsId: '',
            secondarySkillsId: '',
            jobShareStatus: _this.positionShareStatusPrivate
        };

        _this.position.additionalOptions = {
            "address": null,
            "experienceFrom": null,
            "experienceTo": null,
            "otherSkills": null,
            "description": null,
            "positionExpiryDate": null
        };

        _this.position.insightCriteria = {
            "criteriaType": "INSIGHT",
            "criterias": [{ "criteria": "", "isMandatory": 0, "criteriaId": null },
            { "criteria": "", "isMandatory": 0, "criteriaId": null },
            { "criteria": "", "isMandatory": 0, "criteriaId": null },
            { "criteria": "", "isMandatory": 0, "criteriaId": null }]
        };

        _this.position.advanceCriteria = {
            "criteriaType": "ADVANCE",
            "criterias": [{ "criteria": "", "isMandatory": 0, "criteriaId": null },
            { "criteria": "", "isMandatory": 0, "criteriaId": null },
            { "criteria": "", "isMandatory": 0, "criteriaId": null }]
        };

        _this.customOptions = {
            custom1: { id: '', value: '' },
            custom2: { id: '', value: '' },
            custom3: { id: '', value: '' },
            custom4: { id: '', value: '' },
            custom5: { id: '', value: '' }
        };

        _this.customFieldIsShown = {
            custom1: true,
            custom2: false,
            custom3: false,
            custom4: false,
            custom5: false
        };

        var minDate = new Date();
        _this.minDate = minDate.toISOString();
        _this.minTime = new Date();
        _this.options = '';
        _this.noOfCustomFields = 1;
        _this.showAddMore = true;
        _this.showRemoveField = false;
        _this.departmentList = [];
        _this.skillsetList = [];
        //_this.countryList = [];
        //_this.stateList = [];
        //_this.cityList = [];
        _this.recruiters = [];
        _this.primarySkill = {};
        _this.primarySkill.skillsetName = "Select Skills";
        _this.secondarySkill = {};
        _this.tertiarySkill = {};
        _this.secondarySkill.skillsetName = '';
        _this.tertiarySkill.skillsetName = '';
        //_this.isStateDisabled = true;
        // _this.isCityDisabled = true;
        _this.isEditMode = false;
        _this.positionId = "";
        _this.showSkillCollapse = false;
        _this.getDepartments();
        //_this.getCountryList();
        _this.getRecruiters();
        _this.hasChanges = false;
        _this.fetchRecommendations = false;
        _this.geoAddress = {};
    }

    getDepartments() {
        let onSuccess = (response) => {
            // _this.departmentList = response.data;
            _this.departmentList = _.filter(response.data.data, function (item) {
                return item.status === "ACTIVE";
            });
        },
            onError = (error) => {
                console.log(error);
            };
        _this.positionService.getDepartments();
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    getSkillSet(departmentId, type) {
        let onSuccess = (response) => {
            _this.skillsetList = response.data;
            if (type === 1) {
                _this.position.primarySkillsetId = '';
                _this.position.tertiarySkillsId = '';
                _this.position.secondarySkillsId = '';

                _this.primarySkill.skillsetName = "Select Skills";
                _this.secondarySkill.skillsetName = '';
                _this.tertiarySkill.skillsetName = '';
            } else if (_this.isEditMode) {
                if (_this.position && _this.position.primarySkillsetId) {
                    _this.primarySkill = _.find(_this.skillsetList, function (skill) {
                        return skill.id == _this.position.primarySkillsetId;
                    });
                }
                if (_this.position && _this.position.secondarySkillsId) {
                    _this.secondarySkill = _.find(_this.skillsetList, function (skill) {
                        return skill.id == _this.position.secondarySkillsId;
                    });
                }
                if (_this.position && _this.position.tertiarySkillsId) {
                    _this.tertiarySkill = _.find(_this.skillsetList, function (skill) {
                        return skill.id == _this.position.tertiarySkillsId;
                    });
                }
            }

        },
            onError = (error) => {
                console.log(error);
            };
        _this.positionService.getSkills(departmentId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    getRecruiters() {
        let onSuccess = (response) => {
            if (response.data && response.data.successMessage) {
                _this.recruiters = [];
            } else {
                _this.recruiters = response.data;
            }
        },
            onError = (error) => {
                console.log(error);
            };
        _this.positionService.getRecruiters();
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    toggleCriteriaMandatory(type, index) {
        if (type === 'INSIGHT') {
            _this.position.insightCriteria.criterias[index].isMandatory ? (_this.position.insightCriteria.criterias[index].isMandatory = 0) : (_this.position.insightCriteria.criterias[index].isMandatory = 1);
        } else if (type === 'ADVANCE') {
            _this.position.advanceCriteria.criterias[index].isMandatory ? (_this.position.advanceCriteria.criterias[index].isMandatory = 0) : (_this.position.advanceCriteria.criterias[index].isMandatory = 1);
        }
    }

    setCustomOptionValue() {
        _this.position.additionalOptions.address = _this.geoAddress.name;
        if (_this.position
            && _this.position.additionalOptions
            && _this.position.additionalOptions.customOptions
            && _this.position.additionalOptions.customOptions.length > 0) {
            for (var i = 0; i < _this.position.additionalOptions.customOptions.length; i++) {
                if (i === 0) {
                    _this.customOptions.custom1.value = _this.position.additionalOptions.customOptions[i].customOption;
                    _this.customOptions.custom1.id = _this.position.additionalOptions.customOptions[i].optionId;
                    if (_this.position.additionalOptions.customOptions[i].customOption !== ""
                        && _this.position.additionalOptions.customOptions[i].customOption !== null) {
                        _this.customFieldIsShown.custom1 = true;
                    }
                }
                if (i === 1) {
                    _this.customOptions.custom2.value = _this.position.additionalOptions.customOptions[i].customOption;
                    _this.customOptions.custom2.id = _this.position.additionalOptions.customOptions[i].optionId;
                    if (_this.position.additionalOptions.customOptions[i].customOption !== ""
                        && _this.position.additionalOptions.customOptions[i].customOption !== null) {
                        _this.customFieldIsShown.custom2 = true;
                    }
                }
                if (i === 2) {
                    _this.customOptions.custom3.value = _this.position.additionalOptions.customOptions[i].customOption;
                    _this.customOptions.custom3.id = _this.position.additionalOptions.customOptions[i].optionId;
                    if (_this.position.additionalOptions.customOptions[i].customOption !== ""
                        && _this.position.additionalOptions.customOptions[i].customOption !== null) {
                        _this.customFieldIsShown.custom3 = true;
                    }
                }
                if (i === 3) {
                    _this.customOptions.custom4.value = _this.position.additionalOptions.customOptions[i].customOption;
                    _this.customOptions.custom4.id = _this.position.additionalOptions.customOptions[i].optionId;
                    if (_this.position.additionalOptions.customOptions[i].customOption !== ""
                        && _this.position.additionalOptions.customOptions[i].customOption !== null) {
                        _this.customFieldIsShown.custom4 = true;
                    }
                }
                if (i === 4) {
                    _this.customOptions.custom5.value = _this.position.additionalOptions.customOptions[i].customOption;
                    _this.customOptions.custom5.id = _this.position.additionalOptions.customOptions[i].optionId;
                    if (_this.position.additionalOptions.customOptions[i].customOption !== ""
                        && _this.position.additionalOptions.customOptions[i].customOption !== null) {
                        _this.customFieldIsShown.custom5 = true;
                    }
                }
            }
        }
    }

    fetchPositionDetails(positionId) {
        let onSuccess = (response) => {
            _this.position = response.data || {};
            _this.geoAddress.name = _this.position.additionalOptions.address;
            _this.addressData(_this.position.additionalOptions.address);
            _this.models['Ondemand']  = _this.position.isDefaultOndemand;
            _this.models['Live']  = _this.position.isDefaultLive;
            _this.position.isResumeParse = response.data.isResumeParse;
            
            if(_this.position.isDefaultLive){
                _this.moveUp(1); 
            }

            if(_this.position.isDefaultOndemand){ 
                _this.moveUp(0);
            }
            
            if (_this.position && _this.position.additionalOptions) {
                if (_this.position.additionalOptions.address !== ""
                    && _this.position.additionalOptions.address !== null) {
                    //_this.getStateList(_this.position.additionalOptions.address);
                }
                if (_this.position.additionalOptions.positionExpiryDate !== ""
                    && _this.position.additionalOptions.positionExpiryDate !== null) {
                    let positionExpiryDate = new Date(moment.utc(_this.position.additionalOptions.positionExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                    _this.position.additionalOptions.positionExpiryDate = positionExpiryDate;//moment(positionExpiryDate).format('MM-DD-YYYY'); 

                }
            }

            _this.setCustomOptionValue();
            _this.getSkillSet(_this.position.departmentId);
            _this.selectExperience(_this.position.additionalOptions.experienceFrom)
        },
            onError = (error) => {
                console.log(error);
            };
        _this.positionService.getPositionDetails(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    };

    fetchPositionCount(positionId) {
        _this.PositionCount = {};
        let onSuccess = (response) => {
            _this.PositionCount = response.data;
        },
            onError = (error) => {
                console.log(error);
            };
        _this.positionService.getPositionCount(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    };

    addSkillSet(skill) {
        var regex = new RegExp(',', 'g');
        skill.skillsetName = skill.skillsetName.replace(regex, '');
        _this.skillsetList.push(skill);
    };

    removeSkillset(value) {
        _.remove(_this.skillsetList, function (e) {
            return e.id === value;
        });
    };

    setPrimarySkill(value, type, id) {
        _this.removeSkillset(id);
        let data = {
            id: id,
            skillsetName: value
        };
        if (type === '1') {
            if (_this.primarySkill.skillsetName !== '' && _this.primarySkill.skillsetName !== 'Select Skills') {
                _this.addSkillSet(_this.primarySkill);
            }
            _this.primarySkill = data;

        }
        if (type === '2') {
            if (_this.secondarySkill.skillsetName !== '') {
                _this.addSkillSet(_this.secondarySkill);
            }
            _this.secondarySkill = data;
        }
        if (type === '3') {
            if (_this.tertiarySkill.skillsetName !== '') {
                _this.addSkillSet(_this.tertiarySkill);
            }
            _this.tertiarySkill = data;
        }

        if (!_this.isEditMode) {
            _this.fetchRecommendedQs();
        }
    };

    savePosition(mode) {
        _this.position.additionalOptions.address = _this.geoAddress.name;
        _this.position.additionalOptions.customOptions = [];
        _this.position.insightCriteria.criteriaType = "INSIGHT";
        _this.position.advanceCriteria.criteriaType ="ADVANCE";       

        if (!_this.isAutomationCheckedAll) {
            _this.position.isDefaultOndemand = _this.models['Ondemand'] || false; 
            _this.position.isDefaultLive = _this.models['Live'] || false; 
        }else{
             _this.position.isDefaultOndemand =  _this.position.isDefaultLive = _this.isAutomationCheckedAll;
        }

        if (_this.position.isDefaultLive && _this.position.isDefaultOndemand) {
            _this.position.defaultInterviewSequence = _this.automationOption[0].type;
        } else if (!_this.position.isDefaultLive && !_this.position.isDefaultOndemand) {
            _this.position.defaultInterviewSequence = "";
        } else if (_this.position.isDefaultLive && !_this.position.isDefaultOndemand) {
            _this.position.defaultInterviewSequence = "Live";
        } else if (!_this.position.isDefaultLive && _this.position.isDefaultOndemand) {
            _this.position.defaultInterviewSequence = "Ondemand";
        }



        for (var key in _this.customOptions) {
            _this.position.additionalOptions.customOptions.push({
                customOption: _this.customOptions[key].value,
                optionId: _this.customOptions[key].id
            });
        }

        if (_this.checkRequiredFields()) {
            _this.LoaderService.show();           
            let expiryDate = "";
            if(angular.isDefined(_this.position.additionalOptions.positionExpiryDate) && _this.position.additionalOptions.positionExpiryDate !== ""){
                expiryDate = _this.position.additionalOptions.positionExpiryDate.setHours(23, 59, 59, 999);
                expiryDate = new Date(moment.utc(expiryDate).format('YYYY-MM-DD HH:mm:ssZ'));
            }
            _this.position.additionalOptions.positionExpiryDate = expiryDate;
            if (_this.isEditMode || (_this.positionId !== 'new' && _this.positionId !== '' && _this.positionId !== null)) {
                _this.position.statusId = _this.position.statusId;

                if (_this.geoAddress.name === undefined) {
                    _this.position.additionalOptions.address = _this.geoAddress;
                } else {
                    _this.position.additionalOptions.address = _this.geoAddress.name;
                }
                _this.positionService.updatePositionDetails(_this.positionId, _this.position);
                _this.positionService.activePromise.then((response) => {
                    _this.hasChanges = false;
                    if (mode === 'ACTIVATE') {
                        _this.activatePosition();
                    }
                    if (mode !== 'ACTIVATE') {

                        _this.LoaderService.hide();
                        _this.GrowlerService.growl({
                            type: 'success',
                            message: "Data Saved Successfully",
                            delay: 2000
                        });

                    }
                }, (error) => {
                    console.log(error);
                    _this.LoaderService.hide();
                });
            } else {
                _this.position.statusId = 2;
                _this.positionService.saveNewPosition(_this.position);
                _this.positionService.activePromise.then((response) => {
                    angular.element('html, body').scrollTop(0);
                    _this.hasChanges = false;
                    _this.positionId = parseInt(response.data.positionId);
                    if (mode === 'ACTIVATE') {
                        _this.activatePosition();
                    }
                    if (mode !== 'ACTIVATE') {
                        _this.$timeout(function () {
                            _this.LoaderService.hide();
                            _this.$state.go('app.application', { positionId: _this.positionId });

                        }, 800);
                        _this.GrowlerService.growl({
                            type: 'success',
                            message: "Data Saved Successfully",
                            delay: 2000
                        });

                    }
                }, (error) => {
                    _this.positionId = '';
                    _this.LoaderService.hide();
                    console.log(error);
                });
            }
        } else {
            angular.element('html, body').scrollTop(0);
            let msg = "Please fill the required fields";
            let positionExpiryDate = new Date(moment.utc(_this.position.additionalOptions.positionExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
            if (positionExpiryDate < new Date()) {
                msg = "Position expiry date should not be less than current date";
            }
            _this.GrowlerService.growl({
                type: 'danger',
                message: msg,
                delay: 500
            });
        }
        $("#tabSwitchModal").modal("hide");
        $("#tabModal").modal("hide");
    }

    checkRequiredFields() {
        _this.position.additionalOptions.address = _this.geoAddress.name;
        if (_this.position
            && _this.position.code && _this.position.code !== ''
            && _this.position.departmentId && _this.position.departmentId !== ''
            && _this.position.name && _this.position.name !== ''
            && _this.position.primarySkillsetId && _this.position.primarySkillsetId !== ''
            && _this.position.additionalOptions.address && _this.position.additionalOptions.address !== ''
            && _this.position.recruiterId && _this.position.recruiterId !== ''
            && angular.isDefined(_this.position.additionalOptions.positionExpiryDate) && _this.position.additionalOptions.positionExpiryDate !== null && _this.position.additionalOptions.positionExpiryDate !== "") {

            let positionExpiryDate = new Date(moment.utc(_this.position.additionalOptions.positionExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
            if (positionExpiryDate < new Date()) {
                _this.addPositionForm.$setSubmitted();
                return false;
            }

            return true;
        } else {
            _this.addPositionForm.$setSubmitted();
            return false;
        }
    }

    addCustomField(value) {
        _this.noOfCustomFields = value + 1;
        _this.showRemoveField = true;
        switch (_this.noOfCustomFields) {
            case 2:
                _this.customFieldIsShown.custom2 = true;
                break;
            case 3:
                _this.customFieldIsShown.custom3 = true;
                break;
            case 4:
                _this.customFieldIsShown.custom4 = true;
                break;
            case 5:
                _this.customFieldIsShown.custom5 = true;
                _this.showAddMore = false;
                break;
        }
    }

    deleteCustomField(value) {
        _this.showAddMore = true;
        switch (_this.noOfCustomFields) {
            case 2:
                _this.customFieldIsShown.custom2 = false;
                _this.customOptions.custom2.value = "";
                _this.showRemoveField = false;
                break;
            case 3:
                _this.customFieldIsShown.custom3 = false;
                _this.customOptions.custom3.value = "";
                break;
            case 4:
                _this.customFieldIsShown.custom4 = false;
                _this.customOptions.custom4.value = "";
                break;
            case 5:
                _this.customFieldIsShown.custom5 = false;
                _this.customOptions.custom5.value = "";
                break;
        }
        _this.noOfCustomFields = value - 1;
    }

    setActive(id) {
        let elementArray = ['#AdditionalOption', '#InsightRating', '#AdvanceCriteria', '#InsightRating-mbl', '#AdvanceCriteria-mbl'];

        for (let i = 0; elementArray.length > i; i++) {
            let anchor = $(elementArray[i]);
            if (elementArray[i] === id) {
                if (anchor.hasClass('active')) {
                    anchor.removeClass('active');
                } else {
                    anchor.addClass('active');
                }
            } else {
                anchor.removeClass('active');
            }
        }
    }

    discard() {
        $("#cancelModal").modal("hide");
        _this.$timeout(function () {
            _this.$state.go('app.position', { isCanceled: true });
        }, 500);

    }

    activatePosition() {
        let onSuccess = (response) => {
            _this.$timeout(function () {

                _this.LoaderService.hide();
                //_this.$state.go('app.view-position', {positionId: _this.positionId});
                _this.$state.go('app.application', { positionId: _this.positionId });

            }, 800);
            _this.GrowlerService.growl({
                type: 'success',
                message: "Position Activated Successfully",
                delay: 2000
            });
        },
            onError = (error) => {
                _this.LoaderService.hide();
                console.log(error);
            };
        _this.positionService.activatePosition(_this.positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    fetchRecommendedQs() {
        _this.fetchRecommendations = !_this.fetchRecommendations;
    }

    markPosition(status) {
        let onSuccess = (response) => {

            if (status === 24) {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Position Shared Publicly",
                    delay: 400
                });
            } else {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Position Shared Private",
                    delay: 400
                });

            }
        },
            onError = (error) => {
                console.log(error);
            };
        let data = {
            status: status,
            positionIds: [_this.position.id]
        };

        _this.InterviewService.markPositionPublic(data);
        _this.InterviewService.activePromise.then(onSuccess, onError);
    };

    setAddressValue(addressData) {
        _this.addressData = addressData;
    };

    selectExperience(experienceFrom) {
        _this.toExperience = [];
        var exp = Number(experienceFrom);
        let tempExp = [];
        for (var i = 1; i <= 10; i++) {
            tempExp.push(exp + i);
        }
        _this.toExperience = tempExp;
    }

    moveUp(index) {
        if (index <= 0 || index >= _this.automationOption.length)
            return;
        var temp = _this.automationOption[index];
        _this.automationOption[index] = _this.automationOption[index - 1];
        _this.automationOption[index - 1] = temp;
    }

    moveDown(index) {
        if (index < 0 || index >= (_this.automationOption.length - 1))
            return;
        var temp = _this.automationOption[index];
        _this.automationOption[index] = _this.automationOption[index + 1];
        _this.automationOption[index + 1] = temp;
    }

    setAutomationChecked() {
        _this.position.isDefaultOndemand = _this.isAutomationCheckedAll;
        _this.position.isDefaultLive = _this.isAutomationCheckedAll;
        _this.position.isResumeParse = _this.isAutomationCheckedAll;
        _this.models['Live'] = _this.isAutomationCheckedAll;
        _this.models['Ondemand'] = _this.isAutomationCheckedAll;
        if (_this.isAutomationCheckedAll) {
            _this.position.defaultInterviewSequence = _this.automationOption[0].type;
        }
    }

    checkIfAllChecked() {
        let isResumeChecked = _this.position.isResumeParse;
        let isLiveChecked = _this.models['Live'];
        let isOndemandChecked = _this.models['Ondemand'];

        if (isOndemandChecked && isLiveChecked && isResumeChecked) {
            _this.isAutomationCheckedAll = true;
            return false;
        } 
        else if (!isOndemandChecked || !isLiveChecked || !isResumeChecked) {
            _this.isAutomationCheckedAll = false;
            return false;
        }

    }
};
