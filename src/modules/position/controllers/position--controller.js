import _ from 'lodash';
var _this;
export class positionController {
	/** @ngInject  */
    constructor(NgTableParams, positionService, $element, $timeout, $filter, GrowlerService, $window, LoaderService, dataTableService, $storage, $rootScope) {
        _this = this;
        _this.positionService = positionService;
        _this.GrowlerService = GrowlerService;
        _this.LoaderService = LoaderService;
        _this.dataTableService = dataTableService;
        _this.dataTableService.initTable([], {});
        _this.colNum = 6;
        _this.$timeout = $timeout;
        _this.$element = $element;
        _this.$window = $window;
        _this.$storage = $storage;
        _this.$rootScope = $rootScope;
        _this.LoaderService.show();
        _this.searchText = "";
        _this.searchFilter = {};
        _this.isCheckboxclicked = false;
        _this.positionStatusCount = {};
        _this.$timeout(function () {
             _this.LoaderService.hide();
        },1500);
        _this.colNotInit = true;
        _this.positionStatusList = [
            {
                "statusId": 1,
                "statusName": "ACTIVE"
            }, {
                "statusId": 2,
                "statusName": "INACTIVE"
            }
            , {
                "statusId": 14,
                "statusName": "ON HOLD"
            }, {
                "statusId": 16,
                "statusName": "FILLED"
            },
            {
                "statusId": 5,
                "statusName": "ARCHIVED"
            },
            {
                "statusId": 3,
                "statusName": "CLOSED"
            },
            {
                "statusId": 20,
                "statusName": "EXPIRED"
            }];
        _this.tableSelection = [];
        //_this.positionList = [];
         _this.$rootScope.$on('resizeTriggered', function() {
             _this.colNotInit = false;
            _this.dataTableService.initTable(_this.cols, _this.tableParams);
            _this.dataTableService.onLoad();
             
        });
        _this.tableParams = new NgTableParams({
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
                        _this.positionList = [];
                        if (response.data && response.data.data && response.data.data.length > 0) {
                                angular.forEach(response.data.data, function (item) {
                                    if (item.status) {
                                        item.status = item.status.toUpperCase();
                                    }
                                });
                        }
                        _this.positionStatusCount = response.data.statusCounts;
                        _this.positionTotalCount = response.data.total;
                        _this.positionList = response.data.data;
                        params.total(_this.positionTotalCount);
                          if(_this.colNotInit) {
                              _this.colNotInit = false;
                              _this.dataTableService.initTable(_this.cols, _this.tableParams);
                               _this.dataTableService.onLoad();  
                            }                            
                            return (_this.positionList);
                            
                    },
                    onError = (error) => {
                        console.log(error);
                    };

                  _this.positionService.getpositionList(queryURL);
                  return _this.positionService.activePromise.then(onSuccess, onError);
              }
                
          });
            
        _this.toggle = function() {
            _this.dataTableService.setColumn(-1);
            _this.dataTableService.toggle(_this.cols, event.target.value);
            _this.tableParams.reload();
        };


        _this.deletePositions = function ()
        {
            if (_this.tableSelection && _this.tableSelection.length > 0) {
                _this.positionService.updateDeletedRows(_this.tableSelection);
                _this.positionService.activePromise.then((response)=>{                                        
                    _this.tableParams.reload();
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: response.data.successMessage,
                        delay: 2000
                    });
                },(error)=>{
                    console.log(error);
                })
            }
        };

        _this.closeArchieve = function (sts)
        {
            let status = sts;
            if (_this.tableSelection && _this.tableSelection.length > 0) {
                _this.positionService.changeStatus(_this.tableSelection, status);
                _this.positionService.activePromise.then((response)=>{                    
                    _this.tableParams.reload();
                    _this.tableSelection = [];
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: "Position Status Changed Successfully",
                        delay: 2000
                    });
                },(error)=>{
                    console.log(error);
                })
                
            }
        };

    }
    getInterviews(positionId) {
        let onSuccess = (response) => {
              console.log(response.data);
              if (response.data && response.data.successMessage) {
                  _this.interviewsList = [];
                  _this.positionId = positionId;
              } else
              {
                  _this.interviewsList = response.data || [];
              }

          },
          onError = (error) => {
              console.log(error);
          };

        _this.positionService.getInterviews(positionId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    addSelectedPositionId(element, id) {
        if (element.currentTarget.checked) {
            _this.tableSelection.push(id);
        } else {
            _this.tableSelection.pop(id);
        }
    };

    changePositionStatus(positionId, status) {
        if(status === "FILLED" || status === "CLOSED"){               
              _this.positionId = positionId;         
              _this.positionStatusMsg = status;
              $("#closedModal").modal("show");
        } 

        else{

        if(status === 'EXPIRED'){
            _this.GrowlerService.growl({
                  type: 'warning',
                  message: "Cannot update status as position is not expired.",
                  delay: 500
              });
              return;
        }
        let positionStatus = _.find(_this.positionStatusList, function(sts) { return sts.statusName.toUpperCase() === status });
        let onSuccess = (response) => {
              _this.GrowlerService.growl({
                  type: 'success',
                  message: "Position Status Changed Successfully",
                  delay: 2000
              });
              _this.tableParams.reload();
          },
          onError = (error) => {
              console.log(error);
          },
          positionIds = [ positionId ]

        _this.positionService.changeStatus(positionIds, positionStatus.statusId);
        _this.positionService.activePromise.then(onSuccess, onError);
    }

    }

    changeIcon(element, index){
      //console.log(id);
      let id = angular.element("#"+element.currentTarget.id).attr("data-target");
      let rowId =  angular.element("#"+element.currentTarget.id).attr("data-rowId");
      angular.element("tr.collapse.in:not("+id+")").removeClass("in").attr("aria-expanded",false);
      angular.element("tr.active-row:not(#"+rowId+")").removeClass("active-row")
      $('#'+element.currentTarget.id).toggleClass('inactv');
      $('#'+element.currentTarget.id).parents('tr').toggleClass('active-row');
        $('#'+element.currentTarget.id).parents('tr').next('.full-row').slideToggle('slow');



    }

    isPositionIdExists(tableSelection, positionId){
      var isExists = false;
      _.forEach(tableSelection, function(id) {
        if(id == positionId){
          window.alert('Id Exists');
            isExists = true;
        }
      });
      return isExists;
    }

     

    showDeleteModal(position){
      _this.tableSelection = [];
      _this.tableSelection.push(position.id);
      if(_this.tableSelection && _this.tableSelection.length > 0){
          $("#deleteModal").modal("show");
      }
    }

    showCloseModal(){
        if(_this.tableSelection &&_this.tableSelection.length>0){
            $("#closeModal").modal("show");
        }
    }

    showArchieveModal(){
        if(_this.tableSelection &&_this.tableSelection.length>0){
            $("#archiveModal").modal("show");
        }
    }

    compareCandidates(position){
       var x = location.href;
       var n = x.indexOf("/", 8);
       var res = x.slice(0, n);
       this.$storage.setItem('compare-positionId', position);
       if(angular.isDefined(_this.$storage.getItem('compareIds'))){
         _this.$storage.removeItem('compareIds');
       }
       if(angular.isDefined(_this.$storage.getItem('compare-interviewId'))){
         _this.$storage.removeItem('compare-interviewId');
       }
       window.open(res+"/candidate-compare");
      
    }

     changePositionStatusMessage() {       
        let positionStatus = _.find(_this.positionStatusList, function(sts) { return sts.statusName.toUpperCase() === _this.positionStatusMsg });
        let onSuccess = (response) => {
              _this.GrowlerService.growl({
                  type: 'success',
                  message: "Position Status Changed Successfully",
                  delay: 2000
              });
              _this.tableParams.reload();
          },
          onError = (error) => {
              console.log(error);
          },
          positionIds = [ _this.positionId ]

        _this.positionService.changeStatus(positionIds, positionStatus.statusId);
        _this.positionService.activePromise.then(onSuccess, onError);    

    }

    closePositionModel(){
       _this.tableParams.reload();
    }
}

