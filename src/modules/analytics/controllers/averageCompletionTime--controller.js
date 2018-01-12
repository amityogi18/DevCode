let _this;
/*
 @appTypeController Controller
 @param {object} $state - service that can contain some state.
 @param {object} companyInfoService - returns the object and provides all the values and methods related to the companyInfo.
 @param {object} LoaderService -  It is service which helps in showing the progress bar.
 @param {object} locationService -  It is service which provides the methods for fetching country, state and city list.
 */
export class averageCompletionTimeController {
	/** @ngInject  */
  constructor(analyticsService, AuthService) {
      _this = this;
      _this.analyticsService = analyticsService;
      _this.AuthService = AuthService;
      _this.$onInit = function(){
        _this.companyId = _this.cid;
        _this.positionId = _this.pid;
        _this.durationId = _this.durationid;
      _this.getAvgCompletionTimeGraph();
        }
      _this.completionTimeData = {} ;
//      _this.labels = ['ios', 'Android','windows','PC'];
//      _this.data = [5,15,4,3];
      _this.series = ['Position Name'];
     
  }
  
  
  getAvgCompletionTimeGraph(){
       let query = "";
     if(_this.AuthService.user.userRoles && _this.AuthService.user.userRoles == 7){
         let companyId = 1;
         if(angular.isDefined(_this.companyId) 
                && _this.companyId !=='' 
                && _this.companyId !==null){
            companyId = _this.companyId;
        }         
         query = "/"+companyId+"?";
         if(companyId === 1){
             query = query+'isAdmin=1';            
         }
     }else
     {
        let companyId = _this.AuthService.user.companyId;
        query = "/"+companyId+"?"; 
     }     
    if(angular.isDefined(_this.positionId) 
            && _this.positionId !=='' 
            && _this.positionId !==null){
        query = query+'&positionId='+ _this.positionId;
    }
    if(angular.isDefined(_this.durationId) 
            && _this.durationId !=='' 
            && _this.durationIdn !==null ){
        query = query+'&duration='+_this.durationId;
    }
     
       let onSuccess = (response) => {
            console.log(response.data);
             _this.completionTimeData = response.data || [];  
        },
        onError = (error) =>{
            console.log(error);
        };
      _this.analyticsService.getAvgCompletionTimeGraphData(query);
      _this.analyticsService.activePromise.then(onSuccess, onError);
  }
}






