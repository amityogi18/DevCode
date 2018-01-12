let _this;

export class allJobPortalSaController {
  /** @ngInject  */
  constructor(InterviewService) {
    _this = this;

    _this.InterviewService = InterviewService;
    _this.jobPortal();
    _this.portalList = [];

  }
  jobPortal(){
    let onSuccess = (response) => {
        _this.portalList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };

    _this.InterviewService.jobPortals();
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }
}



















