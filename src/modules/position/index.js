//module styles import
//import './styles/index.scss';

import angular from 'angular';
//import positionServices from './services';
import positionControllers from './controllers';
import positionComponents from './components';
import positionPartials from './partials';
import positionConstatns from './constants';
import positionDirectives from './directives';
import positionFilters from './filters';
//import dashboardRouteConfig from './dashboard.route';


//other modules dependency
import candidateReviewConstatns from '../candidate_review/constants';
import settingsService from '../settings/services';


const MODULE_NAME = 'positionModule';


export default angular
    .module(MODULE_NAME, [
        //positionServices,
        positionControllers, 
        positionComponents,
        positionPartials,
        positionConstatns,
        positionDirectives,
        positionFilters,
        candidateReviewConstatns,
        settingsService        
        ]);
    //.config(candidateInterviewRouteConfig);


 //export default  MODULE_NAME;
