import indexTpl from './index.jade';
import confHomeTpl from './partials/conference-home.jade';
import confContactTpl from './partials/conference-contact.jade';
import confMeetingTpl from './partials/conference-meeting.jade';
import confwebrtcTpl from './partials/conference-webrtc.jade';
import confHostLoginTpl from './partials/conference-host-login.jade'; 

import confPartcipantLoginTpl from './partials/conference-participant-login.jade'; 
import confPrepareTpl from './partials/conference-prepare.jade'; 
import confContentTpl from './includes/conference-content.jade';
import confTestTpl from './partials/conference-test.jade';

import confCandidateWebrtcTpl from './partials/conference-candidateWebrtc.jade';
import confErrorTpl from './partials/conference-error.jade';
import confEndTpl from './partials/conference-end.jade';
import confExpiredTpl from './partials/conference-expired.jade';
import interviewPrepareTpl from './partials/interview-prepare.jade';

import dashboardAllNotificationTpl from '../dashboard/partials/all-notification.jade';
import settingsGeneralSettingsTpl from '../settings/partials/general-settings.jade';
import settingsNotificationSettingsTpl from '../settings/partials/notification-settings.jade';
import settingsThemeSettingsTpl from '../settings/partials/theme-settings.jade';


import settingsAdminPlanTpl from '../settings/partials/admin-plan.jade';
import settingsAdminPayTransTpl from '../settings/partials/admin-payment-transaction.jade';
import settingsAdminPaymentTpl from '../settings/partials/admin-payment.jade';
import settingsAdminConfTpl from '../settings/partials/admin-confirmation.jade';
import settingsAdminPaymentPlanTpl from '../settings/partials/admin-payment-plan.jade';
import settingsAdminCustQuesTpl from '../settings/partials/admin-custom-question.jade';
import settingsAdminUserTpl from '../settings/partials/admin-user.jade';
import settingsAdminDeptTpl from '../settings/partials/admin-department.jade';
import settingsAdminCompInfoTpl from '../settings/partials/admin-company-info.jade';
import settingsEmailTpl from '../settings/partials/email-template-settings.jade';
import settingsCustQuesTpl from '../settings/partials/custom-question.jade';
import settingsIssueTicketTpl from '../settings/partials/issue-ticketing.jade';




