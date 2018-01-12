let _this;
let regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
export class candidatePopupController {
	/** @ngInject  */
  constructor(AuthService, $uibModalInstance,$timeout,InterviewService,NgTableParams,$filter,$scope, AdminDepartmentService, CandidateProfileService, locationService, GrowlerService, $rootScope, dataTableService,$mdSelect,$mdMenu) {
    _this = this;
    console.log("Inside candidateAccordionController");
    _this.$modalInstance = $uibModalInstance;
    _this.$timeout = $timeout;
    _this.AuthService = AuthService;
    _this.InterviewService = InterviewService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.locationService = locationService;
    _this.GrowlerService = GrowlerService;
    _this.$scope = $scope;
    _this.$rootScope = $rootScope;
    _this.$mdSelect=$mdSelect;
    _this.$mdMenu=$mdMenu;
    _this.mode = _this.$scope.$resolve.mode;
    _this.positionId = _this.$scope.$resolve.positionId;
    _this.isStateDisabled = true;
    _this.isCityDisabled = true;
    if(_this.mode === 'candidate'){
        _this.showInterviewer = false;
        _this.showCandidate = true;
        _this.showEvaluator = false;
        _this.headerName = 'Candidate';
    }
    if(_this.mode === 'interviewer'){
        _this.showEvaluator = false;
        _this.showCandidate = false;
        _this.showInterviewer = true;
        _this.headerName = 'Interviewer';
    }
    if(_this.mode === 'evaluator'){
        _this.showInterviewer = false;
        _this.showCandidate = false;
        _this.showEvaluator = true;
        _this.headerName = 'Evaluator';
    }
    //Service calls
    _this.departmentList = [];
    _this.skillsetList = [];
    _this.countryList = [];
    _this.stateList = [];
    _this.cityList = [];
    _this.selectedEvaluatorId = [];
    _this.selectedCompanyCandidateId= [];
    _this.selectedProfileCandidateId = [];
    _this.selectedCandidateId= [];
    _this.EditMode = _this.mode;
    _this.selectedInterviewerId = [];
    _this.getDepartment();
    _this.geoAddress = {};
    
    //_this.getCountryList();
    //_this.InterviewService.getCountryInfo();
   // _this.InterviewService.getDepartmentInfo();
    //_this.InterviewService.getExperienceInfo();
    //_this.InterviewService.getCandidateInfo();
    _this.searchCandidateFilter = {};
    _this.searchEvaluatorFilter = {};
    _this.searchInterviewerFilter = {};
    _this.candidateTableFilter = {};

   
    
    _this.evaluatorTableParams = new NgTableParams({
        page : 1,
        count: 5,
        filter :  _this.searchEvaluatorFilter
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

               _this.evaluatorList = response.data.data;
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
    };

    _this.interviewerTableParams = new NgTableParams({
      count:5,
      page:1,
      filter :  _this.searchInterviewerFilter
    },{
        counts: [5, 10, 20], 
        getData:function(params){
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

            _this.interviewerList = response.data.data;
            _this.interviewerListCount = response.data.total;
            params.total(_this.interviewerListCount);
                if(!_this.dataTableService.totalColumn.length) {
                   _this.dataTableService.initTable(_this.cols, _this.interviewerTableParams);  
                }                
                return (_this.interviewerList);

          },
          onError = (error) => {

            console.log(error);
          };
        _this.InterviewService.getInterviewerList(queryURL);
        return _this.InterviewService.activePromise.then(onSuccess, onError);
        
      }});
   _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };

