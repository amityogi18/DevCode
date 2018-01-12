let _this;
export class assessmentResultController {
	/** @ngInject  */
  constructor($window, $storage) {
    _this = this;
    _this.$window = $window;
    _this.$storage = $storage;
    _this.init();
  }

  prepareAssessmentResult(assessmentResult){
      _this.examSummary = { sections: [] };
      let section = { title: "JAVA Technology", answered: 0, notAnswered: 0, marked: 0, notVisited: 0 };
      angular.forEach(assessmentResult, function(question){
          if(question.status === "Answered"){
            section.answered += 1;
          }
          else if(question.status === "Not Answered"){
            section.notAnswered += 1;
          }
          else if(question.status === "Marked"){
            section.marked += 1;
          }
          else {
            section.notVisited += 1;
          }
      });

    section.numberOfQuestions = assessmentResult.length;
    _this.examSummary.sections.push(section);
  }

  readAssessmentResult(){
    let assessmentResult = _this.$storage.getItem('assessment-result');
    if(assessmentResult){
      assessmentResult = JSON.parse(assessmentResult);

      _this.prepareAssessmentResult(assessmentResult);
    }
  }

  init(){
    _this.readAssessmentResult();
  }
}
