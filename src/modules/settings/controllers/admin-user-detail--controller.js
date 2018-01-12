let _this = this,
    _activePromise;

export class AdminUserDetailController {
	/** @ngInject  */
  constructor(AdminUserDetailService, NgTableParams, $window, dataTableService, GrowlerService) {
    _this = this;
    _this.AdminUserDetailService = AdminUserDetailService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.userTableFilter = {};
    _this.list = [];
    _this.selectedCheckboxes = [];
    _this.isDefaultChecked = false;
    _this.GrowlerService = GrowlerService;
    _this.userTableParams = new NgTableParams({
            page: 1,
            count: 5,
            filter: _this.userTableFilter
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

                        _this.userList = response.data.data;
                        for(var i=0; i<_this.userList.length;i++){
                            if(_this.userList[i].role === 'EVALUATOR' || _this.userList[i].role === 'INTERVIEWER'){
                                (_this.list).push(_this.userList[i]);
                            }
                        }
                        _this.userListCount = response.data.total;
                       
                            params.total(_this.userListCount);
                            if(!_this.dataTableService.totalColumn.length) {
                               _this.dataTableService.initTable(_this.cols, _this.userTableParams);  
                            }
                            return (_this.userList);
                        
                    },
                onError = (error) => {
                    console.log(error);
                };

                _this.AdminUserDetailService.getUser(queryURL);
               return  _this.AdminUserDetailService.activePromise.then(onSuccess, onError);
            }
        });
    _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
}
  onClose(){
       _this.userTableParams.reload();
  }

  addDefaultUser(e, id){
    _this.userBoxes = [];
    _this.selectedData = {};
    _this.selectedData.evaluatorId = id;
    _this.selectedData.default = e ? 0 : 1;
    _this.isFound = false;
    _this.isDefaultChecked = true;
    for(var i =0; i < _this.selectedCheckboxes.length; i++){
        if(_this.selectedCheckboxes[i].evaluatorId == _this.selectedData.evaluatorId){
            _this.selectedCheckboxes[i].default = _this.selectedData.default;
            _this.isFound = true;
        }
    }
    if(!_this.isFound){
        _this.selectedCheckboxes.push(_this.selectedData);
    }   
    if(_this.selectedCheckboxes.length > 0){
           if(_this.list.length ===_this.selectedCheckboxes.length){
                for(var j=0; j < _this.selectedCheckboxes.length; j++){
                    _this.userBoxes.push(_this.selectedCheckboxes[j].default);
                    _this.isDefaultChecked = _this.userBoxes.includes(1);
                 }
           }
       }
  }

  setDefaultUser(){
    let onSuccess = () => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Default user Added Successfully",
          delay: 2000
        });
         _this.userTableParams.reload();
         _this.selectedCheckboxes = [];
         _this.isDefaultChecked = false;
      },
      onError = (error) => {
        console.log(error);
      };
      
      var defaultUserData = _this.selectedCheckboxes;

    _this.AdminUserDetailService.setDefaultUser(defaultUserData);
    _this.AdminUserDetailService.activePromise.then(onSuccess, onError);
  }
}
