let multipleSelectQuestion = {
  bindings: {
    question: '=',
    numberOfQuestions: "@",
    disablePreviousButton: "@"
  },
  templateUrl: 'candidate_interview/partials/multiple-select-question.jade',
  controller: 'multipleSelectQuestionController',
  controllerAs: 'multipleSelectQuestionCtrl',
};


export default multipleSelectQuestion;

