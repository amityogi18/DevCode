var _this;
export class liveNowInterviewController {
    /** @ngInject  */
    constructor($state, $location, positionService, AuthService, GrowlerService, InterviewService, $window, LoaderService) {
        _this = this;
        _this.$window = $window;
        _this.positionService = positionService;
        _this.InterviewService = InterviewService;
        _this.AuthService = AuthService;
        _this.GrowlerService = GrowlerService;
        _this.LoaderService = LoaderService;
        _this.$location = $location;
        _this.$state = $state;
        _this.$onInit = function(){                   
            _this.positionId = _this.pid;
            _this.interviewId = "";
            _this.hasChanges = false;
            _this.isLiveNow = false;
            _this.liveNow = '';
            _this.liveNowInterview = {};
            _this.liveNowEmail = '';
            _this.selectedItem  = null;
            _this.searchText    = '';
            _this.getliveNowEmail();

            _this.liveNow = {
                content: '',
                selected: 'bottom-left',
                templateUrl: 'position/partials/model/live-now.jade',
                title: 'Invite Candidate'
            };            
        };
    }
    
    saveLiveNowInterview() {
        _this.liveNowCandidate = _this.selectedItem;
        if (
                 angular.isDefined(_this.liveNowInterview.name)
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
    
    
    getliveNowEmail(query) {
        let onSuccess = (response) => {
           return _this.liveNowEmails = response.data;
        },
        onError = (error) => {
            console.log(error);
        };
        let data = '?&search='+query;
        _this.positionService.getliveNowEmail(data);
        return _this.positionService.activePromise.then(onSuccess, onError);
    }

    setLiveNowData() {
        _this.liveNowInterview = {};
        _this.liveNowInterview.interviewTypeId = 4;
        _this.liveNowInterview.name = '';
        _this.liveNowCandidate = {};
        _this.liveNowInterview.interviewExpiryDate = new Date();
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
    
    linkLiveCandidateToInterview() {
        let onSuccess = (response) => {
            //_this.getInterviewBasedOnPositionId();
            _this.enterLiveMeeting();
        },
                onError = (error) => {
            console.log(error);
        };

        let data = {
            interviewId: _this.interviewId || 1,
            candidateIds: [_this.liveNowCandidate.id]
        };

        _this.InterviewService.linkCompanyCandidateToInterview(data);
        _this.InterviewService.activePromise.then(onSuccess, onError);
    }

    enterLiveMeeting() {
        var confId = _this.interviewCode;
        var userName = _this.AuthService.user.fullName;
        _this.$state.go('conference.host-interview', {interviewCode: confId});
//                var x = location.href;
//                var n = x.indexOf("#");
//                var res = x.slice(0, n);    
//                _this.$window.childWindow = _this.popupwindow(res+"#/host-interview/"+confId, "Live Now");                
    }

    popupwindow(url, title, width, height, left, top) {
        if (!width) {
            width = screen.width;
        }
        if (!height) {
            height = (screen.height * 90) / 100;
        }
        if (!left) {
            left = 0;
        }
        if (!top) {
            top = 0;
        }

        return _this.$window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    }

   

};
