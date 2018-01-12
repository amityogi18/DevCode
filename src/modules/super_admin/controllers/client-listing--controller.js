let _this;
/*
 @clients--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} ClientsService description - returns the object and provides all the values related to the clients.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class ClientListingController {
  /** @ngInject  */
  constructor(NgTableParams, ClientsService, $timeout, GrowlerService, SuperAdminService, $state, UtilsService, dataTableService) {
    _this = this;
    _this.ClientsService = ClientsService;
    _this.GrowlerService = GrowlerService;
    _this.SuperAdminService = SuperAdminService;
    _this.UtilsService = UtilsService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.$timeout = $timeout;
    _this.$state = $state;
    _this.selectedActiveCompanyId = [];
    _this.selectedInactiveCompanyId = [];
    _this.companyList= [];
    _this.getCompanyList();
    _this.searchFilter = {};
    _this.searchActiveCompany;
    _this.clientStatus = 1;

    _this.clientTableParams = new NgTableParams(
      {
        page: 1,
        count: 5,
        filter: _this.searchFilter
      },
      {
        counts: [5, 10, 20],
        getData: function(params) {
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

              _this.clientList = _this.changeListToLocal(response.data.data);
              _this.clientListCount = response.data.total;
              if (_this.clientList &&
                _this.clientList.length > 0) {
                params.total(_this.clientListCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols, _this.clientTableParams);

                }
                return (_this.clientList);
              }
            },
            onError = (error) => {
              console.log(error);
            };

          _this.ClientsService.getActiveClientsList(queryURL);
          return _this.ClientsService.activePromise.then(onSuccess, onError);
        }
      });

    _this.toggle = function(selectedValue) {
      _this.dataTableService.setColumn(-1);
      _this.dataTableService.toggle(_this.cols, event.target.value);
    };
  }


  getCompanyList(){
    let onSuccess = (response) => {
        if(angular.isDefined(response.data) && response.data.length > 0){
          _this.companyList = response.data;
          let all = {id : -1, name : "All"};
          _this.companyList.unshift(all);
          for(let i = 0; _this.companyList.length > i;i++){
            if(_this.companyList[i].name === 'I-TECH'){
              _this.companyList.splice(i, 1);
            }
          }
        }
      },
      onError = (error) => {
        console.log(error);
      };
    _this.SuperAdminService.getCompanyList();
    _this.SuperAdminService.activePromise.then(onSuccess, onError);
  }

  getClientStatus(){
    _this.searchFilter.statusId =  _this.clientStatus;
  }

  getCompanyData(){
    _this.searchFilter.companyName = (_this.companyName === "All") ? "" : _this.companyName;
  }
  
  clearSearchActiveCompany(){
    _this.searchActiveCompany ="";
  }


  addActiveInactiveCompanyId(element, clients){
      if(clients.statusId == 1){        
        if(element.currentTarget.checked){
              _this.selectedActiveCompanyId.push(clients.companyId);
        }
        else{
          if(_this.selectedActiveCompanyId.length > 0){
            for(let i =0; _this.selectedActiveCompanyId.length > i; i++){
              if(_this.selectedActiveCompanyId[i] == clients.companyId){
                _this.selectedActiveCompanyId.splice(i, 1);
              }
            }
          }
        }
      }
      
      if(clients.statusId == 2){        
        if(element.currentTarget.checked){
              _this.selectedInactiveCompanyId.push(clients.companyId);
        }
        else{
          if(_this.selectedInactiveCompanyId.length > 0){
            for(let j = 0; _this.selectedInactiveCompanyId.length > j; j++){
              
              if(_this.selectedInactiveCompanyId[j] == clients.companyId){
                _this.selectedInactiveCompanyId.splice(j, 1);
              }              
            }
          }
        }
      }
  }


  changeClientStatus(status) {
    let onSuccess = () => {
        _this.GrowlerService.growl({ type: 'success', message: "Status Changed Successfully", delay: 300 });
        if(status === 1){
          _this.selectedInactiveCompanyId = [];
        }else{
          _this.selectedActiveCompanyId = [];
        }
        _this.onClose();
      },
      onError = (error) => {
        console.log(error);
      },
      statusData = {
        statusId : status,
        companyIds : (status === 1) ? _this.selectedInactiveCompanyId : _this.selectedActiveCompanyId
      };
    _this.ClientsService.changeClientStatus(statusData);
    _this.ClientsService.activePromise.then(onSuccess, onError);
  }

  onClose(){
    _this.clientTableParams.reload();
    //_this.$state.go(_this.$state.current, {}, {reload: true});
  }

  changeIcon(element, index){
    //console.log(id);
    let id = angular.element("#"+element.currentTarget.id).attr("data-target");
    let rowId =  angular.element("#"+element.currentTarget.id).attr("data-rowId");
    angular.element("tr.collapse.in:not("+id+")").removeClass("in").attr("aria-expanded",false);
    angular.element("tr.active-row:not(#"+rowId+")").removeClass("active-row")
    $('#'+element.currentTarget.id).toggleClass('inactv');
    $('#'+element.currentTarget.id).parents('tr').toggleClass('active-row');
    $('#'+element.currentTarget.id).parents('tr').next('.full-row').slideToggle('slow');
  }

  changeListToLocal(clientList){
    if(clientList && clientList.length > 0){
      for(let i = 0; clientList.length > i; i++){
        clientList[i].registrationDate = _this.UtilsService.getLocalTimeFromGMT(clientList[i].registrationDate, 24, 'MDY');
        if(angular.isDefined(clientList[i].productsPlans) && clientList[i].productsPlans !== null && clientList[i].productsPlans.length > 0){
          for(let j = 0; clientList[i].productsPlans.length > j; j++){
            clientList[i].productsPlans[j].planPurchaseDate = _this.UtilsService.getLocalTimeFromGMT(clientList[i].productsPlans[j].planPurchaseDate, 24, 'MDY');
            clientList[i].productsPlans[j].planExpireDate = _this.UtilsService.getLocalTimeFromGMT(clientList[i].productsPlans[j].planExpireDate, 24, 'MDY');
          }
        }
      }
    }

    return clientList;
  }
  showUpdateClients(clients) {
    _this.client = {};
    _this.client = clients;
  }

}
