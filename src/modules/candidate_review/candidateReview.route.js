import indexTpl from './index.jade';
import candReviewTpl from './partials/candidate-review.jade';
import candCompareTpl from './partials/candidate-compare.jade';
import candProfileTpl from './partials/admin-candidate-profile.jade';


export default routeConfig;

/** @ngInject */
function routeConfig($stateProvider) {

$stateProvider
.state('app.candidate-review', {
    url: '/candidate-review',
    params: {
            positionId : '',
            interviewId : '',
            candidateName: ''
          },
    views: {
      'main-view': {
        controller: 'CandidateReviewController',
        templateUrl: indexTpl,
        controllerAs: 'CandidateReviewCtrl'
      },
      'content@app.candidate-review': {
        templateUrl: candReviewTpl
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidate_review/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })
  .state('app.compare-candidate', {
    url: '/candidate-compare',
    params: {
            candidateId: [],
            positionId : '',
            interviewId : ''
          },
    views: {
      'main-view': {
        controller: 'CandidateCompareController',
        templateUrl: indexTpl,
        controllerAs: 'CandidateReviewCtrl'
      },
      'content@app.compare-candidate': {
        templateUrl: candCompareTpl
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidate_review/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  })

  .state('app.candidate-profile', {
    url: '/candidate-profile?e',
    params: {
        candidateId : ''
      },
    views: {
      'main-view': {
        controller: 'adminCandidateProfileController',
        templateUrl: indexTpl,
        controllerAs: 'adminCandidateProfileCtrl'
      },
      'content@app.candidate-profile': {
        templateUrl: candProfileTpl
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidate_review/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  }).state('app.candidate-profile-data', {
    url: '/candidate-profile/:candidateId?e',
    views: {
      'main-view': {
        controller: 'adminCandidateProfileController',
        templateUrl: indexTpl,
        controllerAs: 'adminCandidateProfileCtrl'
      },
      'content@app.candidate-profile-data': {
        templateUrl: candProfileTpl
      }
    },
    resolve: {
                CTRL: ['$q', '$ocLazyLoad',($q, $ocLazyLoad)=> {
                    return $q((resolve)=> {
                        require.ensure([], ()=> {
                            let module = require('../candidate_review/index.js');
                            module = module.default;
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }]
            }
  });
}