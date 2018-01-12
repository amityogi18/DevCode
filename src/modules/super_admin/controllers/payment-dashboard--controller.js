import _ from 'lodash';
let _this;
export class PaymentDashboardController {
	/** @ngInject  */
  constructor(NgTableParams, PaymentDashboardService, $timeout, SuperAdminService, UtilsService, dataTableService) {
    _this = this;
    _this.PaymentDashboardService = PaymentDashboardService;
    _this.$timeout = $timeout;
    _this.SuperAdminService = SuperAdminService;
    _this.UtilsService = UtilsService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.companyList= [];
    _this.getCompanyList();
    _this.paymentTableFilter = {};
    _this.paymentTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.paymentTableFilter
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
                      _this.paymentList = _this.changeDataToLocal(response.data.data);
                      _this.paymentListCount = response.data.total;
                      if (_this.paymentList &&
                          _this.paymentList.length > 0) {                                
                      params.total(_this.paymentListCount);                                
                      if(!_this.dataTableService.totalColumn.length) {
                          _this.dataTableService.initTable(_this.cols, _this.paymentTableParams);  
                      }
                      return (_this.paymentList);
                      }
                  },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.PaymentDashboardService.getPaymentDetails(queryURL);
                    return _this.PaymentDashboardService.activePromise.then(onSuccess, onError);
                }
            });
            
             _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
            
    _this.dateOptions = {
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(),
        startingDay: 1
       };

       _this.popup = {
          opened: false
        };
       _this.positionExpiryPopup = {
          opened: false
        };
       _this.fromDatePopup = {
          opened: false
        };
      _this.toDatePopup = {
         opened: false
      };
      _this.dateformat = 'MM-dd-yyyy';
      _this.altInputFormats = ['M!/d!/yyyy'];
        }
        
    openFromDatePopup(){
      _this.fromDatePopup.opened = true;
    }
    
    openToDatePopup(){
      _this.toDatePopup.opened = true;
    }
    
    getFromDate(){
      _this.localFromDate = _this.changeListToLocal(_this.fromDate);
      _this.paymentTableFilter.fromDate = _this.localFromDate;
    }
    
    getToDate(){
      _this.localToDate = _this.changeListToLocal(_this.toDate);
      _this.paymentTableFilter.toDate = _this.localToDate;
    }
        
    getCompanyList(){
       let onSuccess = (response) => {
          _this.companyList = response.data;
            for(let i = 0; _this.companyList.length > i;i++) {
                if (_this.companyList[i].name === 'I-TECH') {
                    _this.companyList.splice(i, 1);
                }
            }
           // _this.companyFilterList.unshift(allCompany);
             _this.companyFilterList = angular.copy(response.data, _this.companyFilterList);
             _this.companyFilterList.unshift({id: '', name: 'All'});
          },
          onError = (error) => {
            console.log(error);
          }
        _this.SuperAdminService.getCompanyList();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
      }
      
    getCompanyData(){
        // _this.paymentTableFilter.companyName = _this.name;
       _this.paymentTableFilter.companyId = (_this.id === "All") ? "" : _this.id;
      }
      
    changeListToLocal(dateList){
      return moment.utc(dateList, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY-MM-DD');
    }

    changeDataToLocal(clientList){
      if(clientList && clientList.length > 0){
        for(let i = 0; clientList.length > i; i++){
          clientList[i].transactionTime = moment.utc(clientList[i].transactionTime, 'YYYY-MM-DD HH:mm:ss').local().format('MM-DD-YYYY HH:mm:ss');
        }
      }

      return clientList;
  }
  }
