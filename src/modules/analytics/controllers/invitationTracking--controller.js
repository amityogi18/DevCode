let _this;

export class invitationTrackingController {
	/** @ngInject  */
  constructor(analyticsService, AuthService) {
      _this = this;
      _this.AuthService = AuthService;
      _this.analyticsService = analyticsService;
      _this.$onInit = function(){
        _this.interviewTrackingData = [];
        _this.chartData = {};
        _this.companyId = _this.cid;
        _this.positionId = _this.pid;
        _this.durationId = _this.durationid;
         this.getCandidateTrackingGraph();
      }
  } 
  
getCandidateTrackingGraph(){
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
            _this.interviewTrackingData = response.data.Data;
            let obj = {};
            _this.interviewTrackingData.forEach(function(data){
                obj[data[0]] = data[1]
            });
            _this.chartData = obj;
        },
        onError = (error) =>{
            console.log(error);
        };
          _this.analyticsService.getinterviewTrackingReportGraphData(query);
          _this.analyticsService.activePromise.then(onSuccess, onError);
         
    }
   
}






