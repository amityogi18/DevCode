let _this;
export class allNotificationController {
    constructor(DashboardService, NgTableParams, dataTableService, UtilsService) {
        _this = this;
        _this.DashboardService = DashboardService;
        _this.dataTableService = dataTableService;
        _this.UtilsService = UtilsService;
        _this.notificationList = [];
        _this.dataTableService.initTable([], {});
        _this.colNum = 6;

        _this.tableParams = new NgTableParams({
            page: 1,
            count: 10
        },
            {
                counts: [],
                getData: function (params) {
                    let count = params.count(),
                        page = params.page(),
                        queryURL = `&limit=${count}&page=${page}`;

                            // return _this.DashboardService.getAllNotification(queryURL).then((data) => {                        
                            //     _this.notificationList = _this.getNotificationWithDateDiff(data.data);                         
                            //     params.total(data.total);
                            //     return (_this.notificationList);
                            // }, (error) => {
                            //     _this.notificationList = [];

                            // });
                         let onSuccess = (response) => {
                            _this.notificationList = _this.getNotificationWithDateDiff(response.data.data);
                            _this.notificationCount = response.data.total;
                            
                            params.total(_this.notificationCount);
                                if(!_this.dataTableService.totalColumn.length) {
                                   _this.dataTableService.initTable(_this.cols, _this.tableParams);  
                                }                
                                return (_this.notificationList);
                                            
                            if (_this.notificationList &&
                                _this.notificationList.length > 0) {
                                params.total(_this.notificationCount);
                                return(_this.notificationList);
                            }
                      },
                      onError = (error) => {
                        console.log(error);
                      };
                     _this.DashboardService.getAllNotification(queryURL);
                     return _this.DashboardService.activePromise.then(onSuccess, onError);
                }
            });
        _this.toggle = function () {
            _this.dataTableService.setColumn(-1);
            _this.dataTableService.toggle(_this.cols, event.target.value);
        };
    }

    getNotificationWithDateDiff(notificationsList) {
        let notificationsListDuration = [];
        if (angular.isDefined(notificationsList) && notificationsList.length > 0) {
            _.forEach(notificationsList, function (notifications) {
                notifications.duration = _this.UtilsService.getDateDiff(notifications.date);
                notificationsListDuration.push(notifications);
            });
        }
        return notificationsListDuration;
    }
}

allNotificationController.$inject = ['DashboardService', 'NgTableParams', 'dataTableService', 'UtilsService'];

