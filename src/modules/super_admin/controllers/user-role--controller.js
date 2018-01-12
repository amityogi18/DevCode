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
export class UserRoleController {
	/** @ngInject  */
  constructor(UserRoleService, $timeout, $filter, AdminDepartmentService, CandidateProfileService, GrowlerService, SuperAdminService, $state) {
    _this = this;
    _this.UserRoleService = UserRoleService;
    _this.$timeout = $timeout;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.GrowlerService = GrowlerService;
    _this.SuperAdminService = SuperAdminService;   
    _this.$state = $state;
    _this.departmentList = [];
    _this.skillsetList = [];
    _this.companyList= [];
    _this.getDepartment();
    _this.getCompanyList();
    _this.rolesList = [];
    _this.getRoles();    
    _this.selectedUserId =[];
    _this.statusId = true;
    _this.searchDepartment;
    _this.searchSkill;
    _this.searchRole;
    _this.searchCompany;
    _this.isCompanyDisable = false;
    _this.selectedRole = "";
    if(_this.infoData && _this.infoData === 'edit'){
        _this.IsEdit = true;
        _this.showUpdateUser(_this.data);
    }else
    {
        _this.IsAdd = true;
    }    

//    _this.rolesTypeId  = {
//      "data" :[
//            { id : 2,  name : 'CO-ADMIN' },
//            { id : 3,  name : 'INTERVIEWER' },
//            { id : 4,  name : 'EVALUATOR' },
//            { id : 6,  name : 'RECRUITER' },
//          ]
//    }
//

  $(document).mouseup(function(e) {
        var container = $(".md-select-menu-container");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
    });
}
  clearSearchDepartment(){
    _this.searchDepartment ='';
  }
  
  clearSkillInput(){
    _this.searchSkill ='';
  }
  
  clearSearchRole(){
    _this.searchRole ='';
  }
  
  clearSearchCompany(){
    _this.searchCompany ='';
  }
    isInvalidEmail(email){
        _this.errormessage = "";
       if(angular.isDefined(email) && !EMAIL_REGEX.test(email)){
          _this.errormessage = "Enter Valid Email Id";
           _this.isvalidEmail = false;
        }
        else if(!angular.isDefined(email) || email === "" || email === null){
          _this.errormessage = " Please Enter Email Id";
        }else {
          _this.errormessage = "";
           _this.isvalidEmail = true;
        }
  };
 getCompanyList(){
        let onSuccess = (response) => {
            _this.companyList = response.data;
          },
          onError = (error) => {
            console.log(error);
          };
        _this.SuperAdminService.getCompanyList();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }
 
 getDepartment() {
        let onSuccess = (response) => {
                _this.departmentList = response.data.data;
            },
            onError = (error) => {};
        _this.AdminDepartmentService.getDepartment();
        _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
}
    
