let _this;
export class writtenInterviewAccordionController {
	/** @ngInject  */
  constructor($uibModal,$timeout,InterviewService,$rootScope) {
    _this = this;
    console.log("Inside writtenInterviewAccordionController");
    this.$uibModal = $uibModal;
    this.$timeout = $timeout;
    this.InterviewService = InterviewService;
    this.$modalInstance = {};
    this.defaultQuestions = [];
    this.recommonded = true;
    
    this.$rootScope = $rootScope;
    this.primarySkillId = "";
    this.secondarySkillId = "";
    this.tertiarySkillId = "";
    //Get Default Questions List
   
    this.$rootScope.$on('updateMainWritten',function(e,m){
      _this.defaultQuestions.push(...m.dataArray);
      _this.defaultQuestions = _.uniqBy(_this.defaultQuestions, function (question) {
                return question.questionId;
       });
      _this.onUpdate({value: true});  
    });
    
    this.$onInit = function(){
        this.isEditMode = this.mode;
        this.positionId = this.pid;
        this.interviewId = this.interviewid;
        this.primarySkillId = this.primarySkillId;
        this.secondarySkillId = this.secondarySkillId;
        this.tertiarySkillId = this.tertiarySkillId;
        this.getWrittenInterviewLinkQuestions();
        
    }
    _this.$onChanges = function (changesObj) {
            console.log("updated object written Interview "+changesObj);
            this.isEditMode = this.mode;
            this.positionId = this.pid;
            this.interviewId = this.interviewid;
            this.primarySkillId = this.primarySkillId;
            this.secondarySkillId = this.secondarySkillId;
            this.tertiarySkillId = this.tertiarySkillId;
            if(changesObj.recommendations  
                    && (changesObj.recommendations.currentValue !== changesObj.recommendations.previousValue)){
                if(this.interviewid === ""){
                    if(this.primarySkillId !== ""){
                        this.getWrittenInterviewLinkQuestions();
                    }                    
                }
            }
            if(changesObj.isReset   
                    && (changesObj.isReset.previousValue === true || changesObj.isReset.previousValue === false)
                    && (changesObj.isReset.currentValue !== changesObj.isReset.previousValue)){
                this.defaultQuestions = [];
                if(this.interviewid === ""){
                    if(this.primarySkillId !== ""){
                        this.getWrittenInterviewLinkQuestions();
                    }                    
                }
            }else if(changesObj.isFetch  
                    && (changesObj.isFetch.previousValue === true || changesObj.isFetch.previousValue === false)
                    && (changesObj.isFetch.currentValue !== changesObj.isFetch.previousValue)){
                _this.getWrittenInterviewLinkQuestions();                                
            } 
            else if(changesObj.currentState
                    && (changesObj.currentState.previousValue === true || changesObj.currentState.previousValue === false)
                    && (changesObj.currentState.currentValue !== changesObj.currentState.previousValue)){
                if(_this.isEditMode || (_this.interviewid !== '' && _this.interviewid !== null)){
                    //_this.updateQuestions();
                    if(this.defaultQuestions.length > 0){
                        _this.saveRecQuestions();
                     }
                }else
                {   if(this.defaultQuestions.length > 0){
                        _this.saveRecQuestions();
                    }                    
                }
            }
            
        }
  }

  getWrittenInterviewLinkQuestions(){
    var self = this;
    if(this.primarySkillId !== "" || this.interviewid !== ""){
        this.InterviewService.getInterviewQuestions({
         "interviewId": self.interviewid,
         "positionId": self.pid,
         "primarySkillId": self.primarySkillId,
         "secondarySkillId" : self.secondarySkillId,
         "tertiarySkillId": self.tertiarySkillId,
         "questionTypeId" : [3,4,2]      
       }).then((res) => {
         if(res.hasOwnProperty('recommonded')){
           self.recommonded = res.recommonded;
         }
         if(res.data && res.data.length > 0){
             self.defaultQuestions =  _.uniqBy(res.data, function(question) { return question.questionId; });           
         }
       });
    }          
    
  }
  
