let _this;
/*
 @interviewByMonthController Controller
 @param {object} $state - service that can contain some state.
 @param {object} companyInfoService - returns the object and provides all the values and methods related to the companyInfo.
 @param {object} LoaderService -  It is service which helps in showing the progress bar.
 @param {object} locationService -  It is service which provides the methods for fetching country, state and city list.
 */
export class recruiterwiseReportController {
	/** @ngInject  */
    constructor(analyticsService, AuthService) { 
      _this = this;
      _this.analyticsService = analyticsService;
      _this.AuthService = AuthService;
      _this.$onInit = function(){
        _this.companyId = _this.cid;
        _this.positionId = _this.pid;
        _this.durationId = _this.durationid;
        _this.getRecruiterWiseReportGraph();
        }
      _this.recruiterWiseReport = {} ;
      _this.series = ['No of  Interviews','No of hires'];
      _this.colors = [{backgroundColor: ['#ACDBF7','#ACDBF7','#ACDBF7','#ACDBF7','#ACDBF7','#ACDBF7']},
                        {backgroundColor: ['#4D5360','#4D5360','#4D5360','#4D5360','#4D5360','#4D5360']}];
//      _this.labels = ['Jhon Smith', 'Jhon Doe', 'Robert Luke', 'David Jeemo'];
//      _this.data =[[26,20,25,20],[20,15,10,16]];
  
    }
    
    getRecruiterWiseReportGraph(){
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
            _this.recruiterWiseReport = response.data || [];
            for(var i=0; i<_this.recruiterWiseReport.labels.length; i++){
                var nameLengths = _this.recruiterWiseReport.labels[i].split('');
                if(nameLengths.length > 13){                    
                    nameLengths.length = 13;
                    nameLengths = nameLengths.join("");
                    _this.recruiterWiseReport.labels[i]= nameLengths +'..';
                }else{
                     nameLengths = nameLengths.join("");
                    _this.recruiterWiseReport.labels[i]= nameLengths;
                }
            }
            console.log(response.data);
        },
        onError = (error) =>{
            console.log(error);
        };
      _this.analyticsService.getRecruiterWiseReportGraphData(query);
      _this.analyticsService.activePromise.then(onSuccess, onError);
  }
}

