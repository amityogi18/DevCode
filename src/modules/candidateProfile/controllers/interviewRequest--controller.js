let _this;

export class interviewRequestController {
    /** @ngInject  */
    constructor($location, $timeout, $state, $window, AuthService, interviewRequestService, NgTableParams, UtilsService, CandidateInterviewService, dataTableService) {
        _this = this;
        _this.$location = $location;
        _this.$timeout = $timeout;
        _this.$state = $state;
        _this.$window = $window;
        _this.AuthService = AuthService;
        _this.interviewRequestService = interviewRequestService;
        _this.CandidateInterviewService = CandidateInterviewService;
        _this.dataTableService = dataTableService;
        _this.UtilsService = UtilsService;
        _this.dataTableService.initTable([], {});
        _this.colNum = 6;
        _this.searchFilter = {};
        _this.interviewRequestTableParams = new NgTableParams({
            page: 1,
            count: 5,
            filter: _this.searchFilter
        },
            {
                counts: [5, 10, 20],
                getData: function (params) {
                    let filter = params.filter(),
                        sorting = params.sorting(),
                        count = params.count(),
                        page = params.page(),
                        filterFields = [],
                        sortFields = [],
                        queryString = '',
                        queryURL = '?';

                    angular.forEach(sorting, (value, key) => {
                        sortFields.push(`${key}&order=${value}`);
                    });

                    angular.forEach(filter, (value, key) => {
                        filterFields.push(`${key}=${value}`);
                    });

                    if (sortFields.length) {
                        queryString += `orderBy=${sortFields.join('&')}&`;
                    }

                    if (filterFields.length) {
                        queryString += filterFields.join('&');
                    }

                    queryURL += `${queryString}&limit=${count}&page=${page}`;

                    let onSuccess = (response) => {
                       _this.interviewRequestList = _this.getInterviewListInLocalTime(response.data.data);
                    //     if(window.mobile){
                    //         for(var i =0; i<_this.interviewRequestList.length; i++){
                    //             _this.interviewRequestList[i].interviewUrl.replace("https://stage.jottp.com/", "localhost:8000/");
                    //         }
                    // }
                        _this.interviewRequestListCount = response.data.total;
                        if (_this.interviewRequestList &&
                            _this.interviewRequestList.length > 0) {
                            params.total(_this.interviewRequestListCount);
                            if (!_this.dataTableService.totalColumn.length) {
                                _this.dataTableService.initTable(_this.cols, _this.interviewRequestTableParams);
                            }
                            return (_this.interviewRequestList);
                        }
                    },
                        onError = (error) => {
                            console.log(error);
                        };

                    _this.interviewRequestService.getAllInterviewRequest(queryURL);
                    return _this.interviewRequestService.activePromise.then(onSuccess, onError);
                }
            });

        _this.toggle = function () {
            _this.dataTableService.setColumn(-1);
            _this.dataTableService.toggle(_this.cols, event.target.value);
        };
    }

    launchUrlMobile(url){
        var temp = url.split("/") 
        _this.$state.go('app.schedule-interview',{interviewId: temp[temp.length-1]});
    }
    startInterview(interview) {
        let output = _this.checkValidDateAndTimeForMeeting(interview);
        if (output.isValidTime) {
            //_this.updateCandidateInterviewStatus(interview.interviewId);
            if (interview.interviewTypeId != 3) {
                _this.UtilsService.notify(output.message);
            }
            _this.$timeout(function () {
                let domainUrl = _this.$location.$$host == 'localhost' ? "/#/" : "/";
                let finalUrl = interview.interviewTypeId == 4 ? domainUrl + "candidate-interview/" + interview.interviewCode : domainUrl + "ci/interview/" + interview.interviewCode;
                if(window.mobile){
                    _this.$state.go('ci.interview', {'interviewCode': interview.interviewCode});
                }
                else{
                    _this.$window.childWindow = _this.popupwindow(_this.$window.location.origin + finalUrl, "Interview");
                }

           }, 500);
           
        }
        else if(interview.interviewTypeId == 1){
            if(window.mobile){
                _this.$state.go('app.schedule-interview', {interviewId: interview.interviewId});
            }               
        }
         else {
            _this.UtilsService.notify(output.message);
        }
    }

    popupwindow(url, title, width, height, left, top) {
        if (!width) { width = screen.width; }
        if (!height) { height = (screen.height * 90) / 100; }
        if (!left) { left = 0; }
        if (!top) { top = 0; }
        return _this.$window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    }

