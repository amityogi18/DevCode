//module styles import
//import './styles/index.scss';

import angular from 'angular';
import candidateReviewServices from './services';
import candidateReviewControllers from './controllers';
import candidateReviewPartials from './partials';
import candidateReviewConstatns from './constants';
import candidateReviewDirectives from './directives';

//other modules dependency
import positionService  from '../position/services';
import settingsService from '../settings/services';



const MODULE_NAME = 'candidateReviewModule';


export default angular
    .module(MODULE_NAME, [
        candidateReviewServices,
        candidateReviewControllers,
        candidateReviewPartials,
        candidateReviewConstatns,
        candidateReviewDirectives,
        positionService,
        settingsService
        ]);
    //.config(candidateInterviewRouteConfig);


 //export default  MODULE_NAME;
