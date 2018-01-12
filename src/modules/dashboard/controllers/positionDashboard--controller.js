let _this;
export class positionDashboardController {
	/** @ngInject  */
  constructor( GrowlerService, PositionDashboardService, $window, AuthService, $storage) {
     console.log('Inside company logo controller constructor'); 
      _this = this;
      _this.AuthService = AuthService;
      _this.$window = $window;
      _this.$storage = $storage ;
      _this.GrowlerService = GrowlerService;
      _this.PositionDashboardService = PositionDashboardService;
      _this.latestPositionList = '';
      _this.getlatestPositionList();
      _this.Roles = _this.AuthService.user.userRoles;
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
  getlatestPositionList(){
      let onSuccess = (response) => {
        _this.latestPositionList = response.data;
        console.log("Latest Position---------------->"+_this.latestPositionList);
      },
      onError = (error) => {
        console.log(error);   
      };
    _this.PositionDashboardService.getlatestPositionList();
    _this.PositionDashboardService.activePromise.then(onSuccess, onError);
  }   
    
   
}




