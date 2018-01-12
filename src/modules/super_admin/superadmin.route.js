import indexTpl from './index.jade';
import superAdminTpl from './partials/super-admin.jade';
import superAdminClientTpl from './partials/clients.jade';
import superAdminCompanyCandTpl from './partials/company-candidates.jade';
import superAdminNotificationTpl from './partials/notification-super-admin.jade';
import superAdminPaymentPlanTpl from './partials/payment-plan-super-admin.jade';
import superAdminUserRoleTpl from './partials/user-role-super-admin.jade';
import superAdminTicktingTpl from './partials/ticketing-system-super-admin.jade';
import superAdminQuestionBankTpl from './partials/question-bank-super-admin.jade';
import superAdminThirdPartyTpl from './partials/third-party-super-admin.jade';
import superAdminSocialMediaTpl from './partials/social-media-super-admin.jade';
import superAdminStaticsTpl from './partials/technical-statics-super-admin.jade';
import superAdminCandProfileTpl from './partials/candidate-profile-super-admin.jade';
import superAdminPaymentDashboardTpl from './partials/paymentsDashboard.jade';
import superAdminPositionReviewTpl from './partials/position-review-super-admin.jade';
import superAdminPositionDescriptionTpl from './partials/position-review-description-super-admin.jade';
import superAdminCanAppliedJobTpl from './partials/candidate-applied-job.jade';
import superAdminAllJobPortalTpl from './partials/all-job-portals-super-admin.jade';
import superAdminAppliedJobDescTpl from './partials/candidate-applied-job-description.jade';
import superAdminCandidateCredentialsTpl from './partials/candidate-credentials.jade';
import superAdminBlogTpl from './partials/blog-super-admin.jade'



export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
    $stateProvider.state('sa', {
        url: '/sa',
        abstract: true,
        templateUrl: indexTpl,
         resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../super_admin/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
    })
    .state('sa.home', {
        url: '/home',
        views: {
            'main-view': {
                controller: 'SuperadminController',
                templateUrl: superAdminTpl,
                controllerAs: 'superadminCtrl'
            }
        }
    })
    .state('sa.clients', {
        url: '/clients',
        views: {
            'main-view': {
                controller: 'ClientListingController',
                templateUrl: superAdminClientTpl,
                controllerAs: 'clientsCtrl'
            }
        }
    })
    .state('sa.company-candidates', {
        url: '/company-candidates',
        views: {
            'main-view': {
                controller: 'companycandidateController',
                templateUrl: superAdminCompanyCandTpl,
                controllerAs: 'companycandidateCtrl'
            }
        }
    })
    .state('sa.notification', {
      url: '/notification',
      views: {
        'main-view': {
          controller: 'notificationSaController',
          templateUrl: superAdminNotificationTpl,
          controllerAs: 'notificationSaCtrl'
        }
      }

    })
    .state('sa.admin-payment-plan', {
      url: '/admin-payment-plan',
      views: {
        'main-view': {
          controller: 'PaymentPlansSaController',
          templateUrl: superAdminPaymentPlanTpl,
          controllerAs: 'PaymentPlansSaCtrl'
        }
      }

    })
      .state('sa.user-roles', {
          url: '/user-roles',
          views: {
              'main-view': {
                  controller: 'UserRoleListingController',
                  templateUrl: superAdminUserRoleTpl,
                  controllerAs: 'usersCtrl'
              }
          }
      })
      .state('sa.position-review', {
        url: '/position-review/:portalId',
        views: {
          'main-view': {
            controller: 'PositionReviewSaController',
            templateUrl: superAdminPositionReviewTpl,
            controllerAs: 'positionReviewCtrl'
          }
        }
      })
      .state('sa.job-portals', {
        url: '/job-portals',
        views: {
          'main-view': {
            controller: 'allJobPortalSaController',
            templateUrl: superAdminAllJobPortalTpl,
            controllerAs: 'allJobPortalSaCtrl'
          }
        }
      })
      .state('sa.position-review-description', {
        url: '/position-review-description/:jobId/:portalId',
        views: {
          'main-view': {
            controller: 'PositionReviewDescriptionSaController',
            templateUrl: superAdminPositionDescriptionTpl,
            controllerAs: 'jobDescriptionCtrl'
          }
        }
      })
       .state('sa.ticketing-system', {
          url: '/ticketing-system',
          views: {
              'main-view': {
                  controller: 'TicketingSystemSaController',
                  templateUrl: superAdminTicktingTpl,
                  controllerAs: 'ticketingSystemCtrl'
              }
          }
      })
       .state('sa.question-bank', {
          url: '/question-bank',
          views: {
              'main-view': {
                  controller: 'QuestionBankController',
                  templateUrl: superAdminQuestionBankTpl,
                  controllerAs: 'questionBankCtrl'
              }
          }
      })
      .state('sa.third-party-integration', {
          url: '/third-party-integration',
          views: {
              'main-view': {
                  controller: 'ThirdPartyIntegrationController',
                  templateUrl: superAdminThirdPartyTpl,
                  controllerAs: 'thirdPartyIntegrationCtrl'
              }
          }
      })
      .state('sa.social-media-integration', {
        url: '/social-media-integration',
        views: {
          'main-view': {
            controller: 'SocialMediaController',
            templateUrl: superAdminSocialMediaTpl,
            controllerAs: 'socialMediaCtrl'
          }
        }
      })
      .state('sa.statics', {
        url: '/technical-statics',
        views: {
          'main-view': {
            controller: 'TechnicalStaticsController',
            templateUrl: superAdminStaticsTpl,
            controllerAs: 'technicalStaticsCtrl'
          }
        }
      })
      .state('sa.candidate-profiles', {
        url: '/candidate-profiles',
        views: {
            'main-view': {
                controller: 'candidateprofilesaController',
                templateUrl: superAdminCandProfileTpl,
                controllerAs: 'candidateprofilesaCtrl'
            }
        }
    })
    .state('sa.payment', {
        url: '/payments',
        views: {
            'main-view': {
                controller: 'PaymentDashboardController',
                templateUrl: superAdminPaymentDashboardTpl,
                controllerAs: 'paymentDashboardCtrl'
            }
        }
    })

    .state('sa.candidate-applied-job', {
        url: '/candidate-applied-job',
        views: {
            'main-view': {
                controller: 'CandidateAppliedJobController',
                templateUrl: superAdminCanAppliedJobTpl,
                controllerAs: 'candidateAppliedJobCtrl'
            }
        }
    })
    .state('sa.candidate-applied-job-description', {
        url: '/candidate-applied-job-description/:id',
        views: {
            'main-view': {
                controller: 'CandidateAppliedJobDescriptionController',
                templateUrl: superAdminAppliedJobDescTpl,
                controllerAs: 'candidateAppliedJobDescCtrl'
            }
        }
    })
    .state('sa.candidate-credentials', {
        url: '/candidate-account-info',
        views: {
            'main-view': {
                controller: 'CandidateCredentialsListController',
                templateUrl: superAdminCandidateCredentialsTpl,
                controllerAs: 'candidateCredentialsListCtrl'
            }
        }
    })

    .state('sa.blog-super-admin', {
        url: '/blog-super-admin',
        views: {
            'main-view': {
                controller: 'BlogController',
                templateUrl: superAdminBlogTpl,
                controllerAs: 'blogCtrl'
            }
        }
    });
};
