var _this;
export class candidateEvaluatorAccordionController {
	/** @ngInject  */
  constructor($uibModal, $filter, $timeout, InterviewService, NgTableParams, positionService, $rootScope,AuthService, GrowlerService, dataTableService, $q) {
    _this = this;
    
    _this.$modal = $uibModal;
    _this.$timeout = $timeout;
    _this.$filter = $filter;
    _this.$rootScope = $rootScope;
    _this.$q = $q;
    _this.InterviewService = InterviewService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.AuthService = AuthService;
    _this.positionService = positionService;
    _this.GrowlerService = GrowlerService;
    _this.totalLinkedEvaluators = 0;
    _this.isEditMode = _this.mode;
    _this.interviewId = _this.interviewid;
    _this.positionId = _this.pid;
    _this.linkedInterviewerList = [];
    _this.linkedEvaluatorList = [];
    _this.linkedCandidateList = [];
    _this.tempInterviewerList = [];
    _this.tempEvaluatorList = [];
    _this.tempCandidateList = [];
    _this.hostInterviewerList = [];

    _this.$onChanges = function (changesObj) {
      _this.isEditMode = _this.mode;
      _this.interviewId = _this.interviewid;
      _this.positionId = _this.pid;
      _this.interviewType = _this.interviewtype;
      if (changesObj.isReset
        && (changesObj.isReset.previousValue === true || changesObj.isReset.previousValue === false)
        && (changesObj.isReset.currentValue !== changesObj.isReset.previousValue)) {
        _this.linkedInterviewerList = [];
        _this.linkedEvaluatorList = [];
        _this.linkedCandidateList = [];
        _this.tempInterviewerList = [];
        _this.tempEvaluatorList = [];
        _this.tempCandidateList = [];
        _this.hostInterviewerList = [];
        _this.linkedInterviewertableParams.reload();
        _this.linkedCandidatetableParams.reload();
        _this.linkedEvaluatortableParams.reload();
      } else if (changesObj.isFetch
        && (changesObj.isFetch.previousValue === true || changesObj.isFetch.previousValue === false)
        && (changesObj.isFetch.currentValue !== changesObj.isFetch.previousValue)) {
        _this.linkedInterviewerList = [];
        _this.linkedEvaluatorList = [];
        _this.linkedCandidateList = [];
        _this.tempInterviewerList = [];
        _this.tempEvaluatorList = [];
        _this.tempCandidateList = [];
        _this.hostInterviewerList = [];
        _this.linkedInterviewertableParams.reload();
        _this.linkedCandidatetableParams.reload();
        _this.linkedEvaluatortableParams.reload();
        _this.fetchHostInterviewerData();
      }
      else if (changesObj.currentState
        && (changesObj.currentState.previousValue === true || changesObj.currentState.previousValue === false)
        && (changesObj.currentState.currentValue !== changesObj.currentState.previousValue)) {
        if (_this.isEditMode) {
          _this.linkCompanyCandidateToInterview();
          _this.linkEvaluatorToInterview();
          _this.linkInterviewerToInterview();
        } else {         
          _this.linkInterviewerToInterview();
          
          if (_this.tempEvaluatorList.length > 0) {
            _this.linkEvaluatorToInterview();
          }
          if (_this.tempCandidateList.length > 0) {
            _this.linkCompanyCandidateToInterview();
          }
        }
      }
    };

    _this.linkedCandidatetableParams = new NgTableParams({
      page: 1,
      count: 5
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
        
        _this.linkedCandidateCount = 0;
        let onSuccess = (response) => {
            if (response) {
              _this.linkedCandidateList = response.data.data || [];
              _this.linkedCandidateCount = response.data.total;
            }
            if (_this.tempCandidateList.length > 0) {
               _this.linkedCandidateList = _.concat(_this.tempCandidateList, _this.linkedCandidateList);
              //angular.copy(_this.tempCandidateList, _this.linkedCandidateList);
              if (response && response.data && response.data.total) {
                _this.linkedCandidateCount = (response.data.total + _this.tempCandidateList.length);
              } else {
                _this.linkedCandidateCount = _this.tempCandidateList.length;
              }

            }

            if (_this.linkedCandidateList && _this.linkedCandidateList.length > 0) {
              _this.totalLinkedCandidates = _this.linkedCandidateCount;
              _this.linkedCandidateList = _.uniqBy(_this.linkedCandidateList, function (candidate) {
                return candidate.id;
              }); 
            }
               params.total(_this.linkedCandidateList.length);              
                if(!_this.dataTableService.totalColumn.length) {
                   _this.dataTableService.initTable(_this.cols, _this.linkedCandidatetableParams);  
                }
               return (_this.linkedCandidateList);
          },
          onError = (error) => {
            console.log(error);
          },
          getPromise = (data) => {
             var deferred = $q.defer();
                 deferred.notify(data);
                 deferred.resolve(data); 
              return deferred.promise;
          };

        let interviewId = _this.interviewid;
        if (angular.isDefined(_this.interviewid) && _this.interviewid !== '' && _this.interviewid !== null) {
            _this.positionService.getCandidateList(interviewId, queryURL);
            return _this.positionService.activePromise.then(onSuccess, onError);
        } else if (_this.tempCandidateList.length > 0) {
            _this.positionService.getCandidateList(0, queryURL);
            return _this.positionService.activePromise.then(onSuccess, onError);
        }else{
            params.total(_this.linkedCandidateList.length);
            getPromise(_this.linkedCandidateList);
            _this.totalLinkedCandidates = 0;
            
        }

      }
    });

