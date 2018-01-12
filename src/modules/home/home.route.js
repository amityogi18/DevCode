import tplUrl from './includes/home.jade';
import tplLoginUrl from './partials/user-login.jade';
import forgetHeaderTpl from './includes/forget-reset-header.jade';
import tplCandidateLoginUrl from './partials/user-login.jade';
import tplForgetUrl from './partials/forget-password.jade';
import tplResetUrl from './partials/reset-password.jade';


export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {
    
  $stateProvider.state('app.user-login', {
    url: '/user-login',
    views: {
      'main-view': {
        templateUrl: tplUrl
      },
      'content@app.user-login': {
        controller: 'LoginController',
        templateUrl: tplLoginUrl,
        controllerAs: 'loginCtrl',
        data : {
          userType : '1'
        }
      }
     }
    })
    .state('app.candidate-login', {
      url: '/candidate-login',
      views: {
        'main-view': {
          templateUrl: tplUrl
        },
        'content@app.candidate-login': {
          controller: 'LoginController',
          templateUrl: tplCandidateLoginUrl,
          controllerAs: 'loginCtrl',
          data : {
          userType : '2'
        }
        }
      }
      })
    .state('app.forget-password', {
      url: '/forgot-password',
      params:{
        userType: null
      },
      views: {
        'main-view': {
          templateUrl: tplUrl
        },
        'navbar@app.forget-password': {
          templateUrl: forgetHeaderTpl
        },
        'content@app.forget-password': {
          controller: 'ForgetPasswordController',
          templateUrl: tplForgetUrl,
          controllerAs: 'forgetPasswordCtrl'
          
        }
      }
  })
  .state('app.reset-password', {
    url: '/reset-password/:userType/:token',
    views: {
      'main-view': {
        templateUrl: tplUrl
      },
      'navbar@app.reset-password': {
          templateUrl: forgetHeaderTpl
      },
      'content@app.reset-password': {
        controller: 'ResetPasswordController',
        templateUrl: tplResetUrl,
        controllerAs: 'resetPasswordCtrl'
      }
    }
  });
}