    _this.candidateTableParams = new NgTableParams({
                       page : 1,
                       count: 5,
                       filter: _this.candidateTableFilter
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

                              _this.candidateList = response.data.data;
                              _this.candidateListCount = response.data.total;                                                               
                                params.total(_this.candidateListCount);
                                    if(!_this.dataTableService.totalColumn.length) {
                                       _this.dataTableService.initTable(_this.cols, _this.candidateTableParams);  
                                    }                                    
                                    return (_this.candidateList);
                            },
                            onError = (error) => {
                              console.log(error);
                            };

                          _this.InterviewService.getCandidateList(queryURL, _this.positionId);
                         return  _this.InterviewService.activePromise.then(onSuccess, onError);
                     }
                 });
    _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };

    _this.candidateProfileTableParams = new NgTableParams({
                       page : 1,
                       count: 5,
                       filter: _this.searchCandidateFilter
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

                                _this.profileCandidateList = response.data.data;
                                _this.profileCandidateListCount = response.data.total; 
                                if(_this.profileCandidateList && _this.profileCandidateList.length > 0){
                                    angular.forEach(_this.profileCandidateList, function (item) {
                                            if (item.totalMonthsOfExp !== "" && item.totalMonthsOfExp !== null) {
                                                let n = Number(item.totalMonthsOfExp),
                                                 years = Math.floor(n/12), 
                                                 month = n % 12;
                                                 item.totalMonthsOfExp = "";
                                                 item.totalYrOfExp = "";
                                                if(month >= 1){
                                                    item.totalMonthsOfExp = month;
                                                }
                                                if(years >= 1)
                                                {
                                                   item.totalYrOfExp = years; 
                                                }                                                
                                                
                                            }
                                    });
                                }   
                                params.total(_this.profileCandidateListCount);
                                    if(!_this.dataTableService.totalColumn.length) {
                                       _this.dataTableService.initTable(_this.cols, _this.candidateProfileTableParams);  
                                    }                                    
                                    return (_this.profileCandidateList);
                             
                            },
                            onError = (error) => {
                              console.log(error);
                            };

                          _this.InterviewService.getProfileCandidateList(queryURL);
                          return  _this.InterviewService.activePromise.then(onSuccess, onError);
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

  cancelPopup(){
    console.log(_this.$modalInstance);
    //_this.$modalInstance.dismiss();
    if (_this.$modalInstance) {
      _this.$modalInstance.dismiss('cancel');
    } 
  }

  closePopup(){
    _this.$modalInstance.close();
  }

  controlInterviewerDisplay(){
    _this.showEvaluator = false;
    _this.showCandidate = false;
    _this.showInterviewer = true;
    _this.headerName = 'Interviewers';
  }

  controlEvaluatorDisplay(){
    _this.showInterviewer = false;
    _this.showCandidate = false;
    _this.showEvaluator = true;
    _this.headerName = 'Evaluator';
  }

  controlCandidateDisplay(){
    _this.showInterviewer = false;
    _this.showCandidate = true;
    _this.showEvaluator = false;
    _this.headerName = 'Candidates';
  }
    
  /* ===== Evaluator Popup Section ==== */

  checkRequiredFields() {
    if(_this.firstName && _this.firstName !== ''
    && _this.lastName && _this.lastName !== ''
    && _this.email && _this.email !== ''
    && _this.departmentId && _this.departmentId !== ''
    && _this.skillsetId && _this.skillsetId !== ''
    &&  _this.emailCriteria == true)
     {
      return true;
    }else
    {
      _this.interviewerForm.$setSubmitted();
      _this.evalatorForm.$setSubmitted();
      return false;
    }
  }

  addEvaluator(invalid){
  	//@Todo - validations to be implemented
      if(!angular.isDefined(_this.email) || _this.email ==''){
          _this.errormessage = "Please Enter Email Id";
      }
  	if( _this.checkRequiredFields()){
            
            //let skillsetIdArray =_this.skillsetId.map((v) => {
           // return v.id;
          //});

            let skillsetIdArray =_this.skillsetId;
            let evaluator = {
                "companyId": _this.AuthService.user.companyId,
                "firstName": _this.firstName,
                "lastName": _this.lastName,
                "email": _this.email,
                "departmentId": parseInt(_this.departmentId),
                "skillsetId":  skillsetIdArray
           };
           
          let onSuccess = (response) => {
            _this.clearEvaluationFields();
            _this.evaluator = {};
            _this.skillsetList = [];
            _this.evaluatorTableParams.reload();
            _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Evaluator Added successfully',
                  delay: 2000
              });
          },
          onError = (error) => {
            console.log(error);
          };
           
           _this.InterviewService.addEvaluator(evaluator);
           _this.InterviewService.activePromise.then(onSuccess, onError);
      }
  }

  clearEvaluationFields(){      
      _this.email = _this.firstName = _this.lastName = _this.departmentId = _this.skillsetId = '';
      _this.evalatorForm.$setPristine();
      _this.evalatorForm.$setUntouched();
  }

  saveEvaluator(){
    //Add _this.evaluatorList to main array list @@TODO
    //close the popup on final save
    _this.closePopup();
  }

  //Open Evaluator File upload control
 openevaluatorUpload(){
   $('#evaluatorfilectrl').click();
 }

  /* ===== Evaluator Popup Section End ==== */

  /* ===== Interviwer Popup Section ==== */

  addInterviewer(invalid){
    //@Todo - validations to be implemented
      if(!angular.isDefined(_this.email) || _this.email ==''){
          _this.errormessage = "Please Enter Email Id";
      }
    if(_this.checkRequiredFields()){
        
         //let skillsetIdArray =_this.skillsetId.map((v) => {
            //return v.id;
          //});
        let skillsetIdArray =_this.skillsetId;
        let interviewer = {
                "companyId": _this.AuthService.user.companyId,
                "firstName": _this.firstName,
                "lastName": _this.lastName,
                "email": _this.email,
                "departmentId": parseInt(_this.departmentId),
                "skillsetId":  skillsetIdArray
           };
      let onSuccess = (response) => {
            _this.clearInterviewerFields();
            _this.interviewer = {};
            _this.skillsetList = [];
            _this.interviewerTableParams.reload();
            _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Interviewer Added successfully',
                  delay: 2000
              });
            
          },
          onError = (error) => {
            console.log(error);
          };
           
        _this.InterviewService.addInterviewer(interviewer);
        _this.InterviewService.activePromise.then(onSuccess, onError);
  }
}

  clearInterviewerFields(){      
      _this.email = _this.firstName = _this.lastName = _this.departmentId = _this.skillsetId = '';
      _this.interviewerForm.$setPristine();
      _this.interviewerForm.$setUntouched();
  }
  
  saveInterviewer(){
    //Add _this.evaluatorList to main array list @@TODO
    //close the popup on final save
    _this.closePopup();
  }

  saveInterviewer(){
    //Add this.evaluatorList to main array list @@TODO
    //close the popup on final save
    var cdnSelected = [];
      angular.forEach(this.tableParams.data, function (item) {
        cdnSelected.push(item.selected.id);
      });

    this.InterviewService.saveSelectedCandidates(cdnSelected,positionId);
    this.closePopup();
  }
  
  openinterviewerUpload(){
    $('#interviewerfilectrl').click();
  }

  /* ===== Interviewer Popup Section End ==== */

  /* ===== Candidate Popup Section ==== */

  openCandidateUpload(){
    $('#candidatefilectrl').click();
  }
  
  selectedCountry(){
    if(_this.cndcountry){
      _this.state = _this.cndcountry.state;
    }
  }

  selectedState(){
    if(_this.cndstate){
      _this.city = _this.cndstate.city;
    }
  }

  setAddressValue(addressData) {
        _this.addressData = addressData;
    };

  checkMandatoryFields() {
     _this.address = _this.geoAddress.name;
    if(_this.firstName && _this.firstName !== ''
      && _this.lastName && _this.lastName !== ''
      && _this.email && _this.email !== ''
      && _this.departmentId && _this.departmentId !== ''
      && _this.totalYears && _this.totalYears !== ''
      && _this.totalMonths && _this.totalMonths !== ''
      && _this.address && _this.address !== ''
      && _this.skillsetId && _this.skillsetId !== ''
      && _this.contactNumber && _this.contactNumber !== ''      
      && _this.contactCriteria == true
      && _this.emailCriteria == true
    )
    {   _this.candidateForm.$setPristine();
        _this.candidateForm.$setUntouched();
      return true;
    }else
    {
      _this.candidateForm.$setSubmitted();
      return false;
    }
  }
  
  analyzeYearExp(totalYears){
      if(angular.isDefined(totalYears) && totalYears > 65){
         _this.yearErrormessage ="Enter valid Year";
      }
      else if(!angular.isDefined(totalYears) || totalYears === "" || totalYears === null){
         _this.yearErrormessage = "Enter valid Year";
      }else{
          _this.yearErrormessage = "";
      }
        
    };

    analyzeMonthExp(totalMonths){
      //return event.charCode >= 48 && event.charCode <= 57
      if(angular.isDefined(totalMonths) && totalMonths > 11){
         _this.monthErrormessage ="Enter valid month";
      }
      else if(!angular.isDefined(totalMonths) || totalMonths === "" || totalMonths === null){
         _this.monthErrormessage = "Enter valid month";
      }else{
          _this.monthErrormessage = "";
      }
        
    };
    
  addCandidate(candidateForm){
    //@Todo - validations to be implemented

      if(!angular.isDefined( _this.email) ||  _this.email === ''){
          _this.errormessage = "Please Enter Email Id";
      }
      
      if(!angular.isDefined( _this.totalYears) ||  _this.totalYears == ''){
          _this.yearErrormessage = "Enter Experience In  Years";
      }
      
      if(!angular.isDefined( _this.totalMonths) ||  _this.totalMonths == ''){
          _this.monthErrormessage = "Enter Experience In Months";
      }
      
      if(!angular.isDefined( _this.contactNumber) ||  _this.contactNumber === ''){
          _this.errmsgcon = "Please Enter Contact Number";
      }

    if(_this.checkMandatoryFields()){

        //let skillsetIdArray =_this.skillsetId.map((v) => {
            //return v.id;
        //});
        let skillsetIdArray = _this.skillsetId;
        let candidate = {
                "companyId": _this.AuthService.user.companyId,
                "firstName": _this.firstName,
                "lastName": _this.lastName,
                "email": _this.email,
                "departmentId": parseInt(_this.departmentId),
                "totalYears" : parseInt(_this.totalYears),
                "totalMonths" : parseInt(_this.totalMonths),
                "address" : _this.address,
                "skillsetId":  skillsetIdArray,
                "contactNumber" : _this.contactNumber
           };
      let onSuccess = (response) => {
            _this.clearCandidateFields();
            _this.candidate = {};
            _this.geoAddress = "";
            _this.addressData = "";
            _this.skillsetList = [];
            _this.candidateTableParams.reload();
            _this.GrowlerService.growl({
                  type: 'success',
                  message: 'Candidate Added successfully',
                  delay: 2000
              });
            
          },
          onError = (error) => {
            console.log(error);
          };
           
        _this.InterviewService.addCandidate(candidate);
        _this.InterviewService.activePromise.then(onSuccess, onError);
  }
}

  clearCandidateFields(){   
   _this.email = _this.firstName = _this.lastName = _this.contactNumber = _this.totalYears = _this.totalMonths = _this.geoAddress = 
    _this.departmentId = _this.skillsetId = '';   
     _this.clearData();
    _this.candidateForm.$setPristine();
    _this.candidateForm.$setUntouched();
  }
  clearSuggestions(clearData) {
        _this.clearData = clearData;
    };
  
  getCountryList(){
    let onSuccess = (response) => {
        _this.countryList = response.data;
      },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getCountryList();
    _this.locationService.activePromise.then(onSuccess, onError);
  }

  getStateList(countryId){
    if(angular.isDefined(_this.state) && angular.isDefined(_this.state.id)){
      _this.state.id='';
      _this.stateList = [];
      _this.city.id=''; 
      _this.cityList = [];
      _this.isStateDisabled = true;
      _this.isCityDisabled = true;
    }
    let onSuccess = (response) => {
        _this.stateList = response.data;
        _this.isStateDisabled = false;
      },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getStateList(countryId);
    _this.locationService.activePromise.then(onSuccess, onError);

    _this.candidateForm.$setPristine();
    _this.candidateForm.$setUntouched();
  }

  getCityList(stateId, mode){
    if(angular.isDefined(_this.city) && angular.isDefined(_this.city.id)){
      _this.city.id=''; 
      _this.cityList = [];
      _this.isCityDisabled = true;
    }
    
    let onSuccess = (response) => {
        _this.cityList = response.data;
        _this.isCityDisabled = false;
       
      },
      onError = (error) => {
        console.log(error);
      }
    _this.locationService.getCityList(stateId);
    _this.locationService.activePromise.then(onSuccess, onError);
    _this.candidateForm.$setPristine();
    _this.candidateForm.$setUntouched();
  }
  
  getDepartment(){
    let onSuccess = (response) => {
        _this.departmentList = response.data.data;       
      },
      onError = (error) => {
        console.log(error);
      };
    _this.AdminDepartmentService.getDepartment();
    _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
  }
  
  getSkillSet(departmentId){
    let onSuccess = (response) => {
        _this.skillsetList = response.data;
      },
      onError = (error) => {
        _this.skillsetList = [];
        console.log(error);
      };
    _this.CandidateProfileService.getSkillSet(departmentId);
    _this.CandidateProfileService.activePromise.then(onSuccess, onError);
    _this.skillsetId='';
  }
  
    addCompanyCandidateId(element, candidateIds){
            if(element.currentTarget.checked){
                _this.selectedCompanyCandidateId.push(candidateIds);
            }else{
                _this.selectedCompanyCandidateId.pop(candidateIds);
            }            
    }

    addProfileCandidateId(element, candidateIds){
        if(element.currentTarget.checked){
            _this.selectedProfileCandidateId.push(candidateIds);
        }else{
            _this.selectedProfileCandidateId.pop(candidateIds);
        }            
    }
  
    addEvaluatorUserId(element, userId){
            if(element.currentTarget.checked){
                _this.selectedEvaluatorId.push(userId);
            }else{
                _this.selectedEvaluatorId.pop(userId);
            }            
        }
        
    addInterviewerUserId(element, userId){
            if(element.currentTarget.checked){
                _this.selectedInterviewerId.push(userId);
            }else{
                _this.selectedInterviewerId.pop(userId);
            }            
        }
        
    linkInterviewerToInterview(){
     _this.$rootScope.$broadcast('linkInterviewer',{
        'dataArray':_this.selectedInterviewerId
      });
      _this.closePopup();
    }

    linkEvaluatorToInterview(){
        _this.$rootScope.$broadcast('linkEvaluator',{
        'dataArray':_this.selectedEvaluatorId
      });
      _this.closePopup();
    }

    linkCompanyCandidateToInterview(){
      _this.$rootScope.$broadcast('linkCompanyCandidate',{
        'dataArray':_this.selectedCompanyCandidateId
      });
      _this.closePopup();
    }  
    
    linkProfileCandidateToInterview(){
      _this.$rootScope.$broadcast('linkCompanyCandidate',{
        'dataArray':_this.selectedProfileCandidateId
      });
      _this.closePopup();
    }  

  /* ===== Candidate Popup Section End ==== */
  
  /*
   * @name - isFileAdded
   * @param {object} file - object for file to be uploaded
   * @description - function sets the value of fileNotSelected variable based on selected files
   */
  isFileAdded(file){
    //this.fileSelected = file.length > 0 ? false : true;
    if(file.length > 0){
      _this.fileNotSelected = true;
    }
    else{
      _this.fileNotSelected = false;
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
       }, 
         onSuccess = (response) => {
             if(response.data.imported > 0){
                    _this.evaluatorTableParams.reload();
                    _this.GrowlerService.growl({
                        type: 'success',
                        message: "Evaluator Imported Successfully",
                        delay: 2000
                    });
                }else{
                    _this.GrowlerService.growl({
                        type: 'danger',
                        message: "No Records Uploaded",
                        delay: 2000
                    });
                }
            },
             onError = (error) => {
                 console.log(error);
            };
         _this.InterviewService.importEvaluatorList(data);
         _this.InterviewService.activePromise.then(onSuccess, onError);

    }
    
  uploadInterviewerFile(file) {
        _this.importInterviewerFile = file[0];
        if(_this.importInterviewerFile){
            _this.importInterviewerList();
          }   
    }
  
  importInterviewerList(){      
      let data = {
             companyId : _this.AuthService.user.companyId || 1,
             csvFile :  _this.importInterviewerFile
       }, 
         onSuccess = (response) => {
              if(response.data.imported > 0){
                    _this.interviewerTableParams.reload();
                     _this.GrowlerService.growl({
                         type: 'success',
                         message: "Interviewer Imported Successfully",
                         delay: 2000
                     }); 
                }else
                {
                    _this.GrowlerService.growl({
                        type: 'danger',
                        message: "No Records Uploaded",
                        delay: 2000
                    });
                }
            },
             onError = (error) => {
                 console.log(error);
            };
         _this.InterviewService.importInterviewerList(data);
         _this.InterviewService.activePromise.then(onSuccess, onError);

    }
    
    uploadCandidateFile(file) {
        _this.importCandidateFile = file[0];
        if(_this.importCandidateFile){
            _this.importCandidateList();
          }   
    }
    
    importCandidateList(){ 
        let onSuccess = (response) => {
            if(response.data.uploaded > 0){
                _this.candidateTableParams.reload();
                _this.GrowlerService.growl({
                      type: 'success',
                      message: "Candidate Imported Successfully",
                      delay: 2000
                  });
              }else
              {
                  _this.GrowlerService.growl({
                      type: 'danger',
                      message: "No Records Uploaded",
                      delay: 2000
                  });
              }
           },
            onError = (error) => {
                console.log(error);
           };
       _this.InterviewService.importCandidateList({file :  _this.importCandidateFile});
       _this.InterviewService.activePromise.then(onSuccess, onError);

   }

  analyzePhoneNumber(contactNumber){
    _this.errmsgcon = "";
    if(angular.isDefined(contactNumber) && contactNumber.length < 10){
      _this.errmsgcon = "Enter Valid Contact Number";
        _this.contactCriteria = false;
    }
    else if(!angular.isDefined(contactNumber) || contactNumber === "" || contactNumber === null){
      _this.errmsgcon = "Please Enter Contact Number";
    }else {
      _this.errmsgcon = "";
        _this.contactCriteria = true;
    }
  }

  isInvalidEmailId(email){
    _this.errormessage = "";
    if(angular.isDefined(email) && !regEmail.test(email)){
      _this.errormessage = "Enter Valid Email Id";
      _this.emailCriteria = false;

    }
    else if(!angular.isDefined(email) || email === "" || email === null){
      _this.errormessage = " Please Enter Email Id";
    }else {
      _this.errormessage = "";
        _this.emailCriteria = true;
    }
  };

  removeInvalidFName(firstName) {
    if (angular.isDefined(firstName)) {
      for (var i = 0; i < firstName.length; i++) {
        var code = firstName.charCodeAt(i);
        if (!(code >= 65 && code <= 91) && !(code >= 97 && code <= 122) && !(code == 32)) {
          _this.firstName = "";
          return;
        }
      }
    }
  }

  removeInvalidLName(lastName) {
    if (angular.isDefined(lastName)) {
      for (var i = 0; i < lastName.length; i++) {
        var code = lastName.charCodeAt(i);
        if (!(code >= 65 && code <= 91) && !(code >= 97 && code <= 122) && !(code == 32)) {
          _this.lastName = "";
          return;
        }
      }
    }
  }

    clearSearchDepartment(){
        _this.searchDepartment = '';
    }
    clearSearchState(){
        _this.searchState = '';
    }
    clearSearchCity(){
        _this.searchCity = '';
    }
    clearSearchSkill(){
        _this.searchSkill = '';
    }

    hideMdselect() {
    _this.$mdSelect.hide();
    _this.$mdMenu.hide();
};
}

