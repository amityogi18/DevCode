let _this;
  export class quickStasticsController {
	/** @ngInject  */
    constructor( GrowlerService, QuickStasticsService, AuthService) { 
      _this = this;
      _this.GrowlerService = GrowlerService;
      _this.QuickStasticsService = QuickStasticsService;
      _this.allStastics = '';
      _this.roleId = AuthService.user.userRoles;
      if(_this.roleId !== 3 && _this.roleId !== 4){
        _this.getallStastics();      
      }
  } 
  
    getallStastics(){
        let onSuccess = (response) => {
          _this.allStastics = response.data;
        },
        onError = (error) => {
          console.log(error);   
        };
      _this.QuickStasticsService.getallStastics();
      _this.QuickStasticsService.activePromise.then(onSuccess, onError);
   }    
  }








