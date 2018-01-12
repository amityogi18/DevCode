import indexTpl from './index.jade';
import candInterviewTpl from './partials/candidate-interview.jade';
import candCertificateTpl from './partials/candidate-certificate.jade';
import candLoginTpl from './partials/candidate-login.jade';
import candRegistrationTpl from './partials/candidate-registration.jade';
import candProfileTpl from './partials/candidate-profile.jade';
import candPrepareTpl from './partials/candidate-prepare.jade';
import candInterviewInstructionTpl from './partials/candidate-interview-instruction.jade';
import candCertificateInstructionTpl from './partials/candidate-certificate-instruction.jade';
import candCertificateQuestionTpl from './partials/candidate-certification-question.jade';
import candWelcomeVideoTpl from './partials/candidate-welcome-video.jade';
import candInterviewQuestionTpl from './partials/candidate-interview-question.jade';
import candInterviewExitTpl from './partials/candidate-interview-exit.jade';
import candMultipleQuestionTpl from './partials/candidate-multiple-question.jade';
import candTextQuestionTpl from './partials/candidate-text-question.jade';
import candTestInstructionTpl from './partials/test-instruction.jade';
import candPracticeTestQuestionTpl from './partials/practice-test-question.jade';



export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {

//some data change
  $stateProvider.state('ci', {
      url:'/ci',
      abstract:true,
      templateUrl: indexTpl,
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidate_interview/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('ci.interview', {
    url: '/interview/:interviewCode',
    views: {
      'main-view': {
        controller: 'candidateInterviewController',
        templateUrl: candInterviewTpl,
        controllerAs: 'candidateInterviewCtrl'
      }
    }
  })
  .state('ci.certificate', {
      url: '/certificate/:skillId',
      views: {
        'main-view': {
          controller: 'candidateCertificateController',
          templateUrl: candCertificateTpl,
          controllerAs: 'candidateCertificateCtrl'
        }
      }
  })
    .state('ci.login', {
      url: '/login',
      views: {
        'main-view': {
          controller: 'candidateInterviewController',
          templateUrl: candLoginTpl,
          controllerAs: 'candidateInterviewCtrl'
        }
      }
    })
    .state('ci.registration', {
      url: '/registration',
      views: {
        'main-view': {
          controller: 'candidateInterviewController',
          templateUrl: candRegistrationTpl,
          controllerAs: 'candidateInterviewCtrl'
        }

      }
    })
    .state('ci.profile', {
      url: '/profile',
      views: {
        'main-view': {
          controller: 'candidateInterviewProfileController',
          templateUrl: candProfileTpl,
          controllerAs: 'candidateInterviewProfileCtrl'
        }
      }
    })
    .state('ci.prepare', {
      url: '/prepare',
      views: {
        'main-view': {
          controller: 'CandidateInterviewPrepareController',
          templateUrl: candPrepareTpl,
          controllerAs: 'candidateInterviewPrepareCtrl'
        }
      }
    })
    .state('ci.instruction', {
      url: '/instruction',
      views: {
        'main-view': {
          controller: 'candidateInterviewInstructionController',
          templateUrl: candInterviewInstructionTpl,
          controllerAs: 'candidateInterviewInstructionCtrl'
        }

      }
    }) 
    .state('ci.certification-instruction', {
          url: '/certification-instruction',
          views: {
            'main-view': {
              controller: 'candidateCertificateInstructionController',
              templateUrl: candCertificateInstructionTpl,
              controllerAs: 'candidateCertificateInstructionCtrl'
            }

          }
    })
     .state('ci.certification-question', {
          url: '/certification-question',
          views: {
            'main-view': {
              controller: 'candidateCertificateQuestionController',
              templateUrl: candCertificateQuestionTpl,
              controllerAs: 'candidateCertificateQuestionCtrl'
            }
          }
     })
    .state('ci.video', {
      url: '/video',
      views: {
        'main-view': {
          controller: 'CandidateWelcomeVideoController',
          templateUrl: candWelcomeVideoTpl,
          controllerAs: 'CandidateWelcomeVideoCtrl'
        }
      }
    })
    .state('ci.question', {
      url: '/question',
      views: {
        'main-view': {
          controller: 'candidateInterviewQuestionController',
          templateUrl: candInterviewQuestionTpl,
          controllerAs: 'candidateInterviewQuestionCtrl'
        }
      }
    })
    .state('ci.exit', {
      url: '/exit',
      views: {
        'main-view': {
          controller: 'ExitVideoController',
          templateUrl: candInterviewExitTpl,
          controllerAs: 'exitVideoCtrl'
        }
      }
    })
    .state('ci.multiple-question', {
      url: '/multiple-question',
      views: {
        'main-view': {
          controller: 'candidateQuestionController',
          templateUrl: candMultipleQuestionTpl,
          controllerAs: 'candidateQuestionCtrl'
        }
      }
    })
    .state('ci.text-question', {
      url: '/text-question',
      views: {
        'main-view': {
          controller: 'candidateQuestionController',
          templateUrl: candTextQuestionTpl,
          controllerAs: 'candidateQuestionCtrl'
        }
      }
    })
    .state('ci.test-instruction', {
      url: '/test-instruction',
          views: {
            'main-view': {
              controller: 'TestQuestionInstructionController',
              templateUrl: candTestInstructionTpl,
              controllerAs: 'testQuestionInstructionCtrl'
            }
          }
    })
    .state('ci.practice-test-question', {
          url: '/practice-test-question/:skillsetId',
          views: {
            'main-view': {
              controller: 'PracticeTestQuestionController',
              templateUrl: candPracticeTestQuestionTpl,
              controllerAs: 'PracticeTestQuestionCtrl'
            }
          }
    });
}
