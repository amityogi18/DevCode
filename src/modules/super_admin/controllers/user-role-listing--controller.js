let _this;
const EMAIL_REGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
/*
 @users--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} userRoleSaService description - returns the object and provides all the values related to the users.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class UserRoleListingController {
  /** @ngInject  */
  constructor(NgTableParams, UserRoleService, $timeout, $filter, AdminDepartmentService, CandidateProfileService, GrowlerService, SuperAdminService, $state, UtilsService, dataTableService) {
    _this = this;
    _this.UserRoleService = UserRoleService;
    _this.$timeout = $timeout;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.GrowlerService = GrowlerService;
    _this.SuperAdminService = SuperAdminService;
    _this.UtilsService = UtilsService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.$state = $state;
    _this.companyList= [];
    _this.getCompanyList();
    _this.selectedUserId =[];
    _this.selectedInactiveUserId =[];
    _this.statusId = true;
    _this.companyUserStatus = 'active';
    _this.userTableFilter = {};
    _this.searchActiveCompany;

    _this.userTableParams = new NgTableParams(
      {
        page: 1,
        count: 5,
        filter: _this.userTableFilter
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
            queryString += "status=active";
          }
          queryURL += `${queryString}&limit=${count}&page=${page}`;
          let onSuccess = (response) => {

              _this.userList = _this.changeListToLocal(response.data.data);
              _this.userListCount = response.data.total;
              if (_this.userList &&
                _this.userList.length > 0) {
                params.total(_this.userListCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols, _this.userTableParams);
                }
                return (_this.userList);

              }
            },
            onError = (error) => {
              console.log(error);
            };

          _this.UserRoleService.getActiveUsersList(queryURL);
          return _this.UserRoleService.activePromise.then(onSuccess, onError);
        }
      });

    _this.toggle = function() {
      _this.dataTableService.setColumn(-1);
      _this.dataTableService.toggle(_this.cols, event.target.value);
    };

  }

  getUserStatus(){
    _this.userTableFilter.status =  _this.companyUserStatus;
  }

  getCompanyList(){
    let onSuccess = (response) => {
        var allCompany = {
          id: '',
          name: 'All'
        };
        _this.companyList = response.data;
        _this.companyList.unshift(allCompany);
      },
      onError = (error) => {
        console.log(error);
      }
    _this.SuperAdminService.getCompanyList();
    _this.SuperAdminService.activePromise.then(onSuccess, onError);
  }

  getCompanyData(){
    // _this.userTableFilter.companyId = _this.id;
    _this.userTableFilter.companyId = (_this.id === " ") ? "" : _this.id;
  }
  
  clearSearchActiveCompany(){
    _this.searchActiveCompany ="";
  }
  
  viewUser(userData) {
    _this.id = userData.id;
    _this.firstName = userData.firstName;
    _this.lastName = userData.lastName;
    _this.email = userData.email;
    _this.role = userData.role;
    _this.status = userData.status;
    _this.lastVisited = userData.lastVisited;

  }

  showRoleId(roles){
    _this.roleId = roles.id;
    _this.name = roles.name;
  }

  // addInactiveUserId(element, userId){
  //   if(element.currentTarget.checked){
  //     _this.selectedInactiveUserId.push(userId);
  //   }else{
  //     if(_this.selectedInactiveUserId.length > 0){
  //       for(var i =0; _this.selectedInactiveUserId.length > i; i++){
  //         if(_this.selectedInactiveUserId[i] == userId){
  //           _this.selectedInactiveUserId.splice(i, 1);
  //         }
  //       }
  //     }
  //   }
  // }

  addActiveUserId(element, data){
    if(data.statusId == 1){
      if(element.currentTarget.checked){
        _this.selectedUserId.push(data.id);
      }else{
        if(_this.selectedUserId.length > 0){
          for(var i =0; _this.selectedUserId.length > i; i++){
            if(_this.selectedUserId[i] == data.id){
              _this.selectedUserId.splice(i, 1);
            }
          }
        }
      }
    }
    if(data.statusId == 2){
      if(element.currentTarget.checked){
      _this.selectedInactiveUserId.push(data.id);
      }else{
        if(_this.selectedInactiveUserId.length > 0){
          for(var i =0; _this.selectedInactiveUserId.length > i; i++){
            if(_this.selectedInactiveUserId[i] == data.id){
              _this.selectedInactiveUserId.splice(i, 1);
            }
          }
        }
      }
    }
  }

  deleteUser() {
    let onSuccess = () => {

        _this.GrowlerService.growl({
          type: 'success',
          message: "Status Changed Successfully",
          delay: 2000
        });
        _this.selectedUserId =[];
        _this.selectedInactiveUserId =[];
        _this.onClose();

      },
      onError = (error) => {
        console.log(error);
      },

      userData = {
        statusId : 2,
        userIds : _this.selectedUserId
      };
    _this.UserRoleService.deleteUser(userData);
    _this.UserRoleService.activePromise.then(onSuccess, onError);
  }

  changeUserStatus(type) {
    let statusData = {};
    if(type === 1){
      statusData = {
        statusId : 1,
        userIds : _this.selectedInactiveUserId
      };
    }else
    {
      statusData = {
        statusId : 2,
        userIds : _this.selectedUserId
      };
    }
    let onSuccess = () => {

        _this.GrowlerService.growl({
          type: 'success',
          message: "Status Changed Successfully",
          delay: 2000
        });
        _this.selectedUserId =[];
        _this.selectedInactiveUserId =[];
        _this.onClose();

      },
      onError = (error) => {
        console.log(error);
      };
    _this.UserRoleService.changeUserStatus(statusData);
    _this.UserRoleService.activePromise.then(onSuccess, onError);
  }

  onClose(){
    _this.userTableParams.reload();
    //_this.$state.go(_this.$state.current, {}, {reload: true});
  }
  hideUserModal(){
    $("#usrRoleModal").modal("hide");
  }

  changeListToLocal(userList){
    if(userList && userList.length > 0){
      for(let i = 0; userList.length > i; i++){
        userList[i].lastVisited = _this.UtilsService.getLocalTimeFromGMT(userList[i].lastVisited, 24, 'MDY');
      }
    }

    return userList;
  }
}
