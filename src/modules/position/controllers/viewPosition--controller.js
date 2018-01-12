import _ from 'lodash';

let _this;
export class viewPositionController {
	/** @ngInject  */
  constructor($sce, interviewSettingService, InterviewService, positionService,appliedCandidateService, NgTableParams, $stateParams, $timeout, calendarConfig, scheduleService, locationService, LoaderService, $rootScope, GrowlerService, UtilsService, dataTableService) {
    _this = this;
    _this.hideView = false;
    _this.locationService = locationService;
    _this.$timeout = $timeout;
    _this.$sce = $sce;
    _this.InterviewService = InterviewService;
    _this.interviewSettingService = interviewSettingService;
    _this.LoaderService = LoaderService;
    _this.GrowlerService = GrowlerService;
    _this.UtilsService = UtilsService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});    
    _this.appliedCandidateService = appliedCandidateService;
    _this.colNum = 6;
    _this.LoaderService.show();
     _this.$timeout(function () {
        _this.LoaderService.hide();
        $rootScope.setActiveLi(3);
     },1500);
    _this.linkedCandidateCount = 0;
    _this.totalLinkedEvaluators = 0;
    _this.totalLinkedInterviewers = 0;
    _this.defaultQuestions = [];
    _this.socialMediaApps = [];
    _this.$stateParams = $stateParams;
    _this.positionService = positionService;
    _this.scheduleService = scheduleService;
    _this.positionId = _this.$stateParams.positionId || 1;
    _this.position = {};
    _this.interview = {};
    _this.scheduleInterviewData = {};
    _this.departmentList = [];
    _this.skillsetList = [];
    _this.getSocialMediaAppDetails();  
    _this.fetchPositionDetails(_this.positionId);
    _this.getDepartments();    
    _this.interviewAccordians = [];
    _this.isInterviewSectionShow = true;
    _this.setInterviewTypeId = 0;
    _this.liveNowClicked = false;
    _this.isLiveNow = false; 
    _this.isYoutubeWelcomeVideo = false;
    _this.isYoutubeExitVideo = false;   
    _this.isTwitterAvailible = false;
    _this.isLinkedinAvailible = false;
    _this.isFacebookAvailible = false;
    _this.isGooglePlusAvailible = false;
    _this.isInstagramAvailible = false;    
    _this.candStatus = "";
    _this.candidateData = {};
    _this.pageSize = 10;
    _this.searchFilter = {};
    _this.isFirstLoad = true;

     //Applied Candidate Listing

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
                            _this.appliedCandidatesCount = response.data.total;

                            if (_this.isFirstLoad) {
                                Object.keys(_this.appliedCandidatesList).length > 0 ? _this.candidateAppliedDetailsById(_this.appliedCandidatesList[0].candidateId, _this.appliedCandidatesList[0].appliedJobStatus, _this.appliedCandidatesList[0].appliedJobId) : null;
                                _this.isFirstLoad = false;
                            }

                            params.total(_this.appliedCandidatesCount);
                            return (_this.appliedCandidatesList);
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

     _this.getHiredCandidates = function () {
            _this.hiredCandidatetableParams = new NgTableParams({
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
                        
                        if (response.data && response.data.data) {
                            _this.hiredCandidatesList = response.data.data;                           
                            _this.hiredCandidatesCount = response.data.total;
                            if (_this.isFirstLoad) {
                                Object.keys(_this.hiredCandidatesList).length > 0 ? _this.candidateHiredDetailsById(_this.hiredCandidatesList[0].id) : null;
                                _this.isFirstLoad = false;
                            }

                            params.total(_this.hiredCandidatesCount);                           
                            return (_this.hiredCandidatesList);
                        }

                    },
                    onError = (error) => {
                        console.log(error);
                    };
                    _this.appliedCandidateService.getAllHiredCandidates(queryURL, _this.positionId);
                    return _this.appliedCandidateService.activePromise.then(onSuccess, onError);
                }
            });
    };

    _this.onLoad();
    _this.getHiredCandidates();


    _this.getlinkedEvaluatortableParams = function () {
      _this.linkedEvaluatortableParams = new NgTableParams({
          page: 1,
          count: 5
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
                _this.linkedEvaluatorCount = response.data.total;
                _this.linkedEvaluatorList = response.data.data;
                
                if (_this.linkedEvaluatorList && _this.linkedEvaluatorList.length > 0) {
                  _this.totalLinkedEvaluators = _this.linkedEvaluatorList.length;
                  _this.linkedEvaluatorList = _.uniqBy(_this.linkedEvaluatorList, function (evaluator) {
                    return evaluator.evaluatorId;
                  });                 
                  params.total(_this.linkedEvaluatorList.length);
                    if(!_this.dataTableService.totalColumn.length) {
                       _this.dataTableService.initTable(_this.cols, _this.linkedEvaluatortableParams);  
                    }
                    return (_this.linkedEvaluatorList);
                }
              },
              onError = (error) => {
                console.log(error);
              };
            _this.InterviewService.getLinkedEvaluatorList(queryURL, _this.interviewId);
             return _this.InterviewService.activePromise.then(onSuccess, onError);
          }
        });
    };

    _this.getlinkedInterviewertableParams = function () {
      _this.linkedInterviewertableParams = new NgTableParams({
          page: 1,
          count: 5
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

                _this.linkedInterviewerCount = response.data.total;
                _this.linkedInterviewerList = response.data.data;
                if (_this.linkedInterviewerList && _this.linkedInterviewerList.length > 0) {
                  _this.linkedInterviewerList = _.uniqBy(_this.linkedInterviewerList, function (interviewer) {
                    return interviewer.interviewerId;
                  });
                  _this.totalLinkedInterviewers = _this.linkedInterviewerCount;                                
                  params.total(_this.linkedInterviewerList.length);
                    if(!_this.dataTableService.totalColumn.length) {
                       _this.dataTableService.initTable(_this.cols, _this.linkedInterviewertableParams);  
                    }
                    return (_this.linkedInterviewerList);
                }

              },
              onError = (error) => {
                console.log(error);
              };

            _this.InterviewService.getLinkedInterviewerList(queryURL, _this.interviewId);
            return _this.InterviewService.activePromise.then(onSuccess, onError);

          }
        });
    };

    _this.getTableParams = function () {
      _this.tableParams = new NgTableParams({
          page: 1,
          count: 5
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
                _this.linkedCandidateCount = response.data.total;
                _this.linkedCandidateList = response.data.data;
                if (_this.linkedCandidateList && _this.linkedCandidateList.length > 0) {
                  _this.totalGetCandidates = _this.linkedCandidateList.length;
                  _this.linkedCandidateList = _.uniqBy(_this.linkedCandidateList, function (candidate) {
                    return candidate.id;
                  });                  
                   params.total(_this.linkedCandidateList.length);
                    if(!_this.dataTableService.totalColumn.length) {
                       _this.dataTableService.initTable(_this.cols, _this.tableParams);  
                    }
                    return (_this.linkedCandidateList);
                }

              },
              onError = (error) => {
                console.log(error);
              };

            _this.positionService.getCandidateList(_this.interviewId, queryURL);
            return _this.positionService.activePromise.then(onSuccess, onError);
          }

        });      
    };
    
    _this.getliveNowCandidates = function() {
     _this.liveNowCandidatetableParams = new NgTableParams({
          page : 1,
          count: 10
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
                 queryURL += `${queryString}&page=${page}`;
                      let onSuccess = (response) => {
                       _this.liveNowCandidateCount = response.data.total;
                       _this.liveNowCandidateList = response.data.data || [];
                       console.log(_this.liveNowCandidateList);
                    if(_this.liveNowCandidateList && _this.liveNowCandidateList.length > 0){
                            _this.totalliveNowCandidates = _this.liveNowCandidateCount;                                                        
                    params.total(_this.liveNowCandidateCount);
                    if(!_this.dataTableService.totalColumn.length) {
                       _this.dataTableService.initTable(_this.cols, _this.liveNowCandidatetableParams);  
                    }
                    return (_this.liveNowCandidateList);
                    }                  
                   },
                     onError = (error) => {
                       _this.totalliveNowCandidates = 0;
                   };
                   if(_this.positionId){
                        _this.positionService.getliveNowCandidateList(_this.positionId, queryURL);
                        return _this.positionService.activePromise.then(onSuccess, onError);
                   }
               
          }
      });   
    };

   

    _this.eventsSelected = [];
    _this.calendarConfig = calendarConfig;
    //These variables MUST be set as a minimum for the calendar to work
    _this.calendarView = 'month';
    _this.viewDate = new Date();
    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function (args) {
        _this.eventEdited(args);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function (args) {
        _this.eventDeleted(args);
      }
    }];
    _this.events = [];
    _this.isCellOpen = true;

    _this.getSlotsData = function (slots) {
      //console.log(_this.searchFilter);
      //scheduleService.getSchedulesList(_this.searchFilter);
      $timeout(function () {
        var eventsData = slots;
        _this.addCalendarProperties(eventsData);
        _this.events = eventsData;
      }, 1000);
    };

    _this.cancelSelection = function () {
      angular.forEach(_this.events, function (event) {
        _this.deselctEvent(event);
      });
    };

    _this.addCalendarProperties = function (eventsData) {
      angular.forEach(eventsData, function (eventObj) {
         if(eventObj.active){
        	eventObj.color = _this.calendarConfig.colorTypes.warning;
            }else{
                eventObj.color = _this.calendarConfig.colorTypes.important;
            } 
      });
    };
  }


