let _this;
export class EvaluatorPopupController {
	/** @ngInject  */
  constructor(AuthService, $uibModal,$timeout,InterviewService,NgTableParams,$filter, AdminDepartmentService, CandidateProfileService, candidateReviewService, GrowlerService,positionService, dataTableService) {
    console.log('Inside EvaluatorPopupController constructor');
    _this = this;
    _this.$modalInstance = $uibModal;
    _this.$timeout = $timeout;
    _this.AuthService = AuthService;
    _this.InterviewService = InterviewService;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.CandidateReviewService = candidateReviewService; 
    _this.GrowlerService = GrowlerService;
    _this.positionService = positionService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});   
    _this.colNum = 6;
    _this.searchDepartment ; 
    _this.searchSkill ;
    _this.addEvaluatorbtn = false;
    _this.departmentList = [];  
    _this.questionList = [];
    _this.selected = [];
    _this.selectedEval = [];
    _this.interviewQuestionList = [];
    _this.skillsetList = [];
    _this.selectedEvaluatorId = [];
    _this.selectedInterviewQuestionId = [];
    _this.getDepartments();
    _this.interviewId = _this.data.interviewId;
    _this.interviewType = _this.data.type;
    _this.interviewTypeId = _this.data.interviewTypeId;
    _this.recordingList ={};
    if(_this.interviewTypeId === 3){
        _this.getAllInterviewQuestion();
    }
    if(_this.data && _this.data.candidateId){
      _this.candidateId = _this.data.candidateId;
      _this.recordingList = _this.data.recordingList;
    }else{
      _this.candidateId = _this.data.compareList;
      _this.getRecording();
    }    
     //Ng-table params 
    _this.evaluatorTableParams = new NgTableParams({
                       page : 1,
                       count: 5
                      }, 
                      {          
                        count:[5,10,15],
                        getData: function (params) {
                              let filter = params.filter(),
                              sorting = params.sorting(),
                              count = params.count(),
                              page = params.page();
                              let queryURL = `?limit=${count}&page=${page}`;

                            let onSuccess = (response) => {

                                    _this.evaluatorList = response.data.data;
                                    if(_this.evaluatorList 
                                          && _this.evaluatorList.length > 0){                                        
                                         params.total(_this.evaluatorList.length);
                                        if(!_this.dataTableService.totalColumn.length) {
                                           _this.dataTableService.initTable(_this.cols, _this.evaluatorTableParams);  
                                        }
                                        return (_this.evaluatorList);
                                      }

                                  },
                                  onError = (error) => {

                                      console.log(error);
                                  };

                              _this.CandidateReviewService.getAllEvaluatorList(queryURL);
                               return _this.CandidateReviewService.activePromise.then(onSuccess, onError);
                        }
                     });    
    _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
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

    addEvaluatorSection(){
        if(_this.addEvaluatorbtn === false){
          $('#addEvaluator').css('display', 'block');
        }
        else{
          $('#addEvaluator').css('display', 'none');
        }
       _this.addEvaluatorbtn = !_this.addEvaluatorbtn;

    }
    clearSearchDeptTerm(){
      _this.searchDepartment = '';
    }
    
    clearSearchSkillTerm(){
      _this.searchSkill = '';
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
    
     checkRequiredFields() {
    if(_this.firstName && _this.firstName !== ''
      && _this.lastName && _this.lastName !== ''
      && _this.email && _this.email !== ''
      && _this.departmentId && _this.departmentId !== ''
      && _this.skillsetId && _this.skillsetId !== ''
      && _this.emailCriteria === true
      )
     {
      return true;
    }else
    {      
      _this.evalatorForm.$setSubmitted();
      return false;
    }
  }
    
    addEvaluator(invalid){
  	//@Todo - validations to be implemented
        if(_this.checkRequiredFields()){
            
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
            _this.evaluatorTableParams.reload();
            _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Evaluator Added Sucessfully',
                  delay: 2000
              });
            _this.firstName = ''; 
            _this.lastName = ''; 
            _this.email = ''; 
            _this.departmentId = ''; 
            _this.skillsetId = '';
            _this.evalatorForm.$setPristine();
           _this.evalatorForm.$setUntouched();
          },
          onError = (error) => {
            console.log(error);
          };
           
           _this.InterviewService.addEvaluator(evaluator);
           _this.InterviewService.activePromise.then(onSuccess, onError);
      }
      else{
          _this.GrowlerService.growl({
              type: 'warning',
              message: 'Please fill all the valid fields required!',
              delay: 2000
          });
        }
    }
    
     //Open Evaluator File upload control
    openevaluatorUpload(){
          $('#evaluatorfilectrl').click();
        }
    
    isFileAdded(file){
        //this.fileSelected = file.length > 0 ? false : true;
        if(file.length > 0){
          this.fileNotSelected = true;
        }
        else{
          this.fileNotSelected = false;
        }
    }

    uploadEvaluatorFile(file) {
        _this.importEvaluatorFile = file[0];
        if(_this.importEvaluatorFile){
            _this.importEvaluatorList();
        }   
    }

    importEvaluatorList(){      
          let data = {
                 companyId : _this.AuthService.user.companyId || 1,
                 csvFile :  _this.importEvaluatorFile
           }; 
            let onSuccess = (response) => {
                 _this.evaluatorTableParams.reload();
                  _this.GrowlerService.growl({
                  type: 'success',
                  message: "Evaluator Imported Successfully",
                  delay: 2000
              });
                },
                 onError = (error) => {
                     console.log(error);
                };
             _this.InterviewService.importEvaluatorList(data);
             _this.InterviewService.activePromise.then(onSuccess, onError);

        };
 
  getAllInterviewQuestion(){      
        let data = {
               interviewId : _this.data.interviewId|| 1,
               candidateId : _this.data.candidateId
         };
          let onSuccess = (response) => {
                _this.interviewQuestionList = response.data.data;
                for(var i=0; i<_this.interviewQuestionList.length; i++){
                  _this.questionList.push(_this.interviewQuestionList[i].questionId);
                  console.log(_this.questionList );
                }
              },
               onError = (error) => {
                   console.log(error);
              };

           _this.CandidateReviewService.getInterviewQuestions(_this.data.candidateId,_this.data.interviewId);
           _this.CandidateReviewService.activePromise.then(onSuccess, onError);

      }

  selectAllPortals(event){     
      let checkBoxs = document.querySelectorAll('.check-box-list md-checkbox.md-priamry');
      for(var i = 0; i < checkBoxs.length;i++){
         checkBoxs[i].checked = event.currentTarget.checked;
         if(event.currentTarget.checked){
           if(!_this.isIdExist(checkBoxs[i].id)){
              _this.selectedInterviewQuestionId.push(checkBoxs[i].id);
           }
         }else{ _this.selectedInterviewQuestionId.pop(checkBoxs[i].id);}
      }
   }
   
   checkUncheckSelectAll(){
     let cbSelectAll = document.getElementById('cbSelectAll');
     let checkBoxs = document.querySelectorAll('.check-box-list md-checkbox.md-priamry');
     if(checkBoxs.length === _this.selectedInterviewQuestionId.length){
        cbSelectAll.checked = true;
     }else{
        cbSelectAll.checked = false;
     }
   }

    
    shareUserInterviewQuestion(){
          let fileId='';
          if(_this.recordingList && _this.recordingList.fileId){
            fileId=_this.recordingList.fileId;
          }
          let QuestionIds = [];
            if (_this.selected && _this.selected.length > 0){
              QuestionIds = _this.selected;
            }
            if( _this.interviewType !== 'Live now' && _this.interviewType !== 'Live' && _this.selectedEvaluatorId && _this.selectedEvaluatorId.length >0 &&
                _this.selected && _this.selected.length === 0){
               _this.GrowlerService.growl({
                  type: 'warning',
                  message: "Please select Question to be Shared",
                  delay: 2000
                  });
            }
            if( _this.selectedEvaluatorId && _this.selectedEvaluatorId.length === 0 &&
                _this.selected && _this.selected.length === 0){
               _this.GrowlerService.growl({
                  type: 'warning',
                  message: "Please select Evaluator",
                  delay: 2000
                  });
            }
            if( _this.interviewType !== 'Live now' && _this.interviewType !== 'Live' && _this.selectedEvaluatorId && _this.selectedEvaluatorId.length === 0 &&
                    _this.selected && _this.selected.length === 0){
                    
                _this.GrowlerService.growl({
                  type: 'success',
                  message: "Please select Evaluator and Questions to be Shared",
                  delay: 2000 
                });
            }
            let onSuccess = (response) => {
                if(_this.interviewType !== 'Live' && _this.interviewType !== 'Live now'){
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: "Question Shared Sucessfully",
                        delay: 2000
                    });
                  }else{
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: "Interview Shared Sucessfully",
                        delay: 2000
                    });  
                  } 
                },
                onError = (error) => {
                  console.log(error);
                };
          
            let data = {
                 interviewId : _this.interviewId || 1,
                 evaluatorIds : _this.selectedEvaluatorId,
                 statusId   : 1,
                 questionIds : QuestionIds,
                 candidateId : _this.candidateId || 1,
                 fileId : fileId
            };
          if((_this.interviewType === 'Live' || _this.interviewType === 'Live now') && _this.selectedEvaluatorId && _this.selectedEvaluatorId.length >0){
                _this.CandidateReviewService.shareInterviewQuestion(data);
                
                _this.CandidateReviewService.activePromise.then(onSuccess, onError);
                _this.close();
              
            }else if(_this.selectedEvaluatorId && _this.selectedEvaluatorId.length >0 &&
                _this.selected && _this.selected.length > 0){
               
                _this.CandidateReviewService.shareInterviewQuestion(data);
                _this.CandidateReviewService.activePromise.then(onSuccess, onError);
                _this.close();  
            }
        }

   getRecording (){
      _this.candidateReviewService.getLiveRecordings(_this.candidateId, _this.interviewId).then((data)=>{     
                _this.recordingList = data; 
                
                if(_this.recordingList && _this.recordingList.fileId){
                   _this.selectedInterviewQuestionId = [];
            }
               
        });          
   }
   
   analyzeEmailId(value){
     let emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
     _this.errormessage = "";
        if(angular.isDefined(value) && !emailRegex.test(value)){
            _this.errormessage = "Enter Valid Email Id";
            _this.emailCriteria = false;
        }
        else if(!angular.isDefined(value) || value === "" || value === null){
            _this.errormessage = " Please Enter Email Id";
        }else {
            _this.errormessage = "";
            _this.emailCriteria = true;
        }
   }
  
    toggleCheckbox(id, list) {
      var idx = list.indexOf(id);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(id);
      }
    };

    exists(id, list) {
      if(list.length > 0){
        return list.indexOf(id) > -1;
      }
    };

    isIndeterminate() {
      return (_this.selected.length !== 0 &&
          _this.selected.length !== _this.questionList.length);
    };

    isChecked() {
      return _this.selected.length === _this.questionList.length;
    };

    toggleAll() {
      if (_this.selected.length === _this.questionList.length) {
        _this.selected = [];
      } else if (_this.selected.length === 0 || _this.selected.length > 0) {
        _this.selected = _this.questionList.slice(0);
      }
    };
   
    toggleEvalCheckbox(id, evalList) {
      var idx = evalList.indexOf(id);
      if (idx > -1) {
        evalList.splice(idx, 1);
         _this.selectedEvaluatorId = _this.selectedEval;
      }
      else {
        evalList.push(id);
        _this.selectedEvaluatorId = _this.selectedEval;
      }
    };

    existsEval(id, evalList) {
      if(evalList.length > 0){
        return evalList.indexOf(id) > -1;
      }
    };    
    
  }
  
