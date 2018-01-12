let _this;
/*
 @companycandidate--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} clientsService description - returns the object and provides all the values related to the company candidates.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class companycandidateController {
  /** @ngInject  */
  constructor(NgTableParams, companycandidateService, AuthService, $timeout, InterviewService, AdminDepartmentService, locationService, CandidateProfileService, GrowlerService, $state, $window, SuperAdminService, dataTableService, $storage) {
    _this = this;
    _this.companycandidateService = companycandidateService;
    _this.AuthService = AuthService;
    _this.$timeout = $timeout;
    _this.InterviewService = InterviewService;
    _this.adminDepartmentService = AdminDepartmentService;
    _this.locationService = locationService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.GrowlerService = GrowlerService;
    _this.SuperAdminService = SuperAdminService;
    _this.dataTableService = dataTableService;
    _this.$storage = $storage;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.$state = $state;
    _this.$window = $window;
    _this.tableSelection = [];
    _this.tableSelectionDelete = [];
    _this.searchFilter = {};
    _this.companyList= [];
    _this.getCompanyList();
    _this.companyCandidateStatus = 'active';
    _this.searchActiveCompany;
    _this.tableParams = new NgTableParams({
      page : 1,
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
            queryString += "status=active";
          }
        queryURL += `${queryString}&limit=${count}&page=${page}`;
        let onSuccess = (response) => {

            _this.candidateStatusCount = response.data.statusCounts;
            _this.candidateListCount = response.data.total;
            _this.candidateList = response.data.data;
            if (response.data.data && response.data.data.length > 0) {
              params.total(_this.candidateListCount);
              if(!_this.dataTableService.totalColumn.length) {
                _this.dataTableService.initTable(_this.cols, _this.tableParams);
              }
              return (_this.candidateList);
            }

          },
          onError = (error) => {
            console.log(error);
          };
        _this.companycandidateService.getcandidateList(queryURL);
        return _this.companycandidateService.activePromise.then(onSuccess, onError);
      }
    });
  }

  getCompanyCandidateStatus(){
    _this.searchFilter.status =  _this.companyCandidateStatus;
  }

  getCompanyList(){
    let onSuccess = (response) => {
        var allCompany = {
          id: '',
          name: 'All'
        };
        _this.companyList = response.data;
        for(let i = 0; _this.companyList.length > i;i++){
          if(_this.companyList[i].name === 'I-TECH'){
            _this.companyList.splice(i, 1);
          }
        }
        _this.companyList.unshift(allCompany);

      },
      onError = (error) => {
        console.log(error);
      };
    _this.SuperAdminService.getCompanyList();
    _this.SuperAdminService.activePromise.then(onSuccess, onError);
  }

  getCompanyData(){
    _this.searchFilter.companyId = (_this.id === "All") ? "" : _this.id;
  }

  clearSearchActiveCompany(){
    _this.searchActiveCompany ="";
  }

  addSelectedCandidateId(element, data) {

    let candidate = {
      companyId : data.companyId,
      candidateId: data.candidateId
    };
    if(data.status == "ACTIVE"){
      if (element.currentTarget.checked) {
        _this.tableSelection.push(candidate);
      } else {
        _this.tableSelection.pop(candidate);
      }
    }else{
        if (element.currentTarget.checked) {
          _this.tableSelectionDelete.push(candidate);
      }else {
        if(_this.tableSelectionDelete.length > 0){
            for(let j = 0; _this.tableSelectionDelete.length > j; j++){
              
              if(_this.tableSelectionDelete[j].candidateId == data.candidateId){
                _this.tableSelectionDelete.splice(j, 1);
              }
              if(_this.tableSelectionDelete.length === 1){
                  _this.tableSelectionDelete = [];
              }
            }
          }
      }

    }
  };

  viewCandidate(candidateId){
    let tempCandidateIdArray =[];
    if (candidateId && candidateId !== null && candidateId !== "") {
      tempCandidateIdArray.push(candidateId);
      this.redirectToCompare(tempCandidateIdArray);
    }
  };

  compareCandidates(){
    let candidateIdArray = [];
    if (_this.tableSelection && _this.tableSelection.length > 0) {
      let candidateIdArray = _this.tableSelection.map((v) => {
        return v.candidateId;
      });
      this.redirectToCompare(candidateIdArray);
    }

  };

  redirectToCompare(candidateIdArray){
    var x = location.href;
    var n = x.indexOf("/", 8);
    var res = x.slice(0, n);
    this.$storage.setItem('compareIds', candidateIdArray);
    if(angular.isDefined(_this.$storage.getItem('compare-positionId'))){
      _this.$storage.removeItem('compare-positionId');
    }
    if(angular.isDefined(_this.$storage.getItem('compare-interviewId'))){
      _this.$storage.removeItem('compare-interviewId');
    }
    window.open(res+"/candidate-compare");
    _this.onClose();
  }

  changeStatus(status){
    let tableSelection = [];
    if(status === 'Active'){
      status = 1;
      tableSelection = _this.tableSelectionDelete;
    }else{
      status = 2;
      tableSelection = _this.tableSelection;
    }

    let companyData = {
      candidates : tableSelection,
      statusId : status
    }

    if (tableSelection && tableSelection.length > 0) {
      _this.companycandidateService.changeStatus(companyData);
      _this.companycandidateService.activePromise.then((response)=>{
        _this.GrowlerService.growl({
          type: 'success',
          message: 'Status Changed Successfully',
          delay: 2000
        });
        _this.tableSelection = [];
        _this.tableSelectionDelete = [];
        _this.onClose();
      },(error)=>{
        console.log(error);
      })
    }
  };

  onClose(){
    _this.tableParams.reload();
  }

}
