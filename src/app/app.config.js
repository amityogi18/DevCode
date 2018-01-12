export default Config;

/** @ngInject */
function Config($translateProvider, $stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, calendarConfig) {
   
    $locationProvider.html5Mode({enabled:true, requireBase:false});
    $locationProvider.hashPrefix('');

    $translateProvider.useStaticFilesLoader({
        prefix: window.appBasePath+'languages/',
        suffix: '.json'
    });

    // calendar configration starts
    console.log('calendar config',calendarConfig);
    calendarConfig.templates.calendarMonthCellEvents = 'calendar_view.html'; 


    // calendar configration ends

    $translateProvider.preferredLanguage('en');
    
    $translateProvider.useSanitizeValueStrategy('sanitize');

    $translateProvider.fallbackLanguage('en');

    $urlRouterProvider.otherwise('/user-login');

    $httpProvider.interceptors.push('HttpInterceptorService');

    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
