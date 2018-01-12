export class questionsListController {
	/** @ngInject  */
  constructor($uibModal,$timeout,InterviewService,$rootScope) {
    console.log("Inside questionsListController");
    this.$modal = $uibModal;
    this.$timeout = $timeout;
    this.$modalInstance = {};
    this.defaultQuestions = [];
    this.recommonded = true;
    this.InterviewService = InterviewService;
    this.$rootScope = $rootScope;
    this.isEditMode = this.mode;
    this.positionId = this.pid;
    this.interviewId = this.interviewid;
    this.primarySkillId = "";
    this.secondarySkillId = "";
    this.tertiarySkillId = "";

    var self = this;
    this.$rootScope.$on('updateMainWritten',function(e,m){
      self.defaultQuestions.push(...m.dataArray);
      self.defaultQuestions = _.uniqBy(self.defaultQuestions, function (question) {
                return question.questionId;
       });
      self.onUpdate({value: true});  
    });
    
    this.$onInit = function(){
        this.isEditMode = this.mode;
        this.positionId = this.pid;
        this.interviewId = this.interviewid;
        this.primarySkillId = this.primarySkillId;
        this.secondarySkillId = this.secondarySkillId;
        this.tertiarySkillId = this.tertiarySkillId;
         this.getQuestionList();
    }
    
    this.$onChanges = function (changesObj) {
            console.log("updated object question list"+changesObj);
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
                        this.getQuestionList();
                    }                    
                }
            }
            if(changesObj.isReset 
                    && (changesObj.isReset.previousValue === true || changesObj.isReset.previousValue === false)
                    && (changesObj.isReset.currentValue !== changesObj.isReset.previousValue)){
                this.defaultQuestions = [];
                if(this.interviewid === ""){
                    if(this.primarySkillId !== ""){
                        this.getQuestionList();
                    }                    
                }
            }else if(changesObj.isFetch 
                    && (changesObj.isFetch.previousValue === true || changesObj.isFetch.previousValue === false)
                    && (changesObj.isFetch.currentValue !== changesObj.isFetch.previousValue)){
                this.getQuestionList();                                
            } 
            else if(changesObj.currentState 
                    && (changesObj.currentState.previousValue === true || changesObj.currentState.previousValue === false)
                    && (changesObj.currentState.currentValue !== changesObj.currentState.previousValue)){
                
               if(this.isEditMode){
                   // this.updateQuestions();
                   if(this.defaultQuestions.length > 0){
                        this.saveRecQuestions();
                     }
                }else
                {
                    if(this.defaultQuestions.length > 0){
                        this.saveRecQuestions();
                    }
                }
            }
            
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
  
  getQuestionList(){
    var self = this;
    if(this.primarySkillId !== "" || this.interviewid !== ""){
        this.InterviewService.getInterviewQuestions({
          "interviewId": self.interviewid,
          "positionId": self.pid,
          "primarySkillId": self.primarySkillId,
          "secondarySkillId" : self.secondarySkillId,
          "tertiarySkillId": self.tertiarySkillId,
          "questionTypeId" : [2,1,3,4,5]
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
      controller:'writtenInterviewQuestionPopupController',
      controllerAs:'$ctrl',
      templateUrl:'questionbank-popup',
      size:'md',
      windowClass:'written-popup default-tab-module question-bankpop',
      backdrop: 'static',
      keyboard: false,
      resolve: {
            items: function () {
                return self.positionId;
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
      modalInstance = this.$modal.open({
        controller:'writtenInterviewQuestionPopupController',
        controllerAs:'$ctrl',
        templateUrl:'questionbank-popup',
        size:'md',
        windowClass:'written-popup default-tab-module question-bankpop',
        backdrop: 'static',
        keyboard: false,
        resolve: {
              items: function () {
                  return self.positionId;
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
 