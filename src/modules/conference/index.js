//import './styles/index.scss';
import angular from 'angular';
import conferenceService from './services';
import conferenceControllers from './controllers';
import conferenceComponents from './components';
import conferenceConstants from './constants';
import conferenceDirectives from './directives';
import conferenceFilters from './filters';
import conferencePartials from './partials';
//import conferenceRouteConfig from './conference.route';


//other modules dependency
import CandidateInterviewService from '../candidate_interview/services';
import settingsControllers from '../settings/controllers';
import settingsServices from '../settings/services';
import settingsDirectives from '../settings/directives';
import settingsComponents from '../settings/components';
import settingsConstants from '../settings/constants';
import settingsPartials from '../settings/partials';



const MODULE_NAME = 'conferenceModule';


export default angular
    .module(MODULE_NAME, [
        conferencePartials,
        conferenceService, 
        conferenceControllers,
        conferenceComponents,
        conferenceConstants,
        conferenceDirectives,
        conferenceFilters,
        CandidateInterviewService,
        settingsControllers,
        settingsServices,
        settingsDirectives,
        settingsComponents,
        settingsConstants,
        settingsPartials
        ]);
    //.config(conferenceRouteConfig);


 //export default  MODULE_NAME;
