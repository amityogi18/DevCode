import _ from 'lodash';
let _this;
const allowedSecs = 120;

/*
 @question--Controller
 @param {object} NgTableParams description - initialise the ng-table & provides configuration
 @param {object} clientsService description - returns the object and provides all the values related to the company questions.
 @param {object} $scope This is act like glue between view and controller.
 @param {object} $element This represent element of dom.
 @param  {object} $timeout
 @param {NestedTableService} It nested table accordian service which is used in table accordian.
 */
export class QuestionBankController {
  /** @ngInject  */
  constructor(NgTableParams, QuestionBankService, $timeout, GrowlerService, AdminDepartmentService, CandidateProfileService, CustomQuestionService, $sce, mediaRecorderService, InterviewService, SuperAdminService, $state,LoaderService, dataTableService) {
    _this = this;
    _this.QuestionBankService = QuestionBankService;
    _this.$timeout = $timeout;
    _this.GrowlerService = GrowlerService;
    _this.$sce = $sce;
    _this.$timeout = $timeout;
    _this.mediaRecorderService = mediaRecorderService;
    _this.InterviewService = InterviewService;
    _this.CustomQuestionService = CustomQuestionService;
    _this.AdminDepartmentService = AdminDepartmentService;
    _this.CandidateProfileService = CandidateProfileService;
    _this.$state = $state;
    _this.LoaderService = LoaderService;
    _this.showSetPractice = true;
    _this.SuperAdminService = SuperAdminService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.showMCQ = true;
    _this.showAudio = false;
    _this.showVideo = false;
    _this.showText = false;
    _this.showMSQ = false;
    _this.showImage = false;
    _this.recordedVideo ='';
    _this.paused = false;
    _this.mediaRecorder = '';
    _this.isMCQ = true;
    _this.subCategory = [];
    _this.question = [];
    _this.isAudioVideo = false;
    _this.isWritten = false;
    _this.departmentList = [];
    _this.getDepartment();
    _this.companyList= [];
    _this.companyFilterList = [];
    _this.id = {};
    _this.getCompanyList();
    _this.generalTableFilter = {};
    _this.customTableFilter = {};
    _this.practiceQuestionTableFilter = {};
    _this.skillFilter = [];
    _this.selectedQuestionIds = [];
    _this.responseTypeList = [];
    _this.searchCompany;
    _this.tabIdSelected = 1;
    _this.questionList = {
      1: [],
      2: [],
      3: [],
    };
    _this.onTabSwitch = false;
    _this.generalTableParams = new NgTableParams(
      {
        page: 1,
        count: 5,
        filter: _this.generalTableFilter
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
          }
          queryURL += `${queryString}&limit=${count}&page=${page}`;
          let onSuccess = (response) => {

              _this.generalQuestionList = response.data.data;
              _this.generalQuestionListCount = response.data.total;
              if (_this.generalQuestionList &&
                _this.generalQuestionList.length > 0) {
                params.total(_this.generalQuestionListCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols, _this.generalTableParams);
                }
                return (_this.generalQuestionList);
              }
            },
            onError = (error) => {
              console.log(error);
            };

          _this.QuestionBankService.getGeneralQuestionData(queryURL);
          return _this.QuestionBankService.activePromise.then(onSuccess, onError);
        }
      });
    _this.toggle = function(selectedValue) {
      _this.dataTableService.setColumn(-1);
      _this.dataTableService.toggle(_this.cols, event.target.value);
    };

    _this.customTableParams = new NgTableParams(
      {
        page: 1,
        count: 5,
        filter: _this.customTableFilter
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
          }
          queryURL += `${queryString}&limit=${count}&page=${page}`;
          let onSuccess = (response) => {

              _this.customQuestionList = response.data.data;
              _this.customQuestionListCount = response.data.total;
              if (_this.customQuestionList &&
                _this.customQuestionList.length > 0) {
                params.total(_this.customQuestionListCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols11, _this.customTableParams);
                }
                return (_this.customQuestionList);
              }

            },
            onError = (error) => {
              console.log(error);
            };

          let companyId = _this.companyId || 1;

          _this.QuestionBankService.getCustomQuestionData(queryURL, companyId);
          return _this.QuestionBankService.activePromise.then(onSuccess, onError);
        }
      });
    _this.toggle11 = function(selectedValue) {
      _this.dataTableService.setColumn(-1);
      _this.dataTableService.toggle(_this.cols11, event.target.value);
    };

    _this.practiceQuestionTableParams = new NgTableParams(
      {
        page: 1,
        count: 5,
        filter: _this.practiceQuestionTableFilter
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
            if(angular.isDefined(value) && value.constructor !== Array){
              _this.skillFilter = "skillId[]="+value;
            }


          });
          if (sortFields.length) {
            queryString += `orderBy=${sortFields.join('&')}&`;
          }
          if (filterFields.length) {
            //queryString += filterFields.join('&');
            queryString += _this.skillFilter;
          }
          queryURL += `${queryString}&limit=${count}&page=${page}`;
          let onSuccess = (response) => {
              _this.practiceQuestionList = response.data.data;
              _this.practiceQuestionListCount = response.data.total;
              if (_this.practiceQuestionList &&
                _this.practiceQuestionList.length > 0) {
                params.total(_this.practiceQuestionListCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols12, _this.practiceQuestionTableParams);
                }
                return (_this.practiceQuestionList);
              }

            },
            onError = (error) => {
              console.log(error);
            };

           _this.QuestionBankService.getPracticeQuestionData(queryURL);
          return _this.QuestionBankService.activePromise.then(onSuccess, onError);
        }
      });

    _this.toggle12 = function(selectedValue) {
      _this.dataTableService.setColumn(-1);
      _this.dataTableService.toggle(_this.cols12, event.target.value);
    };

    _this.practiceQuestionTableFilter.skillId = [];
    _this.videoQuestionSelected = [];
    _this.selectedQuestionIds = [];
  }
  
  clearSearchCompany(){
    _this.searchCompany = '';
  }

  getCompanyList(){
    let onSuccess = (response) => {
        _this.companyList = response.data;
        _this.id = _this.companyList[0].id;
        _this.companyFilterList = angular.copy(response.data, _this.companyFilterList);

        for(let i = 0; _this.companyFilterList.length > i;i++){
          if(_this.companyFilterList[i].name === 'I-TECH'){
            _this.companyFilterList.splice(i, 1);
          }
        }
        _this.companyFilterList.unshift({ id: '',  name: 'All'});

      },
      onError = (error) => {
        console.log(error);
      }
    _this.SuperAdminService.getCompanyList();
    _this.SuperAdminService.activePromise.then(onSuccess, onError);
  }

  getCompanyData(id){
    _this.companyId = id;
    _this.customTableFilter.status = '';
    _this.customTableFilter.companyId = (id === " ") ? "" : id;
  }

  getSkillData(id){
    _this.skillId = id;
    _this.practiceQuestionTableFilter.skillId = id;
  }

  uploadAttachment(file) {
    _this.attachment = file;
    _this.importQuestionList();
  }

  isFileAdded(file){
    if(file.length > 0){
      this.fileNotSelected = true;
    }
    else{
      this.fileNotSelected = false;
    }
  }

  importQuestionList(){
    let onSuccess = (response) => {
        _this.GrowlerService.growl({
          type: 'success',
          message: 'Question Imported Successfully',
          delay: 2000
        });
        _this.onClose();
      },
      onError = (error) => {
        console.log(error);
      };
    let fileData = {
      file :  _this.attachment[0]
    }

    let companyId = _this.companyId || 1;
    _this.QuestionBankService.importQuestionList(fileData, companyId);
    _this.QuestionBankService.activePromise.then(onSuccess, onError);
  }

  showSetQuestion(tabId){
    _this.tabIdSelected = tabId;
    switch(tabId) {
      case 1: 
        _this.generalTableParams.page(1);
        _this.generalTableParams.reload();
        break;
      case 2: 
        _this.customTableParams.page(1);
        _this.customTableParams.reload();
        break;
      case 3:
          _this.practiceQuestionTableParams.page(1);
         _this.practiceQuestionTableParams.reload();
    }
    if(tabId === 3){
      _this.showSetPractice = false;
    }
    else{
      _this.showSetPractice = true;
    }
    if(tabId === 2){
      _this.customTableFilter.status = 'all';
    }else {
      _this.customTableFilter.status = '';
      _this.customTableFilter.companyId = '';
    }
  }

  addQuestionId(element, questionId, question){
    //let clientId = clients.companyId;
    _this.isRemoved = false;
    if(_this.questionList[_this.tabIdSelected].indexOf(questionId) === -1) {
        _this.questionList[_this.tabIdSelected].push(questionId);
    }
    
    if(question){
      if((question.questionType == 'MCQ' || question.questionType == 'MSQ') && element.currentTarget.checked){
        _this.videoQuestionSelected.push(questionId)
      }
      else if((question.questionType == 'MCQ' || question.questionType == 'MSQ') && !element.currentTarget.checked){
        for(var i =0; _this.videoQuestionSelected.length > i; i++){
          if(_this.videoQuestionSelected[i] == questionId){
            _this.isRemoved = true;;
            _this.questionList[_this.tabIdSelected].splice(_this.questionList[_this.tabIdSelected].indexOf(questionId), 1);
            _this.videoQuestionSelected.splice(i, 1);
          }
        }
      }
    }

    if(element.currentTarget.checked){
      _this.selectedQuestionIds.push(questionId);
    }else{
      if(_this.selectedQuestionIds.length > 0){
        for(var i =0; _this.selectedQuestionIds.length > i; i++){
          if(_this.selectedQuestionIds[i] == questionId){
            !_this.isRemoved && _this.questionList[_this.tabIdSelected].splice(_this.questionList[_this.tabIdSelected].indexOf(questionId), 1);
            _this.selectedQuestionIds.splice(i, 1);
          }
        }
      }
    }
  }

  deleteGeneralQuestion() {
    let onSuccess = () => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Question Deleted Successfully",
          delay: 2000
        });
        _this.onClose();
        _this.selectedQuestionIds = [];
      },
      onError = (error) => {
        console.log(error);
      },

      questionData = {
        questionIds : _this.selectedQuestionIds
      };
    _this.QuestionBankService.deleteQuestion(questionData);
    _this.QuestionBankService.activePromise.then(onSuccess, onError);
  }

  deleteCustomQuestion() {
    let onSuccess = () => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Question Deleted Successfully",
          delay: 2000
        });
        _this.onClose();
        _this.selectedQuestionIds = [];
      },
      onError = (error) => {
        console.log(error);
      },

      questionData = {
        questionIds : _this.selectedQuestionIds
      };
    _this.QuestionBankService.deleteQuestion(questionData);
    _this.QuestionBankService.activePromise.then(onSuccess, onError);
  }

  getDepartment(){
    let onSuccess = (response) => {
        _this.departmentList = response.data.data;
        for(let i = 0; _this.departmentList.length > i; i++){
          if(_this.departmentList[i].name === 'Any Other'){
            _this.departmentList.splice(i, 1);
          }
        }
      },
      onError = (error) => {
        console.log(error);
      };
    _this.AdminDepartmentService.getDepartment();
    _this.AdminDepartmentService.activePromise.then(onSuccess, onError);
  }

  getSkillSet(departmentId){
    if(angular.isDefined(departmentId) && departmentId !== null && departmentId !== ''){
      //_this.skillId = skillsetId;
      //_this.practiceQuestionTableParams.skillId = skillsetId;
      let onSuccess = (response) => {
          _this.skillsetList = response.data;
        },
        onError = (error) => {
          console.log(error);
        };
      _this.CandidateProfileService.getSkillSet(departmentId);
      _this.CandidateProfileService.activePromise.then(onSuccess, onError);
    }
  }

  setPracticeQuestion() {
    let onSuccess = () => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Practice Question Added Successfully",
          delay: 2000
        });
        _this.selectedQuestionIds = [];
        _this.onClose();
      },
      onError = (error) => {
        console.log(error);
      },

      practiceQuestionData = {
        questionIds : _this.selectedQuestionIds
      };
    _this.QuestionBankService.setPracticeQuestion(practiceQuestionData);
    _this.QuestionBankService.activePromise.then(onSuccess, onError);
  }


  deletePracticeQuestion() {
    let onSuccess = () => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Question Deleted Successfully",
          delay: 2000
        });
        _this.selectedQuestionIds = [];
        _this.onClose();
      },
      onError = (error) => {
        console.log(error);
      },

      practiceQuestionData = {
        questionIds : _this.selectedQuestionIds
      };
    _this.QuestionBankService.setPracticeQuestion(practiceQuestionData);
    _this.QuestionBankService.activePromise.then(onSuccess, onError);
  }

  onClose(){
    _this.generalTableParams.reload();
    _this.customTableParams.reload();
    _this.practiceQuestionTableParams.reload();
  }

  getQuestionDetailsById(questionId){

    let onSuccess = (response) => {
        _this.selectedQuestionType =  response.data.questionTypeId;
        _this.questionTypeChanged();
        _this.enteredQuestion =  response.data.question;
        _this.id =  response.data.companyId;
        _this.statusId =  response.data.statusId;
        _this.questionLevel =  response.data.questionLevel;
        _this.thinkTimeSec =  response.data.thinkTimeSec;
        _this.responseTimeSec =  response.data.responseTimeSec;
        _this.departmentId = response.data.departmentId;
        _this.getSkillSet(response.data.departmentId);
        _this.skillsetId = response.data.skillsetId;
        _this.selectedResponseType = response.data.responseTypeId;
        _this.questionId = questionId;
        _this.responseTypeId =  response.data.responseTypeId;
        _this.filePath =  response.data.filePath;
        _this.fileType =  response.data.fileType;
        _this.questionTypeName = response.data.questionTypeName;
        _this.departmentName = response.data.departmentName;
        _this.skillsetName = response.data.skillsetName;

        if(_this.selectedQuestionType == 4 || _this.selectedQuestionType == 3){
          _this.option1 = response.data.options[0].option;
          _this.option2 = response.data.options[1].option;
          _this.option3 = response.data.options[2].option;
          _this.option4 = response.data.options[3].option;
          if(_this.selectedQuestionType == 4){
            _this.answerOption1 = response.data.options[0].isCorrect == 1 ? 2: 0;
            _this.answerOption2 = response.data.options[1].isCorrect == 1 ? 3: 0;
            _this.answerOption3 = response.data.options[2].isCorrect == 1 ? 4: 0;
            _this.answerOption4 = response.data.options[3].isCorrect == 1 ? 5: 0;
          }else if(_this.selectedQuestionType == 3){
            _this.answerOption1 = response.data.options[0].isCorrect == 1 ? true: false;
            _this.answerOption2 = response.data.options[1].isCorrect == 1 ? true: false;
            _this.answerOption3 = response.data.options[2].isCorrect == 1 ? true: false;
            _this.answerOption4 = response.data.options[3].isCorrect == 1 ? true: false;
          }
        }

      },
      onError = (error) => {
      };

    _this.CustomQuestionService.getQuestionDetailsById(questionId);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);
  }

  questionTypeChanged(){
    _this.selectedQuestionType && _this.selectedQuestionType === 4 ? _this.showMCQ = true : _this.showMCQ = false;
    _this.selectedQuestionType && _this.selectedQuestionType === 5 ? _this.showAudio = true : _this.showAudio = false;
    _this.selectedQuestionType && _this.selectedQuestionType === 6 ? _this.showImage = true : _this.showImage = false;
    _this.selectedQuestionType && _this.selectedQuestionType === 2 ? _this.showText = true : _this.showText = false;
    _this.selectedQuestionType && _this.selectedQuestionType === 3 ? _this.showMSQ = true : _this.showMSQ = false;
    _this.selectedQuestionType && _this.selectedQuestionType === 1 ? _this.showVideo = true : _this.showVideo = false;

    if(this.selectedQuestionType && this.selectedQuestionType === 4){
      _this.responseTypeList = [{"id": 4,"responseType": "MCQ"}];
    }else if(this.selectedQuestionType && this.selectedQuestionType === 3){
      _this.responseTypeList = [{"id": 3,"responseType": "MSQ"}];
    }else if(this.selectedQuestionType && this.selectedQuestionType === 2){
      _this.responseTypeList = [  {"id": 5,"responseType": "AUDIO"},
        {"id": 1,"responseType": "VIDEO"},
        {"id": 2,"responseType": "TEXT"}
      ];
    }else if(this.selectedQuestionType && (this.selectedQuestionType === 1 || this.selectedQuestionType === 5)){
      _this.responseTypeList = [
        {"id": 5,"responseType": "AUDIO"},
        {"id": 1,"responseType": "VIDEO"},
        {"id": 2,"responseType": "TEXT"}
      ];
    }

  }

  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

}
