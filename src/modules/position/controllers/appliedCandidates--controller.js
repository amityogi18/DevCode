var _this,
        activePromise;
export class appliedCandidatesController {
    /** @ngInject  */
    constructor($location, $scope, $stateParams, appliedCandidateService, positionService, NgTableParams, dataTableService, GrowlerService, $state) {
        console.log('Inside applied Candidates Controller constructor');
        _this = this;
        _this.$scope = $scope;
        _this.$location = $location;
        _this.$stateParams = $stateParams;
        _this.$state = $state;
        _this.appliedCandidateService = appliedCandidateService;
        _this.dataTableService = dataTableService;
        _this.GrowlerService = GrowlerService;
        _this.positionService = positionService;
        _this.searchFilter = {};
        _this.candidateData = {};
        _this.pageSize = 10;
        _this.isFirstLoad = true;
        _this.showPositionCount = true;
        _this.candStatus = "";
        _this.tabType = "";
        _this.currentNavItem = {
            "current": "applied",
            "prev": 'app.advertise({positionId: ' + _this.$stateParams.positionId + '})',
            "next": 'app.interview({positionId: ' + _this.$stateParams.positionId + '})'
        };

        _this.getAllAppliedCandidates = function () {
            _this.getAllAppliedCandidatesTableParams = new NgTableParams({
                page: 1,
                count: _this.pageSize,
                filter: _this.searchFilter
            }, {
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
                        if (response.data && response.data.data) {
                            _this.appliedCandidatesList = response.data.data;
                            _this.candidateList = response.data.data;
                            _this.appliedCandidatesCount = response.data.total;
                            if (_this.isFirstLoad) {
                                Object.keys(_this.appliedCandidatesList).length > 0 ? _this.candidateAppliedDetailsById(_this.candidateList[0].candidateId, _this.candidateList[0].appliedJobStatus, _this.candidateList[0].appliedJobId) : null;
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
                    _this.appliedCandidateService.getAllAppliedCandidates(queryURL, _this.jobCode);
                    return _this.appliedCandidateService.activePromise.then(onSuccess, onError);
                }
            });
        };

        _this.onLoad();
    };
    
    onLoad() {
        let url = _this.$location.path();
        if (url === "/position/add/new") {
            _this.positionId = "";
        } else {
            _this.positionId = _this.$stateParams.positionId || 1;
            _this.fetchPositionCount(_this.positionId);
        }
        _this.getAllAppliedCandidates();
    };
    
    saveData(mode){
        if (mode === 'ACTIVATE') {
           _this.activatePosition();
        }
    };
    
    showMoreData() {
        _this.pageSize = (_this.pageSize + 10);
        _this.getAllAppliedCandidates();
    };
    
    fetchPositionCount(positionId) {
        _this.PositionCount = {};
        let onSuccess = (response) => {
            _this.PositionCount = response.data;
            _this.jobCode = response.data.jobCode;
        },
        onError = (error) => {
            console.log(error);
        };
        _this.positionService.getPositionCount(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    };
    
    getCandidateStatus() {
        if (_this.candidateStatus === 'All') {
            _this.candidateStatus = '';
            _this.searchFilter.appliedJobStatus = _this.candidateStatus;
            _this.candidateStatus = 'All';
        } else {
            _this.searchFilter.appliedJobStatus = (_this.candidateStatus === " ") ? "" : _this.candidateStatus;
        }
    };
    
    candidateAppliedDetailsById(candId, status, appliedJobId) {
        _this.getCommentForAppliedCandidate(candId);

        let onSuccess = (response) => {

            _this.candidateData = response.data;
            _this.candidateData.appliedStatus = status;
            _this.candStatus = status;
            _this.appliedJobId = appliedJobId;
            //_this.candidateEducation =  _this.candidateData.candidateEducation;
        },
                onError = (error) => {
            console.log(error);
        };
        _this.appliedCandidateService.candidateAppliedDetailsById(candId, _this.jobCode);
        _this.appliedCandidateService.activePromise.then(onSuccess, onError);
    };
    
    addCommentForRejected(type, candidateId) {
        let commentInfo = {};
        if (type === 12) {
            commentInfo = {
                statusId: 12,
                jobId: _this.appliedJobId,
                candidateId: _this.candidateData.candidateInfo.id,
                comment: _this.addComment
            };
        } else {
            commentInfo = {
                statusId: 26,
                jobId: _this.appliedJobId,
                candidateId: _this.candidateData.candidateInfo.id

            };
        }

        let onSuccess = (response) => {
            _this.GrowlerService.growl({
                type: 'success',
                message: 'status change successfully',
                delay: 300
            });
            _this.addComment = '';
            _this.getAllAppliedCandidatesTableParams.reload();
            _this.getCommentForAppliedCandidate(candidateId);
            //_this.$scope.$apply();
        },
                onError = (error) => {
            console.log(error);
        };

        _this.appliedCandidateService.addCommentForRejected(commentInfo);
        _this.appliedCandidateService.activePromise.then(onSuccess, onError);
    };
    
    getCommentForAppliedCandidate(candidateId) {
        let onSuccess = (response) => {
            _this.commentData = response.data;
            _this.candStatus = _this.commentData.appliedJobStatus;
        },
                onError = (error) => {
            console.log(error);
        };
        _this.appliedCandidateService.getCommentForAppliedCandidate(_this.jobCode, candidateId);
        _this.appliedCandidateService.activePromise.then(onSuccess, onError);
    };
    
    activatePosition() {
        let onSuccess = (response) => {
            _this.fetchPositionCount(_this.positionId);
            _this.GrowlerService.growl({
                type: 'success',
                message: "Position Activated Successfully",
                delay: 2000
            });
        },
        onError = (error) => {
            console.log(error);
        };
        _this.positionService.activatePosition(_this.positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

}