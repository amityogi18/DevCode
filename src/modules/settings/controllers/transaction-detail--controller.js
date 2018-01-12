import _ from 'lodash';

/*
 @name TransactionDetailController-Controller
 @param {Object}NgTableParams  This return the actual data and promise object.
 @param {Object} $scope This bind the value between controller and view.
 @param {Object}$element This act as alias for jquery function.
 @param {Object}$timeout This is the predefined service.
 @param {Object}$filter This is used for displaying filter data.
 */
export class transactionDetailController {
  constructor(NgTableParams, TransactionDetailService, $scope, $element, $timeout, $filter, dataTableService) {
    var _this = this;
    _this.TransactionDetailService = TransactionDetailService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.$scope = $scope;
    _this.$timeout = $timeout;
    _this.$element = $element;
    _this.searchText = "";
    _this.colNum = 6;
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
                      _this.transactionListCount = response.data.total;
                      _this.transactionList = response.data.data;
                      for(var i=0;i<_this.transactionList.length;i++){   
                          let tempTime = _this.transactionList[i].transactionTime;
                        _this.transactionList[i].transactionTime =  moment.utc(tempTime+'Z', 'YYYY-MM-DD HH:mm').local().format('MM-DD-YYYY  HH:mm');
                      }
                      
                      params.total(_this.transactionListCount);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.tableParams);  
                            }                         
                            return (_this.transactionList);

                        if(_this.TransactionDetailService.transactionList && _this.TransactionDetailService.transactionList.length > 0){
                        _this.totaltransactionList = _this.TransactionDetailService.transactionList.length;    
                            params.total(_this.TransactionDetailService.transactionList.length);
                             return(_this.TransactionDetailService.transactionList);
                        }     

                  },
                    onError = (error) => {
                        console.log(error);
                    };
                    _this.TransactionDetailService.gettransactionList(queryURL);
                    return _this.TransactionDetailService.activePromise.then(onSuccess, onError);

      }

    });
    _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };


    _this.checkboxes = {'checked': false, items: {}};


    // watch for check all checkbox
    _this.$scope.$watch('checkboxes.checked', function (value) {
      angular.forEach(_this.transactionList, function (item) {
        if (angular.isDefined(item.transactionId)) {
          _this.checkboxes.items[item.transactionId] = value;
        }
      });
    });

  }
}

transactionDetailController.$inject = ['NgTableParams','TransactionDetailService', '$scope', '$element', '$timeout', '$filter', 'dataTableService'];