  openQuestionBank(e,selectedOption) {
    var self = this;
    let modalInstance;
    modalInstance = this.$uibModal.open({
      controller:'writtenInterviewQuestionPopupController',
      controllerAs:'$ctrl',
      templateUrl:'questionbank-popup',
      size:'md',
      windowClass:'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false,
      resolve: {
            items: function () {
                return _this.positionId;
            }
        }
    });
      //Opened event
      modalInstance.rendered.then(i => {
        //Control display behavour of tabs in question bank popup
        self.$timeout(()=>{
          self.$modalInstance = modalInstance;
          $('#hiddenbutton').click();
        });
      });
    }

    openNewQuestion(e){
      var self = this;
      let modalInstance;
      modalInstance = this.$uibModal.open({
        controller:'writtenInterviewQuestionPopupController',
        controllerAs:'$ctrl',
        templateUrl:'questionbank-popup',
        size:'md',
        windowClass:'written-popup default-tab-module question-bankpop',
        backdrop: 'static',
        keyboard: false,
      resolve: {
            items: function () {
                return _this.positionId;
            }
        }
      });
      //Opened event
      modalInstance.rendered.then(i => {
        //Control display behavour of tabs in question bank popup
        self.$timeout(()=>{
          self.$modalInstance = modalInstance;
          $('#hiddennewbutton').click();
        });
      });
    }
  /* =========================== Existing template popup section ================= */
  // Button click event to open existing template popup
  openExistingTemplate(e,type){
    var self = this;
    let modalInstance;
    modalInstance = this.$uibModal.open({
      controller:'writtenInterviewQuestionPopupController',
      controllerAs:'$ctrl',
      templateUrl:'questionbank-popup',
      size:'md',
      windowClass:'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false,
      resolve: {
            items: function () {
                return _this.positionId;
            }
        }
    });
      //Opened event
      modalInstance.rendered.then(i => {
        //Control display behavour of tabs in question bank popup
        self.$timeout(()=>{
          self.$modalInstance = modalInstance;
          $('#hiddenExstingTemplateBtn').click();
        });
      });
    }
  /* ============== Previous position popup ================= */
  // Button click event to open a previous position popup
  openPreviousPosition(e,type){
    var self = this;
    let modalInstance;
    modalInstance = this.$uibModal.open({
      controller:'writtenInterviewQuestionPopupController',
      controllerAs:'$ctrl',
      templateUrl:'questionbank-popup',
      size:'md',
      windowClass:'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false,
      resolve: {
            items: function () {
                return _this.positionId;
            }
        }
    });
      //Opened event
      modalInstance.rendered.then(i => {
        //Control display behavour of tabs in question bank popup
        self.$timeout(()=>{
          self.$modalInstance = modalInstance;
          $('#hiddenPrevPosBtn').click();
        });
      });
    }
  /* === SAVE RECOMMENDED QUESTIONS === */
  saveRecQuestions(){
    let questionIDArray = this.defaultQuestions.map((v) => {
      return v.questionId;
    });
    var data = {
      "interviewId":this.interviewid,
      "questionIds":questionIDArray,
      "responseTypeId":[2,3,4]
    };
    //API Call
    this.InterviewService.saveInterviewQuestions(data).then((response) =>{
      console.log('#################### - Interview question saved successfully');
    });
  }

  /* === Delete a question from questions ===*/
  removeQuestion(index){
    this.defaultQuestions.splice(index,1);
    _this.onUpdate({value: true});
  }

  /* === UPDATE QUESTIONS === */
  updateQuestions(){
    let questionIDArray = this.defaultQuestions.map((v) => {
      return v.questionId;
    });
    var data = {
      "interviewId":this.interviewid,
      "questionIds":questionIDArray,
      "responseTypeId":[2,3,4]
    };
    //API Call
    this.InterviewService.updateInterviewQuestions(data).then((response) =>{
      console.log('#################### - Interview question updated successfully');
    });
  }
}


