import indexTpl from './index.jade';
import contentTpl from './includes/content.jade';
import settingsGeneralTpl from './partials/general-settings.jade';
import settingsCustQuesTpl from './partials/custom-question.jade';
import settingsEmailTpl from './partials/email-template-settings.jade';
import settingsNotificationTpl from './partials/notification-settings.jade';
import settingsThemeTpl from './partials/theme-settings.jade';
import settingsIssueTicketTpl from './partials/issue-ticketing.jade';
import settingCalendarTpl from './partials/calendar.jade';
import settingsAdminCompInfoTpl from './partials/admin-company-info.jade';
import settingsAdminDeptTpl from './partials/admin-department.jade';
import settingsAdminUserTpl from './partials/admin-user.jade';
import settingsAdminCustQuesTpl from './partials/admin-custom-question.jade';
import settingsAdminPaymentPlanTpl from './partials/admin-payment-plan.jade';
import settingsAdminConfTpl from './partials/admin-confirmation.jade';
import settingsAdminPaymentTpl from './partials/admin-payment.jade';
import settingsAdminPayTransTpl from './partials/admin-payment-transaction.jade';
import settingsAdminPlanTpl from './partials/admin-plan.jade';
import settingsPortalIntegTpl from './partials/portal-integration-settings.jade';
import paymentSuccessTpl from './partials/admin-payment-success.jade';
import positionAutomationTpl from './partials/position-automation.jade';




export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        abstract: true,
        templateUrl: indexTpl,
         resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../settings/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
    })
    .state('settings.general-settings', {
        url: '/general-settings',
        views: {
            'main-view': {
                controller: 'GeneralSettingsController',
                templateUrl: settingsGeneralTpl,
                controllerAs: 'GeneralSettingsCtrl'
            }
        }
    })
    .state('settings.custom-question', {
        url: '/custom-question',
        views: {
            'main-view': {
                controller: 'CustomQuestionListingController',
                templateUrl: settingsCustQuesTpl,
                controllerAs: 'CustomQuestionListingCtrl'
            }
        },
        params : {
                  activeTab : ''
                }
    })
    .state('settings.email-template-settings', {
        url: '/email-template-settings',
        views: {
            'main-view': {
                controller: 'EmailTemplateSettingsController',
                templateUrl: settingsEmailTpl,
                controllerAs: 'EmailTemplateSettingsCtrl'
            }
        }
    })
    .state('settings.notification-settings', {
        url: '/notification-settings',
        views: {
            'main-view': {
                controller: 'NotificationSettingsController',
                templateUrl: settingsNotificationTpl,
                controllerAs: 'NotificationSettingsCtrl'
            }
        }
    })
    .state('settings.theme-settings', {
        url: '/theme-settings',
        views: {
            'main-view': {
                controller: 'ThemeSettingsController',
                templateUrl: settingsThemeTpl,
                controllerAs: 'ThemeSettingsCtrl'
            }
        }
    })
    .state('settings.issue-ticketing', {
        url: '/issue-ticketing',
        views: {
            'main-view': {
                controller: 'IssueTicketingController',
                templateUrl: settingsIssueTicketTpl,
                controllerAs: 'IssueTicketingCtrl'
            }
        }
    })
    .state('settings.calendar', {
        url: '/calendar',
        views: {
            'main-view': {
                controller: 'CalendarController',
                templateUrl: settingCalendarTpl,
                controllerAs: 'CalendarCtrl'
            }
        }
    })
    .state('settings.admin-company-info', {
        url: '/admin-company-info',
        views: {
            'main-view': {
                controller: 'AdminCompanyInfoController',
                templateUrl: settingsAdminCompInfoTpl,
                controllerAs: 'AdminCompanyInfoCtrl'
            }
        }
    })
    .state('settings.admin-department', {
        url: '/admin-department',
        views: {
            'main-view': {
                controller: 'AdminDepartmentListingController',
                templateUrl: settingsAdminDeptTpl,
                controllerAs: 'AdminDepartmentListingController'
            }
        }
    })
    .state('settings.admin-user', {
        url: '/admin-user',
        views: {
            'main-view': {
                controller: 'AdminUserDetailController',
                templateUrl: settingsAdminUserTpl,
                controllerAs: 'adminUserDetailCtrl'
            }
        }
    })
    .state('settings.admin-custom-question', {
        url: '/admin-custom-question',
        views: {
            'main-view': {
                controller: 'AdminCustomQuestionController',
                templateUrl: settingsAdminCustQuesTpl,
                controllerAs: 'AdminCustomQuestionCtrl'
            }
        }
    })
    .state('settings.admin-payment-plan', {
        url: '/admin-payment-plan',
        views: {
            'main-view': {
                controller: 'AdminPaymentPlanController',
                templateUrl: settingsAdminPaymentPlanTpl,
                controllerAs: 'AdminPaymentPlanCtrl'
            }
        }
    })
    .state('settings.admin-confirmation', {
        url: '/admin-confirmation/:planId',
        views: {
            'main-view': {
                controller: 'AdminConfirmationController',
                templateUrl: settingsAdminConfTpl,
                controllerAs: 'AdminConfirmationCtrl'
            }
        }
    })
    .state('settings.admin-payment', {
        url: '/admin-payment/:planId/:type',
        params: {
            planId : '',
            type : ''
          },
        views: {
            'main-view': {
                controller: 'AdminPaymentController',
                templateUrl: settingsAdminPaymentTpl,
                controllerAs: 'AdminPaymentCtrl'
            }
        }
    })
    .state('settings.admin-portal-payment', {
        url: '/admin-portal-payment/:positionId/:type',
        params: {
            planId : ''
          },
        views: {
            'main-view': {
                controller: 'AdminPaymentController',
                templateUrl: settingsAdminPaymentTpl,
                controllerAs: 'AdminPaymentCtrl'
            }
        }
    })
    .state('settings.admin-payment-transaction', {
        url: '/admin-payment-transaction',
        views: {
            'main-view': {
                controller: 'transactionDetailController',
                templateUrl: settingsAdminPayTransTpl,
                controllerAs: 'transactionDetailCtrl'
            }
        }
    })
    .state('settings.admin-plan', {
        url: '/admin-plan?e',
        views: {
            'main-view': {
                controller: 'AdminPlanController',
                templateUrl: settingsAdminPlanTpl,
                controllerAs: 'AdminPlanCtrl'
            }
        }
    })
    .state('settings.admin-payment-done', {
        url: '/payment/success?client_secret&livemode&source',
        views: {
            'main-view': {
                controller: 'AdminPaymentSuccessController',
                templateUrl: paymentSuccessTpl,
                controllerAs: 'ctrl'
            }
        }
    })
    .state('settings.portal-integration-settings', {
      url: '/portal-integration-settings',
      views: {
        'main-view': {
          controller: 'PortalIntegrationController',
          templateUrl: settingsPortalIntegTpl,
          controllerAs: 'PortalIntegrationCtrl'
        }
      }
    })
    .state('settings.position-automation', {
      url: '/position-automation',
      views: {
        'main-view': {
          controller: 'positionAutomationController',
          templateUrl: positionAutomationTpl,
          controllerAs: 'positionAutomationCtrl'
        }
      }
    });
    
    $stateProvider.state('transaction', {
      url: '/transaction',
      abstract: true,    
      templateUrl: contentTpl,
      resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../settings/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }      
    })
    .state('transaction.success', {
      url: '/success?client_secret&livemode&source',
      views: {
              'main-view': {
                controller: 'AdminPaymentSuccessController',
                templateUrl: paymentSuccessTpl,
                controllerAs: 'ctrl'
              }
            }  
    });
};
