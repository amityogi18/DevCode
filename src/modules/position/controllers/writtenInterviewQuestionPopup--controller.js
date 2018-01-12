let _this;
export class writtenInterviewQuestionPopupController {
	/** @ngInject  */
  constructor(items,$uibModalInstance, $timeout, InterviewService, $rootScope ,AuthService, GrowlerService) {
    console.log("Inside writtenInterviewQuestionPopupController");
    _this = this;
    _this.items = items;
    this.subCategory = [];
    this.question = [];
    this.selectedQuestions = [];
    this.showSelectedQuestions = false;
    this.$timeout = $timeout;
    this.$modalInstance = $uibModalInstance;
    this.InterviewService = InterviewService;
    this.GrowlerService = GrowlerService;
    this.AuthService = AuthService;
    this.selectedQuestionType = 4;
    this.selectedResponseType = 4;
    _this.showMCQ = true;
    _this.showMSQ = false;
    _this.showText = false;
    this.$rootScope = $rootScope;
    this.answerOption1 = 0;
    this.answerOption2 = 0;
    this.answerOption3 = 0;
    this.answerOption4 = 0;
    this.option1 = "";
    this.option2 = "";
    this.option3 = "";
    this.option4 = "";
    this.defaultQuestions = [];
    //Controlling the display behaviour of tabs inside a question bank popup
    this.showFromQuestionBank = false;
    this.showNewQuestion = false;
    this.showExistingTemplate = false;
    this.showPrevPositionTemplate = false;
    this.isAnswerChecked = false;
     _this.showFileChooser = false;
    _this.questionBankList = [];
    _this.avQuestionTypeList = [];
    _this.getAVQuestionTypeInfo();
    _this.PrevPositionList = [];
    _this.existingTemplateList = [];
    _this.responseTypeList = [{"id": 4,"responseType": "MCQ"}];
  }

