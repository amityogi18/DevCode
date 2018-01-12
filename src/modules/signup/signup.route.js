import indexTpl from './index.jade';
import signupHeaderTpl from './includes/header.jade';
import signupContentTpl from './includes/signup-content.jade';
//import signupHomeTpl from './partials/assessment-home.jade';
import signupCompanyTpl from './partials/company-signup.jade';
import signupEmailConfTpl from './partials/email-confirmation.jade';
import signupCompanyInfoTpl from './partials/company-info.jade';
import signupCandidateTpl from './partials/candidate-signup.jade';
import signupCandConfTpl from './partials/candidate-confirmation.jade';
import signupCandEmailConfTpl from './partials/candidate-email-confirmation.jade';



export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
  $stateProvider.state('signup', {
    views: {
      '': {
        templateUrl: indexTpl,
        controller: 'AssessmentHomeController',
        controllerAs: 'AssessmentHomeCtrl'
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../signup/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  //   .state('signup.assessment-home', {
  //   url: '/assessment-home',
  //   views: {
  //     'main-view': {
  //       controller: 'AssessmentHomeController',
  //       templateUrl: signupHomeTpl,
  //       controllerAs: 'AssessmentHomeCtrl'
  //     }
  //   }
  // })
  .state('signup.company-signup', {
    url: '/company-signup',
    views: {
      'main-view': {
        controller: 'CompanySignupController',
        templateUrl: signupContentTpl,
        controllerAs: 'companySignupCtrl'
      },
     // 'navbar@signup.company-signup': {
       // templateUrl: signupHeaderTpl
     // },
      'content@signup.company-signup': {
        templateUrl: signupCompanyTpl
      }
    }
  })
  .state('signup.email-confirmation', {
    url: '/email-confirmation',
      views: {
          'main-view': {
            controller: 'CompanySignupController',
            templateUrl: signupContentTpl,
            controllerAs: 'companySignupCtrl'
          },
          'navbar@signup.email-confirmation': {
            templateUrl: signupHeaderTpl
          },
          'content@signup.email-confirmation': {
            templateUrl: signupEmailConfTpl
      }
    }
  })
  .state('signup.company-info', {
    url: '/company-info/:token',
    views: {
          'main-view': {
            controller: 'CompanyInfoController',
            templateUrl: signupContentTpl,
            controllerAs: 'companyInfoCtrl'
          },
          'navbar@signup.company-info': {
            templateUrl: signupHeaderTpl
          },
          'content@signup.company-info': {
            templateUrl: signupCompanyInfoTpl,
          }
    }
  })
  .state('signup.candidate-signup', {
      url: '/candidate-signup',      
      views: {
          'main-view': {
            controller: 'CandidateSignupController',
            templateUrl: signupContentTpl,
            controllerAs: 'candidateSignupCtrl'
          },
          //'navbar@signup.candidate-signup': {
         //   templateUrl: signupHeaderTpl
        //  },
          'content@signup.candidate-signup': {
            templateUrl: signupCandidateTpl,
          }
    }
    })
  .state('signup.candidate-confirmation', {
       url: '/candidate-confirmation/:token',
       views: {
           'main-view': {
             controller: 'CandidateConfirmationController',
             templateUrl: signupContentTpl,
             controllerAs: 'candidateConfirmationCtrl'
           },
           'navbar@signup.candidate-confirmation': {
                templateUrl: signupHeaderTpl
           },
           'content@signup.candidate-confirmation': {
                   templateUrl: signupCandConfTpl,
               }
       }
    })
  .state('signup.candidate-email-confirmation', {
           url: '/candidate-email-confirmation',
           views: {
               'main-view': {
                   controller: 'CandidateSignupController',
                   templateUrl: signupContentTpl,
                   controllerAs: 'candidateSignupCtrl'
               },
                'navbar@signup.candidate-email-confirmation': {
                   templateUrl: signupHeaderTpl
               },
               'content@signup.candidate-email-confirmation': {
                   templateUrl: signupCandEmailConfTpl,
               }
           }
        });
}