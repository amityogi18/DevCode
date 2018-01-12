let audioResponseQuestion = {
  bindings: {
    question: '<',
    numberOfQuestions: "@",
    triggerStopRecording: '@',
    isNewQuestion:'<',
    onUpdate:'&'
  },
  templateUrl: 'candidate_interview/partials/audio-response-question.jade',
  controller: 'audioResponseQuestionController',
  controllerAs: 'audioResponseQuestionCtrl',
};


export default audioResponseQuestion;

