let _this;
/*
 @interviewByMonthController Controller
 @param {object} $state - service that can contain some state.
 @param {object} companyInfoService - returns the object and provides all the values and methods related to the companyInfo.
 @param {object} LoaderService -  It is service which helps in showing the progress bar.
 @param {object} locationService -  It is service which provides the methods for fetching country, state and city list.
 */
export class interviewByMonthController {
		/** @ngInject  */
    constructor(analyticsService, AuthService) { 
      _this = this;
      _this.analyticsService = analyticsService;
      _this.AuthService = AuthService;
     _this.$onInit = function(){
        _this.companyId = _this.cid;
        _this.positionId = _this.pid;
        _this.durationId = _this.durationid;
        _this.getInterviewByMonthReportGraph();
        }
      _this.interviewByMonthReport = {};
      _this.series = ['Series A','Series A'];
      _this.colors = ['#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd','#45b7cd'];
//    this.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'];
//    this.data =[24,12,27,23,15,11,10,23,14,21,15,5];
  
    }
    
    getInterviewByMonthReportGraph(){
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
            _this.interviewByMonthReport = response.data || [];  
        },
        onError = (error) =>{
            console.log(error);
        };
      _this.analyticsService.getInterviewByMonthReportGraphData(query);
      _this.analyticsService.activePromise.then(onSuccess, onError);
  }
}

