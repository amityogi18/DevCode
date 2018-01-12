import indexTpl from './index.jade';
import candProfileHomeTpl from './partials/candidate-profile-home.jade';
import candViewProfileTpl from './partials/view-profile.jade';
import candMyProfileTpl from './partials/my-profile.jade';
import candCertExitTpl from './partials/candidate-certificate-exit.jade';
import candManageProfileTpl from './partials/manage-profile.jade';
import candCertificationTpl from './partials/certification.jade';
import candAssessmentTpl from './partials/assessment.jade';
import candAssessmentResultTpl from './partials/assessment-result.jade';
import candTestInstructionTpl from './partials/test-instruction.jade';
import candCertWelcomeTpl from './partials/certification-welcome.jade';
import candCertInstructionTpl from './partials/certification-instruction.jade';
import candPractiveVideoTpl from './partials/practice-video.jade';
import candInterviewRequestTpl from './partials/interview-request.jade';
import candMultiApplyTpl from './partials/multi-apply.jade';
import candCoverLetterTpl from './partials/cover-letter.jade';
import appliedJobListTpl from './partials/applied-job-list.jade';
import jobOpeningsTpl from './partials/job-openings.jade';
import jobApplyTpl from './partials/job-apply.jade';
import jobDescriptionTpl from './partials/job-description.jade';
import favouriteJobDescriptionTpl from './partials/favourite-job-description.jade';
import candidatePublicLoginTpl from './partials/candidate-public-login.jade';

//import candGoldCertTpl from '../partials/gold-certificate-template.jade';
import candPracticeVideoInstructionTpl from './partials/practice-video-instruction.jade';
import candAllNotificationTpl from '../dashboard/partials/all-notification.jade';
import candGeneralSettingsTpl from '../settings/partials/general-settings.jade';
import candNotificationSettingsTpl from '../settings/partials/notification-settings.jade';
import candThemeSettingsTpl from '../settings/partials/theme-settings.jade';
import candIssueTicketingTpl from '../settings/partials/issue-ticketing.jade';
import settingsCandPaymentTpl from '../settings/partials/admin-payment.jade';
import candPublicProfileTpl from './includes/public-profile.jade';
import candProfilePublicTpl from './partials/candidate-profile-public.jade';
import appliedJobDescriptionTpl from './partials/applied-job-description.jade';
import candMailBoxTpl from './partials/mail-box.jade';

