let _this,
    _activePromise;

export class PaymentPlansSaController {
	/** @ngInject  */
  constructor(NgTableParams, SuperAdminService, UtilsService, dataTableService) {
    _this = this;
    _this.SuperAdminService = SuperAdminService;
    _this.UtilsService = UtilsService;
     _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.dataPlan = {};
    _this.conferenceData ={};
    _this.interviewData ={};
    _this.companyFilterList = [];
    _this.getPlans();
    _this.isInterview =  1;
     _this.productId = 1;
     _this.getCompanyList();
    _this.customPlansTableFilter = {};
    _this.searchActiveCompany;
    
     _this.customPlansTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.customPlansTableFilter
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
                    }
                    queryURL += `${queryString}&limit=${count}&page=${page}`;
                    let onSuccess = (response) => {

                            _this.customPlanList = _this.changeListToLocal(response.data.data);
                            _this.customPlanListCount = response.data.total;
                            if (_this.customPlanList &&
                                _this.customPlanList.length > 0) {
                                params.total(_this.customPlanListCount);                                
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.customPlansTableParams);  
                            }
                            return (_this.customPlanList);
                            }
                        },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.SuperAdminService.getSaCustomPlanData(queryURL);
                    return _this.SuperAdminService.activePromise.then(onSuccess, onError);
                }
            });
         _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
  }
  
  clearSearchActiveCompany(){
    _this.searchActiveCompany = '';
  }
  
  getPlans(){
    let onSuccess = (response) => {
        _this.dataPlan = response.data || [];
        console.log(_this.dataPlan);
        for(var i=0;i<_this.dataPlan.length;i++){
            if(_this.dataPlan[i].id === 2){
                 _this.conferenceData =_this.dataPlan[i].plans || []; 
                 console.log(_this.conferenceData);                
            } 
            if(_this.dataPlan[i].id === 1){
                _this.interviewData = _this.dataPlan[i].plans || [];
                console.log(_this.interviewData);
            }
        }    
      },
      onError = (error) => {
        console.log(error);
      }
    _this.SuperAdminService.getSaPlansData();
    _this.SuperAdminService.activePromise.then(onSuccess, onError);
  }
    
    getCompanyList(){
          let onSuccess = (response) => {
            _this.companyList = response.data;
            _this.id = _this.companyList[0].id;
            _this.companyFilterList = angular.copy(response.data, _this.companyFilterList);
    
            for(let i = 0; _this.companyFilterList.length > i;i++){
              if(_this.companyFilterList[i].name === 'I-TECH'){
                _this.companyFilterList.splice(i, 1);
              }
            }
            _this.companyFilterList.unshift({ id: '',  name: 'All'});
    
          },
          onError = (error) => {
            console.log(error);
          }
        _this.SuperAdminService.getCompanyList();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
      }
      
    getCompanyData(){
        _this.customPlansTableFilter.search = (_this.search === "All") ? "" : _this.search;
      }

    onClose(){
        _this.customPlansTableParams.reload();
    }

    changeListToLocal(customPlanList){
        if(customPlanList && customPlanList.length > 0){
            for(let i = 0; customPlanList.length > i; i++){
                customPlanList[i].createdAt = _this.UtilsService.getLocalTimeFromGMT(customPlanList[i].createdAt, 24, 'MDY');
            
            }
        }

        return customPlanList;
    }

    viewPlanDetails(customPlan) {
        _this.plan = {};
        _this.plan = customPlan;
    }
}