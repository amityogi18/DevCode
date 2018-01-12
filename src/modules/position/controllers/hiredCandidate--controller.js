var _this,
        activePromise;
export class hiredCandidatesController {
    /** @ngInject  */
    constructor($location, $scope, $stateParams, appliedCandidateService, positionService, NgTableParams, dataTableService, GrowlerService) {

        _this = this;
        _this.$scope = $scope;
        _this.$location = $location;
        _this.$stateParams = $stateParams;
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
        //_this.currentNavItem = 'hired';
        _this.currentNavItem = {
            "current": "hired",
            "prev": 'app.interview({positionId: ' + _this.$stateParams.positionId + '})',
            "next": 'app.hired({positionId: ' + _this.$stateParams.positionId + '})'
        };
        _this.onLoad();
        _this.getHiredCandidates = function () {
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
                        //_this.positionStatusCount = response.data.statusCounts;
                        if (response.data && response.data.data) {
                            _this.hiredCandidatesList = response.data.data;
                            _this.candidateList = response.data.data;
                            _this.hiredCandidatesCount = response.data.total;
                            if (_this.isFirstLoad) {
                                Object.keys(_this.hiredCandidatesList).length > 0 ? _this.candidateHiredDetailsById(_this.candidateList[0].id) : null;
                                _this.isFirstLoad = false;
                            }

                            params.total(_this.hiredCandidatesCount);
                            if (!_this.dataTableService.totalColumn.length) {
                                _this.dataTableService.initTable(_this.cols, _this.tableParams);
                            }
                            return (_this.candidateList);
                        }

                    },
                    onError = (error) => {
                        console.log(error);
                    };
                    _this.appliedCandidateService.getAllHiredCandidates(queryURL, _this.positionId);
                    return _this.appliedCandidateService.activePromise.then(onSuccess, onError);
                }
            });
            _this.toggle = function () {
                _this.dataTableService.setColumn(-1);
                _this.dataTableService.toggle(_this.cols, event.target.value);
            };
        };

        _this.getHiredCandidates();

    }

    onClose() {
        _this.tableParams.reload();
    }

    onLoad() {
        let url = _this.$location.path();
        if (url === "/position/add/new") {
            _this.positionId = "";
        } else {
            _this.positionId = _this.$stateParams.positionId || 1;
            _this.fetchPositionCount(_this.positionId);
        }
    }

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
        },
        onError = (error) => {
            console.log(error);
        };
        _this.positionService.getPositionCount(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    };
    
    candidateHiredDetailsById(candId) {
        _this.jobCode = _this.PositionCount.jobCode;
        let onSuccess = (response) => {
            _this.candidateData = response.data;
        },
        onError = (error) => {
            console.log(error);
        };
        _this.appliedCandidateService.candidateAppliedDetailsById(candId, _this.jobCode);
        _this.appliedCandidateService.activePromise.then(onSuccess, onError);
    }
    
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





