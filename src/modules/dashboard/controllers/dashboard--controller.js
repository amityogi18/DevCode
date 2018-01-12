let _this;
export class DashboardController {
	/** @ngInject  */
  constructor($rootScope, AuthService, $timeout, $stateParams, $window, PositionDashboardService, DashboardService, LoaderService) {
    _this = this;   
    _this.AuthService = AuthService;
    _this.PositionDashboardService = PositionDashboardService;
    _this.DashboardService = DashboardService;
    _this.LoaderService = LoaderService;
    _this.$stateParams = $stateParams;
    _this.$timeout = $timeout;
    _this.$window = $window;
    _this.LoaderService.show();
    _this.myInterval = 3000;
    _this.noWrapSlides = false;
    _this.active = 0;
    _this.calendarView = 'month';
    _this.viewDate = new Date();
    _this.getlatestPositionList();
    _this.events = [];    
    _this.showIntroOverlay = _this.$stateParams.introParam;
    $rootScope.fullName = _this.AuthService.getFullName();
    $rootScope.showLogout = _this.AuthService.isUserLoggedIn(); 
    _this.$timeout(function () {
          _this.LoaderService.hide();
    },2000);

    _this.$timeout(function () {
        $rootScope.setActiveLi(1);
        angular.element('.carousel').triggerHandler('onload');
         $('.carousel').carousel();
    },1000);

  }
  
  getlatestPositionList(){
        _this.LoaderService.show();
      let onSuccess = (response) => {
        _this.latestPositionList = [];
        _this.latestPositionList = response.data;
        _this.LoaderService.hide();
      },
      onError = (error) => {
        _this.LoaderService.hide();
        console.log(error);   
      };
    _this.PositionDashboardService.getlatestPositionList();
    _this.PositionDashboardService.activePromise.then(onSuccess, onError);
  }  
  
  closeIntro(){
   _this.showIntroOverlay = false;
  }
  
  onLoad(){
     $('#carousel1').carousel();
  }
  slide(dir){
    $('#carousel1').carousel(dir);  
  }
}

