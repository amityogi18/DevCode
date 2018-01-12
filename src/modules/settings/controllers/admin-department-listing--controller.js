let _this;

export class AdminDepartmentListingController {
	/** @ngInject  */
    constructor(AdminDepartmentService, NgTableParams, $window, dataTableService) {
        _this = this;        
        _this.adminDepartmentService = AdminDepartmentService; 
        _this.dataTableService = dataTableService; 
        _this.dataTableService.initTable([], {});
        _this.departmentTableFilter = {};
        _this.colNum = 6;
        console.log('Inside Admin Department Listing Controller');
        
        _this.departmentTableParams = new NgTableParams({
            page: 1,
            count: 10,
            filter: _this.departmentTableFilter
        }, {
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
                        _this.departmentListById = response.data.data;
                        _this.departmentListCount = response.data.total;                   
                                                        
                        params.total(_this.departmentListCount);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.departmentTableParams);  
                            }                       
                           return (_this.departmentListById);    
                    },
                    onError = (error) => {
                        console.log(error);
                    };

                _this.adminDepartmentService.getDepartmentByCompanyId(queryURL);
                return _this.adminDepartmentService.activePromise.then(onSuccess, onError);
            }
        });
        
        _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
             
    } 
    

    get activePromise() {
        return _this.adminDepartmentService.activePromise;
    }
    
     onClose(){
      _this.departmentTableParams.reload();
  }   
}
