let _this = this;

/*
 @analyticsController Controller
 @param {object} analyticsService -  It is service which helps in showing the analytics data.
 */
export class analyticsController {
    /** @ngInject */
    constructor(analyticsService, $stateParams, $state, AuthService, $timeout, $rootScope) {
        _this = this;
        _this.$timeout = $timeout;
        _this.analyticsService = analyticsService;
        _this.$stateParams = $stateParams;
        _this.$state = $state;
        _this.AuthService = AuthService;
        _this.showFunnelChart = false;
        _this.reportCompany = {};
        _this.reportPosition = {};
        _this.reportDuration = '';
        if (angular.isDefined(_this.$stateParams.companyId)) {
            _this.reportCompany.id = _this.$stateParams.companyId;
        }
        if (angular.isDefined(_this.$stateParams.positionId)) {
            _this.reportPosition.id = _this.$stateParams.positionId;
        }
        if (angular.isDefined(_this.$stateParams.duration)) {
            _this.reportDuration = _this.$stateParams.duration;
        }
        _this.$timeout(function () {
            $rootScope.setActiveLi(5);
        }, 1000);        
        _this.companyList = [];
        _this.getCompanyList();
        _this.positionList = {};

        if (_this.AuthService.user.userRoles && _this.AuthService.user.userRoles == 7) {
            let companyId = 0;
            if (angular.isDefined(_this.reportCompany) && _this.reportCompany.id && _this.reportCompany.id !== '') {
                companyId = _this.reportCompany.id;
            }
            _this.getPositionList(companyId);
        } else
        {
            let userCompanyId = _this.AuthService.user.companyId;
            _this.getPositionList(userCompanyId);
        }

        _this.interviewTrackingData = [];
        // _this.getinterviewTrackingReportGraph() ;
        
    }

    clearSearchCompany() {
        _this.searchCompany = '';
    }

    clearSearchPosition() {
        _this.searchPosition = '';
    }

    selectedData(type, value) {
        if (type === 'company') {
            _this.reportCompany = value;
            _this.reportPosition = {};
            _this.reportPosition.id = '';
            _this.reportDuration = '';            
        }else if (type === 'position') {
            _this.reportPosition = value;
        }else if (type === 'duration') {
            _this.reportDuration = value;
        } 
        
        //angular.element('html, body').scrollTop(0);
        _this.$state.go('app.analytics-stats', {positionId: _this.reportPosition.id, duration: _this.reportDuration, companyId: _this.reportCompany.id});

    }    
    getPositionList(companyId) {
        let onSuccess = (response) => {
            _this.positionList = response.data || [];
            angular.element('html, body').scrollTop(0);
        },
        onError = (error) => {
            console.log(error);
        };
        _this.analyticsService.getpositionList(companyId);
        _this.analyticsService.activePromise.then(onSuccess, onError);
    }
    
    getCompanyList() {
        let onSuccess = (response) => {
            _this.companyList = response.data;
        },
                onError = (error) => {
            console.log(error);
        };
        if (_this.AuthService.user.userRoles && _this.AuthService.user.userRoles == 7) {
            _this.analyticsService.getCompanyList();
            _this.analyticsService.activePromise.then(onSuccess, onError);
        } else {
            _this.companyList = [];
        }
    }
}


