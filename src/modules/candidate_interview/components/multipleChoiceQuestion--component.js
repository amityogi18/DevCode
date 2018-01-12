let multipleChoiceQuestion = {
  bindings: {
    question: '=',
    numberOfQuestions: "@",
    disablePreviousButton: "@"
  },
  templateUrl: 'candidate_interview/partials/multiple-choice-question.jade',
  controller: 'multipleChoiceQuestionController',
  controllerAs: 'multipleChoiceQuestionCtrl',
};


export default multipleChoiceQuestion;

