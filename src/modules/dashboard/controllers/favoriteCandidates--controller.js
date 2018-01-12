let _this;
export class favoriteCandidatesController {
	/** @ngInject  */
  constructor($state, GrowlerService, FavoriteCandidatesService) {
    _this = this;
    _this.$state = $state;
    _this.GrowlerService = GrowlerService;
    _this.FavoriteCandidatesService = FavoriteCandidatesService;
    _this.favoriteCandidates = '';
    _this.getfavoriteCandidates();
    console.log('Inside quickStasticsController constructor');
  }
 
  getfavoriteCandidates() {
    let query = "?&limit=5&page=1";
    let onSuccess = (response) => {
        _this.favoriteCandidates = response.data.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.FavoriteCandidatesService.getfavoriteCandidates(query);
    _this.FavoriteCandidatesService.activePromise.then(onSuccess, onError);
  }

  filterFavouriteCandidate() {
    let returnCandidateIdArray = _this.getAllCandidateId();
    _this.$state.go('app.compare-candidate', { candidateId: returnCandidateIdArray, positionId : '', interviewId : ''});
  }

  getAllCandidateId() {
    let returnCandidateIdArray = [];
    if (_this.favoriteCandidates.length > 0) {
      for (let i = 0; _this.favoriteCandidates.length > i; i++) {
        returnCandidateIdArray.push(_this.favoriteCandidates[i].id);
      }
    }
    return returnCandidateIdArray;
  }
}



 