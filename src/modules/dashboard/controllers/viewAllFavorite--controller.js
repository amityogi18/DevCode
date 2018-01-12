let _this;
export class viewAllFavoriteController {
	/** @ngInject  */
  constructor($state, $window, GrowlerService, NgTableParams, FavoriteCandidatesService, dataTableService, $storage) {
    _this = this;
    _this.$state = $state;
    _this.$window = $window;
    _this.GrowlerService = GrowlerService;
    _this.FavoriteCandidatesService = FavoriteCandidatesService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.$storage = $storage;
    _this.colNum = 6;
    _this.favoriteCandidates = '';
    _this.compareList = [];
    _this.selectedCandidate = {};
  
    console.log('Inside quickStasticsController constructor');
    
     _this.favoriteTableParams = new NgTableParams({
        page : 1,
        count: 5,
        filter :  _this.searchFavoriteFilter
       }, {
         counts:[5,10,20],
         getData: function (params) {
           let filter = params.filter(),
             sorting = params.sorting(),
             count = params.count(),
             page = params.page(),
             filterFields = [],
             sortFields = [],
             queryString = '',
             queryURL = '?';
           angular.forEach(sorting, (value, key) => {
             console.log(key + '---' + value);
             sortFields.push(`${key}&order=${value}`);
           });
           angular.forEach(filter, (value, key) => {
             console.log(key + '---' + value);
             filterFields.push(`${key}=${value}`);
           });
           if (sortFields.length) {
             queryString += `orderBy=${sortFields.join('&')}&`;
           }
           if (filterFields.length) {
             queryString += filterFields.join('&');
           }
           queryURL += `${queryString}&limit=${count}&page=${page}`;
           let onSuccess = (response) => {

               _this.favoriteCandidateList = response.data.data;
               _this.favoriteCandidateListCount = response.data.total;
               if(_this.favoriteCandidateList
                 && _this.favoriteCandidateList.length > 0){                 
                 params.total(_this.favoriteCandidateListCount);              
                if(!_this.dataTableService.totalColumn.length) {
                   _this.dataTableService.initTable(_this.cols, _this.favoriteTableParams);  
                }
                return (_this.favoriteCandidateList);
               }

             },
             onError = (error) => {

               console.log(error);
             };

           _this.FavoriteCandidatesService.getfavoriteCandidates(queryURL);
           return _this.FavoriteCandidatesService.activePromise.then(onSuccess, onError);
       }
  });
   _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
  
      _this.addSelectedCandidate = function (selectedCandidate) {
            var isPresent = false;
            if (event.currentTarget.checked) {
                for (var i = 0; i < _this.compareList.length; i++) {
                    if (JSON.stringify(_this.compareList[i]) == JSON.stringify(selectedCandidate)) {
                        isPresent = true;
                    }
                }
                if (!isPresent) {
                    selectedCandidate['ischecked'] = true;
                    _this.compareList.push(selectedCandidate);
                }
            } else {
                for (var i = 0; i < _this.compareList.length; i++) {
                    if (JSON.stringify(_this.compareList[i]) == JSON.stringify(selectedCandidate)) {
                        selectedCandidate['ischecked'] = false;
                        _this.compareList.splice(i, 1);
                    }
                }
            }
          
        };
  }
  
    viewCandidate(candidateId){
      let tempCandidateIdArray =[];
        if (candidateId && candidateId !== null && candidateId !== "") {
           tempCandidateIdArray.push(candidateId);
            this.redirectToCompare(tempCandidateIdArray);
        }
    };
  
    compareCandidates(){      
      if (this.compareList && this.compareList.length > 0) {
            let candidateIdArray = this.compareList.map((v) => {
                return v.candidateId;
              });
           this.redirectToCompare(candidateIdArray);
        }
       
    };
    
    redirectToCompare(candidateIdArray){
            var x = location.href;
            var n = x.indexOf("/", 8);
            var res = x.slice(0, n);
            this.$storage.setItem('compare-positionId', this.pid);
            this.$storage.setItem('compareIds', candidateIdArray);
            this.$storage.setItem('compare-interviewId', this.interviewId);
            window.open(res+"/candidate-compare");
    }
//
//  getfavoriteCandidates() {
//    let onSuccess = (response) => {
//        _this.favoriteCandidates = response.data.data;
//      },
//      onError = (error) => {
//        console.log(error);
//      };
//    _this.FavoriteCandidatesService.getfavoriteCandidates();
//    _this.FavoriteCandidatesService.activePromise.then(onSuccess, onError);
//  }
//
//  filterFavouriteCandidate() {
//    let returnCandidateIdArray = _this.getAllCandidateId();
//    _this.$state.go('app.compare-candidate', { candidateId: returnCandidateIdArray, positionId : '', interviewId : ''});
//  }

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



 