export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
  $stateProvider.state('conference', {
      //url:'',
      abstract:true,
    views: {
      '': {
        templateUrl: indexTpl

      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('./index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('conference.conference-home', {
    url: '/conference-home',
    params: {
        showHeader : true,
        introConferenceParam :''
      },
    views: {
      'main-view': {
        controller: 'ConferenceController',
        templateUrl: confHomeTpl,
        controllerAs: 'ConferenceCtrl'
      }
    }
  })
  .state('conference.conference-contact', {
    url: '/conference-contact',
    params: {
        showHeader : true           
    },
    views: {
      'main-view': {
        controller: 'ConferenceContactController',
        templateUrl: confContactTpl,
        controllerAs: 'conferenceContactCtrl'
      }
    }
  })
  .state('conference.conference-meeting', {
      url: '/conference-meeting',
      params: {
        showHeader : true           
      },
      views: {
        'main-view': {
          controller: 'conferenceMeetingController',
          templateUrl: confMeetingTpl,
          controllerAs: 'conferenceMeetingCtrl'
        }
//        'navbar@conference.conference-meeting': {
//          templateUrl: 'packages/conference/includes/header.html'
//        },
//        'content@conference.conference-meeting': {
//          templateUrl: 'packages/conference/partials/conference-meeting.html'
//        }
      }
    })
  .state('conference.conference-webrtc', {
        url: '/conference-webrtc/:parType',
        params: {
                showHeader : false           
            },
        views: {
          'main-view': {
            controller: 'ConferenceWebrtcController',
            templateUrl: confwebrtcTpl,
            controllerAs: 'ConferenceWebrtcCtrl'
          }
//          'content@conference.conference-webrtc': {
//            templateUrl: 'packages/conference/partials/conference-webrtc.html'
//          }
        }
      })
  .state('conference.host-login', {
        url: '/ht/:ConfId',
        params: {
                showHeader : false           
            },
        views: {
          'main-view': {
            controller: 'ConferenceLoginController',
            templateUrl: confHostLoginTpl,
            controllerAs: 'conferenceLoginCtrl'
          }
//          'content@conference.host-login': {
//            templateUrl: 'packages/conference/partials/conference-host-login.html'
//          }
        }
      })
  .state('conference.participant-login', {
       url: '/cn/:ConfId',
               params: {
                showHeader : false           
            },
       views: {
         'main-view': {
           controller: 'ConferenceLoginController',
           templateUrl: confPartcipantLoginTpl,
           controllerAs: 'conferenceLoginCtrl'
         }
//         'content@conference.participant-login': {
//           templateUrl: 'packages/conference/partials/conference-participant-login.html'
//         }
      }
     })
  .state('conference.prepare', {
        params: {
            participantName: '',
            confId : '',
            participantType : '',
            showHeader : false, 
            hideFooter : true
          },
       views: {
         'main-view': {
           controller: 'ConferencePrepareController',
           templateUrl: confPrepareTpl,
           controllerAs: 'ConferencePrepareCtrl'
         },
        'content@conference.prepare': {
          templateUrl: confPrepareTpl
        }
       }
     })
     .state('conference.free-conference', {
       params: {
            meetingRole : '',
            participantName : '',
            displayName : '',
            showHeader : false 
          },
       url: '/meet/:confId',
       views: {
         'main-view': {
           controller: 'ConferenceDemoController',
           templateUrl: confContentTpl,
           controllerAs: 'ConferenceDemoCtrl'
         },
         'content@conference.free-conference': {
           templateUrl: confTestTpl
         }
       }
     })
     .state('conference.free-conference-hostcheck', {
       url: '/meet/:confId/:participantName',
       params: {
                showHeader : false           
            },
       views: {
         'main-view': {
           controller: 'ConferenceDemoController',
           templateUrl: confContentTpl,
           controllerAs: 'ConferenceDemoCtrl'
         },
         'content@conference.free-conference-hostcheck': {
           templateUrl: confTestTpl
         }
       }
     })
  .state('conference.participant-webrtc', {
        params: {
            meetingTypeM: 'conference',
            meetingRole : 'participant',
            participantName : '',
            confId : '',
            showHeader : false 
          },
        views: {
          'main-view': {
            controller: 'ConferenceWebrtcController',
            templateUrl: confContentTpl,
            controllerAs: 'ConferenceWebrtcCtrl'
          },
          'content@conference.participant-webrtc': {
            templateUrl: confCandidateWebrtcTpl
          }
        }
      })
  .state('conference.host-webrtc', {
       //url:'/conference-home/',
        params: {
            meetingTypeM: 'conference',
            meetingRole : 'host',
            participantName : '',
            confId : '',
            showHeader : false 
          },
        views: {
          'main-view': {
            controller: 'ConferenceWebrtcController',
            templateUrl: confContentTpl,
            controllerAs: 'ConferenceWebrtcCtrl'
          },
          'content@conference.host-webrtc': {
            templateUrl: confwebrtcTpl
          }
        }
      })
      .state('conference.free-conference-host', {
        params: {
            meetingTypeM: 'unlisted',
            meetingRole : 'host',
            participantName : '',
            confId : '',
            showHeader : false 
          },
        views: {
          'main-view': {
            controller: 'ConferenceWebrtcController',
            templateUrl: confContentTpl,
            controllerAs: 'ConferenceWebrtcCtrl'
          },
          'content@conference.free-conference-host': {
            templateUrl: confwebrtcTpl
          }
        }
      })
      .state('conference.free-conference-participant', {
        params: {
            meetingTypeM: 'unlisted',
            meetingRole : 'participant',
            participantName : '',
            confId : '',
            showHeader : false 
          },
        views: {
          'main-view': {
            controller: 'ConferenceWebrtcController',
            templateUrl: confContentTpl,
            controllerAs: 'ConferenceWebrtcCtrl'
          },
          'content@conference.free-conference-participant': {
            templateUrl: confCandidateWebrtcTpl
          }
        }
      })
  .state('conference.meeting-error', {
      params: {
            showHeader : false 
          },
        views: {
          'main-view': {
            templateUrl: confContentTpl
          },
          'content@conference.meeting-error': {
            templateUrl: confErrorTpl
          }
        }
      })
  .state('conference.meeting-end', {
      params: {
            showHeader : false 
          },
        views: {
          'main-view': {
            templateUrl: confContentTpl
          },
          'content@conference.meeting-end': {
            templateUrl: confEndTpl
          }
        }
      })
  .state('conference.meeting-expired', {
      params: {
            showHeader : false 
          },
        views: {
          'main-view': {
            templateUrl: confContentTpl
          },
          'content@conference.meeting-expired': {
            templateUrl: confExpiredTpl
          }
        }
      })
  .state('conference.candidate-webrtc', {
          url: '/candidate-webrtc',
          params: {
            meetingTypeM: 'interview',
            meetingRole : '',
            participantName : 'candidate',
            confId : '',
            showHeader : false 
          },
          views: {
            'main-view': {
              controller: 'ConferenceWebrtcController',
              templateUrl: confContentTpl,
              controllerAs: 'ConferenceWebrtcCtrl'
            },
            'content@conference.candidate-webrtc': {
              templateUrl: confCandidateWebrtcTpl
            }
          }
        })
  .state('conference.notifications', {
      url: '/conference/notifications',
      params: {
            showHeader : true 
          },
      views: {
        'main-view': {
          controller: 'allNotificationController',
          templateUrl: dashboardAllNotificationTpl,
          controllerAs: 'allNotificationCtrl'
        }
    }      
  })
  .state('conference.host-interview', {
            url: '/host-interview/:interviewCode',
            params: {
                    showHeader : false 
                  },
            views: {
              'main-view': {
                controller: 'InterviewPrepareController',
                templateUrl: confContentTpl,
                controllerAs: 'interviewPrepareCtrl'
              },
              'content@conference.host-interview': {
                templateUrl: interviewPrepareTpl
              }
            }
          })
  .state('conference.candidate-interview', {
           url: '/candidate-interview/:interviewCode',
           params: {
            showHeader : false 
          },
           views: {
             'main-view': {
               controller: 'InterviewPrepareController',
               templateUrl: confContentTpl,
               controllerAs: 'interviewPrepareCtrl'
             },
             'content@conference.candidate-interview': {
               templateUrl: interviewPrepareTpl
             }
           }
         })
   .state('conference.general-settings', {
        url: '/general-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'GeneralSettingsController',
                templateUrl: settingsGeneralSettingsTpl,
                controllerAs: 'GeneralSettingsCtrl'
            }
        } 
    })
    .state('conference.notification-settings', {
        url: '/notification-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'NotificationSettingsController',
                templateUrl: settingsNotificationSettingsTpl,
                controllerAs: 'NotificationSettingsCtrl'
            }
        } 
    })
    .state('conference.theme-settings', {
        url: '/theme-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'ThemeSettingsController',
                templateUrl: settingsThemeSettingsTpl,
                controllerAs: 'ThemeSettingsCtrl'
            }
        } 
    })
    .state('conference.issue-ticketing', {
        url: '/issue-ticketing-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'IssueTicketingController',
                templateUrl: settingsIssueTicketTpl,
                controllerAs: 'IssueTicketingCtrl'
            }
        } 
    })
    .state('conference.custom-question', {
        url: '/custom-question-settings',
        views: {
            'main-view': {
                controller: 'CustomQuestionListingController',
                templateUrl: settingsCustQuesTpl,
                controllerAs: 'CustomQuestionListingCtrl'
            }
        },
        params : {
                  activeTab : '',
                  showHeader : true
                }
    })
    .state('conference.email-template-settings', {
        url: '/email-template-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'EmailTemplateSettingsController',
                templateUrl: settingsEmailTpl,
                controllerAs: 'EmailTemplateSettingsCtrl'
            }
        }
    })
    .state('conference.admin-company-info', {
        url: '/admin-company-info-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminCompanyInfoController',
                templateUrl: settingsAdminCompInfoTpl,
                controllerAs: 'AdminCompanyInfoCtrl'
            }
        }
    })
    .state('conference.admin-department', {
        url: '/admin-department-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminDepartmentListingController',
                templateUrl: settingsAdminDeptTpl,
                controllerAs: 'AdminDepartmentListingController'
            }
        }
    })
    .state('conference.admin-user', {
        url: '/admin-user-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminUserDetailController',
                templateUrl: settingsAdminUserTpl,
                controllerAs: 'adminUserDetailCtrl'
            }
        }
    })
    .state('conference.admin-custom-question', {
        url: '/admin-custom-question-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminCustomQuestionController',
                templateUrl: settingsAdminCustQuesTpl,
                controllerAs: 'AdminCustomQuestionCtrl'
            }
        }
    })
    .state('conference.admin-payment-plan', {
        url: '/admin-payment-plan-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminPaymentPlanController',
                templateUrl: settingsAdminPaymentPlanTpl,
                controllerAs: 'AdminPaymentPlanCtrl'
            }
        }
    })
    .state('conference.admin-confirmation', {
        url: '/admin-confirmation-settings/:planId',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminConfirmationController',
                templateUrl: settingsAdminConfTpl,
                controllerAs: 'AdminConfirmationCtrl'
            }
        }
    })
    .state('conference.admin-payment', {
        url: '/admin-payment-settings',
        params: {
            planId : '',
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminPaymentController',
                templateUrl: settingsAdminPaymentTpl,
                controllerAs: 'AdminPaymentCtrl'
            }
        }
    })
    .state('conference.admin-payment-transaction', {
        url: '/admin-payment-transaction-settings',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'transactionDetailController',
                templateUrl: settingsAdminPayTransTpl,
                controllerAs: 'transactionDetailCtrl'
            }
        }
    })
    .state('conference.admin-plan', {
        url: '/admin-plan-settings?e',
        params: {
            showHeader : true 
          },
        views: {
            'main-view': {
                controller: 'AdminPlanController',
                templateUrl: settingsAdminPlanTpl,
                controllerAs: 'AdminPlanCtrl'
            }
        }
    });


}