    checkValidDateAndTimeForMeeting(interview) {
        let returnValue = { isValidTime: true, message: "" }
        if (interview.interviewTypeId == 4 || interview.interviewTypeId == 1) {
            let interviewStartDateTime = moment(interview.localStartDateTime);
            let interviewEndDateTime = moment(interview.localEndDateTime);
            let currentDate = moment();
            if (interview.candidateInterviewStatus === 11) {
                returnValue.isValidTime = false;
                if (interview.interviewTypeId == 4) {
                    returnValue.message = "Meeting already completed at " + interviewStartDateTime.format('MMM-DD-YYYY hh:mm A');
                } else {
                    returnValue.message = "Meeting already completed at " + interviewEndDateTime.format('MMM-DD-YYYY hh:mm A');
                }
            }
            else if (interviewStartDateTime >= currentDate) {
                returnValue.isValidTime = false;
                returnValue.message = "Meeting has still not started, Please start meeting at " + interviewStartDateTime.format('MMM-DD-YYYY HH:mm');
            }
            else if (interview.interviewTypeId == 1 && interviewEndDateTime <= currentDate) {
                returnValue.isValidTime = false;
                returnValue.message = "Meeting has ended at " + interviewEndDateTime.format('MMM-DD-YYYY hh:mm A');
            }
            else {
                returnValue.isValidTime = true;
                returnValue.message = "You are about to join the meeting in a moment.";
            }
            return returnValue;
        } else {
            return returnValue;
        }
    }

    getInterviewListInLocalTime(interviewList) {
        if (interviewList && interviewList.length > 0) {
            for (let i = 0; interviewList.length > i; i++) {
                if (interviewList[i].interviewTypeId == 1 && !interviewList[i].isSlotBooked) {
                    interviewList[i].interviewFromDate == "--";
                    interviewList[i].interviewToDate == "--";
                } else {
                    // Ondemand expiry date
                    if (interviewList[i].interviewTypeId === 3) {
                        interviewList[i].interviewExpiryDate = _this.UtilsService.getLocalTimeFromGMT(interviewList[i].interviewExpiryDate, 24);
                    }

                    // Slot start date time
                    let interviewSlotStartDate = interviewList[i].interviewFromDate;
                    let interviewSlotStartTime = interviewList[i].interviewFromTime;
                    let localStartDateTime = interviewSlotStartDate + " " + interviewSlotStartTime;

                    // Slot end date time
                    let interviewSlotEndDate = interviewList[i].interviewFromDate;
                    let interviewSlotEndTime = (interviewList[i].interviewToTime == "") ? "00:00:00" : interviewList[i].interviewToTime;
                    let localEndDateTime = interviewSlotEndDate + " " + interviewSlotEndTime;
                    interviewList[i].localEndDateTime = _this.UtilsService.getLocalTimeFromGMT(localEndDateTime, 12);

                    let slotStartTime = _this.UtilsService.getLocalTimeFromGMT(localStartDateTime, "H");
                    let slotEndTime = _this.UtilsService.getLocalTimeFromGMT(localEndDateTime, "H");
                    interviewList[i].liveSlot = "Slot : " + slotStartTime + " to " + slotEndTime;
                    interviewList[i].liveNowSlot = slotStartTime;

                    interviewList[i].interviewFromDate = _this.UtilsService.getLocalTimeFromGMT(localStartDateTime, 24);
                    interviewList[i].localStartDateTime = _this.UtilsService.getLocalTimeFromGMT(localStartDateTime, 12);
                    if (interviewList[i].interviewToDate !== "" && interviewList[i].interviewToDate !== "") {
                        let liveDateTime = interviewList[i].interviewToDate + " " + interviewList[i].interviewToTime;
                        interviewList[i].interviewToDate = _this.UtilsService.getLocalTimeFromGMT(liveDateTime, 24);
                    }
                }
            }
        }
        return interviewList;
    }

    updateCandidateInterviewStatus(interviewId) {
        let onSuccess = (response) => {
            console.log(response);
        },
            onError = (error) => {
                console.log(error);
            },
            statusData = { statusId: 10, interviewId: interviewId };
        _this.CandidateInterviewService.updateCandidateInterviewStatus(statusData);
        _this.CandidateInterviewService.activePromise.then(onSuccess, onError);
    }
}

