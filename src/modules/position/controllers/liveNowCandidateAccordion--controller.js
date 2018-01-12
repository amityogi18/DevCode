let _this;
    

export class liveNowInterviewAccordionController {
  constructor($uibModal,$scope,$timeout,$filter,positionService,$rootScope,NgTableParams, dataTableService) {
    console.log("Inside liveNowInterviewAccordionController");
    _this = this;
    _this.$modal = $uibModal;
    _this.$timeout = $timeout;
    _this.$filter = $filter;
    _this.positionService = positionService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.positionId = _this.pid;
    _this.interviewId = _this.interviewid;
    _this.liveNowCandidateList = [];  
    
    _this.getliveNowCandidates = function() {
     _this.liveNowCandidatetableParams = new NgTableParams({
          page : 1,
          count: 10
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
                       _this.liveNowCandidateCount = response.data.total;
                       _this.liveNowCandidateList = response.data.data || [];                      
                    if(_this.liveNowCandidateList && _this.liveNowCandidateList.length > 0){
                            _this.totalliveNowCandidates = _this.liveNowCandidateCount;                                                        
                           params.total(_this.liveNowCandidateCount);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.liveNowCandidatetableParams);  
                            }
                            return (_this.liveNowCandidateList);
                    }                  
                   },
                     onError = (error) => {
                       _this.totalliveNowCandidates = 0;
                   };
                   if(_this.positionId){
                        _this.positionService.getliveNowCandidateList(_this.positionId, queryURL);
                         return _this.positionService.activePromise.then(onSuccess, onError);
                   }
               
          }
    });
     _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
  };
     _this.$onInit = function(){
        _this.isEditMode = this.mode;
        _this.interviewId = this.interviewid;
        _this.positionId = this.pid;        
        _this.getliveNowCandidates(_this.positionId);
    };
};
  
}

liveNowInterviewAccordionController.$inject = ['$uibModal', '$scope','$timeout','$filter','positionService','$rootScope','NgTableParams', 'dataTableService'];