export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
  $stateProvider.state('candidateProfile', {
      url: '/candidateProfile',
      abstract: true,    
      templateUrl: indexTpl,
      resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidateProfile/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }   
  })
  .state('candidateProfile.home', {
    url: '/home',
    views: {
      'main-view': {
        controller: 'CandidateHomeController',
        templateUrl: candProfileHomeTpl,
        controllerAs: 'candidateHomeCtrl'
      }
    }
  })
  .state('candidateProfile.view-profile', {
    url: '/view-profile',
     views: {
       'main-view': {
         controller: 'CandidateProfileController',
         templateUrl: candViewProfileTpl,
         controllerAs: 'CandidateProfileCtrl'
       }
    }
  })
  .state('candidateProfile.show-profile', {
    url: '/show-profile/:profileId',
     views: {
       'main-view': {
         controller: 'CandidateProfileController',
         templateUrl: candViewProfileTpl,
         controllerAs: 'CandidateProfileCtrl'
      }
    }
  })
  .state('candidateProfile.update-profile', {
    url: '/update-profile/:profileId',
    views: {
      'main-view': {
        controller: 'CandidateProfileController',
        templateUrl: candMyProfileTpl,
        controllerAs: 'CandidateProfileCtrl'
      }
    }
  })
  .state('candidateProfile.certificate-exit', {
    url: '/certificate-exit/:certificateId',
    views: {
      'main-view': {
        controller: 'CertificateExitController',
        templateUrl: candCertExitTpl,
        controllerAs: 'CertificateExitCtrl'
      }
    }
  })
  .state('candidateProfile.create-profile', {
      url: '/create-profile',
      views: {
        'main-view': {
          controller: 'CandidateProfileController',
          templateUrl: candMyProfileTpl,
          controllerAs: 'CandidateProfileCtrl'
        }
      }
  })
  .state('candidateProfile.manage-profile', {
    url: '/manage-profile',
    views: {
      'main-view': {
        controller: 'manageProfileController',
        templateUrl: candManageProfileTpl,
        controllerAs: 'manageProfileCtrl'
      }
    }
  })
  .state('candidateProfile.certification', {
    url: '/certification',
    views: {
      'main-view': {
        controller: 'certificateTemplateController',
        templateUrl: candCertificationTpl,
        controllerAs: 'certificateTemplateCtrl'
      }
    }
  })
  .state('candidateProfile.certification-welcome', {
    url: '/certification-welcome',
    views: {
      'main-view': {
        controller: 'CandidateProfileController',
        templateUrl: candCertWelcomeTpl,
        controllerAs: 'CandidateProfileController'
      }
    }
  })
  .state('candidateProfile.applied-job-list', {
    url: '/applied-job-list',
    views: {
      'main-view': {
        controller: 'appliedJobListController',
        templateUrl: appliedJobListTpl,
        controllerAs: 'appliedJobListCtrl'
      }
    }
  })
  .state('candidateProfile.job-openings', {
        url: '/job-openings?e',
        params: {
            jobId : ''
          },
        views: {
            'main-view': {
                controller: 'jobOpeningsController',
                templateUrl: jobOpeningsTpl,
                controllerAs: 'jobOpeningsCtrl'
            }
        },
        resolve: {
            CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                return $q((resolve)=> {
                    require.ensure([], ()=> {
                        let module = require('../candidateProfile/index.js');
                        module = module.default;
                        $ocLazyLoad.load({name: module.name});
                        resolve(module.controller);
                    });
                });
            }]
        }
    })
    .state('candidateProfile.job-openings-data', {
        url: '/job-openings/:jobId?e',
        params: {
            jobId : ''
          },
        views: {
            'main-view': {
                controller: 'jobOpeningsController',
                templateUrl: jobOpeningsTpl,
                controllerAs: 'jobOpeningsCtrl'
            }
        },
        resolve: {
            CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                return $q((resolve)=> {
                    require.ensure([], ()=> {
                        let module = require('../candidateProfile/index.js');
                        module = module.default;
                        $ocLazyLoad.load({name: module.name});
                        resolve(module.controller);
                    });
                });
            }]
        }
    })
  .state('candidateProfile.candidate-public-login', {
        url: '/candidate-public-login',
        views: {
            'main-view': {
                controller: 'jobOpeningsController',
                templateUrl: candidatePublicLoginTpl,
                controllerAs: 'jobOpeningsCtrl'
            }
        }
      })
  .state('candidateProfile.job-description', {
        url: '/job-description/:jobId',
        views: {
            'main-view': {
                controller: 'jobDescriptionController',
                templateUrl: jobDescriptionTpl,
                controllerAs: 'jobDescriptionCtrl'
            }
        }
  })
      .state('candidateProfile.favourite-job-description', {
          url: '/favourite-job-description/:jobId',
          views: {
              'main-view': {
                  controller: 'favouriteJobDescriptionController',
                  templateUrl: favouriteJobDescriptionTpl,
                  controllerAs: 'favouriteJobDescriptionCtrl'
              }
          }
      })
  .state('candidateProfile.job-apply', {
        url: '/job-apply',
        views: {
            'main-view': {
                controller: 'jobOpeningsController',
                templateUrl: jobApplyTpl,
                controllerAs: 'jobOpeningsCtrl'
            }
        }
    })
  .state('candidateProfile.certification-instruction', {
    url: '/certification-instruction',
    views: {
      'main-view': {
        controller: 'CertificationInstructionController',
        templateUrl: candCertInstructionTpl,
        controllerAs: 'CertificationInstructionCtrl'
      }
    }
  })
  .state('candidateProfile.practice-video', {
    url: '/practice-video',
    views: {
      'main-view': {
        controller: 'PracticeVideoController',
        templateUrl: candPractiveVideoTpl,
        controllerAs: 'practiceVideoCtrl'
      }
    }
  })
  .state('candidateProfile.interview-request', {
    url: '/interview-request',
    views: {
      'main-view': {
        controller: 'interviewRequestController',
        templateUrl: candInterviewRequestTpl,
        controllerAs: 'interviewRequestController'
      }
    }
  })
  .state('candidateProfile.multi-apply', {
    url: '/multi-apply',
    views: {
      'main-view': {
        controller: 'multipleApplyController',
        templateUrl: candMultiApplyTpl,
        controllerAs: 'multipleApplyCtrl'
      }
    }
  })
  .state('candidateProfile.cover-letter', {
    url: '/cover-letter',
    views: {
      'main-view': {
        controller: 'coverLetterController',
        templateUrl: candCoverLetterTpl,
        controllerAs: 'coverLetterCtrl'
      }
    }
  })
    // .state('candidateProfile.certificationTemplate', {
    //   url: '/certification-Template',
    //   views: {
    //     'main-view': {
    //       controller: 'certificateTemplateController',
    //       templateUrl: candGoldCertTpl,
    //       controllerAs: 'certificateTemplateCtrl'
    //     }
    //   }
    // })
  .state('candidateProfile.practice-video-instruction', {
    url: '/practice-video-instruction',
    views: {
      'main-view': {
        controller: 'TakePracticeTestQuestionController',
        templateUrl: candPracticeVideoInstructionTpl,
        controllerAs: 'takePracticeTestQuestionCtrl'
      }
    }
  })
  .state('candidateProfile.notifications', {
      url: '/profile/notifications-settings',
      views: {
          'main-view': {
              controller: 'allNotificationController',
              templateUrl: candAllNotificationTpl,
              controllerAs: 'allNotificationCtrl'
          }
      } 
  })
  .state('candidateProfile.general-settings', {
    url: '/general-settings',
    views: {
        'main-view': {
            controller: 'GeneralSettingsController',
            templateUrl: candGeneralSettingsTpl,
            controllerAs: 'GeneralSettingsCtrl'
        }
    } 
  })
  .state('candidateProfile.notification-settings', {
      url: '/notification-settings',
      views: {
          'main-view': {
              controller: 'NotificationSettingsController',
              templateUrl: candNotificationSettingsTpl,
              controllerAs: 'NotificationSettingsCtrl'
          }
      } 
  })
  .state('candidateProfile.theme-settings', {
      url: '/theme-settings',
      views: {
          'main-view': {
              controller: 'ThemeSettingsController',
              templateUrl: candThemeSettingsTpl,
              controllerAs: 'ThemeSettingsCtrl'
          }
      } 
  })
  .state('candidateProfile.mail-box', {
      url: '/mail-box',
      views: {
          'main-view': {
              controller: 'mailBoxController',
              templateUrl: candMailBoxTpl,
              controllerAs: 'mailBoxCtrl'
          }
      } 
  })
  .state('candidateProfile.issue-ticketing', {
      url: '/issue-ticketing-settings',
      views: {
          'main-view': {
              controller: 'IssueTicketingController',
              templateUrl: candIssueTicketingTpl,
              controllerAs: 'IssueTicketingCtrl'
          }
      } 
  }).state('candidateProfile.admin-payment', {
        url: '/admin-payment/:planId/:type',
        params: {
            planId : '',
            type : ''
          },
        views: {
            'main-view': {
                controller: 'AdminPaymentController',
                templateUrl: settingsCandPaymentTpl,
                controllerAs: 'AdminPaymentCtrl'
            }
        }
    });
  $stateProvider.state('public', {
      url: '/public',
      abstract: true,    
      templateUrl: candPublicProfileTpl,
      resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidateProfile/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }      
  })
  .state('public.profile', {
    url: '/profile/:randomToken',
    views: {
            'main-view': {
              controller: 'candidateProfilePublicController',
              templateUrl: candProfilePublicTpl,
              controllerAs: 'candidateProfilePublicCtrl'
            }
          }  
  })
   .state('public.applied-job-description', {
       url: '/applied-job-description/:jobId?e',
       views: {
           'main-view': {
               controller: 'jobDescriptionController',
               templateUrl: appliedJobDescriptionTpl,
               controllerAs: 'jobDescriptionCtrl'
           },
           resolve: {
            CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                return $q((resolve)=> {
                    require.ensure([], ()=> {
                        let module = require('../candidateProfile/index.js');
                        module = module.default;
                        $ocLazyLoad.load({name: module.name});
                        resolve(module.controller);
                    });
                });
            }]
        }   
       }
   })
   
   .state('public.candidate-public-login', {
      url: '/candidate-public-login/:jobId',
      views: {
          'main-view': {
              controller: 'jobApplyController',
              templateUrl: candidatePublicLoginTpl,
              controllerAs: 'jobApplyCtrl'
          }
      }
  })
  .state('assessment', {
      url: '/assessment',
      templateUrl: candAssessmentTpl,
      controller: 'assessmentController',
      controllerAs: 'assessmentController',
      resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidateProfile/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
    })
    .state('app.assessment-result', {
      url: '/assessment/result',
      views: {
        'main-view': {
          controller: 'assessmentResultController',
          templateUrl: candAssessmentResultTpl,
          controllerAs: 'assessmentResultController'
        }
      },
      resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidateProfile/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
    })
    .state('app.test-instruction', {
      url: '/test-instruction',
      views: {
        'main-view': {
          controller: 'testInstructionController',
          templateUrl: candTestInstructionTpl,
          controllerAs: 'testInstructionController'
        }
      },
      resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidateProfile/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
    });
  
}