import _ from 'lodash';
var _this;
/*
 @candidate--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} clientsService description - returns the object and provides all the values related to the company candidates.
 @param {object} $scope This is act like glue between view and controller.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class candidateprofilesaController {
  /** @ngInject  */
  constructor(NgTableParams, $document, candidateprofilesaService, $scope, $timeout, $filter, GrowlerService, UtilsService, dataTableService) {
    _this = this;
    _this.candidateprofilesaService = candidateprofilesaService;
    _this.$scope = $scope;
    _this.$timeout = $timeout;
    _this.$document = $document;
    _this.GrowlerService = GrowlerService;
    _this.UtilsService = UtilsService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.tableSelection = [];
    _this.tableSelectionDeleted = [];
    _this.searchText = "";
    _this.sharableLink = '';
    _this.searchFilter = {};
    _this.candidateStatus = 1;
    _this.tableParams = new NgTableParams({
      page: 1,
      count: 5,
      filter: _this.searchFilter
    }, {
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
          }else{
            queryString += "statusId=1";
          }
          queryURL += `${queryString}&limit=${count}&page=${page}`;
          let onSuccess = (response) => {
            _this.candidateProfileList = _this.changeListToLocal(response.data.data);
            _this.candidateProfileListCount = response.data.total;
            params.total(_this.candidateProfileListCount);
            if (!_this.dataTableService.totalColumn.length) {
              _this.dataTableService.initTable(_this.cols, _this.tableParams);
            }
            return (_this.candidateProfileList);
          },
            onError = (error) => {
              console.log(error);
            };
          _this.candidateprofilesaService.getcandidateList(queryURL);
          return _this.candidateprofilesaService.activePromise.then(onSuccess, onError);
        }
      });
    
    _this.toggle = function (selectedValue) {
      _this.dataTableService.setColumn(-1);
      _this.dataTableService.toggle(_this.cols, event.target.value);
    };
  }

  getCandidateStatus(){
    _this.searchFilter.statusId =  _this.candidateStatus;
  }

  addSelectedCandidateId(element, data) {
    
    let candidate = {
      companyId: data.companyId,
      candidateId: data.candidateId
    };

    if(data.status == "ACTIVE"){
      if (element.currentTarget.checked) {
        _this.tableSelection.push(candidate);
      } else {
        _this.tableSelection.pop(candidate);

        if(_this.tableSelection.length > 0){
            for(let i = 0; _this.tableSelection.length > i; i++){
              if(_this.tableSelection[i].candidateId == data.candidateId){
                _this.tableSelection.splice(i, 1);
              }
            }
          }
      }
    }
    else{
      if (element.currentTarget.checked) {
        _this.tableSelectionDeleted.push(candidate);
      } else {
        if(_this.tableSelectionDeleted.length > 0){
            for(let j = 0; _this.tableSelectionDeleted.length > j; j++){
              
              if(_this.tableSelectionDeleted[j].candidateId == data.candidateId){
                _this.tableSelectionDeleted.splice(j, 1);
              }
              if(_this.tableSelectionDeleted.length === 1){
                  _this.tableSelectionDeleted = [];
              }
            }
          }
      }
    }
  };

  deleteCandidate(status) {
    let tableSelection = [], statusId;
    if (status === 'Active') {
      statusId = 1;
      tableSelection = _this.tableSelectionDeleted;
    } else {
      statusId = 2;
      tableSelection = _this.tableSelection;
    }

    let companyData = {
      candidates: tableSelection,
      statusId: statusId
    }

    if (tableSelection && tableSelection.length > 0) {
      _this.candidateprofilesaService.deleteCandidate(companyData);
      _this.candidateprofilesaService.activePromise.then((response) => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Status Changed Successfully ",
          delay: 2000
        });
        _this.tableSelection = [];
        _this.tableSelectionDeleted = [];
        _this.tableParams.reload();
        
      }, (error) => {
        console.log(error);
      });
    }
  };
  copyLink(id, e) {
    let txtLink = $('#txt_' + id);
    txtLink.focus();
    txtLink.select();
    return document.execCommand("copy");
  }

  changeListToLocal(profileList) {
    if (profileList && profileList.length > 0) {
      for (let i = 0; profileList.length > i; i++) {
        profileList[i].registredAt = _this.UtilsService.getLocalTimeFromGMT(profileList[i].registredAt, 24, 'MDY');
        profileList[i].lastActive = _this.UtilsService.getLocalTimeFromGMT(profileList[i].lastActive, 24, 'MDY');
        profileList[i].lastUpdated = _this.UtilsService.getLocalTimeFromGMT(profileList[i].lastUpdated, 24, 'MDY');

      }
    }

    return profileList;
  }

}
