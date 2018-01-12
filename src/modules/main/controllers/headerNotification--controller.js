let _this;
import _ from 'lodash';

export class headerNotificationController {
    /** @ngInject */
    constructor($rootScope, DashboardService, $interval, $state, UtilsService) {
        _this = this;
        _this.$rootScope = $rootScope;
        _this.$interval = $interval;
        _this.$state = $state;
        _this.DashboardService = DashboardService;
        _this.UtilsService = UtilsService;
        _this.isLoading = true;
        _this.notificationList2 = [];

        _this.fetchNotificationCount();

        _this.$rootScope.notification = _this.$interval(function () {
            if (_this.$rootScope.isLoggedIn) {
                _this.fetchNotificationCount();
            } else {
                _this.stopFetchNotification();
            }
        }, 60000);

    }

    showAllNotifications() {
        if (_this.$state.current && _this.$state.current.name) {
            let currentState = _this.$state.current.name;
            if (currentState.indexOf('conference.') >= 0) {
                _this.$state.go('conference.notifications');
            } else if (currentState.indexOf('candidateProfile.') >= 0) {
                _this.$state.go('candidateProfile.notifications');
            } else if (currentState.indexOf('app.') >= 0 || currentState.indexOf('sa.') >= 0 || currentState.indexOf('settings.') >= 0) {
                _this.$state.go('app.notifications');
            }
        }
    }

    stopFetchNotification() {
        if (angular.isDefined(_this.$rootScope.notification)) {
            _this.$interval.cancel(_this.$rootScope.notification);
            _this.$rootScope.notification = undefined;
        }
    };

    fetchNotificationCount() {
        _this.isLoading = true;
        _this.DashboardService.getNotificationCount().then((data) => {
            _this.notificationCount = data.notificationCount;
            _this.isLoading = false;
        }, (error) => {
            _this.notificationCount = 0;
            _this.isLoading = false;
        });
    };

    fetchNotification() {
        _this.isLoading = true;
        _this.DashboardService.getNotifications().then((data) => {
            _this.notificationList2 = _this.getNotificationWithDateDiff(data.notifications);
            _this.isLoading = false;
            _this.fetchNotificationCount();
        }, (error) => {
            _this.notificationList2 = [];
        });
    };

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