import indexTpl from './index.jade';
import dashboardTpl from './partials/dashboard.jade';
import dashboadRefTpl from './partials/refer-earn.jade';
import dashboardSuperAdminTpl from './partials/dashboardSuperAdmin.jade';
import notificationTpl from './partials/all-notification.jade';
import allFavoriteCandidatesTpl from './partials/allFavoriteCandidates.jade'



export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {

    
  $stateProvider.state('app.dashboard', {
    url: '/dashboard',
    params: {
            introParam : ''
         },
    views: {
      'main-view': {
        controller: 'DashboardController',
        templateUrl: indexTpl,
        controllerAs: 'dashboardCtrl'
      },
      'content@app.dashboard': {
        templateUrl: dashboardTpl
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../dashboard/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
    .state('app.refer', {
            url: '/refer-earn',
          views: {
            'main-view': {
                controller: 'ReferEarnController',
                  templateUrl: indexTpl,
                  controllerAs: 'referEarnCtrl'
              },
            'content@app.refer': {
                templateUrl: dashboadRefTpl
             }
          },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../dashboard/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }

     })
    .state('app.dashboardSuperAdmin', {
            url: '/dashbord-superadmin',
          views: {
            'main-view': {
                controller: 'DashboardController',
                  templateUrl: indexTpl,
                  controllerAs: 'dashboardCtrl'
              },
            'content@app.dashboardSuperAdmin': {
                templateUrl: dashboardSuperAdminTpl
             }
          },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../dashboard/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }

     })
     .state('app.notifications', {
        url: '/notifications',
        views: {
            'main-view': {
                controller: 'allNotificationController',
                templateUrl: notificationTpl,
                controllerAs: 'allNotificationCtrl'
            }
        } ,
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../dashboard/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
    })
    .state('app.auth', {
        url: '/auth/:mailClient/?code',
      views: {
        'main-view': {
            controller: 'googleOutlookAuthController',
              templateUrl: dashboardTpl,
              controllerAs: 'googleAuthCtrl'
          }
      },
    resolve: {
            CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                return $q((resolve)=> {
                    require.ensure([], ()=> {
                        let module = require('../dashboard/index.js');
                        module = module.default;
                        $ocLazyLoad.load({name: module.name});
                        resolve(module.controller);
                    });
                });
            }]
        }

    })
      .state('app.allFavoriteCandidates', {
        url: '/allFavoriteCandidates',
        views: {
            'main-view': {
                controller: 'viewAllFavoriteController',
                templateUrl: allFavoriteCandidatesTpl,
                controllerAs: 'viewAllFavoriteCtrl'
            }
        } ,
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../dashboard/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
    });


}
