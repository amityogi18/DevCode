let _this;
export class dashboradNotificationController {
	/** @ngInject  */
  constructor(DashboardService, AuthService, $state) {
    _this = this;
    _this.DashboardService = DashboardService;
    _this.AuthService = AuthService;
    _this.fullHeight = false;
    _this.$state = $state;    
    _this.getAllNotification();
    
  }
  showlist(){
    if(_this.AuthService.user.userRoles === 3 || _this.AuthService.user.userRoles === 4){
      _this.fullHeight = true;
    }else{
      _this.fullHeight = false;
    }
  }
  getAllNotification(){
        let onSuccess = (response) => {
          _this.notificationList = [];
          _this.notificationList = response.data.data;
          _this.showlist();
        },
        onError = (error) => {
          console.log(error);   
        };
      _this.DashboardService.getAllNotification('&limit=7&page=1');
      _this.DashboardService.activePromise.then(onSuccess, onError);
   }
   
   showAllNotifications(){
      if(_this.$state.current && _this.$state.current.name){
            let currentState = _this.$state.current.name;
              if(currentState.indexOf('conference.') >= 0){
                  _this.$state.go('conference.notifications');
             }else if(currentState.indexOf('candidateProfile.') >= 0){
                  _this.$state.go('candidateProfile.notifications');
             }else if(currentState.indexOf('app.') >= 0 || currentState.indexOf('sa.') >= 0 || currentState.indexOf('settings.') >= 0){
                  _this.$state.go('app.notifications');
             }          
          
      }
  }
}
