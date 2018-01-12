import _ from 'lodash';

/*
 @evaluatorDashboardController--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} DashboardService description - returns the object and provides all the values related to the candidate.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class evaluatorDashboardController {
  constructor(NgTableParams, DashboardService, $scope, $element, $timeout, $rootScope, dataTableService) {
    let _this = this;
    $rootScope.setActiveLi(1);
    _this.DashboardService = DashboardService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.$scope = $scope;
    _this.$timeout = $timeout;
    _this.$element = $element;
    _this.candidateStatusList = [];
     _this.candidateTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.candidateTableFilter
        },
             {
                counts: [],
                getData: function(params) {
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

                            _this.candidateStatusList = response.data.data;
                            _this.candidateStatusListCount = response.data.total;;
                            if (_this.candidateStatusList &&
                                _this.candidateStatusList.length > 0) {
                                params.total(5);
                            }
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.candidateTableParams);  
                            }
                            return (_this.candidateStatusList);
                                
                            
                            
                        },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.DashboardService.getCandidatesList(queryURL);
                    return _this.DashboardService.activePromise.then(onSuccess, onError);
                }
            });
             _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
            _this.DashboardService.getAllNotification().then((data)=>{
        _this.notificationList = data.notifications;
        //_this.notificationCount = data.notifications.length;

      });
      _this.DashboardService.getNotifications().then((data)=>{
        $rootScope.notificationList2 = data.notifications;
        //_this.notificationCount = data.notifications.length;

      });
      _this.DashboardService.getNotificationCount().then((data)=>{
          //_this.notificationCount = data.notificationCount;
            $rootScope.notificationCount = data.notificationCount;
      });

  }
}
evaluatorDashboardController.$inject = ['NgTableParams', 'DashboardService', '$scope', '$element', '$timeout','$rootScope', 'dataTableService'];

