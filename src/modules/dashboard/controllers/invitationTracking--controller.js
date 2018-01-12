let _this;

export class invitationTrackingController {
	/** @ngInject  */
  constructor(QuickStasticsService) {
      _this = this;
      _this.QuickStasticsService = QuickStasticsService;
      _this.interviewTrackingData = [];
      _this.chartData = {};
      _this.getCandidateTrackingGraph();
  } 
  
getCandidateTrackingGraph(){
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
      _this.QuickStasticsService.getinterviewTrackingReportGraphData();
      _this.QuickStasticsService.activePromise.then(onSuccess, onError);
         
    }
   
}






