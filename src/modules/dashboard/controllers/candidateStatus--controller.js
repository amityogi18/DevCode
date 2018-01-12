let _this;
  export class candidateStatusController {
	/** @ngInject  */
    constructor( QuickStasticsService) {
      _this = this;
      _this.QuickStasticsService = QuickStasticsService;
      _this.candidateStatusReportData = {};
      _this.getCandidateStatusReportGraph();
      _this.colors = ['#e2ab3b','#3db9dc','#458bc4','#626773','#d0d6cb','#4fc55b','#d57171','#23b195'];

  }
    getCandidateStatusReportGraph(){
        let onSuccess = (response) => {
             console.log(response.data);
             _this.candidateStatusReportData = response.data || [];  
         },
         onError = (error) =>{
             console.log(error);
         };
       _this.QuickStasticsService.getCandidateStatusReportGraphData();
       _this.QuickStasticsService.activePromise.then(onSuccess, onError);
    }
}

  



