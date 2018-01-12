import appConfig from 'core/app.js';
import 'angular-mocks';

var appModule = appConfig.modules.appModule,
  interviewQuestionsUrl = '/interview/questions',

  questions = [
    {
      questionId :'1',
      question: 'Tell me about yourself?',
      preparationTime : 50,
      responseTime: 20,
      responseType: 'video'
    },
    {
      questionId :'2',
      question: 'Which of the following class level(nonlocal) variable declarations will not compile?2',
      optionA: 'A. protected int a;2',
      optionB:'B. translent int b=3;2',
      optionC:'C. private synchronized int e;2',
      optionD: 'D. volatile int d;2',
      timeAllowed: 10,
      timeLeft: 10,
      responseType: 'multiple-choice'
    },
    {
      questionId :'3',
      question: 'Which of the following class level(nonlocal) variable declarations will not compile?4',
      timeAllowed : 120,
      timeLeft : 120,
      responseType: 'text'
    },
    {
      questionId :'4',
      question: 'Which of the following class level(nonlocal) variable declarations will not compile?3',
      preparationTime : 5,
      responseTime : 20,
      responseType: 'audio'
    }
    ];



appModule.run(setMockForquestionList);

setMockForquestionList.$inject = ['$httpBackend'];
function setMockForquestionList($httpBackend) {
  $httpBackend.whenGET(/partials/).passThrough();
  $httpBackend.whenGET(/signup/).passThrough();
  $httpBackend.whenGET(/packages/).passThrough();
  $httpBackend.whenGET(interviewQuestionsUrl).respond(questions);
}