    _this.linkedEvaluatortableParams = new NgTableParams({
      page: 1,
      count: 5
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
            if (response) {
              _this.linkedEvaluatorList = response.data.data || [];
              console.log(_this.linkedEvaluatorList);
              _this.linkedEvaluatorCount = response.data.total;
            }
            if (_this.tempEvaluatorList.length > 0) {
              _this.linkedEvaluatorList = _.concat(_this.tempEvaluatorList, _this.linkedEvaluatorList);
              //angular.copy(_this.tempEvaluatorList, _this.linkedEvaluatorList);
              if (response && response.data && response.data.total) {
                _this.linkedEvaluatorCount = (response.data.total + _this.tempEvaluatorList.length);
              } else {
                _this.linkedEvaluatorCount = _this.tempEvaluatorList.length;
              }

            }
            if (_this.linkedEvaluatorList && _this.linkedEvaluatorList.length > 0) {
              _this.linkedEvaluatorList = _.uniqBy(_this.linkedEvaluatorList, function (evaluator) {
                return evaluator.evaluatorId;
              });
          }
              _this.totalLinkedEvaluators = _this.linkedEvaluatorCount;              
               params.total(_this.linkedEvaluatorCount);
                if(!_this.dataTableService.totalColumn.length) {
                   _this.dataTableService.initTable(_this.cols, _this.linkedEvaluatortableParams);  
                }
                return (_this.linkedEvaluatorList);
          },
          onError = (error) => {
            console.log(error);
          },
          getPromise = (data) => {
             var deferred = $q.defer();
                 deferred.notify(data);
                 deferred.resolve(data); 
              return deferred.promise;
          };
        let interviewId = _this.interviewid;
        if (angular.isDefined(_this.interviewid) && _this.interviewid !== '' && _this.interviewid !== null) {
            _this.InterviewService.getLinkedEvaluatorList(queryURL, interviewId);
            return _this.InterviewService.activePromise.then(onSuccess, onError);
        } else if (_this.tempEvaluatorList.length > 0) {
             _this.InterviewService.getLinkedEvaluatorList(queryURL, 0);
            return _this.InterviewService.activePromise.then(onSuccess, onError);
        }else{
            params.total(_this.linkedEvaluatorList.length);
            getPromise(_this.linkedEvaluatorList);
            _this.totalLinkedEvaluators = 0;
        }
      }
    });
    _this.totalLinkedInterviewers = 0;
    _this.linkedInterviewertableParams = new NgTableParams({
      page: 1,
      count: 5
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
            if (response) {
              _this.linkedInterviewerList = response.data.data || [];
              _this.linkedInterviewerCount = response.data.total;
            }
            if (_this.tempInterviewerList.length > 0) {
              _this.linkedInterviewerList = _.concat(_this.tempInterviewerList, _this.linkedInterviewerList);
              //angular.copy(_this.tempInterviewerList, _this.linkedInterviewerList);
              if (response && response.data && response.data.total) {
                _this.linkedInterviewerCount = (response.data.total + _this.tempInterviewerList.length);
              } else {
                _this.linkedInterviewerCount = _this.tempInterviewerList.length;
              }

            }

            if (_this.linkedInterviewerList && _this.linkedInterviewerList.length > 0) {
              _this.totalLinkedInterviewers = _this.linkedInterviewerCount;
              _this.linkedInterviewerList = _.uniqBy(_this.linkedInterviewerList, function (interviewer) {
                return interviewer.interviewerId;
              });
            }

             params.total(_this.linkedInterviewerCount);
                if(!_this.dataTableService.totalColumn.length) {
                   _this.dataTableService.initTable(_this.cols, _this.linkedInterviewertableParams);  
                }
                return (_this.linkedInterviewerList); 

          },
          onError = (error) => {
            console.log(error);
          },
          getPromise = (data) => {
             var deferred = $q.defer();
                 deferred.notify(data);
                 deferred.resolve(data); 
              return deferred.promise;
          };
        let interviewId = _this.interviewid;
        if (angular.isDefined(_this.interviewid) && _this.interviewid !== '' && _this.interviewid !== null) {
          _this.InterviewService.getLinkedInterviewerList(queryURL, interviewId);
          return _this.InterviewService.activePromise.then(onSuccess, onError);
        } else if (_this.tempInterviewerList.length > 0) {
          _this.InterviewService.getLinkedInterviewerList(queryURL, 0);
          return _this.InterviewService.activePromise.then(onSuccess, onError);
        }else{
            params.total(_this.linkedInterviewerList.length);
            getPromise(_this.linkedInterviewerList);
            _this.totalLinkedInterviewers = 0;
        }

      }
    });
    _this.toggle = function() {
      
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };

    _this.$rootScope.$on('linkInterviewer', function (e, m) {
      _this.tempInterviewerList.push(...m.dataArray);
      _this.linkedInterviewertableParams.reload();
      _this.onUpdate({value: true});
    });

    _this.$rootScope.$on('linkEvaluator', function (e, m) {
      _this.tempEvaluatorList.push(...m.dataArray);
      _this.linkedEvaluatortableParams.reload();
      _this.onUpdate({value: true});
    });

    _this.$rootScope.$on('linkCompanyCandidate', function (e, m) {
      _this.tempCandidateList.push(...m.dataArray);
      _this.linkedCandidatetableParams.reload();
      _this.onUpdate({value: true});
    });

    console.log("Inside candidateEvaluatorAccordionController");
  }

  /* ===== Evaluator Popup Section ==== */

  openAddEvaluatorPopup() {
    let modalInstance;
    modalInstance = _this.$modal.open({
      controller: 'candidatePopupController',
      controllerAs: '$ctrl',
      templateUrl: 'candidate-popup',
      size: 'md',
      windowClass: 'written-popup default-tab-module question-bankpop adcandidate-form interviewer-tab-content',
      backdrop: 'static',
      keyboard: false,
      resolve: {
         mode: function () {            
          return 'evaluator';
        }
      }
    });
//    modalInstance.rendered.then(() => {
//      _this.$timeout(() => {
//        $('#hiddenEvaluator').click();
//      });
//    });
    modalInstance.closed.then(i => {
      //Control display behavour of tabs in question bank popup
      _this.$timeout(() => {
        _this.linkedEvaluatortableParams.reload();
      });
    });
  }

  /* ===== Evaluator Popup Section End ==== */

  /* ==== Interviwer Popup section ==== */
  openAddInterviewerPopup() {
    let modalInstance;
    modalInstance = _this.$modal.open({
      controller: 'candidatePopupController',
      controllerAs: '$ctrl',
      templateUrl: 'candidate-popup',
      size: 'md',
      windowClass: 'written-popup default-tab-module question-bankpop adcandidate-form interviewer-tab-content',
      backdrop: 'static',
      keyboard: false,
      resolve: {
         mode: function () {            
          return 'interviewer';
        }
      }
    });

//    modalInstance.rendered.then(() => {
//      _this.$timeout(() => {
//        $('#hiddenInterview').click();
//      });
//    });

    modalInstance.closed.then(i => {
      //Control display behavour of tabs in question bank popup
      _this.$timeout(() => {
        _this.linkedInterviewertableParams.reload();
      });
    });
  }

  /* ==== Interviwer Popup section End ==== */

  /* ==== Add Candiate Popup section ==== */
  openAddCandidatePopup() {
    let modalInstance;
    modalInstance = _this.$modal.open({
      controller: 'candidatePopupController',
      controllerAs: '$ctrl',
      templateUrl: 'candidate-popup',
      size: 'md',
      windowClass: 'written-popup default-tab-module question-bankpop adcandidate-form interviewer-tab-content',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        mode: function () {            
          return 'candidate';
        },
        positionId : function () {            
          return _this.positionId;
        }, 
      }
    });

