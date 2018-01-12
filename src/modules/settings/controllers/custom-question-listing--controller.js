let _this;
export class CustomQuestionListingController {
  /** @ngInject  */
  constructor(CustomQuestionService, $timeout, NgTableParams, GrowlerService, LoaderService, $sce, UtilsService, dataTableService) {
    _this = this;
    _this.$timeout = $timeout;
    _this.$sce = $sce;
    _this.GrowlerService = GrowlerService;
    _this.UtilsService = UtilsService;
    _this.CustomQuestionService = CustomQuestionService;
    _this.dataTableService = dataTableService;
    _this.dataTableService.initTable([], {});
    _this.colNum = 6;
    _this.isDefaultChecked = false;
    _this.selectedCheckboxes = [];
    _this.GrowlerService = GrowlerService;
    _this.LoaderService = LoaderService;
    _this.customQuestionList = [];
    _this.customQuestionTemplateList = [];
    _this.isActive = false;
    _this.customQuestions = function () {
      _this.customQuestionTableParams = new NgTableParams({
          page: 1,
          count: 5
        },
        {
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
                _this.customQuestionList = response.data.data;
                _this.customQuestionCount = response.data.total;
                
                params.total(_this.customQuestionCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols, _this.customQuestionTableParams);
                }
                return (_this.customQuestionList);

              },
              onError = (error) => {
                console.log(error);
              };
            _this.CustomQuestionService.getcustomQuestionList(queryURL);
            return _this.CustomQuestionService.activePromise.then(onSuccess, onError);
          }
        });
    };
    _this.toggle = function() {
        _this.dataTableService.setColumn(-1);
        _this.dataTableService.toggle(_this.cols, event.target.value);
    };
    //******Get Default Question List*******//
   
      _this.defaultCustomQuestionTableParams = new NgTableParams({
          page: 1,
          count: 5
        },
        {
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
            queryURL += `${queryString}&limit=${count}&page=${page}&isDefault=true`;
            let onSuccess = (response) => {                
                _this.defaultCustomQuestionList = response.data.data;
                _this.defaultCustomQuestionCount = response.data.total;
                
                params.total(_this.defaultCustomQuestionCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols, _this.defaultCustomQuestionTableParams);
                }
                return (_this.defaultCustomQuestionList);

              },
              onError = (error) => {
                console.log(error);
              };
            _this.CustomQuestionService.getDefaultCustomQuestionList(queryURL);
            return _this.CustomQuestionService.activePromise.then(onSuccess, onError);
          }
        });
    
    


    _this.getAllCustomQuestionTemplateList = function () {
      _this.customQuestionTemplatetableParams = new NgTableParams({
          page: 1,
          count: 5
        },
        {
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
                let customQuestionTemplateCount = response.data.length;
                _this.customQuestionTemplateList = response.data;

                if (_this.customQuestionTemplateList && customQuestionTemplateCount > 0) {
                  for (var i = 0; i < customQuestionTemplateCount; i++) {
                    _this.questionId = _this.customQuestionTemplateList[i].id;
                  }
                }
                _this.totalcustomQuestionTemplate = customQuestionTemplateCount;
                params.total(_this.customQuestionTemplateCount);
                if(!_this.dataTableService.totalColumn.length) {
                  _this.dataTableService.initTable(_this.cols, _this.customQuestionTemplatetableParams);
                }
                return (_this.customQuestionTemplateList);
              },
              onError = (error) => {
                console.log(error);
              };
            _this.CustomQuestionService.getcustomQuestionTemplateList(queryURL);
            return _this.CustomQuestionService.activePromise.then(onSuccess, onError);
          }
        });
    }
    _this.customQuestions();
    _this.getAllCustomQuestionTemplateList();

    $('#myCustomQuestionModal').on('hidden.bs.modal', function (e) {
         console.log('modal closed');
         $('#questionBankAudioElement').trigger('pause');
         _this.UtilsService.stopVideoPlayer();
      })
  }

  onClose() {
    _this.customQuestionTableParams.reload();
    _this.customQuestionTemplatetableParams.reload();
    _this.defaultCustomQuestionTableParams.reload();
    //_this.$state.go(_this.$state.current, {activeTab: _this.activeTab}, {reload: true});

  }

  deleteCustomQuestion(questionIds) {
    let onSuccess = (response) => {
        _this.customQuestionTableParams.reload();
        _this.GrowlerService.growl({
          type: 'success',
          message: "Custom Question Deleted Successfully",
          delay: 2000
        });
        console.log(response.data);
        _this.activeTab = 1;

      },
      onError = (error) => {
        console.log(error);
      };
    let removeQuestionObj = {
      questionIds: [questionIds]
    };
    _this.CustomQuestionService.deleteCustomQuestion(removeQuestionObj);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);

  }

  deleteQuesstionTemplate(templateId) {
    let onSuccess = (response) => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Question Template Deleted Successfully",
          delay: 2000
        });
        _this.activeTab = 2;
        _this.customQuestionTemplatetableParams.reload();
      },
      onError = (error) => {
        console.log(error);
      };

    _this.CustomQuestionService.deleteQuesstionTemplate(templateId);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);

  }

  importQuestionList(){
    _this.LoaderService.show();
    let onSuccess = (response) => {
        _this.GrowlerService.growl({ type: 'success', message: 'Question Imported Successfully', delay: 300});
        _this.activeTab = 1;
        _this.LoaderService.hide();
        _this.customQuestionTableParams.reload();
      },
      onError = (error) => {
        _this.LoaderService.hide();
        _this.customQuestionTableParams.reload();
      };
    let fileData = {
      file :  _this.attachment[0]
    };
    _this.CustomQuestionService.importQuestionList(fileData);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);
  }

  isFileAdded(file){
    if(file.length > 0){
      this.fileNotSelected = true;
    }
    else{
      this.fileNotSelected = false;
    }
  }

  uploadAttachment(file) {
    _this.attachment = file;
    if(file.length > 0){
      _this.importQuestionList();
    }
    
  }

  getQuestionDetailsById(questionId) {
    _this.question= {};
    let onSuccess = (response) => {
        if(response.data){
          _this.question.selectedQuestionType = response.data.questionTypeId;
          _this.question.enteredQuestion = response.data.question;
          _this.question.statusId = response.data.statusId;
          _this.question.questionLevel = response.data.questionLevel;
          _this.question.thinkTimeSec = response.data.thinkTimeSec;
          _this.responseTimeSec = response.data.responseTimeSec;
          _this.question.selectedResponseType = response.data.responseTypeId;
          _this.question.filePath = response.data.filePath;
          _this.question.imagePath = response.data.imagePath;
          if(angular.isDefined(_this.question.filePath)){
            //responseVideo.src = _this.selectedQuestion.response.answersGiven;
            _this.UtilsService.initVideoPlayer("questionBankVideoElement", _this.question.filePath);
          }
          _this.question.fileType = response.data.fileType;
          _this.question.questionTypeName = response.data.questionTypeName;
          _this.question.departmentName = response.data.departmentName;
          _this.question.skillsetName = response.data.skillsetName;
          if (response.data.options && response.data.options.length > 0) {
            _this.question.option1 = response.data.options[0].option;
            _this.question.option2 = response.data.options[1].option;
            _this.question.option3 = response.data.options[2].option;
            _this.question.option4 = response.data.options[3].option;
          }
          if (_this.question.selectedQuestionType == 4) {
            _this.question.answerOption1 = response.data.options[0].isCorrect == 1 ? 2 : 0;
            _this.question.answerOption2 = response.data.options[1].isCorrect == 1 ? 3 : 0;
            _this.question.answerOption3 = response.data.options[2].isCorrect == 1 ? 4 : 0;
            _this.question.answerOption4 = response.data.options[3].isCorrect == 1 ? 5 : 0;
          } else if (_this.question.selectedQuestionType == 3) {
            _this.question.answerOption1 = response.data.options[0].isCorrect == 1 ? true : false;
            _this.question.answerOption2 = response.data.options[1].isCorrect == 1 ? true : false;
            _this.question.answerOption3 = response.data.options[2].isCorrect == 1 ? true : false;
            _this.question.answerOption4 = response.data.options[3].isCorrect == 1 ? true : false;
          }
        }
      },
      onError = (error) => {
      };

    _this.CustomQuestionService.getQuestionDetailsById(questionId);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);
  }

  getTemplateDetailsById(templateId) {
    _this.templateDetail = {};
    let onSuccess = (response) => {
        _this.templateDetail = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.CustomQuestionService.getTemplateDetailsById(templateId);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);
  }

  trustSrc(src) {
    return _this.$sce.trustAsResourceUrl(src);
  }

  stopMedia(){
    $('#questionBankAudioElement').trigger('pause');
    _this.UtilsService.stopVideoPlayer();
  }

  addDefaultQuestion(questionId){
       _this.selectedData = {};
       _this.selectedData.questionId = questionId;
       if(questionId){
           _this.isDefaultChecked = true;
           _this.selectedCheckboxes.push(_this.selectedData.questionId);        
       }

  }

  setDefaultQuestion() {
    let onSuccess = () => {
        _this.GrowlerService.growl({
          type: 'success',
          message: "Default Question Added Successfully",
          delay: 2000
        });
         _this.defaultCustomQuestionTableParams.reload();
         _this.selectedCheckboxes = [];
         _this.isDefaultChecked = false;
      },
      onError = (error) => {
        console.log(error);
      };
      
      //_this.selectedQuestionIds = _.uniqBy(_this.selectedQuestionIds);
      var defaultQuestionData = {
        questionIds : _this.selectedCheckboxes
      };
    _this.CustomQuestionService.setDefaultQuestion(defaultQuestionData);
    _this.CustomQuestionService.activePromise.then(onSuccess, onError);
  }
}

