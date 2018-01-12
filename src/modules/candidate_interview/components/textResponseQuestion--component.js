let textResponseQuestion = {
    bindings: {
        question: '=',
        numberOfQuestions: "@",
        disablePreviousButton: "@",
        isNewQuestion:'<'
    },
    templateUrl: 'candidate_interview/partials/text-response-question.jade',
    controller: 'textResponseQuestionController',
    controllerAs: 'textResponseQuestionCtrl',
};


export default textResponseQuestion;