//    modalInstance.rendered.then(() => {
//      _this.$timeout(() => {
//        $('#hiddenCandidate').click();
//      });
//    });

    modalInstance.closed.then(i => {
      //Control display behavour of tabs in question bank popup
      _this.$timeout(() => {
        _this.linkedCandidatetableParams.reload();
      });
    });
  }

  removeInterviewer(interviewerId) {
    _.remove(_this.linkedInterviewerList, interviewerId);
    _.remove(_this.tempInterviewerList, interviewerId);  
    _.remove(_this.hostInterviewerList, interviewerId); 
    _this.onUpdate({value: true});

  }

  removeEvaluator(evaluatorId) {
    _.remove(_this.linkedEvaluatorList, evaluatorId);
    _.remove(_this.tempEvaluatorList, evaluatorId);
    _this.onUpdate({value: true});
  }

  removeCandidate(id) {
    _.remove(_this.linkedCandidateList, id);
    _.remove(_this.tempCandidateList, id);
    _this.onUpdate({value: true});

  }
  
  resendMail(userId, userType) {    
    let onSuccess = (response) => { 
        _this.GrowlerService.growl({type: 'success', message: "Email sent Successfully",delay: 1000});
      },
      onError = (error) => { 
        console.log(error);
      };
    let data = {
      interviewId: _this.interviewid || 1,
      userType: userType,
      candidateUserIds: [userId]
    };
    _this.InterviewService.resendMail(data);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  linkInterviewerToInterview() {
    let interviewerIDArray = _this.linkedInterviewerList.map((v) => {
      return v.interviewerId;
    });
    let onSuccess = (response) => {
        //_this.close();
      },
      onError = (error) => {
        console.log(error);
      };

    let data = {
      interviewId: _this.interviewid || 1,
      userIds: interviewerIDArray,
      host: _this.hostInterviewerList
    };
    _this.InterviewService.linkInterviewerToInterview(data);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  linkEvaluatorToInterview() {
    let evaluatorIDArray = _this.linkedEvaluatorList.map((v) => {
      return v.evaluatorId;
    });
    let onSuccess = (response) => {
        //_this.close();
      },
      onError = (error) => {
        console.log(error);
      };

    let data = {
      interviewId: _this.interviewid || 1,
      userIds: evaluatorIDArray
    };

    _this.InterviewService.linkEvaluatorToInterview(data);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  linkCompanyCandidateToInterview() {
    let candidateIDArray = _this.linkedCandidateList.map((v) => {
      return v.id;
    });

    let onSuccess = (response) => {
        //_this.close();
      },
      onError = (error) => {
        console.log(error);
      };

    let data = {
      interviewId: _this.interviewid || 1,
      candidateIds: candidateIDArray
    };

    _this.InterviewService.linkCompanyCandidateToInterview(data);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  makeInterviewerHost(element, interviewer) {
    if (element.currentTarget.checked) {
      _this.hostInterviewerList.push(interviewer.interviewerId);
    } else {
      _this.hostInterviewerList.pop(interviewer.interviewerId);
    }
  }
  fetchHostInterviewerData(){
      let onSuccess = (response) => {
          _this.hostInterviewerList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.fetchHostInterviewer(_this.interviewid);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  };
}


