import _ from 'lodash';
var _this;
const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
const phoneRegex = /^[7-9][0-9]{9}|\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/g;
/*
 @companycandidate--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} clientsService description - returns the object and provides all the values related to the company candidates.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class editCandidateController {
	/** @ngInject  */
  constructor($scope,companycandidateService, AuthService, $timeout, InterviewService, AdminDepartmentService, locationService, CandidateProfileService, GrowlerService, $state, SuperAdminService) {
    _this = this;
    _this.companycandidateService = companycandidateService;
    _this.AuthService = AuthService;
    _this.$timeout = $timeout;
    _this.InterviewService = InterviewService;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.GrowlerService = GrowlerService;
    _this.locationService = locationService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.$state = $state;
    _this.SuperAdminService = SuperAdminService;
    _this.departmentList = [];
    _this.skillsetList = [];
    _this.companyList = [];
    _this.editMode = false;
    _this.viewMode = false;
    _this.addMode = true;
    _this.editCandidateData = {};
    _this.searchDepartment;
    _this.searchSkill;
    _this.geoAddress = {};
    _this.months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    if(_this.infoData && _this.infoData === "edit"){
        _this.editMode = true;
        _this.viewMode = false;
        _this.addMode = false;
         _this.fetchCandidateData();
    }else if(_this.infoData && _this.infoData === "view"){
        _this.viewMode = true;
        _this.editMode = false;
        _this.addMode = false;
         _this.fetchCandidateData();
    }else
    {
        _this.getDepartment();
        _this.getCompanyList();
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
    getCompanyList(){
        let onSuccess = (response) => {
                _this.companyList = response.data;
                for(let i = 0; _this.companyList.length > i;i++){
                    if(_this.companyList[i].name === 'I-TECH'){
                        _this.companyList.splice(i, 1);
                    }
                }
            },
            onError = (error) => {
                console.log(error);
            }
        _this.SuperAdminService.getCompanyList();
        _this.SuperAdminService.activePromise.then(onSuccess, onError);
    }

    fetchCandidateData(){
        _this.isvalidEmail = true;
         _this.isvalidNumber = true;
        let candidateID = _this.data.candidateId;
        let companyID = _this.data.companyId;
            let onSuccess = (response) => {
                _this.editCandidateData = response.data || [];
                _this.geoAddress.name = _this.editCandidateData.address;
                 _this.addressData(_this.editCandidateData.address);
                //_this.geoAddress.name = _this.editCandidateData.address;
                if(angular.isDefined(_this.editCandidateData.skillsets) && _this.editCandidateData.skillsets.length > 0){
                    _this.editCandidateData.skillsets = _this.editCandidateData.skillsets
                        .filter(skill => skill.id !== null)
                        .map(v => v.id) || [];
                }
                if(_this.editCandidateData.totalMonths !== null){
                    _this.editCandidateData.totalMonths = _this.editCandidateData.totalMonths.toString();
                }
                _this.getDepartment();
                _this.getCompanyList();
            },
            onError = (error) => {
                console.log(error);
            };  
            _this.companycandidateService.getCandidateData(candidateID, companyID);
            _this.companycandidateService.activePromise.then(onSuccess, onError);
        }

     setAddressValue(addressData) {
         _this.addressData = addressData;
    };
  
  getDepartment(){
    let onSuccess = (response) => {
        _this.departmentList = response.data.data; 
            if(_this.editMode){
            _this.editCandidateData.department = _.find(_this.departmentList, function(department) { return department.name === _this.editCandidateData.departmentName; });
             _this.getSkillSet(_this.editCandidateData.department.id  );
            }
        },
      onError = (error) => {
        console.log(error);
      };
    _this.AdminDepartmentService.getDepartment();
    _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
  }
  
  getSkillSet(departmentId, isDepartmentChange){
      if(isDepartmentChange){
          _this.skillsetList = [];
          _this.editCandidateData.skillsets = "";
      };
    let onSuccess = (response) => {
        _this.skillsetList = response.data || [];
        if(_this.editMode){
//        _this.editCandidateData.skillsetId = _.find(_this.skillsetList, function(skills) {
//            return skills.name === _this.editCandidateData.skillsets;
//        });
    }
     },
      onError = (error) => {
        console.log(error);
      };
    _this.CandidateProfileService.getSkillSet(departmentId);
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
  }

    checkMandatoryFields() {
        _this.editCandidateData.address = _this.geoAddress.name;
        if(_this.editCandidateData.companyId &&  _this.editCandidateData.companyId !==''
            && _this.editCandidateData.firstName && _this.editCandidateData.firstName !==''
            && _this.editCandidateData.lastName && _this.editCandidateData.lastName  !==''
            && _this.editCandidateData.emailId &&  _this.editCandidateData.emailId !==''
            && _this.editCandidateData.department &&  _this.editCandidateData.department !==''
            && _this.editCandidateData.address && _this.editCandidateData.address !== ''
            && _this.editCandidateData.totalyearsOfExperience &&   _this.editCandidateData.totalyearsOfExperience !==''
            && _this.editCandidateData.totalMonths &&  _this.editCandidateData.totalMonths  !==''
            && _.compact(_this.editCandidateData.skillsets).length
            && _this.editCandidateData.contactNumber && _this.editCandidateData.contactNumber !==''
            && _this.isvalidEmail == true
            && _this.isvalidNumber == true

        ) {
            _this.candidateForm.$setPristine();
            _this.candidateForm.$setUntouched();
            return true;
        }
        else{_this.candidateForm.$setSubmitted();
            return false;
        }
    }
     addCandidate() {
         if(!angular.isDefined(_this.editCandidateData.emailId) || _this.editCandidateData.emailId === "" || _this.editCandidateData.emailId === null){
             _this.errormessage = " Please Enter Email Id";
         }
         if(!angular.isDefined( _this.editCandidateData.contactNumber) ||  _this.editCandidateData.contactNumber === "" ||  _this.editCandidateData.contactNumber === null){
             _this.errmsgcon = "Please Enter Contact Number";
         }
         if (_this.checkMandatoryFields()) {
             let skillsetIdArray = [];
             let candidate = {};
             //@Todo - validations to be implemented
             _this.editMode = false;
             _this.viewMode = false;
             _this.addMode = true;
             if (angular.isDefined(_this.editCandidateData)) {
                let skillsetIdArray = _this.editCandidateData.skillsets;
            

                 candidate = {
                     "companyId": _this.editCandidateData.companyId,
                     "firstName": _this.editCandidateData.firstName,
                     "lastName": _this.editCandidateData.lastName,
                     "email": _this.editCandidateData.emailId,
                     "departmentId": _this.editCandidateData.department.id,
                     "totalYears": _this.editCandidateData.totalyearsOfExperience,
                     "totalMonths": parseInt(_this.editCandidateData.totalMonths),
                     "address": _this.editCandidateData.address,
                     "skillsetId": skillsetIdArray,
                     "contactNumber": _this.editCandidateData.contactNumber
                 };
             }
             _this.InterviewService.addCandidate(candidate);
             _this.InterviewService.activePromise.then((response) => {
                     _this.GrowlerService.growl({
                         type: 'success',
                         message: 'Candidate Added successfully',
                         delay: 2000
                     });
                     _this.editCandidateData = {};
                     _this.onClose();
                     _this.close();

                 },
                 (error) => {
                     console.log(error);
                 });

         }

     }
     updateCandidate() {
        if (_this.checkMandatoryFields()) {
             //@Todo - validations to be implemented
             _this.editMode = true;
             _this.viewMode = false;
             _this.addMode = false;
             let candidateId = _this.data.candidateId;
             let skillsetIdArray = _this.editCandidateData.skillsets.filter(skill => skill !== null);
             //_this.geoAddress = _this.editCandidateData.address;
             let candidate = {
                 "companyId": _this.editCandidateData.companyId,
                 "firstName": _this.editCandidateData.firstName,
                 "lastName": _this.editCandidateData.lastName,
                 "email": _this.editCandidateData.emailId,
                 "departmentId": _this.editCandidateData.department.id,
                 "totalYears": _this.editCandidateData.totalyearsOfExperience,
                 "totalMonths": parseInt(_this.editCandidateData.totalMonths),
                 "address": _this.editCandidateData.address,
                 "skillsetId": skillsetIdArray,
                 "contactNumber": _this.editCandidateData.contactNumber
             };
             _this.InterviewService.updateCandidate(candidateId, candidate);
             _this.InterviewService.activePromise.then((response) => {
                     _this.GrowlerService.growl({
                         type: 'success',
                         message: 'Candidate Updated Successfully',
                         delay: 2000
                     });
                     _this.editCandidateData = {};
                     _this.onClose();
                     _this.close();
                 },
                 (error) => {
                     console.log(error);
                 });
        }
     }
  isInvalidEmail(email){
        _this.errormessage = "";
       if(angular.isDefined(email) && !reg.test(email)){
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
  
  analyzePhoneNumber(value){
    _this.errmsgcon = "";
    if(angular.isDefined(value) && value.length < 10){
      _this.errmsgcon = "Enter Valid Contact Number";
        _this.isvalidNumber = false;
    }
    else if(!angular.isDefined(value) || value === "" || value === null){
      _this.errmsgcon = "Please Enter Contact Number";
    }else {
      _this.errmsgcon = "";
        _this.isvalidNumber = true;
    }
  }

    onClose(){
        _this.$state.go(_this.$state.current, {}, {reload: true});
    }
}



