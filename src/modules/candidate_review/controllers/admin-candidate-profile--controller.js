let _this;
export class adminCandidateProfileController {
    /** @ngInject  */
    constructor($state, $rootScope, NgTableParams, candidateReviewService, $sce, dataTableService, UtilsService, $stateParams, AdminPaymentPlanService, $q, $timeout, GrowlerService,$location, $window) {

        console.log('Inside candidate controller constructor');
        _this = this;
        $rootScope.setActiveLi(12);
        _this.$state = $state;
        _this.$window = $window;
        _this.$sce = $sce;
        _this.$q = $q;
        _this.$timeout = $timeout;
        _this.$stateParams = $stateParams;
        _this.$location = $location;
        _this.dataTableService = dataTableService;
        _this.UtilsService = UtilsService;
        _this.GrowlerService = GrowlerService;
        _this.dataTableService.initTable([], {});
        _this.selectedQuestionIndex = -1;
        _this.videoPath = '';
        _this.startMonth = [];
        _this.startYear = [];
        _this.endMonth = [];
        _this.endYear = [];
        _this.candidateReviewService = candidateReviewService;
        _this.AdminPaymentPlanService = AdminPaymentPlanService;
        _this.selectedCandidateData = {};
        _this.advancedFilter = {};
        _this.suggetionList = [];
        _this.isVideo = false;
        _this.showVideo = false;
        _this.profilePic = '';
        _this.statusFilter = '';
        _this.searchBtnHide = false;
        _this.shownone = false;
        _this.sortBy = '';
        _this.hideSection = false;
        _this.order = true;
        _this.searchtext = '';
        _this.fromYearErrormessage = '';
        _this.toYearErrormessage = '';
        _this.locationName = {};
        _this.searchFilter = {};
        _this.sortField = {};
        _this.pageSize = 10;
        _this.isFirstLoad = true;
        _this.searchjobText = null;
        _this.selectedJobItem = null;
        _this.JobTitleList = [];
        _this.cardDetails = [];
        _this.suggestionList = [];
        _this.selectedItem = null;
        _this.searchText = null;
        _this.candidateId = _this.$stateParams.candidateId;
        _this.isPaymentError = false;
        _this.paymentError = "";
        
        
        _this.getCandidateList = function () {
            _this.tableParams = new NgTableParams({
                page: 1,
                count: _this.pageSize,
                filter: _this.searchFilter,
                sorting: _this.sortField
            },
                {
                    counts: [],
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
                            console.log(key + '---' + value);
                            sortFields.push(`${key}&order=${value}`);
                        });
                        angular.forEach(filter, (value, key) => {
                            console.log(key + '---' + value);
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
                            _this.positionStatusCount = response.data.statusCounts;
                            if (response.data && response.data.data) {
                                //_this.candidateProfileList = response.data.data;
                                _this.candidateList = response.data.data;
                                _this.candidateCount = response.data.total;
                                if ((response.data && response.data.total === 0) || _this.candidateList.length === 0) {
                                    _this.hideSection = true;
                                } else {
                                    _this.hideSection = false;
                                }

                                if (_this.isFirstLoad) {
                                    _this.candidateList.length > 0 ? _this.selectCandidate(_this.candidateList[0].id) : null;
                                    _this.isFirstLoad = false;
                                }

                                params.total(_this.candidateCount);
                                if (!_this.dataTableService.totalColumn.length) {
                                    _this.dataTableService.initTable(_this.cols, _this.tableParams);
                                }
                                return (_this.candidateList);
                            }
                        },
                            onError = (error) => {
                                console.log(error);
                            };
                        _this.candidateReviewService.getCandidatesList(queryURL);
                        return _this.candidateReviewService.activePromise.then(onSuccess, onError);
                    }
                });
            _this.toggle = function () {
                _this.dataTableService.setColumn(-1);
                _this.dataTableService.toggle(_this.cols, event.target.value);
            };
        };
        _this.onLoad = function () {            
            let errorParam = _this.$location.$$search;
            if (angular.isDefined(_this.candidateId) && _this.candidateId !== "" && _this.candidateId !== null) {                
                if(angular.isDefined(errorParam) && angular.isDefined(errorParam.e)){
                    if(errorParam.e !== ""){
                        _this.isPaymentError = true;
                        _this.paymentError = errorParam.e;
                        _this.$timeout(function () {
                            _this.isPaymentError = false;
                            _this.paymentError = "";
                            //_this.$location.search('e', null);
                        }, 10000);
                        
                    }
                    _this.isFirstLoad = false;
                    _this.getCandidateList();
                    _this.selectCandidate(_this.candidateId);
                }else
                {
                    _this.downloadResume();
                }                
            }else
            {
                _this.getCandidateList();
            }
        };

        _this.onLoad();
    }

    clearSearchDeptTerm() {
        _this.searchJobTitles = '';
    }

    trustSrc(src) {
        return _this.$sce.trustAsResourceUrl(src);
    }

    showMoreData() {
        _this.pageSize = (_this.pageSize + 10);
        _this.getCandidateList();
    };

    filter() {
        _this.isFirstLoad = true;
        if(_this.fromExperience || _this.fromExperience === ''){
            _this.advancedFilter.fromExperience = _this.fromExperience;
        }
        if(_this.toExperience || _this.toExperience === ''){
            _this.advancedFilter.toExperience = _this.toExperience;
        }
        if (_this.jobType || _this.jobType === '') {
            _this.advancedFilter.jobType = _this.jobType;
        }
        if (_this.overallRating || _this.overallRating === '') {
            _this.advancedFilter.overallRating = _this.overallRating;
        }
        if (_this.lastUpdated || _this.lastUpdated === '') {
            _this.advancedFilter.lastUpdated = _this.lastUpdated;
        }
        if (_this.salary || _this.salary === '') {
            _this.advancedFilter.salary = _this.salary;
        }
        if (_this.distance || _this.distance === '') {
            _this.advancedFilter.distance = _this.distance;
        }
        if (_this.education || _this.education === '') {
            _this.advancedFilter.education = _this.education;
        }
        if (_this.selectedItem || _this.selectedItem === '') {
            _this.advancedFilter.search = _this.selectedItem;
        }
        if (_this.selectedJobItem || _this.selectedJobItem === '') {
            if(angular.isDefined(_this.selectedJobItem.jobTitle)){
                _this.advancedFilter.designations = _this.selectedJobItem.jobTitle;
            }else{
                _this.advancedFilter.designations = '';
            }
        }
        if (_this.locationName.name || _this.locationName.name === '') {
            _this.advancedFilter.location = _this.locationName.name;
        }
        _this.searchFilter = _this.advancedFilter;
        _this.getCandidateList();
    }

    resetSearch() {
        _this.isFirstLoad = true;
        _this.advancedFilter = {};
        _this.searchFilter = {};
        _this.locationName = {};
        _this.selectedItem = _this.selectedJobItem= _this.jobType = _this.fromExperience= _this.toExperience =_this.overallRating =_this.salary =_this.distance =_this.lastUpdated =_this.education ='';
        _this.clearData();
        _this.getCandidateList();
    }

    hideSearchBtn() {
        this.searchBtnHide = !_this.searchBtnHide;
    }

    selectCandidate(id) {
        let onSuccess = (response) => {
            angular.element('html, body').scrollTop(0);
            _this.selectedCandidateData = response.data;
            if (_this.selectedCandidateData.candidateExperiences !== '' && _this.selectedCandidateData.candidateExperiences !== null) {
                for (var i = 0; i < _this.selectedCandidateData.candidateExperiences.length; i++) {
                    let startDate = moment(_this.selectedCandidateData.candidateExperiences[i].startDate, 'MM-DD-YYYY'), 
                     sm = startDate.format('MMM'),
                     sy  = startDate.format('YYYY'),
                     endDate = moment(_this.selectedCandidateData.candidateExperiences[i].endDate, 'MM-DD-YYYY'), 
                     em = endDate.format('MMM'),
                     ey  = endDate.format('YYYY');
                    _this.selectedCandidateData.candidateExperiences[i].startDate = sm+ '(' + sy +')';
                    _this.selectedCandidateData.candidateExperiences[i].endDate = em + '(' + ey + ')';
                }
            }
            _this.profilePic = _this.selectedCandidateData.profilePicUrl;
            if (_this.selectedCandidateData.twoMinIntroVideo === '' || _this.selectedCandidateData.twoMinIntroVideo === null) {
                _this.showVideo = false;
            } else {
                _this.videoPath = response.data.twoMinIntroVideo;
                _this.showVideo = true;
                _this.videoPlay(_this.videoPath);
            }
        },
            onError = (error) => {
                _this.selectedCandidateData = {};
            };

        _this.candidateReviewService.getCandidateData(id);
        _this.candidateReviewService.activePromise.then(onSuccess, onError);

    }

    videoPlay() {
        if (_this.videoPath !== null && _this.videoPath !== "") {
            let path = _this.videoPath;
            if (path.indexOf('youtube') >= 0) {
                path = path.replace("watch?v=", "embed/");
                _this.isVideo = true;
                _this.videoPath = path;
            } else {
                _this.isVideo = false;
                _this.UtilsService.initVideoPlayer('candidateVideo', path);
            }
        }
    }

    getCardDetail() {
        let onSuccess = (response) => {
            _this.cardDetails = response.data;
        },
            onError = (error) => {
                _this.cardDetails = [];
            };

        _this.candidateReviewService.getCompanyDetails();
        _this.candidateReviewService.activePromise.then(onSuccess, onError);
    }

    goToPayment() {
        var candidateId = _this.selectedCandidateData.candidateInfo.id;       
        if (angular.isDefined(_this.cardDetails) && !_this.cardDetails.status) {
            _this.$state.go('settings.admin-payment', { planId: candidateId, type: "candidate" });
        } else {
            _this.paymentCallback(_this.cardDetails.threeDsecure);
           
        }
        $("body").removeClass("modal-open");
    }

    updateCardDetails() {
        var candidateId = _this.selectedCandidateData.candidateInfo.id;
        _this.$state.go('settings.admin-payment', { planId: candidateId, type: "candidate" });
        $("body").removeClass("modal-open");
    }


    downloadResume(isAllowed) {
        let candidateId = "";
        if(angular.isDefined(_this.selectedCandidateData) 
                && angular.isDefined(_this.selectedCandidateData.candidateInfo) 
                && _this.selectedCandidateData.candidateInfo.id !== null ){
            candidateId = _this.selectedCandidateData.candidateInfo.id;
        }else
        {
            candidateId = _this.candidateId;
        }
        let candidateName_Resume = "candiateResume",
            paymentInfo = window.localStorage.getItem('paymentResponse');
        if ((angular.isDefined(paymentInfo) && paymentInfo !== null && paymentInfo !== "") || isAllowed) {           
                window.localStorage.removeItem('paymentResponse');
                
                _this.candidateReviewService.getResume(candidateId).then((data) => {
                    _this.candidateResume = data ? data : [];       
                    $('#downloadResumeLink').attr({
                        href: _this.candidateResume.data.resume,
                        target: '_blank',
                        download: candidateName_Resume
                    })[0].click();

                }, (error) => {
                    _this.candidateResume = [];                
                });   
                
                _this.isFirstLoad = false;
                _this.getCandidateList();
                _this.selectCandidate(candidateId);
        }{
            _this.$state.go('app.candidate-profile');
        }
    }

    paymentIframeCallback(response) {
        let windowWidth = _this.$window.innerWidth,
        windowHeight = _this.$window.innerHeight,
        windowStyle = 'width:'+windowWidth+'px;height:'+windowHeight+'px;overflow: hidden;border:0px;position:absolute;top:-65px;left:-133px;z-index:9999;';

        //window.location.replace(response.redirect.url);
        let paymentContainer = document.querySelector('#candidate-profile-container');
            paymentContainer.style.display ='none';

        var iframe = document.createElement("iframe");
        iframe.src = response.redirect.url;
        iframe.setAttribute('style',windowStyle);
        iframe.className = "secure-iframe";
        $("#payment-candidate-iframe").append(iframe);
    };

    paymentCallback(isThreeD) {
        let product = "",
            portal = [],
            candidateId = _this.selectedCandidateData.candidateInfo.id,
            type = "candidate";

        let data = {
            "paymentType": type,
            "sourceId": "",
            "portalPlans": portal,
            "productPlan": product,
            "candidateId": candidateId,
            "positionId": "",
            "jobCode": "",
            "cardStatus": "x1ssdf1112dfdf1111df",
            "cardExpMonth": "",
            "cardExpYear": "",
            "cardLast4digit": "",
            "threed_secure": "",
            "owner": {
                "address": {
                    "city": "",
                    "country": "",
                    "line1": "",
                    "line2": "",
                    "postal_code": "",
                    "state": ""
                },
                "email": "",
                "name": "",
                "phone": "",
                "verified_address": null,
                "verified_email": null,
                "verified_name": null,
                "verified_phone": null
            }
        };
        let onSuccess = (response) => {
            console.log(response.data);
            if (isThreeD === "supported") {
                _this.paymentIframeCallback(response.data);
            } else {
                _this.makePayment(response.data);
            }
        },
            onError = (error) => {
                console.log(error);
                _this.GrowlerService.growl({
                    type: 'danger',
                    message: 'Something went wrong, Please try again in sometime. If problem persist please contact customer support.',
                    delay: 6000
                });
            };
        if (isThreeD === "supported") {
            _this.AdminPaymentPlanService.getThreeDSecureSource(data);
            _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
        } else {
            _this.AdminPaymentPlanService.getPaymentObject(data);
            _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
        }

    }

    makePayment(token) {
        let data = {
            "autoRenew": "1",
            "customerCode": token.customerCode
        };
        let onSuccess = (response) => {
            console.log(response.data);
            _this.GrowlerService.growl({
                type: 'success',
                message: 'Transaction Successfull !!',
                delay: 3000
            });

            _this.downloadResume(true);
        },
            onError = (error) => {
                console.log(error);
                _this.GrowlerService.growl({
                    type: 'danger',
                    message: 'Something went wrong, Please try again in sometime. If problem persist please contact customer support.',
                    delay: 6000
                });
            };
        _this.AdminPaymentPlanService.makePayment(data);
        _this.AdminPaymentPlanService.activePromise.then(onSuccess, onError);
    }

    sortFields() {
        _this.isFirstLoad = true;
        _this.sortField = {};
        let order = "desc";

        if (_this.sortBy === 'name') {
            let order = "asc";
            _this.sortField.fullName = order;
        } else if (_this.sortBy === 'rating') {
            _this.sortField.overallRating = order;
        } else if (_this.sortBy === 'likeCount') {
            _this.sortField.yes = order;
        } else if (_this.sortBy === 'dislikeCount') {
            _this.sortField.no = order;
        } else if (_this.sortBy === 'maybeCount') {
            _this.sortField.maybe = order;
        }
        _this.getCandidateList();

    }

    getOrderBy() {
        return (_this.sortBy && _this.sortBy != '') ? _this.sortBy : null;
    }

    getJobTitle(query) {
        var data = '';
        let jobTitle = query,
            onSuccess = (response) => {
                return _this.JobTitleList = response.data;
            },

            onError = (error) => {
                _this.JobTitleList = [];
            };

        if (angular.isDefined(jobTitle)
            && jobTitle !== ''
            && jobTitle !== null) {
            data = '?roleKeyword=' + jobTitle;
        }

        _this.candidateReviewService.getJobData(data);
        return _this.candidateReviewService.activePromise.then(onSuccess, onError);
    }

    analyzeEmailId(value) {
        let emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        _this.isEmailIdvalid = emailRegex.test(value);
    }

    querySearch(query) {
        let querySuggestionList = query,

            onSuccess = (response) => {
                return _this.suggetionList = response.data.result;
                console.log(_this.suggetionList);

            },

            onError = (error) => {
                _this.suggetionList = [];
            };

        if (angular.isDefined(querySuggestionList)
            && querySuggestionList !== ''
            && querySuggestionList !== null) {
            var data = '?keyword=' + querySuggestionList;
        }

        _this.candidateReviewService.getSearchList(data);
        return _this.candidateReviewService.activePromise.then(onSuccess, onError);
    }

    clearSuggestions(clearData) {
        _this.clearData = clearData;
    };

    analyzeFromYearExp(fromYears) {
        if (angular.isDefined(fromYears) && fromYears > 60) {
            _this.fromYearErrormessage = "Enter valid Years Of Experience";
        } else {
            _this.fromYearErrormessage = "";
        }

    };

    analyzeToYearExp(toYears) {
        if (angular.isDefined(toYears) && toYears > 65) {
            _this.toYearErrormessage = "Enter valid Years Of Experience";
        } else if (_this.advancedFilter.fromExperience > toYears) {
            _this.toYearErrormessage = "must be greater than from(yrs)";
        }
        else {
            _this.toYearErrormessage = "";
        }

    };

    hideList() {
        var windowWidth = angular.element(window).width();
        if (windowWidth > 767) {
            return false;
        }
        else {
            _this.shownone = true;
            document.getElementById('candidateListBar').style.display = 'none';
            document.getElementById('backbtn').style.display = 'block';
            document.getElementById('details').style.display = 'initial';
            return true;
        }
    }
    showList() {
        var windowWidth = angular.element(window).width();
        if (windowWidth > 767) {
            return false;
        }
        else {
            _this.shownone = false;
            document.getElementById('candidateListBar').style.display = 'contents';
            document.getElementById('backbtn').style.display = 'none';
            document.getElementById('details').style.display = 'none';
            return true;
        }
    }

    stopVideo(){
        var myPlayer = videojs("candidateVideo");
        myPlayer.pause();
        $('myPlayer').modal('hide');
    }
}

