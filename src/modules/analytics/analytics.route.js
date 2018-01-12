import indexTpl from './index.jade';
import contentTpl from './partials/analytics.jade';


export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {

$stateProvider
.state('app.analytics', {
    url: '/analytics',
    views: {
      'main-view': {
        controller: 'analyticsController',
        templateUrl: indexTpl,
        controllerAs: 'AnalyticsCtrl'
      },
       'content@app.analytics': {
       templateUrl: contentTpl
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../analytics/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.analytics-stats', {
    url: '/analytics/stats/:positionId/:duration/:companyId',
    views: {
      'main-view': {
        controller: 'analyticsController',
        templateUrl: indexTpl,
        controllerAs: 'AnalyticsCtrl'
      },
       'content@app.analytics-stats': {
       templateUrl: contentTpl
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../analytics/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  });

}
