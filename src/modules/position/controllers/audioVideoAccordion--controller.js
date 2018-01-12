let _this;
export class audioVideoAccordionController {
	/** @ngInject  */
  constructor($uibModal,$timeout,InterviewService,$rootScope) {
    _this = this;
    console.log("Inside audioVideoAccordionController");
    this.$modal = $uibModal;
    this.$timeout = $timeout;
    this.$modalInstance = {};
    this.InterviewService = InterviewService;
    this.isEditMode = this.mode;
    this.getPositionId = this.pid;
    this.interviewId = this.interviewid;
    this.primarySkillId = "";
    this.secondarySkillId = "";
    this.tertiarySkillId = "";
    this.defaultQuestions = [];
    this.recommonded = true;
    this.$rootScope = $rootScope;
    _this.path = _this.$rootScope.audioVideoImagePath;
    console.log("ahskdjahksjd",_this.$rootScope.audioVideoImagePath);
    console.log("ahskdjahksjd",_this.$rootScope);

    this.$rootScope.$on('updateMain',function(e,m){
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
        this.getAudioVideoLinkQuestions();
    }
    _this.$onChanges = function (changesObj) {
            console.log("updated object"+changesObj);
            this.isEditMode = this.mode;
            this.getPositionId = this.pid;
            this.interviewId = this.interviewid;
            this.primarySkillId = this.primarySkillId;
            this.secondarySkillId = this.secondarySkillId;
            this.tertiarySkillId = this.tertiarySkillId;
            if(changesObj.recommendations  
                    && (changesObj.recommendations.currentValue !== changesObj.recommendations.previousValue)){
                if(this.interviewid === ""){
                    if(this.primarySkillId !== ""){
                        this.getAudioVideoLinkQuestions();
                    }                    
                }
            }
            if(changesObj.isReset 
                    && (changesObj.isReset.previousValue === true || changesObj.isReset.previousValue === false)
                    && (changesObj.isReset.currentValue !== changesObj.isReset.previousValue)){
                this.defaultQuestions = [];
                if(this.interviewid === ""){
                    if(this.primarySkillId !== ""){
                        this.getAudioVideoLinkQuestions();
                    }                    
                }
            }else if(changesObj.isFetch
                    && (changesObj.isFetch.previousValue === true || changesObj.isFetch.previousValue === false)
                    && (changesObj.isFetch.currentValue !== changesObj.isFetch.previousValue)){
                _this.getAudioVideoLinkQuestions();                                
            } 
            else if(changesObj.currentState  
                    && (changesObj.currentState.previousValue === true || changesObj.currentState.previousValue === false)
                    && (changesObj.currentState.currentValue !== changesObj.currentState.previousValue)){
                if(_this.isEditMode || (_this.interviewid !== '' && _this.interviewid !== null)){
                    if(this.defaultQuestions.length > 0){
                        _this.saveRecQuestions();
                     }
                    //_this.updateQuestions();
                }else
                {   if(this.defaultQuestions.length > 0){
                        _this.saveRecQuestions();
                  }
                }
              }
            }
          }

  getAudioVideoLinkQuestions(){
    var self = this;
    if(this.primarySkillId !== "" || this.interviewid !== "" ){
        this.InterviewService.getInterviewQuestions({
          "interviewId": self.interviewid,
          "positionId": self.pid,
          "primarySkillId": self.primarySkillId,
          "secondarySkillId" : self.secondarySkillId,
          "tertiarySkillId": self.tertiarySkillId,
          "questionTypeId" : [5,1]
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
    modalInstance = this.$modal.open({
      controller:'audioVideoQuestionPopupController',
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
      this.$modalInstance = this.$modal.open({
        controller:'audioVideoQuestionPopupController',
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
      this.$modalInstance.rendered.then(i => {
        //Control display behavour of tabs in question bank popup
        self.$timeout(()=>{
          $('#hiddennewbutton').click();
        });
      });
    } 
    
  openExistingTemplate(e,type){
    var self = this;
    let modalInstance;
    modalInstance = this.$modal.open({
      controller:'audioVideoQuestionPopupController',
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
    
  openPreviousPosition(e,type){
    var self = this;
    let modalInstance;
    modalInstance = this.$modal.open({
      controller:'audioVideoQuestionPopupController',
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
  /* ===== Close Modal ===== */
  closeModal(){
    if(this.$modalInstance){
      this.$modalInstance.dismiss('cancel');
    }
  }

  /* === SAVE RECOMMENDED QUESTIONS === */
  saveRecQuestions(){
    let questionIDArray = this.defaultQuestions.map((v) => {
      return v.questionId;
    });
    var data = {
      "interviewId":this.interviewid,
      "questionIds":questionIDArray,
      "responseTypeId":[5,1]
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
      "responseTypeId":[5,1]
    };
    //API Call
    this.InterviewService.updateInterviewQuestions(data).then((response) =>{
      console.log('#################### - Interview question updated successfully');
    });
  }
}
