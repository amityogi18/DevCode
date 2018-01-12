
export class candidateAccordionController {
	/** @ngInject  */
    constructor($rootScope, $uibModal, $state, NgTableParams, $timeout, positionService, $window, GrowlerService, AuthService, dataTableService, $storage) {
        var _this = this;
        _this.isListViewSelected = true;
        _this.isGridViewSelected = false;
        _this.positionService = positionService;
        _this.GrowlerService = GrowlerService;
        _this.AuthService = AuthService;
        _this.dataTableService = dataTableService;
        _this.dataTableService.initTable([], {}); 
        _this.colNum = 6;
        _this.userRole=AuthService.user.userRoles;
        _this.$state = $state;
        _this.positionId = _this.pid;
        _this.candidateTotal = 0;
        _this.compareList = [];
        _this.candidateFilter = {};
        _this.selectedCandidate = {};
        _this.$modal = $uibModal;
        _this.$timeout = $timeout;
        _this.$window = $window;
        _this.$storage = $storage;
        _this.isLiveNow = false;
        _this.liveNowClicked = false;
        _this.liveNowInterviews = [];
         _this.$timeout(function () {
        $rootScope.setActiveLi(3);
          },1000);
        _this.candidateStatusAvailable = [
            {
                "statusId": 21,
                "statusName": "NEW"
            },
            {
                "statusId": 13,
                "statusName": "IN PROGRESS"
            },
            {
                "statusId": 14,
                "statusName": "ON HOLD"
            },
            {
                "statusId": 6,
                "statusName": "HIRED"
            },
            {
                "statusId": 22,
                "statusName": "INREVIEW"
            },
            {
                "statusId": 23,
                "statusName": "EVALUATED"
            },
            {
                "statusId": 11,
                "statusName": "COMPLETED"
            },
            {
                "statusId": 12,
                "statusName": "REJECTED"
            },
            {
                "statusId": 5,
                "statusName": "ARCHIVED"
            }];
        console.log("Inside candidateAccordionController");
         _this.$onChanges = function (changesObj) {
                    console.log("updated object candidateEvaluatorAccordion "+changesObj);
                   if(changesObj.pid
                           && (changesObj.pid.currentValue !== changesObj.pid.previousValue)){
                        _this.positionId = _this.pid;
                        _this.getInterviews(_this.pid);
                    }

                };
        _this.initData = function (resetCandidateCount) {
            _this.candidateTableParams = new NgTableParams({
                page: 1,
                count: 5,
                filter:  _this.candidateFilter
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
                                _this.initialCandidateList = [];
                                _this.candidateAccordionSummary = response.data.summary;
                                _this.candidateTotal = response.data.total ? response.data.total : resetCandidateCount;                                
                                if (response.data && response.data.data && response.data.data.length > 0) {
                                    if(_this.liveNowClicked){
                                        angular.forEach(response.data.data, function (item) {
                                            if (item.candidateStatusName) {
                                                item.candidateStatus = item.candidateStatusName.toUpperCase();
                                            }
                                            if (item.interviewStatusName) {
                                                item.interviewStatus = item.interviewStatusName.toUpperCase();
                                            }
                                            if (item.avgRatings) {
                                                item.overallRating = item.avgRatings;
                                            }
                                        });
                                    }else
                                    {
                                        angular.forEach(response.data.data, function (item) {
                                            if (item.candidateStatus) {
                                                item.candidateStatus = item.candidateStatus.toUpperCase();
                                            }
                                        });
                                    }
                                    _this.initialCandidateList = response.data.data;
                                   params.total(_this.candidateTotal);
                                        if(!_this.dataTableService.totalColumn.length) {
                                           _this.dataTableService.initTable(_this.cols, _this.candidateTableParams);  
                                        }                            
                                    return (_this.initialCandidateList);
                                }else
                                {
                                    _this.initialCandidateList = [];
                                    params.total(_this.initialCandidateList.length);
                                    return(_this.initialCandidateList);
                                }

                            },
                                    onError = (error) => {
                                console.log(error);
                            };
                            //console.log("id----"+_this.interviewsList[0].id)
                            console.log("selected id " + _this.interviewId);
                            if(_this.liveNowClicked){
                                 _this.positionService.getliveNowCandidateList(_this.pid, queryURL);
                            }
                            else
                            {
                               _this.positionService.getPositionCandidateList(_this.interviewId, queryURL);
                            }
                            return _this.positionService.activePromise.then(onSuccess, onError);

                        }
                    });
      _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
        };
        _this.getInterviews = function(positionId) {
            let onSuccess = (response) => {
                console.log(response.data);
                if (response.data && response.data.successMessage) {
                    _this.interviewsList = [];

                } else
                {

                    _this.interviewsList = [];
                    if(response.data && response.data.length >0){
                        for (var i = 0; i < response.data.length; i++) {
                            if(response.data[i].interviewTypeId !== 4){
                                  _this.interviewsList.push(response.data[i]);
                            }
                            if(response.data[i].interviewTypeId === 4 || response.data[i].interviewTypeId === 1){
                              if(response.data[i].interviewTypeId === 4){
                                _this.isLiveNow = true;
                              }    
                             _this.selectedCandidate.interviewTypeId = response.data[i].interviewTypeId;
                            }

                        }
                    }
                    if (_this.interviewsList && _this.interviewsList.length > 0) {
                            _this.interviewId = _this.interviewsList[0].id;
                            _this.initData();
                            _this.$timeout(function() {
                                    $(".default-tab-module .nav-tabs li:eq(0) a").tab('show');
                            }, 100);
                    }else
                    {
                          if(_this.isLiveNow){
                              _this.liveNowClicked = true;
                              _this.initData();
                              _this.$timeout(function() {
                                    $(".default-tab-module .nav-tabs li:eq(0) a").tab('show');
                                }, 100);
                          }

                    }
                }

            },
            onError = (error) => {
                console.log(error);
            };

            _this.positionService.getInterviews(positionId);
            _this.positionService.activePromise.then(onSuccess, onError);
        };
        _this.applyCandidateFilter = function(filterValue){
            console.log(filterValue);
            _this.candidateFilter.candidateStatus = filterValue;
            _this.initData();
        };

        _this.showListView = function () {
            _this.isListViewSelected = true;
            _this.isGridViewSelected = false;
        };

        _this.showGridView = function () {
            _this.isListViewSelected = false;
            _this.isGridViewSelected = true;
        };

        _this.showCandidates = function (selectedInterview,$event) {
            angular.element(".tabination-area li.active").removeClass("active");
            angular.element($event.currentTarget).parents("li").addClass("active");

            _this.compareList = [];
            _this.liveNowClicked = false;
            _this.interviewId = selectedInterview;
            //_this.initialCandidateList = angular.copy(selectedInterview);
            _this.initData(0);

        };
        _this.showLiveNow = function(){
            _this.liveNowClicked = true;
            _this.initData();
        };
        _this.addSelectedCandidate = function (selectedCandidate) {
            var isPresent = false;
            if (event.currentTarget.checked) {
                for (var i = 0; i < _this.compareList.length; i++) {
                    if (JSON.stringify(_this.compareList[i]) == JSON.stringify(selectedCandidate)) {
                        isPresent = true;
                    }
                }
                if (!isPresent) {
                    selectedCandidate['ischecked'] = true;
                    _this.compareList.push(selectedCandidate);
                }
            } else {
                for (var i = 0; i < _this.compareList.length; i++) {
                    if (JSON.stringify(_this.compareList[i]) == JSON.stringify(selectedCandidate)) {
                        selectedCandidate['ischecked'] = false;
                        _this.compareList.splice(i, 1);
                    }
                }
            }
            _this.selectedCandidate.compareList =  _this.compareList;
            _this.selectedCandidate.interviewId =  _this.interviewId;
        };

        _this.applyQuickFilter = function () {
            switch (event.target.dataset.title) {
                case 'showList' :
                    _this.showListView();
                    break;
                case 'showGrid' :
                    _this.showGridView();
                    break;
                default :
                    var list = angular.copy(_this.initialCandidateList);
                    for (var idx = 0; idx < list.length; idx++) {
                        if (list[idx].candidateStatus != event.target.dataset.title && (event.target.dataset.title != 'all')) {
                            list.splice(idx, 1);
                            idx--;
                        }
                    }
                    _this.initialCandidateList = list;
                    _this.candidateTableParams.reload().then(function (data) {
                        if (data.length === 0 && _this.candidateTableParams.total() > 0) {
                            _this.candidateTableParams.page(_this.candidateTableParams.page() - 1);
                            _this.initData();
                        }
                    });
            }
        };
    }
    updateCandidateStatus(candidateId, candidateStatus, interviewId){
        let changeCandidateStatus = _.find(this.candidateStatusAvailable, function(sts) { return sts.statusName === candidateStatus });
        let intId = this.interviewId;
        if(this.liveNowClicked){
            intId = interviewId;
        }
        let onSuccess = (response) => {
              this.GrowlerService.growl({
                  type: 'success',
                  message: "Candidate status changed Successfully",
                  delay: 2000
              });
              this.initData();
          },
          onError = (error) => {
              console.log(error);
              this.initData();
          },
          
          data = {
              interviewId : intId,
              candidateId : candidateId,
              statusId: changeCandidateStatus.statusId
          };

        this.positionService.updateCandidateStatus(data);
        this.positionService.activePromise.then(onSuccess, onError);
    }
    viewCandidate(candidateId){
      let tempCandidateIdArray =[];
        if (candidateId && candidateId !== null && candidateId !== "") {
           tempCandidateIdArray.push(candidateId);
            this.redirectToCompare(tempCandidateIdArray);
        }
    };
    
    compareCandidates(candidateId){
      
      if (this.compareList && this.compareList.length > 0) {
            let candidateIdArray = this.compareList.map((v) => {
                return v.id;
              });
           this.redirectToCompare(candidateIdArray);
        }
       
    };
    
    redirectToCompare(candidateIdArray){
            var x = location.href;
            var n = x.indexOf("/", 8);
            var res = x.slice(0, n);
            this.$storage.setItem('compare-positionId', this.pid);
            this.$storage.setItem('compareIds', candidateIdArray);
            this.$storage.setItem('compare-interviewId', this.interviewId);
            window.open(res+"/candidate-compare");
    }
}


