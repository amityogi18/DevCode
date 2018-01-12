let _this = this;

export class favouriteJobDescriptionController {
    /** @ngInject  */
  constructor(favouriteJobDescriptionService, GrowlerService, $stateParams) {
    _this = this;
    _this.favouriteJobDescriptionService = favouriteJobDescriptionService;
    _this.GrowlerService = GrowlerService;
    _this.$stateParams = $stateParams;
    _this.jobId = _this.$stateParams.jobId || 1;
    _this.getFavouriteJobDescription(_this.jobId);
  }



  getFavouriteJobDescription(jobId){
      let onSuccess = (response) => {
              _this.favouriteJobDescription = response.data;
          },
          onError = (error) => {
              console.log(error);
          };
      _this.favouriteJobDescriptionService.getFavouriteJobDescription(jobId);
      _this.favouriteJobDescriptionService.activePromise.then(onSuccess, onError);
  }



};

