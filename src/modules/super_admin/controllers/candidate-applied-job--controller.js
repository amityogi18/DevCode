let _this;
export class CandidateAppliedJobController {
  /** @ngInject  */
  constructor(CandidateAppliedJobService, GrowlerService, $stateParams, NgTableParams, UtilsService, dataTableService) {
    _this = this;
    _this.GrowlerService = GrowlerService;
    _this.CandidateAppliedJobService = CandidateAppliedJobService;
    _this.candidateAppliedJobList = [];
    _this.$stateParams = $stateParams;
    _this.UtilsService = UtilsService;
    _this.dataTableService = dataTableService;
    _this.searchFilter = {};
    //_this.getCandidateAppliedList();

    _this.candidateAppliedTableParams = new NgTableParams(
      {
        page: 1,
        count: 5,
        filter: _this.searchFilter
      },
      {
        counts: [5, 10, 20],
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
              sortFields.push(`${key}&order=${value}`);
            });

            angular.forEach(filter, (value, key) => {
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
              _this.candidateAppliedList = _this.changeListToLocal(response.data.data);
              _this.candidateAppliedCount = response.data.total;
              if (_this.candidateAppliedList && _this.candidateAppliedList.length > 0) {
                params.total(_this.candidateAppliedCount);
                if (!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols, _this.candidateAppliedTableParams);
                }
                return (_this.candidateAppliedList);
              }
            },
              onError = (error) => {
                console.log(error);
              };              
              _this.CandidateAppliedJobService.getCandidateAppliedList(queryURL);
              return _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);
        }
      });
  }

  getCandidateAppliedList() {
    let onSuccess = (response) => {
      _this.candidateAppliedJobList = response.data.data;
      _this.appliedCandidateCount = response.data.total;
    },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateAppliedJobService.getCandidateAppliedList();
    _this.CandidateAppliedJobService.activePromise.then(onSuccess, onError);
  }

  changeListToLocal(candidateAppliedList){
    if(candidateAppliedList && candidateAppliedList.length > 0){
      for(let i = 0; candidateAppliedList.length > i; i++){
        candidateAppliedList[i].appliedDateLocal = _this.UtilsService.getLocalTimeFromGMT(candidateAppliedList[i].appliedDate, 24, 'MDY');      
      }
    }
    return candidateAppliedList;
  }
}