  getSkillSet(departmentId, isDepartmentChange){
      if(isDepartmentChange){
          _this.skillsetList = [];
          _this.skillsetId = "";
      };
    let onSuccess = (response) => {
        _this.skillsetList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.getSkillSet(departmentId);
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

    checkMandatoryFields() {
        if(_this.firstName && _this.firstName !== ''
            && _this.lastName && _this.lastName !== ''
            && _this.departmentId && _this.departmentId !== ''
            && _this.companyId && _this.companyId !== ''
            && _this.email && _this.email !== ''
            && _this.skillsetId && _this.skillsetId.length !== 0
            && _this.roles && _this.roles !== ''
            && _this.isvalidEmail === true
        ) {
            return true;
        }
        else{_this.userForm.$setSubmitted();
            return false;
        }
    }

  addUser() {
      console.log('hit');
      if(!angular.isDefined(_this.email) || _this.email === "" || _this.email === null){
          _this.errormessage = " Please Enter Email Id";
      }

      if (_this.checkMandatoryFields()) {
          let onSuccess = () => {
                  _this.GrowlerService.growl({
                      type: 'success',
                      message: "User Added Successfully",
                      delay: 2000
                  });
                  _this.close();
              },
              onError = (error) => {
                  console.log(error);
              };
        //   if (angular.isDefined(_this.skillsetId)) {
        //       _this.skillsetIdArray = _this.skillsetId.map((v) => {
        //          return v.id;
        //      });
            
          //}
          //console.log('skill list',_this.skillsetIdArray);
          let userData = {
              companyId: _this.companyId,
              firstName: _this.firstName,
              lastName: _this.lastName,
              email: _this.email,
              roleId: _this.roles,
              departmentId: parseInt(_this.departmentId),
              skillsetId:  _this.skillsetId

          };

          _this.UserRoleService.addUser(userData);
          _this.UserRoleService.activePromise.then(onSuccess, onError);
      }
  }
    showUpdateUser(user) {
        _this.isvalidEmail = true;

        if(user.roleId===8 || user.roleId===9 || user.roleId===10 || user.roleId===11 || user.roleId === 12 || user.roleId===13 || user.roleId===14 || user.roleId===15 || user.roleId===16 || user.roleId === 17){
         _this.isCompanyDisable = true;
         _this.selectedRole = user.role;
        }
        else{
          _this.isCompanyDisable = false;
        }
        //_this.roles = {};
        if(angular.isDefined(user.departmentId) && user.departmentId !== null){
            _this.getSkillSet(user.departmentId);
        }           
        _this.id = user.id;
        _this.firstName = user.firstName;
        _this.lastName = user.lastName;
        _this.email = user.email;
        //_this.roles.name = user.role;
        //_this.roles.id = user.roleId;
        _this.roles = user.roleId;
        _this.companyId = user.companyId;
        _this.departmentId = user.departmentId;
        _this.skillsetId = user.skills.map((v) => {
                  return v.id;
        });
       // _this.skillsetId = user.skills;
        _this.statusId = user.statusId;
        
    }
    
    showRoleId(roles){
      _this.roleId = roles.id;
      _this.name = roles.name;
    }
    
     updateUser() {
         if (_this.checkMandatoryFields()) {
             let onSuccess = () => {
                     _this.GrowlerService.growl({
                         type: 'success',
                         message: "User Updated Successfully",
                         delay: 2000
                     });
                     _this.close();
                 },
                 onError = (error) => {
                     console.log(error);
                 };

//             _this.skillsetIdArray = _this.skillsetId.map((v) => {
//                 return v.id;
//             });
            let skillsetIdArray = _this.skillsetId;
             _this.updateData = {
                 companyId: _this.companyId,
                 firstName: _this.firstName,
                 lastName: _this.lastName,
                 roleId: _this.roles,
                 departmentId: parseInt(_this.departmentId),
                 skillsetId: skillsetIdArray,
                 statusId: _this.statusId
             };
             _this.UserRoleService.updateUser(_this.id, _this.updateData);
             _this.UserRoleService.activePromise.then(onSuccess, onError);
         }
     }
//    onClose(){
//        _this.$state.go(_this.$state.current, {}, {reload: true});
//    }



 getRoles(){
    let onSuccess = (response) => {
      _this.rolesList = response.data;
      for(let i = 0; _this.rolesList.length > i;i++) {
          if (_this.rolesList[i].role === 'ADMIN') {
              _this.rolesList.splice(i, 1);
          }
      }
    },
    onError = (error) => {
      console.log(error);
    };
    
     _this.UserRoleService.getRoles();
     _this.UserRoleService.activePromise.then(onSuccess, onError);
    }

  getCompanyForSuperUser(roleId){
    if(roleId===8 || roleId===9 || roleId===10 || roleId===11 || roleId === 12 || roleId===13 || roleId===14 || roleId===15 || roleId===16 || roleId === 17){
      _this.companyId = 1;
      _this.isCompanyDisable = true;
      angular.forEach(_this.rolesList,function(value,key) {
         if(value.id === roleId) {
          _this.selectedRole = value.role;
         }
      });

    }
    else{
      _this.isCompanyDisable = false;
      _this.companyId = "";
    }
  }    
    
} 