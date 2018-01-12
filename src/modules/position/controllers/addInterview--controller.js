var _this;
export class addInterviewController {
    /** @ngInject  */
    constructor($state, $scope, $location, $stateParams, $rootScope, $timeout, locationService, positionService, AuthService, GrowlerService, InterviewService, $window, LoaderService) {
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
           "current" : "interview",
           "prev":'app.applied({positionId: '+_this.$stateParams.positionId+'})',
           "next":'app.hired({positionId: '+_this.$stateParams.positionId+'})'
         };
        _this.onLoad();
        _this.skillset = [];
        _this.fetchSkill();
        _this.showPositionCount = true;
        _this.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };        
        _this.dateformat = 'MM-dd-yyyy';
        _this.altInputFormats = ['M!/d!/yyyy'];
        _this.$scope.$on("saveData", function(event, data){
            if(data ==='app.interview') {
               _this.saveInterview('SAVE');   
            }    
        });

    }

    onLoad() {        
        _this.LoaderService.show();
        _this.positionId = _this.$stateParams.positionId;
        _this.getInterviewBasedOnPositionId(_this.positionId);
        _this.$timeout(function () {
            _this.LoaderService.hide();
        }, 2000);
        _this.fetchPositionCount(_this.positionId);
    }

    saveData(mode){
        _this.saveInterview(mode);
    }
    
    fetchPositionCount(positionId) {
        _this.PositionCount = {};
        let onSuccess = (response) => {
            console.log('counts', response.data);
            _this.PositionCount = response.data;
        },
        onError = (error) => {
            console.log(error);
        };
        _this.positionService.getPositionCount(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    };
    
    interviewUpdated(value) {
        _this.hasChanges = true;
    }

    initializeParams() {
        var minDate = new Date();
        _this.minDate = minDate.toISOString();
        _this.minTime = new Date();
        _this.interviewAccordians = [];
        _this.newInterview = {};
        _this.interviewSection = false;
        _this.accordianSection = false;
        _this.isInterviewsLimitExceeded = false;
        _this.isInterviewSectionShow = false;
        _this.isAccordianSectionShow = false;
        _this.isShowAddNewInterviewBtn = false;
        _this.selectedInterviewTypeId = 0;
        _this.isEditMode = false;
        _this.positionId = "";
        _this.interviewId = "";
        _this.saveInterviewData = false;
        _this.doReset = false;
        _this.doGet = false;
        _this.hasChanges = false;
        _this.isLiveNow = false;
        _this.liveNow = '';
        _this.interview = {};
        _this.tempInterview = {};
        _this.liveNowInterview = {};
        _this.liveNowEmail = '';
        _this.fetchRecommendations = false;
        _this.socialMediaPortal = [];
        _this.socialMedia();
        _this.interviewsTypeId = [
            {id: 1, name: 'Live'},
            {id: 2, name: 'On Site'},
            {id: 3, name: 'On Demand'}
        ];

    }

    addNewInterview() {
        _this.isInterviewsLimitExceeded = _this.interviewAccordians.length >= 5 ? true : false;
        _this.isShowAddNewInterviewBtn = (_this.interviewAccordians.length + 1) >= 5 ? true : false;
        if (!_this.isInterviewsLimitExceeded)
        {
            _this.doReset = !_this.doReset;

            let interviewObj = {
                "id": "",
                "interviewTypeId": "",
                "name": 'Interview ' + (_this.interviewAccordians.length + 1),
                "interviewExpiryDate": "",
                "enableShareLink": "",
                "fromDate": "",
                "toDate": "",
                "fromTime": "",
                "toTime": ""
            };
            _this.interview = interviewObj;
            _this.interviewAccordians.push(interviewObj);

            _this.$timeout(function () {
                $(".interview-tabs .nav-tabs li:eq(" + (_this.interviewAccordians.length - 1) + ") a").tab('show');
            }, 100);
            _this.interviewId = "";
            _this.selectedInterviewTypeId = '';
        }

        _this.isAccordianSectionShow = false;
        _this.interviewTypeId = 0;
    }

    checkRequiredFields() {
        if (_this.position
                && _this.position.code && _this.position.code !== ''
                && _this.position.departmentId && _this.position.departmentId !== ''
                && _this.position.name && _this.position.name !== ''
                && _this.position.primarySkillsetId && _this.position.primarySkillsetId !== ''
                && _this.position.recruiterId && _this.position.recruiterId !== ''
                && _this.position.additionalOptions.positionExpiryDate !== null) {

            let positionExpiryDate = new Date(moment.utc(_this.position.additionalOptions.positionExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
            if (positionExpiryDate < new Date()) {
                _this.addPositionForm.$setSubmitted();
                _this.interviewForm.$setSubmitted();
                return false;
            }

            return true;
        } else
        {
            _this.addPositionForm.$setSubmitted();
            _this.interviewForm.$setSubmitted();
            return false;
        }
    }

    saveInterview(mode) {
        _this.selectedInterviewTypeIds = _this.interview.interviewTypeId;
        _this.isAccordianSectionShow = true;
        let onSuccess = (response) => {

            if (response && response.data && response.data.interviewId) {
                _this.interviewId = response.data.interviewId;
                _this.interviewCode = response.data.interviewCode;
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Data Saved Successfully",
                    delay: 2000
                });
            }
            if (_this.interview && _this.interview.interviewTypeId
                    && _this.interview.interviewTypeId !== 4) {
                _this.saveInterviewData = !_this.saveInterviewData;
                _this.selectedInterviewTypeId = _this.selectedInterviewTypeIds;
                _this.getInterviewBasedOnPositionId('switch', _this.interviewId);
            }
            
            
            if (mode === 'SWITCH') {
                _this.resetAccordian(_this.tempInterview);
            }else if (mode === 'ACTIVATE') {
                _this.activatePosition();
            }else
            {
                _this.$timeout(function () {
                    _this.hasChanges = false;
                    //_this.doGet = !_this.doGet; 
                    _this.fetchPositionCount(_this.positionId);
                }, 1000);                
            }
           
                   
            
        },
                onError = (response) => {
            console.log(response);
        };
        //time should be 23.59.00
        if(_this.hasChanges){
            let expiryDate = "";
            if(angular.isDefined(_this.interview.interviewExpiryDate) && _this.interview.interviewExpiryDate !== ""){
                expiryDate = _this.interview.interviewExpiryDate.setHours(23,59,59,999);
                expiryDate = new Date(moment.utc(expiryDate).format('YYYY-MM-DD HH:mm:ssZ'));
            }

            if (_this.isEditMode && (_this.interviewId === '' || _this.interviewId === null)) {

                let interviewData = {
                    "interviewTypeId": parseInt(_this.interview.interviewTypeId),
                    "name": _this.interview.name,
                    "interviewExpiryDate": expiryDate,
                    "enableShareLink": _this.interview.enableShareLink || 1,
                    "positionId": _this.positionId,
                    "companyId": _this.AuthService.user.companyId,
                    "userId": _this.AuthService.user.userId,
                    "fromDate": _this.interview.fromDate,
                    "toDate": _this.interview.toDate,
                    "fromTime": moment(_this.interview.fromTime).format('HH:mm:ss'),
                    "toTime": moment(_this.interview.toTime).format('HH:mm:ss'),
                    "createdAt": new Date()
                };
                _this.positionService.saveInterview(interviewData);
            } else if (_this.isEditMode || (_this.interviewId !== '' && _this.interviewId !== null)) {
                _this.interviewId = _this.interview.id;
                let interviewData = {
                    "interviewId": _this.interview.id,
                    "interviewTypeId": _this.interview.interviewTypeId,
                    "name": _this.interview.name,
                    "interviewExpiryDate": expiryDate,
                    "enableShareLink": _this.interview.enableShareLink || "",
                    "fromDate": _this.interview.fromDate,
                    "toDate": _this.interview.toDate,
                    "fromTime": moment(_this.interview.fromTime).format('HH:mm:ss'),
                    "toTime": moment(_this.interview.toTime).format('HH:mm:ss')
                };
                _this.positionService.updateInterview(interviewData);

            } else {
                let interviewData = {
                    "interviewTypeId": parseInt(_this.interview.interviewTypeId),
                    "name": _this.interview.name,
                    "interviewExpiryDate": expiryDate,
                    "enableShareLink": _this.interview.enableShareLink || 1,
                    "positionId": _this.positionId,
                    "companyId": _this.AuthService.user.companyId,
                    "userId": _this.AuthService.user.userId,
                    "fromDate": _this.interview.fromDate,
                    "toDate": _this.interview.toDate,
                    "fromTime": moment(_this.interview.fromTime).format('HH:mm:ss'),
                    "toTime": moment(_this.interview.toTime).format('HH:mm:ss'),
                    "createdAt": new Date()
                };
                _this.positionService.saveInterview(interviewData);
            }
            _this.positionService.activePromise.then(onSuccess, onError);
        }else
        {
            if (mode === 'ACTIVATE') {
                _this.activatePosition();
            }
        }
    }
    
    activatePosition() {
        let onSuccess = (response) => {
            _this.fetchPositionCount(_this.positionId);
            _this.$timeout(function () {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "Position Activated Successfully",
                    delay: 2000
                });
                _this.$state.go('app.view-position', {positionId: _this.positionId});
            }, 800);
        },
        onError = (error) => {
            _this.LoaderService.hide();
            console.log(error);
        };
        _this.positionService.activatePosition(_this.positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    saveLiveNowInterview() {
        if (angular.isDefined(_this.liveNowInterview)
                && angular.isDefined(_this.liveNowInterview.name)
                && _this.liveNowInterview.name !== ""
                && angular.isDefined(_this.liveNowCandidate)
                && angular.isDefined(_this.liveNowCandidate.id)
                && _this.liveNowCandidate.id !== ""
                && _this.liveNowCandidate.id !== null) {

            let interviewData = {
                "interviewTypeId": parseInt(_this.liveNowInterview.interviewTypeId),
                "name": _this.liveNowInterview.name,
                "interviewExpiryDate": _this.liveNowInterview.interviewExpiryDate,
                "enableShareLink": _this.liveNowInterview.enableShareLink || 1,
                "positionId": _this.positionId,
                "companyId": _this.AuthService.user.companyId,
                "userId": _this.AuthService.user.userId,
                "fromDate": _this.liveNowInterview.fromDate,
                "toDate": _this.liveNowInterview.toDate,
                "fromTime": moment(_this.liveNowInterview.fromTime).format('HH:mm:ss'),
                "toTime": moment(_this.liveNowInterview.toTime).format('HH:mm:ss'),
                "createdAt": new Date()
            };
            let onSuccess = (response) => {
                if (response && response.data && response.data.interviewId) {
                    _this.interviewCode = response.data.interviewCode;
                    _this.interviewId = response.data.interviewId;
                    if (_this.liveNowInterview && _this.liveNowInterview.interviewTypeId
                            && _this.liveNowInterview.interviewTypeId === 4) {
                        _this.linkLiveCandidateToInterview();
                    }

                }
            },
            onError = (response) => {
                console.log(response);
            };
            _this.positionService.saveInterview(interviewData);
            _this.positionService.activePromise.then(onSuccess, onError);
        } else
        {
            _this.GrowlerService.growl({
                type: 'danger',
                message: "Please fill the required fields",
                delay: 2000
            });
            return;
        }
    }

    cancelNewInterview() {
        _this.newInterview = {};
    }

    showAccordions() {
        _this.isAccordianSectionShow = true;
        _this.selectedInterviewTypeId = _this.interview.interviewTypeId;
        if (_this.interviewId === "") {
            _this.doReset = !_this.doReset;
        }
    }

    getInterviewBasedOnPositionId(mode, id) {
        let onSuccess = (response) => {
            _this.interviewAccordians = [];
            if (response.data && response.data.length > 0) {
                _this.isEditMode = true;
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].interviewTypeId !== 4) {
                        if (response.data[i].interviewExpiryDate && response.data[i].interviewExpiryDate !== "") {
                            response.data[i].interviewExpiryDate = new Date(moment.utc(response.data[i].interviewExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                        }
                        if (response.data[i].interviewTypeId === 2) {
                            if (response.data[i].fromDate !== "") {
                                response.data[i].fromDate = new Date(moment.utc(response.data[i].fromDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                            }
                            if (response.data[i].toDate !== "") {
                                response.data[i].toDate = new Date(moment.utc(response.data[i].toDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                            }
                            if (response.data[i].fromTime !== "") {
                                let startTime = moment(_this.minDate).format('YYYY-MM-DD') + ' ' + response.data[i].fromTime;
                                response.data[i].fromTime = new Date(startTime);
                            }
                            if (response.data[i].toTime !== "") {
                                let endTime = moment(_this.minDate).format('YYYY-MM-DD') + ' ' + response.data[i].toTime;
                                response.data[i].toTime = new Date(endTime);
                            }
                        }
                        _this.interviewAccordians.push(response.data[i]);
                    }
                    if (response.data[i].interviewTypeId === 4) {
                        _this.isLiveNow = true;
                    }
                }
            }
            //_this.interviewAccordians = response.data;
            if (mode === 'switch') {
                if (_this.interviewAccordians && _this.interviewAccordians.length > 0) {
                    for (var i = 0; i < _this.interviewAccordians.length; i++) {
                        if (_this.interviewAccordians[i].id === id) {
                            _this.interview = _this.interviewAccordians[i];
                            _this.interviewId = _this.interviewAccordians[i].id;
                            _this.$timeout(function () {
                                $(".interview-tabs .nav-tabs li:eq(" + i + ") a").tab('show');
                            }, 100);
                            break;
                        }
                    }
                }
            } else {
                if (_this.interviewAccordians.length > 0) {
                    _this.interview.interviewTypeId = _this.interviewAccordians[0].interviewTypeId;
                    _this.selectedInterviewTypeId = _this.interviewAccordians[0].interviewTypeId;
                    _this.interviewId = _this.interviewAccordians[0].id;
                    _this.interview.id = _this.interviewAccordians[0].id;
                    _this.interview.name = _this.interviewAccordians[0].name;
                    _this.interview.enableShareLink = _this.interviewAccordians[0].enableShareLink;
                    _this.interview.interviewExpiryDate = new Date(moment.utc(_this.interviewAccordians[0].interviewExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                    _this.interview.fromDate = new Date(moment.utc(_this.interviewAccordians[0].fromDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                    _this.interview.toDate = new Date(moment.utc(_this.interviewAccordians[0].toDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                    let startTime = moment(_this.minDate).format('YYYY-MM-DD') + ' ' + _this.interviewAccordians[0].fromTime;
                    let endTime = moment(_this.minDate).format('YYYY-MM-DD') + ' ' + _this.interviewAccordians[0].toTime;
                    _this.interview.fromTime = new Date(startTime);
                    _this.interview.toTime = new Date(endTime);
                    _this.interview.interviewUrl = _this.interviewAccordians[0].interviewUrl;

                    if (_this.isEditMode) {
                        _this.doGet = !_this.doGet;
                    }
                    _this.isEditMode = true;
                    _this.isAccordianSectionShow = true;
                } else if (_this.isLiveNow) {
                    _this.liveNowClicked = true;
                    _this.selectedInterviewTypeId = 4;
                    _this.interview.interviewTypeId = 4;
                    _this.interview.name = 'Live Now';
                    _this.$timeout(function () {
                        $(".interview-tabs .nav-tabs li:eq(0) a").tab('show');
                    }, 100);
                } else {
                    let interviewData = {
                        "id": "",
                        "interviewTypeId": "1",
                        "name": "Interview 1",
                        "interviewExpiryDate": "",
                        "enableShareLink": "",
                        "fromDate": "",
                        "toDate": "",
                        "fromTime": "",
                        "toTime": ""
                    };
                    _this.interviewAccordians.push(interviewData);
                    _this.selectedInterviewTypeId = 3;
                    _this.interview = {};
                    _this.interview.interviewTypeId = 3;
                    _this.interview.name = "InterviewOnDemand" + moment(_this.minDate).format('MMDDYYYY');
                    _this.interview.interviewExpiryDate = new Date(moment(_this.minDate).add(1, 'M').format('MM-DD-YYYY'));
                    _this.isAccordianSectionShow = true;
                    _this.showAccordions();
                }
                _this.$timeout(function () {
                    $('.interview-tabs .nav-tabs li:eq(0) a').tab('show');
                }, 100);
            }
            _this.isShowAddNewInterviewBtn = (_this.interviewAccordians.length + 1) >= 5 ? true : false;
        },
        onError = (response) => {
            console.log(response);

        };

        _this.positionService.getInterviewBasedOnPositionId(_this.positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    removeClass(tabArray) {
        if (tabArray && tabArray.length > 0) {
            for (var i = 0; tabArray.length - 1 > i; i++) {
                $('#' + tabArray[i].id).removeClass("active in");
                $('#li_' + tabArray[i].id).removeClass("active");
            }
            $('#li_' + tabArray[tabArray.length - 1].id).addClass("active");
            $('#btnAddNewInterview').removeClass("active");
        }
    }

    getInterviewDetails(id) {
        let onSuccess = (response) => {
            _this.interviewAccordians = {
                "interviewTypeId": response.data.interviewTypeId,
                "name": response.data.name,
                "interviewExpiryDate": response.data.interviewExpiryDate,
                "enableShareLink": response.data.enableShareLink,
                "interviewUrl": response.data.interviewUrl
            };
        },
        onError = (response) => {
            console.log(response);
        };

        let interviewId = id;
        _this.positionService.getInterviewDetails(interviewId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    getFormatedDate(date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    setInterviewTypeId(id) {
        _this.selectedInterviewTypeId = id;
    }

    resetAccordian(interview) {
        _this.interview = interview;
        _this.selectedInterviewTypeId = _this.interview.interviewTypeId;
        if ((interview.id !== _this.interviewId) && interview.id !== '') {
            _this.interviewId = interview.id;
            _this.showAccordions();
            _this.doGet = !_this.doGet;
        } else if (interview.id === '') {
            _this.interviewId = interview.id;
            _this.doReset = !_this.doReset;
        }
        _this.hasChanges = false;
    }

    discardChanges(mode) {
        if (mode === 'NEW') {
            _this.addNewInterview();
            _this.doReset = !_this.doReset;
        }
        if (mode === 'SWITCH') {
            _this.resetAccordian(_this.tempInterview);
        }

    }

    showTabSwitchModal(interview) {
        _this.tempInterview = {};
        if (_this.hasChanges) {
            $("#tabSwitchModal").modal("show");
            if (angular.isDefined(interview)) {
                _this.tempInterview = interview;
            }
        } else
        {
            _this.resetAccordian(interview);
        }
    }

    showTabNewModal() {
        if (_this.hasChanges) {
            $("#tabModal").modal("show");
        } else
        {
            _this.addNewInterview();
        }
    }

    fetchRecommendedQs() {
        _this.fetchRecommendations = !_this.fetchRecommendations;
    }
    
    socialMedia() {
        let onSuccess = (response) => {
            _this.socialMediaPortal = response.data;
        },
                onError = (error) => {
            console.log(error);
        };

        _this.InterviewService.socialMediaApp();
        _this.InterviewService.activePromise.then(onSuccess, onError);
    }
    
    fetchSkill(){
      let onSuccess = (response) => {
            _this.skillset = response.data;
          },
          onError = (error) => {
              console.log(error);
          };
                
        _this.InterviewService.skills(_this.positionId);
        _this.InterviewService.activePromise.then(onSuccess, onError);
    }
    showLiveNow() {
        _this.isLiveNow = true;
        _this.isAccordianSectionShow = true;
        _this.liveNowInterview.interviewTypeId = 4;
        _this.liveNowInterview.name = 'Live Now';
        _this.liveNowCandidate = {};
        _this.liveNowInterview.interviewExpiryDate = new Date();
        _this.selectedInterviewTypeId = 4;
    }
};
