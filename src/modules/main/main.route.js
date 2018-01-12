import  tplUrl from './main.jade';
export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
    $stateProvider /** Describe our states */
        .state('app', {
        url: '',
        views: {
            '': {
                controller: 'AppController',
                templateUrl: tplUrl,
                controllerAs: 'AppCtrl'
            }
        }
    });
}
