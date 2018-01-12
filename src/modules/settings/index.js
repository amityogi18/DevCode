//module styles import
//import './styles/index.scss';

import angular from 'angular';
import settingsDirectives from './directives';
import settingsServices from './services';
import settingsControllers from './controllers';
import settingsComponents from './components';
import settingsConstants from './constants';
import settingsPartials from './partials';
//import settingsRouteConfig from './settings.route';


//other modules dependency
import interviewSettingService from '../position/services';
import CandidateInterviewService from '../candidate_interview/services';
import ExitVideoController from '../candidate_interview/controllers';
//import mediaRecorderService from '../position/services';


const MODULE_NAME = 'settingsModule';


export default angular
    .module(MODULE_NAME, [
        settingsPartials,
        settingsDirectives,
        settingsServices, 
        settingsControllers,
        settingsComponents,
        settingsConstants,
        interviewSettingService,
        CandidateInterviewService,
        ExitVideoController
        ]);
    //.config(settingsRouteConfig);


 //export default  MODULE_NAME;
