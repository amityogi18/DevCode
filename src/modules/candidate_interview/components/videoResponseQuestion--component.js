let videoResponseQuestion = {
  bindings: {
    question: '<',    
    numberOfQuestions: "@",
    triggerStopRecording: '@',
    isNewQuestion:'<',
    onUpdate:'&'
  },
  templateUrl: 'candidate_interview/partials/video-response-question.jade',
  controller: 'videoResponseQuestionController',
  controllerAs: 'videoResponseQuestionCtrl',
};


export default videoResponseQuestion;