  getPreviousPositionInfo() {
    _this.prevPositionId ='';
    let query="exceptPosition="+_this.items;
    let onSuccess = (response) => {
        _this.PrevPositionList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getPreviousPositionInfo(query);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  getExistingTemplateInfo() {
    _this.templateId = '';
    let onSuccess = (response) => {
        _this.existingTemplateList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getExistingTemplateInfo();
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  getQuestionBankInfo(type) {
    _this.categoryId = '';
    _this.subCategoryId = '';
    _this.subCategory = [];
    _this.question = [];
    let companyId= 1;
    if(type === 'company'){
      companyId = this.AuthService.user.companyId;
    }
    let onSuccess = (response) => {
        //_this.questionBankList = response.data;
        _this.questionBankList = _.filter(response.data.data, function(item){
            return item.status === "ACTIVE";
        });
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getQuestionBankInfo(companyId);
    _this.InterviewService.activePromise.then(onSuccess, onError);
  }

  getAVQuestionTypeInfo() {
    let onSuccess = (response) => {
        _this.avQuestionTypeList = response.data;
        _this.questionTypeList = _this.getQuestiontypeList(_this.avQuestionTypeList);
      },
      onError = (error) => {
        console.log(error);
      };
    this.InterviewService.getAVQuestionTypeInfo();
    this.InterviewService.activePromise.then(onSuccess, onError);
  }


  openQuestionBank(e, selectedOption) {
    var self = this;
    let modalInstance;
    modalInstance = this.$modal.open({
      controller: 'newQuestionPopupController',
      controllerAs: '$ctrl',
      templateUrl: 'questionbank-popup',
      size: 'md',
      windowClass: 'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false
    });
    //Opened event
    modalInstance.rendered.then(i => {
      //Control display behavour of tabs in question bank popup
      self.$timeout(()=> {
        self.$modalInstance = modalInstance;
        self.showFromQuestionBank = true;
        self.showNewQuestion = false;
      });
    });
  }

  controlTabsDisplay() {
    this.showFromQuestionBank = true;
    this.showNewQuestion = false;
    this.getQuestionBankInfo('custom');
  }
  
  controlNewTabsDisplay(){
    this.showFromQuestionBank = false;
    this.showNewQuestion = true;
    this.getQuestionBankInfo('company');
  }
  openNewQuestion(e) {
    var self = this;
    let modalInstance;
    modalInstance = this.$modal.open({
      controller: 'newQuestionPopupController',
      controllerAs: '$ctrl',
      templateUrl: 'questionbank-popup',
      size: 'md',
      windowClass: 'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false
    });
    //Opened event
    modalInstance.rendered.then(i => {
      //Control display behavour of tabs in question bank popup
      self.$timeout(()=> {
        self.$modalInstance = modalInstance;
        this.controlTabsDisplay();
        $('#hiddenbutton').click();
      });
    });
  }

  selectCategory(id) {
    _this.categoryId = id;
    _this.subCategory = [];
    _this.question = [];
    let onSuccess = (response) => {
        _this.subCategory = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getSkillSet(id);
    _this.InterviewService.activePromise.then(onSuccess, onError);

  }

  selectSubCategory(index,type) {
    let companyId= 1;
    if(type === 'company'){
      companyId = this.AuthService.user.companyId;
    }
    _this.question = [];
    _this.skillSetName = this.subCategory[index].skillsetName;
    _this.subCategoryId = this.subCategory[index].id;
    let onSuccess = (response) => {        
       _this.question = _.filter(response.data, function(item){
            return (item.responseTypeId === 2 || item.responseTypeId === 3 || item.responseTypeId === 4);
        });
          //_this.question = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getQuestionsBySkills(companyId, this.subCategory[index].id);
    _this.InterviewService.activePromise.then(onSuccess, onError);

  }

  selectQuestions(index,q) {
    var self = this;
    this.showSelectedQuestions = true;
    this.selectedQuestions.push({
      'question': q.question,
      'questionType': q.questionType,
      'responseType': q.responseTypeId,
      'skill': self.skillSetName,
      'questionId': q.questionId
    });
    this.selectedQuestions = _.uniqBy(this.selectedQuestions, function (question) {
        return question.questionId;
    });
  }

  removeSelectedQuestion(i) {
    this.selectedQuestions.splice(i, 1);
    this.selectedQuestions.length === 0 ? this.showSelectedQuestions = false : this.showSelectedQuestions = true;
  }

  //On Final Finish
  chooseQuestionFinish() {
    var self = this;
    this.$rootScope.$broadcast('updateMainWritten', {
      'dataArray': self.selectedQuestions
    });
    this.defaultQuestions.push(...this.question);
    this.$modalInstance.close();
  }

  //On Question type selection
  questionTypeChanged() {
    this.$rootScope.audioVideoImagePath ='';
    this.mcqMsqImage ='';
    this.removeImage();
    _this.isQuestionImageFileAdded = false;
    this.selectedQuestionType && this.selectedQuestionType === 4 ? _this.showMCQ = true : _this.showMCQ = false;
    this.selectedQuestionType && this.selectedQuestionType === 3 ? _this.showMSQ = true : _this.showMSQ = false;
    this.selectedQuestionType && this.selectedQuestionType === 2 ? _this.showText = true : _this.showText = false;
    //Bind the category (Skill Set)
    if(this.selectedQuestionType && this.selectedQuestionType === 4){
        _this.responseTypeList = [{"id": 4,"responseType": "MCQ"}];
        _this.selectedResponseType = 4;
    }else if(this.selectedQuestionType && this.selectedQuestionType === 3){
        _this.responseTypeList = [{"id": 3,"responseType": "MSQ"}];
        _this.selectedResponseType = 3;
    }else if(this.selectedQuestionType && this.selectedQuestionType === 2){
        _this.responseTypeList = [{"id": 2,"responseType": "TEXT"}];
        _this.selectedResponseType = 2;
    }

  }

  categoryChanged() {
    let onSuccess = (response) => {
        _this.subCategoryList = response.data;
      },
      onError = (error) => {
        console.log(error);
      };
    _this.InterviewService.getSkillSet(_this.selectedCategory);
    _this.InterviewService.activePromise.then(onSuccess, onError);
    _this.selectedSubCategory='';
  }

  checkRequiredFields(){
      if(  this.selectedQuestionType && _this.selectedQuestionType !== ''
              && _this.enteredQuestion && _this.enteredQuestion !==''
              && _this.selectedCategory && _this.selectedCategory !==''
              && _this.selectedResponseType && _this.selectedResponseType !==''
              && _this.selectedSubCategory && _this.selectedSubCategory !==''
      ){
          if((_this.selectedQuestionType == 3 || _this.selectedQuestionType == 4) && (_this.option1 == '' || _this.option2 == '' || _this.isAnswerChecked == false)){
              _this.questionBankForm.$setSubmitted();
              return false;
          }
          return true;
      }
      else{
          _this.questionBankForm.$setSubmitted();
        return false;
      }
  }
    checkAnswerSelection(){
        if( _this.answerOption1 == 2 || _this.answerOption2 == 3 ||  _this.answerOption3 == 4 || _this.answerOption4 == 5){
            _this.productMsg = " ";
            _this.isAnswerChecked = true;
        }
        else{
            _this.productMsg = "Please Select Right Answer"
            _this.isAnswerChecked = false;
        }
    }
    checkMsqAnswerSelection(){
        if( _this.answerOption1 == true || _this.answerOption2 == true ||  _this.answerOption3 == true || _this.answerOption4 == true){
            _this.answerMsg = " ";
            _this.isAnswerChecked = true;
        }
        else{
            _this.answerMsg = "Please Select Right Answer"
            _this.isAnswerChecked = false;
        }
    }
  //Save Question
  saveQuesstion() {
      if( _this.answerOption1 == 0  &&  _this.answerOption2 == 0 &&  _this.answerOption3 == 0 &&  _this.answerOption4 == 0){
          _this.productMsg = "Please Select Right Answer"
      }
      if( _this.answerOption1 == false  &&  _this.answerOption2 == false &&  _this.answerOption3 == false &&  _this.answerOption4 == false){
          _this.answerMsg = "Please Select Right Answer"
      }
      if (_this. checkRequiredFields()) {
          var self = this;
          this.showSelectedQuestions = true;

          let newQuestionData = {
              "companyId": 1,
              "questionTypeId": this.selectedQuestionType,
              "question": this.enteredQuestion,
              "statusId": 1,
              "questionLevel": "medium",
              "thinkTimeSec": 10,
              "responseTimeSec": 20,
              "skillsetId": this.selectedSubCategory,
              "departmentId": this.selectedCategory,
              "responseTypeId": this.selectedResponseType,
              "filePath": "",
              "imagePath": this.mcqMsqImage,

              "options": [
                  {"option": this.option1, "isCorrect": (this.answerOption1 == 2 || this.answerOption1) ? 1 : 0},
                  {"option": this.option2, "isCorrect": (this.answerOption2 == 3 || this.answerOption2) ? 1 : 0},
                  {"option": this.option3, "isCorrect": (this.answerOption3 == 4 || this.answerOption3) ? 1 : 0},
                  {"option": this.option4, "isCorrect": (this.answerOption4 == 5 || this.answerOption4) ? 1 : 0}
              ]
          };

          if (newQuestionData) {
              this.InterviewService.saveNewQuestion(newQuestionData).then((response) => {
                  if (response.status && response.status === 200 && response.statusText && response.statusText.indexOf('OK') > -1) {
                      if (response.data && response.data.responseTypeId) {
                          response.data.responseType = response.data.responseTypeId;
                      }
                      self.selectedQuestions.push(response.data);
                      this.GrowlerService.growl({
                          type: 'success',
                          message: "Question Saved Successfully",
                          delay: 2000
                      });
                      _this.clearQuestionbankFields();
                      this.answerOption1 = 0;
                      this.answerOption2 = 0;
                      this.answerOption3 = 0;
                      this.answerOption4 = 0;
                  }
              });
          }
      }
  }
  
  optionsChanged(val){
      //window.alert('click');
      _this.answerOption1 = 0;
      _this.answerOption2 = 0;
      _this.answerOption3 = 0;
      _this.answerOption4 = 0;
      if(val == 2){
          _this.answerOption1 = 2;
      }else if(val == 3){
          _this.answerOption2 = 3;
      }else if(val == 4){
          _this.answerOption3 = 4;
      }else if(val == 5){
          _this.answerOption4 = 5;
      }
  }
  
  
  
  clearQuestionbankFields(){
    _this.selectedQuestionType = _this.enteredQuestion = _this.selectedCategory = _this.selectedResponseType = _this.selectedSubCategory =_this.option1=_this.option2=_this.option3=_this.option4 ='';
    _this.questionBankForm.$setPristine();
    _this.questionBankForm.$setUntouched();
  }
  /* =========================== Existing template popup section ================= */
  // Button click event to open existing template popup
  openExistingTemplate(e, type) {
    var self = this;
    let modalInstance;
    modalInstance = this.$modal.open({
      controller: 'newQuestionPopupController',
      controllerAs: '$ctrl',
      templateUrl: 'questionbank-popup',
      size: 'md',
      windowClass: 'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false
    });
    //Opened event
    modalInstance.rendered.then(i => {
      //Control display behavour of tabs in question bank popup
      self.$timeout(()=> {
        self.$modalInstance = modalInstance;
        $('#hiddenExstingTemplateBtn').click();
      });
    });
  }

  selectExistingTemplateQuestions(i, q) {
    var self = this;
    this.showSelectedQuestions = true;
    this.selectedQuestions.push({
      'question': q.name,
      'questionType': q.type,
      'responseType': q.responseTypeId,
      'skill': self.existingTemplateName,
      'questionId': q.id
    });
    this.selectedQuestions = _.uniqBy(this.selectedQuestions, function (question) {
        return question.questionId;
    });
  }

  //Control display behaviour of existing template
  controlExistingTemplateTabsDisplay() {      
    this.getExistingTemplateInfo();
    this.showFromQuestionBank = false;
    this.showNewQuestion = false;
    this.showExistingTemplate = true;
  }

  //Selected temlate list
  selectedExistingTemplate(index) {
    if (_this.existingTemplateList) {
      _this.existingTemplateQuestion = [];
      _this.templateId = _this.existingTemplateList[index].id;
      _this.existingTemplateName = _this.existingTemplateList[index].name;
      let onSuccess = (response) => {
        _this.existingTemplateQuestion = _.filter(response.data, function(item){
            return (item.responseType === 2 || item.responseType === 3 || item.responseType === 4);
        });
         // _this.existingTemplateQuestion = response.data;
        },
        onError = (error) => {
          console.log(error);
        };
      _this.InterviewService.getExsTemplateQuestions(_this.existingTemplateList[index].id);
      _this.InterviewService.activePromise.then(onSuccess, onError);

    }
  }

  /* ============== Previous position popup ================= */
  // Button click event to open a previous position popup
  openPreviousPosition(e, type) {
    var self = this;
    let modalInstance;
    modalInstance = this.$modal.open({
      controller: 'newQuestionPopupController',
      controllerAs: '$ctrl',
      templateUrl: 'questionbank-popup',
      size: 'md',
      windowClass: 'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false
    });
    //Opened event
    modalInstance.rendered.then(i => {
      //Control display behavour of tabs in question bank popup
      self.$timeout(()=> {
        self.$modalInstance = modalInstance;
        $('#hiddenPrevPosBtn').click();
      });
    });
  }

  selectPrevPositionQuestions(i, q) {
    var self = this;
    this.showSelectedQuestions = true;
    this.selectedQuestions.push({
      'question': q.question,
      'questionType': q.questionTypeId,
      'responseType': q.responseTypeId,
      'skill': self.PrevPostionName,
      'questionId': q.id
    });
    this.selectedQuestions = _.uniqBy(this.selectedQuestions, function (question) {
        return question.questionId;
    });
  }

  //Control display behaviour of existing template
  controlPrevPosTabsDisplay() {      
    this.getPreviousPositionInfo();
    this.showFromQuestionBank = false;
    this.showNewQuestion = false;
    this.showExistingTemplate = false;
    this.showPrevPositionTemplate = true;
  }

  //Selected temlate list
  selectedPrevPosition(index) {
    if (_this.PrevPositionList) {
      _this.PrevPositionQuestion = [];
      _this.prevPositionId = _this.PrevPositionList[index].id;
      _this.PrevPostionName = _this.PrevPositionList[index].positionName;
      let onSuccess = (response) => {
          _this.PrevPositionQuestion = _.filter(response.data, function(item){
            return (item.responseTypeId === 2 || item.responseTypeId === 3 || item.responseTypeId === 4);
        });
          //_this.PrevPositionQuestion = response.data;
        },
        onError = (error) => {
          console.log(error);
        };
      _this.InterviewService.getPreviousPositionQuestions(this.PrevPositionList[index].id);
      _this.InterviewService.activePromise.then(onSuccess, onError);
    }
  }

  /* ===== Close Modal ===== */
  closeModal() {
    if (this.$modalInstance) {
      this.$modalInstance.dismiss();
    }
  }

  getQuestiontypeList(questionTypeList) {
    let returnArray = [];
    if (angular.isDefined(questionTypeList) && questionTypeList.length > 0) {
      for (var i = 0; questionTypeList.length > i; i++) {
        if (questionTypeList[i].questionType == "MCQ" || questionTypeList[i].questionType == "MSQ" || questionTypeList[i].questionType == "TEXT") {
          returnArray.push(questionTypeList[i]);
        }
      }
    }
    return returnArray;
  }

   isFileAdded(file){
    if(angular.isDefined(file) && file.length>0){
       /*var fr = new FileReader();
       fr.onload = function () {
          _this.$rootScope.audioVideoImagePath = fr.result;
       }
       fr.readAsDataURL(file[0]);
       _this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded; */
      if(file.length > 0){
        this.fileNotSelected = true;
       }
        else{
          this.fileNotSelected = false; 
        }
    }
    
  }
  
   uploadImage(file) {
         this.$rootScope.audioVideoImagePath = URL.createObjectURL(file[0]);
         this.mcqMsqImage = file[0];
         this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
         this.showFileChooser = false;
    }
  
    removeImage(){
      this.imagePath = "";
      this.showFileChooser = true;
      this.isQuestionImageFileAdded =! _this.isQuestionImageFileAdded;
    }
    clearSearchCategory(){
        this.searchCategory = '';
    }
    clearSearchSubCategory(){
        this.searchSubCategory = '';
    }
}