onLoad() {     
  _this.positionId = _this.$stateParams.positionId;
 }


  getAudioVideoQuestions() {
    _this.audioVideoQuestions = [];
    _this.InterviewService.getInterviewQuestions({
      "interviewId": _this.interviewId,
      "questionTypeId": [5,1]
    }).then((res) => {
      if (res.data && res.data.length > 0) {
        _this.audioVideoQuestions = _.uniqBy(res.data, function (question) {
          return question.questionId;
        });
      }
    });
  }

  getWrittenQuestions() {
    _this.InterviewService.getInterviewQuestions({
      "interviewId": _this.interviewId,
      "questionTypeId": [3,4,2]
    }).then((res) => {
      if (res.data && res.data.length > 0) {
        _this.writtenQuestions = _.uniqBy(res.data, function (question) {
          return question.questionId;
        });
      }
    });
  }

  getQuestionsList() {
    _this.InterviewService.getInterviewQuestions({
      "interviewId": _this.interviewId,
      "questionTypeId": [2,1,3,4,5]
    }).then((res) => {
      if (res.data && res.data.length > 0) {
        _this.defaultQuestions = _.uniqBy(res.data, function (question) {
          return question.questionId;
        });
      }
    });
  }

  getDepartments() {
    let onSuccess = (response) => {
        _this.departmentList = response.data.data;
        if (_this.position
          && _this.position.departmentId) {
          _this.departmentNameId = _.find(_this.departmentList, function (department) {
            return department.id == _this.position.departmentId;
          });
        }
      },
      onError = (error) => {
        console.log(error);
      }
    _this.positionService.getDepartments();
    _this.positionService.activePromise.then(onSuccess, onError);
  }

  getSkillSet(departmentId) {
    let onSuccess = (response) => {
        _this.skillsetList = response.data;
        _this.primarySkillName = _.find(_this.skillsetList, function (skill) {
          return skill.id == _this.position.primarySkillsetId;
        });
        _this.secondrySkillName = _.find(_this.skillsetList, function (skill) {
          return skill.id == _this.position.secondarySkillsId;
        });
        _this.tertiarySkillName = _.find(_this.skillsetList, function (skill) {
          return skill.id == _this.position.tertiarySkillsId;
        });
      },
      onError = (error) => {
        console.log(error);
      }
    _this.positionService.getSkills(departmentId);
    _this.positionService.activePromise.then(onSuccess, onError);
  }
  
  
  fetchPositionDetails(positionId) {

    let onSuccess = (response) => {
        console.log(response.data);
        _this.position = response.data || {};
        _this.jobCode = _this.position.code;
        if (_this.position.departmentId !== ""
          && _this.position.departmentId !== null) {
          _this.getDepartments();
        }
        if (_this.position.primarySkillsetId !== ""
          && _this.position.primarySkillsetId !== null) {
          _this.getSkillSet(_this.position.departmentId);
        }
//        if (_this.position.additionalOptions && _this.position.additionalOptions.country !== ""
//          && _this.position.additionalOptions.country !== null) {
//          _this.getCountryList();
//        }
//        if (_this.position.additionalOptions && _this.position.additionalOptions.state !== ""
//          && _this.position.additionalOptions.state !== null) {
//          _this.getStateList(_this.position.additionalOptions.country);
//        }
//        if (_this.position.additionalOptions && _this.position.additionalOptions.city !== ""
//          && _this.position.additionalOptions.city !== null) {
//          _this.getCityList(_this.position.additionalOptions.state);
//        }
        if(_this.position.additionalOptions.positionExpiryDate !== ""
                        && _this.position.additionalOptions.positionExpiryDate !== null 
                        && _this.position.additionalOptions.positionExpiryDate !== "0000-00-00 00:00:00"){
            let positionExpiryDate = new Date(moment.utc(_this.position.additionalOptions.positionExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
            _this.position.additionalOptions.positionExpiryDate = positionExpiryDate;//moment(positionExpiryDate).format('MM-DD-YYYY'); 
        } 
        if(_this.position.additionalOptions.description!=='') {
            document.querySelector('.view-additional-option').innerHTML = _this.position.additionalOptions.description;
        }else {
            document.querySelector('.view-additional-option').innerHTML = 'N/A'
        }
        
        _this.fetchPositionCount(_this.positionId);
        _this.getInterviewBasedOnPositionId();
        _this.getApplicationFormDetails(_this.jobCode);
        _this.getJobPortalsDetails(positionId);
        
      },
      onError = (error) => {
        console.log(error);
        _this.hideView = true;
      };
    _this.positionService.getPositionDetails(positionId);
    _this.positionService.activePromise.then(onSuccess, onError);
  }
  
  getInterviewSettings() {
    let onSuccess = (response) => {
        console.log(response.data);
        _this.interviewSetting = response.data || [];
        _this.getWelcomeVideos(_this.interviewSetting.welcomeVideoFileId);
        _this.getExitVideos(_this.interviewSetting.exitVideoFileId);
      },
      onError = (error) => {
        console.log(error);
      };
    _this.interviewSettingService.getInterviewSetting(_this.interviewId);
    _this.interviewSettingService.activePromise.then(onSuccess, onError);
  }
  
  getWelcomeVideos(fileId) {
    let onSuccess = (response) => {
        console.log(response.data);
        if (response && response.data && response.data.file) {
          _this.welcomeVideofile = response.data.file || "";
          _this.videoUpdated(1,_this.welcomeVideofile);
        }
        else {
          _this.welcomeVideofile = "";
        }

      },
      onError = (error) => {
        console.log(error);
      };
    _this.interviewSettingService.getExitVideo(fileId);
    _this.interviewSettingService.activePromise.then(onSuccess, onError);
  }
  
  getExitVideos(fileId) {
    let onSuccess = (response) => {
        console.log(response.data);
        if (response && response.data && response.data.file) {
          _this.exitVideofile = response.data.file || "";
          _this.videoUpdated(2,_this.exitVideofile);
        } else {
          _this.exitVideofile = "";
        }
      },
      onError = (error) => {
        console.log(error);
      };
    _this.interviewSettingService.getExitVideo(fileId);
    _this.interviewSettingService.activePromise.then(onSuccess, onError);
  }
  
  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

//  addNewInterview(){ 
//    let isInterviewsLimitExceeded = _this.interviewAccordians.length >= 5 ? true : false;
//    if(!isInterviewsLimitExceeded)
//    {
//       let tabId = 'index' + _this.interviewAccordians.length + 1;
//       _this.interviewAccordians.push({
//         interviewIndex : _this.interviewAccordians.length + 1,
//         id : tabId,
//         name :  'Interview ' + (_this.interviewAccordians.length + 1),
//         interviewTypeId : _this.interviewAccordians.interviewTypeId
//       });
//       _this.removeClass(_this.interviewAccordians);
//       _this.fetchAllData();
//    }
//
//  }

  removeClass(tabArray) {
    if (tabArray && tabArray.length > 0) {
      for (var i = 0; tabArray.length - 1 > i; i++) {
        $('#' + tabArray[i].id).removeClass("active in");
      }
    }
  }

  getInterviewBasedOnPositionId() {
    let onSuccess = (response) => {
        _this.interviewAccordians = [];
        if(response.data && response.data.length >0){
            for (var i = 0; i < response.data.length; i++) {
                if(response.data[i].interviewExpiryDate && response.data[i].interviewExpiryDate !== ""){
                    let interviewExpiryDate = new Date(moment.utc(response.data[i].interviewExpiryDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                    response.data[i].interviewExpiryDate = moment(interviewExpiryDate).format('MM-DD-YYYY'); 
                               
                }               
                if(response.data[i].interviewTypeId === 4){
                      _this.isLiveNow = true;                           
                }
                if(response.data[i].interviewTypeId === 2){
                        if(response.data[i].fromDate !== ""){
                            let fromDate = new Date(moment.utc(response.data[i].fromDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                            response.data[i].fromDate = moment(fromDate).format('MM-DD-YYYY');                           
                            
                        }
                        if(response.data[i].toDate !== ""){
                            let toDate = new Date(moment.utc(response.data[i].toDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                            response.data[i].toDate = moment(toDate).format('MM-DD-YYYY');                             
                        }
                               
                }
                if(response.data[i].interviewTypeId !== 4){
                      _this.interviewAccordians.push(response.data[i]);                             
                }

            }
        }
        if (_this.interviewAccordians.length > 0) {
          _this.selectedInterviewTypeId = _this.interviewAccordians[0].interviewTypeId;
          _this.interviewId = _this.interviewAccordians[0].id;
          _this.interview = _this.interviewAccordians[0];
          _this.fetchAllData();
          _this.$timeout(function () {
            $(".interview-tabs .nav-tabs li:eq(0) a").tab('show');
          }, 100);
        }else
            {                        
                  if(_this.isLiveNow){
                      _this.liveNowClicked = true;
                      _this.selectedInterviewTypeId = 4;
                      _this.interview.interviewTypeId = 4;
                      _this.interview.name = 'Live Now';
                      _this.getliveNowCandidates();
                      _this.$timeout(function() { 
                            $(".interview-tabs .nav-tabs li:eq(0) a").tab('show');
                        }, 100);
                  }

            }
      },
      onError = (response) => {
        console.log(response.data);
      };
    _this.positionService.getInterviewBasedOnPositionId(_this.positionId);
    _this.positionService.activePromise.then(onSuccess, onError);
  }

//
//  removeClass(tabArray){
//      if(tabArray && tabArray.length > 0){
//        for(var i=0; tabArray.length -1 > i; i++){
//              let tabElement = $('#'+ tabArray[i].id);
//              tabElement.removeClass("active in");
//        }
//      }
//  }
  
  getScheduleData() {
    let onSuccess = (response) => {
        console.log(response.data);
        _this.scheduleInterviewData = {};
        _this.scheduleInterviewData = response.data;
        let hasData = _.isEmpty(_this.scheduleInterviewData);                        
         if (!hasData){
            let val = _this.scheduleInterviewData.slots;
            for(var i=0;i < val.length ;i++){                            
                    val[i]['startsAt'] = new Date(moment.utc(val[i].startDate, 'YYYY-MM-DD H:mm').local().format('MM-DD-YYYY HH:mm'));
                    val[i]['endsAt'] = new Date(moment.utc(val[i].endDate, 'YYYY-MM-DD H:mm').local().format('MM-DD-YYYY HH:mm'));
                    val[i]['title'] = "SLOT ("+new Date(moment(val[i].startDate+'Z').local().format('MM-DD-YYYY HH:mm'))+")";
                    val[i]['summary'] = "SLOT ("+moment(val[i].startDate+'Z').local().format('HH:mm')+")";
            };
            if(_this.scheduleInterviewData.fromDate !== ""){
                let fromDate = new Date(moment.utc(_this.scheduleInterviewData.fromDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                _this.scheduleInterviewData.fromDate = moment(fromDate).format('MM-DD-YYYY');
                _this.viewDate = new Date(_this.scheduleInterviewData.fromDate);
            }
            if(_this.scheduleInterviewData.toDate !== ""){
                let toDate = new Date(moment.utc(_this.scheduleInterviewData.toDate, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm'));
                _this.scheduleInterviewData.toDate = moment(toDate).format('MM-DD-YYYY');                             
            }
            _this.scheduleInterviewData.fromTime = _this.scheduleInterviewData.fromTime;
            _this.scheduleInterviewData.toTime = _this.scheduleInterviewData.toTime;
            _this.addCalendarProperties(_this.scheduleInterviewData.slots);
            _this.events = _this.scheduleInterviewData.slots;
         }
      },
      onError = (error) => {
        console.log(error);
      };
    _this.scheduleService.getScheduleInterview(_this.interviewId);
    _this.scheduleService.activePromise.then(onSuccess, onError);
  }

  fetchInterviewDetails(data) {
    _this.liveNowClicked = false;
    _this.interview = data;
    _this.interviewId = data.id;
    _this.selectedInterviewTypeId = data.interviewTypeId;
    _this.fetchAllData();
  }
  showLiveNow(){
    _this.liveNowClicked = true;
    _this.selectedInterviewTypeId = 4;
  }
//  getFormatedDate(date){
//     return date.getFullYear() + "-" + ( date.getMonth() + 1) + "-" + date.getDate();
//  }
  
  fetchAllData() {

    if (_this.selectedInterviewTypeId && _this.selectedInterviewTypeId === 1) {

      _this.getQuestionsList();
      _this.getTableParams();
      _this.getlinkedInterviewertableParams();
      _this.getlinkedEvaluatortableParams();
      _this.getScheduleData();
    }
    if (_this.selectedInterviewTypeId && _this.selectedInterviewTypeId === 2) {
      _this.getTableParams();
      _this.getlinkedInterviewertableParams();
      _this.getlinkedEvaluatortableParams();
    }
    if (_this.selectedInterviewTypeId && _this.selectedInterviewTypeId === 3) {
      _this.getInterviewSettings();
      _this.getTableParams();
      _this.getlinkedInterviewertableParams();
      _this.getlinkedEvaluatortableParams();
      _this.getWrittenQuestions();
      _this.getAudioVideoQuestions();
    }
    if(_this.isLiveNow){
        _this.getliveNowCandidates();
    }
  }
  
  videoUpdated(val,url){
      $(".video-js").each(function() {
          let player = $(this)[0];
          let videoPlayer = videojs(player, {}, function () {});
          videoPlayer.pause();
      });
      if(url !== null && url !== ""){
        let path =  url;
        if(path.indexOf('youtube') >= 0){
            if(val === 1){
                _this.isYoutubeWelcomeVideo = true;
            }else{
                _this.isYoutubeExitVideo = true;
            }
        }else{
            if(val === 1){
                _this.isYoutubeWelcomeVideo = false;
                _this.UtilsService.initVideoPlayer('welcomeVideo', path);
            }else{
                _this.isYoutubeExitVideo = false;
                _this.UtilsService.initVideoPlayer('exitVideo', path);
            }
        }
      }
  };
  
  activatePosition(){
      _this.LoaderService.show();
       let onSuccess = (response) => {  
            _this.position.statusId = 1;
            _this.$timeout(function() {
                _this.GrowlerService.growl({
                          type: 'success',
                          message: "Position Activated Successfully",
                          delay: 2000
                      });
            }, 500);
            _this.LoaderService.hide();
        },
        onError = (error) =>{
            _this.LoaderService.hide();
        };
         _this.positionService.activatePosition(_this.positionId);
         _this.positionService.activePromise.then(onSuccess, onError);
   }
   
   //get Application Form details
   getApplicationFormDetails(jobCode){
     let onSuccess = (response) =>{
       _this.applicationFormData = response.data;
     },
      onError =(error) =>{
        console.log(error);
      }; 
      _this.positionService.getApplicationFormDetails(jobCode);
      _this.positionService.activePromise.then(onSuccess, onError);
   }
   
   //get portal details
   getJobPortalsDetails(positionId){
     let onSuccess = (response) =>{
       _this.jobPortalsData = response.data;
     },
      onError =(error) =>{
        console.log(error);
      }; 
      _this.positionService.getJobPortalsDetails(positionId);
      _this.positionService.activePromise.then(onSuccess, onError);
   }

   getSocialMediaAppDetails() {

    let onSuccess = (response) => {
      _this.socialMediaApps = response.data;

      angular.forEach(_this.socialMediaApps, function(value, key){
        switch(value.socialPortalId) {
          case 1 :
             _this.isFacebookAvailible = true;
             break;
          case 2 :  
             _this.isTwitterAvailible = true;
             break;
          case 3 :
             _this.isLinkedinAvailible = true;
             break;
          case 4 :  
             _this.isGooglePlusAvailible = true;
             break;   
          case 5 :  
             _this.isInstagramAvailible = true;
             break;   
        }

      });
    },
    onError = (error) => {
      console.log(error);
    };
    _this.InterviewService.socialMediaApp();
    _this.InterviewService.activePromise.then(onSuccess, onError);
   }

   //Get Candidate Status
  
      getCandidateStatus() {
        if (_this.candidateStatus === 'All') {
            _this.candidateStatus = '';
            _this.searchFilter.appliedJobStatus = _this.candidateStatus;
            _this.candidateStatus = 'All';
        } else {
            _this.searchFilter.appliedJobStatus = (_this.candidateStatus === " ") ? "" : _this.candidateStatus;
        }
    };
  //Get candidate details by Id

    candidateAppliedDetailsById(candId, status, appliedJobId) {
        _this.getCommentForAppliedCandidate(candId);

        let onSuccess = (response) => {

            _this.candidateData = response.data;
            _this.candidateData.appliedStatus = status;
            _this.candStatus = status;
            _this.appliedJobId = appliedJobId;
        },
                onError = (error) => {
            console.log(error);
        };
        _this.appliedCandidateService.candidateAppliedDetailsById(candId, _this.jobCode);
        _this.appliedCandidateService.activePromise.then(onSuccess, onError);
    };

  //Get Comment Api
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

    fetchPositionCount(positionId) {
        _this.PositionCount = {};
        let onSuccess = (response) => {
            _this.PositionCount = response.data;
            _this.jobCode = response.data.jobCode;
            _this.getAllAppliedCandidates();
        },
        onError = (error) => {
            console.log(error);
        };
        _this.positionService.getPositionCount(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    };

    showMoreData() {
        _this.pageSize = (_this.pageSize + 10);
        _this.getAllAppliedCandidates();
    };

    candidateHiredDetailsById(candId) {
        _this.jobCode = _this.PositionCount.jobCode;
        let onSuccess = (response) => {
            _this.hiredCandidateData = response.data;
        },
        onError = (error) => {
            console.log(error);
        };
        _this.appliedCandidateService.candidateAppliedDetailsById(candId, _this.jobCode);
        _this.appliedCandidateService.activePromise.then(onSuccess, onError);
    }

}


