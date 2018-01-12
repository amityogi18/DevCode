let _this = this,
  _activePromise;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export class AdminUserEditController {
	/** @ngInject  */
  constructor(AdminUserDetailService, AdminDepartmentService, CandidateProfileService, GrowlerService, AuthService) {
    _this = this;
    _this.AdminUserDetailService = AdminUserDetailService;
    _this.adminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.GrowlerService = GrowlerService;   
    _this.AuthService = AuthService;
    _this.departmentList = [];
    _this.skillsetList = [];
    _this.userList = [];
    _this.getDepartment();
    _this.rolesList = [];
    _this.getRoles();
    _this.searchDepartment;
    _this.searchSkill;
    _this.searchRole;
    _this.isDefaultUser = false;
    _this.isDefaultEvaluatorAndInterviewer = false;
     
//    _this.rolesTypeId  = {
//      "data" :[
//        { id : 2,  name : 'CO-ADMIN' },
//        { id : 3,  name : 'INTERVIEWER' },
//        { id : 4,  name : 'EVALUATOR' },
//        { id : 6,  name : 'RECRUITER' }
//
//      ]
//    };
    
    if(_this.infoData && _this.infoData === 'edit'){
         _this.IsEdit = true;
         _this.showUpdate(_this.data);
        }else{
            _this.IsAdd = true;
        }
        
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
  
  showUpdate(user) {
        //_this.roles = {};
        if(angular.isDefined(user.departmentId) && user.departmentId !== null){
            _this.getSkillSet(user.departmentId);
        }

          if(user.roleId===3 || user.roleId===4){
           _this.isDefaultEvaluatorAndInterviewer = true;
        }
        else{
           _this.isDefaultEvaluatorAndInterviewer = false;
        }           
        _this.id = user.id;
        _this.firstName = user.firstName;
        _this.lastName = user.lastName;
        _this.email = user.email;
        //_this.roles = {"id":user.roleId, "role":user.role};  
        _this.roles = user.roleId;
        _this.companyId = user.companyId;
        _this.departmentId = user.departmentId;
        _this.isDefault = user.isDefault == true ? 1 : 0;
        //_this.skillsetId = user.skills;
        _this.statusId = user.statusId;
        _this.skillsetId = user.skills.map((v) => {
                  return v.id;
        });
        
    }
    

  showRoleId(roles){
    _this.roleId = roles.id;
    _this.name = roles.name;
  }

  getDepartment() {
    let onSuccess = (response) => {
       // _this.departmentList = response.data.data;
        
        _this.departmentList = _.filter(response.data.data, function(item){
            return item.status === "ACTIVE";
        });
      },
      onError = (error) => {};
    _this.AdminUserDetailService.getDepartmentByCompanyId();
    _this.AdminUserDetailService.activePromise.then(onSuccess, onError);
  }

  getSkillSet(departmentId, isDepartmentChange){
    if(isDepartmentChange){
      _this.skillsetList = [];
      _this.skills = "";
      _this.skillsetId = [];

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
        if(_this.firstName  && _this.firstName !== ''
            && _this.lastName  && _this.lastName !== ''
            && _this.departmentId  && _this.departmentId !== ''
            && _this.skillsetId  && _this.skillsetId !== null && _this.skillsetId.length > 0
            && _this.roles && _this.roles  && _this.roles !== ''
        ) {
            return true;
        }
        else{
          _this.userForm.$setSubmitted();
            return false;
        }
    }
    
    addUser() {
        if(!angular.isDefined(_this.email) || _this.email ===''){
            _this.errormessage = "Please Enter Email Id";
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

//            if (angular.isDefined(_this.skillsetId)) {
//              _this.skillsetIdArray = _this.skillsetId.map((v) => {
//                  return v.id;
//              });
//          }
            let userData = {
                firstName: _this.firstName,
                lastName: _this.lastName,
                email: _this.email,
                roleId: _this.roles,
                departmentId: parseInt(_this.departmentId),
                default : _this.isDefault == true ? 1 : 0,
                skillsetId: _this.skillsetId

            };

            _this.AdminUserDetailService.addUser(userData);
            _this.AdminUserDetailService.activePromise.then(onSuccess, onError);
        }
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
//              skillsetIdArray = _this.skillsetId.map((v) => {
//                  return v.id;
//              });
          let skillsetIdArray = _this.skillsetId;    
          let updateData = {
              companyId: _this.companyId,
              firstName: _this.firstName,
              lastName: _this.lastName,
              //roleId: _this.roles.id,
              roleId: _this.roles,
              departmentId: parseInt(_this.departmentId),
              skillsetId: skillsetIdArray,
              default : _this.isDefault == true ? 1 : 0,
              statusId: _this.statusId
          };
          _this.AdminUserDetailService.updateUser(_this.id, updateData);
          _this.AdminUserDetailService.activePromise.then(onSuccess, onError);
      }
  }
  
     analyzeEmail(email){
      _this.errormessage = "";
      if(angular.isDefined(email) && !emailRegex.test(email)){
        _this.errormessage = "Enter Valid Email Id";
        _this.isemailValid = false;
      }
      else if(!angular.isDefined(email) || email === "" || email === null){
        _this.errormessage = " Please Enter Email Id";
      }else {
        _this.errormessage = "";
          _this.isemailValid = true;
      }
  }
  
  removeUser(id) {
        let onSuccess = () => {
                _this.GrowlerService.growl({
                    type: 'success',
                    message: "User Removed Successfully",
                    delay: 2000
                });
                _this.userTableParams.reload();
            },
            onError = (error) => {
                console.log(error);
            };
        _this.AdminUserDetailService.removeUser(id);
        _this.AdminUserDetailService.activePromise.then(onSuccess, onError);
    }

    getRoles(){
      let onSuccess = (response) => {
        _this.rolesList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
      
       _this.AdminUserDetailService.getRoles();
       _this.AdminUserDetailService.activePromise.then(onSuccess, onError);
    }

    getDefaultData(roleId){
      if(roleId===3 || roleId===4){
         _this.isDefaultEvaluatorAndInterviewer = true;
      }
      else{
         _this.isDefaultEvaluatorAndInterviewer = false;
      }
    }
    
}
