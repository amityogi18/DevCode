let _this;
export class AddEvaluatorPopupController {
	/** @ngInject  */
  constructor( $filter, $timeout, InterviewService, NgTableParams, AuthService, positionService,GrowlerService, dataTableService) {
    _this = this;
    _this.role = false;
    _this.$timeout = $timeout;
    _this.$filter = $filter;
    _this.headerName = 'Evaluators';
    _this.InterviewService = InterviewService;
    _this.positionService = positionService;
    _this.GrowlerService = GrowlerService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.interviewId = _this.data.interviewId;
    _this.AuthService = AuthService;
    _this.positionId = _this.pid;
    _this.searchDepartment ; 
    _this.searchSkill ;
    _this.departmentList = [];
    _this.selectedEvaluatorId = [];
    _this.getDepartments();
    _this.skillsetList = [];
    _this.evaluatorList = [];
    _this.searchEvaluatorFilter = {};
    
    if(_this.AuthService.user.userRoles &&(_this.AuthService.user.userRoles == 1 ||_this.AuthService.user.userRoles == 2 ||_this.AuthService.user.userRoles == 7)){
        _this.role= true;
    }
    
     _this.evaluatorTableParams = new NgTableParams({
        page : 1,
        count: 5,
        filter :  _this.searchEvaluatorFilter
       }, {
         counts:[5,10,20],
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
               //_this.evaluatorLength = response.data;
               _this.evaluatorList = response.data.data;
               console.log(_this.evaluatorList);
               _this.evaluatorListCount = response.data.total;                
               params.total(_this.evaluatorListCount);
                if(!_this.dataTableService.totalColumn.length) {
                   _this.dataTableService.initTable(_this.cols, _this.evaluatorTableParams);  
                }
                return (_this.evaluatorList);

             },
             onError = (error) => {

               console.log(error);
             };

           _this.InterviewService.getEvaluatorList(queryURL);
            return _this.InterviewService.activePromise.then(onSuccess, onError);
       }
  });  
  _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
        _this.evaluatorTableParams.reload();
    };
    
    $(document).mouseup(function(e) {
        var container = $(".md-select-menu-container");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
    });
    
  } 
    
  clearSearchDeptTerm(){
    _this.searchDepartment = '';
  }

  clearSearchSkillTerm(){
    _this.searchSkill = '';
  }

  cancelPopup(){
    _this.$modalInstance.dismiss('cancel');
  }

  closePopup(){
    _this.$modalInstance.close();
  }
    linkEvaluatorToInterview(){
            let onSuccess = (response) => {
                _this.close();
                 _this.GrowlerService.growl({
                  type: 'success',
                  message: "Evaluator Added Successfully",
                  delay: 2000
              });
            },
            onError = (error) => {
              console.log(error);
            };
          
            let data = {
               interviewId :_this.data.interviewId,
               userIds : _this.selectedEvaluatorId,
               singleAdd: 'yes'
            };
         if(_this.data.interviewId !== '' && _this.selectedEvaluatorId.length !== 0){
            _this.InterviewService.linkEvaluatorToInterview(data);
            _this.InterviewService.activePromise.then(onSuccess, onError);
          }
          else if(_this.selectedEvaluatorId.length === 0){
              _this.GrowlerService.growl({
                  type: 'danger',
                  message: "Please Add Evaluator",
                  delay: 2000
              }); 
          }if(_this.data.interviewId === ''){
              _this.GrowlerService.growl({
                  type: 'danger',
                  message: "Please Add Interviewer",
                  delay: 2000
              }); 
          }
        }
    
  getDepartments(){
     let onSuccess = (response) => {
         _this.departmentList = response.data.data;        
       },
       onError = (error) => {
         console.log(error);
       };
     _this.positionService.getDepartments();
     _this.positionService.activePromise.then(onSuccess, onError);
   }

  getSkillSet(departmentId){
     if(angular.isDefined(_this.skillsetId)){
      _this.skillsetId='';  
    } 
      let onSuccess = (response) => {
          _this.skillsetList = response.data;
        },
        onError = (error) => {
          console.log(error);
        };
      _this.positionService.getSkills(departmentId);
      _this.positionService.activePromise.then(onSuccess, onError);
    }

    checkMandatoryFields() {
        if(_this.firstName && _this.firstName !== ''
            && _this.lastName && _this.lastName !== ''
            && _this.departmentId && _this.departmentId !== ''
            && _this.email && _this.email !== ''
            && _this.skillsetId && _this.skillsetId.length !== 0
            &&  _this.isEmailValid == true
        ) {
            return true;
        }
        else{_this.evalatorForm.$setSubmitted();
            return false;
        }
    }

  addEvaluator(invalid){

      if(!angular.isDefined( _this.email) || _this.email == '' ){
          _this.errormessage = " Please Enter Email Id";
      }

      if(_this.checkMandatoryFields()){
            let skillsetIdArray = _this.skillsetId.map(Number);          
            let evaluator = {
                "companyId": _this.AuthService.user.companyId,
                "firstName": _this.firstName,
                "lastName": _this.lastName,
                "email": _this.email,
                "departmentId": parseInt(_this.departmentId),
                "skillsetId":  skillsetIdArray
           };           
          let onSuccess = (response) => {
           _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Evaluator Added successfully',
                  delay: 2000
              });
            _this.evaluatorTableParams.reload(); 
            _this.firstName = ''; 
            _this.lastName = ''; 
            _this.email = ''; 
            _this.departmentId = ''; 
            _this.skillsetId = '';
            _this.skillsetList = [];
          },
          onError = (error) => {
            console.log(error);
          };
           
           _this.InterviewService.addEvaluator(evaluator);
           _this.InterviewService.activePromise.then(onSuccess, onError);
           _this.evalatorForm.$setPristine();
           _this.evalatorForm.$setUntouched();
      }
      else{
          _this.GrowlerService.growl({
              type: 'warning',
              message: 'Please fill all the valid fields required!',
              delay: 2000
          });
        }
    } 
      
  addEvaluatorUserId(element, userId){
      if(element.currentTarget.checked){
          _this.selectedEvaluatorId.push(userId);
      }else{
          _this.selectedEvaluatorId.pop(userId);
      }            
    } 

    analyzeEmailId(email){
        let emailRegex =/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        _this.errormessage = "";
        if(angular.isDefined(email) && !emailRegex.test(email)){
            _this.errormessage = "Enter Valid Email Id";
            _this.isEmailValid = false;
        }
        else if(!angular.isDefined(email) || email === "" || email === null){
            _this.errormessage = " Please Enter Email Id";
        }else {
            _this.errormessage = "";
            _this.isEmailValid = true;
        }
    };
    
    
}    
