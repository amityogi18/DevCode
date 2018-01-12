import indexTpl from './index.jade';
import positionTpl from './partials/position.jade';
import positionAddTpl from './partials/add-position.jade';
import positionCandSchedInterviewTpl from './partials/candidate-ScheduleInterview.jade';
import positionViewTpl from './partials/view-position.jade';
import mainNavigationTpl from '../main/partials/navigation.jade';
import positionJobPortalTpl from './partials/jobPortal.jade';
import positionAddInterviewTpl from './partials/add-interview.jade';
import positionAppliedCandidatesTpl from './partials/applied-candidates.jade';
import positionHiredTpl from './partials/hired-candidates.jade';
import positionApplicationTpl from './partials/position-application.jade';



export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
  $stateProvider.state('app.position', {
    url: '/position',
    params: {
        isCanceled : false 
      },
    views: {
      'main-view': {
        controller: 'positionController',
        templateUrl: indexTpl,
        controllerAs: 'positionCtrl'
      },
      'navbar@app.position': {
        templateUrl: mainNavigationTpl
      },
      'content@app.position': {
        templateUrl: positionTpl,
        controllerAs: 'positionCtrl'
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.create-position', {
    url: '/position/add/:positionId',
    views: {
          'main-view': {
            controller: 'addPositionController',
            templateUrl: indexTpl,
            controllerAs: 'newPositionCtrl'
          },
          'navbar@app.create-position': {
           templateUrl: mainNavigationTpl
          },
          'content@app.create-position': {
           
            templateUrl: positionAddTpl
           
          }
  },
  resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.advertise', {
    url: '/position/advertise/:positionId?e',
    views: {
          'main-view': {
            controller: 'JobPortalController',
            templateUrl: indexTpl,
            controllerAs: 'newPositionCtrl'
          },
          'navbar@app.advertise': {
           templateUrl: mainNavigationTpl
          },
          'content@app.advertise': {
           
            templateUrl: positionJobPortalTpl
           
          }
  },
  resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.applied', {
    url: '/position/applied/:positionId',
    views: {
          'main-view': {
            controller: 'appliedCandidatesController',
            templateUrl: indexTpl,
            controllerAs: 'newPositionCtrl'
          },
          'navbar@app.applied': {
           templateUrl: mainNavigationTpl
          },
          'content@app.applied': {
           
            templateUrl: positionAppliedCandidatesTpl
           
          }
  },
  resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.interview', {
    url: '/position/interview/:positionId',
    views: {
          'main-view': {
            controller: 'addInterviewController',
            templateUrl: indexTpl,
            controllerAs: 'newPositionCtrl'
          },
          'navbar@app.interview': {
           templateUrl: mainNavigationTpl
          },
          'content@app.interview': {
           
            templateUrl: positionAddInterviewTpl
           
          }
  },
  resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.hired', {
    url: '/position/hired/:positionId',
    views: {
          'main-view': {
            controller: 'hiredCandidatesController',
            templateUrl: indexTpl,
            controllerAs: 'newPositionCtrl'
          },
          'navbar@app.hired': {
           templateUrl: mainNavigationTpl
          },
          'content@app.hired': {
           
            templateUrl: positionHiredTpl
           
          }
  },
  resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.application', {
    url: '/position/application/:positionId',
    views: {
          'main-view': {
            controller: 'applicationController',
            templateUrl: indexTpl,
            controllerAs: 'newPositionCtrl'
          },
          'navbar@app.application': {
           templateUrl: mainNavigationTpl
          },
          'content@app.application': {
           
            templateUrl: positionApplicationTpl
           
          }
  },
  resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.update-position', {
    url: '/position/edit/:positionId',
    views: {
          'main-view': {
            controller: 'addPositionController',
            templateUrl: indexTpl,
            controllerAs: 'newPositionCtrl'
          },
          'navbar@app.update-position': {
           templateUrl: mainNavigationTpl
          },
          'content@app.update-position': {
           
            templateUrl: positionAddTpl
           
          }
  },
  resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  }).state('app.schedule-interview', {
    url: '/schedule-interview/:interviewId',
    views: {
          'main-view': {
            controller: 'candidateScheduleInterviewController',
            templateUrl: indexTpl,
            controllerAs: 'candidateScheduleInterview'
          },
          'navbar@app.schedule-interview': {
           templateUrl: mainNavigationTpl
          },
          'content@app.schedule-interview': {
            controller: 'candidateScheduleInterviewController',
            templateUrl: positionCandSchedInterviewTpl,
            controllerAs: 'candidateScheduleInterviewController'
          }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  }).state('app.view-position', {
    url: '/position/view/:positionId',
    views: {
      'main-view': {
        controller: 'viewPositionController',
        templateUrl: indexTpl,
        controllerAs: 'viewPositionCtrl'
      },
      'navbar@app.view-position': {
        templateUrl: mainNavigationTpl
      },
      'content@app.view-position': {
        controller: 'viewPositionController',
        templateUrl: positionViewTpl,
        controllerAs: 'viewPositionCtrl'
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../position/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  });
}