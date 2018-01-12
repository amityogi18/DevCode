//module styles import
//import './styles/index.scss';

import angular from 'angular';
import candidateProfileServices from './services';
import candidateProfileControllers from './controllers';
import candidateProfilePartials from './partials';
import candidateProfileDirectives from './directives';  


//other modules dependency
import CandidateInterviewService from '../candidate_interview/services';
import GeneralSettingsController from '../settings/controllers';
import NotificationSettingsController from '../settings/controllers';
import ThemeSettingsController from '../settings/controllers';
import IssueTicketingController from '../settings/controllers';
import IssueTicketingService from '../settings/services';
import allNotificationController from '../dashboard/controllers';
import CandidateSignupService from '../signup/services';
import positionServices from '../position/services';
import mailBoxController from '../settings/controllers';
import settingsDirectives from '../settings/directives';
import settingsPartials from '../settings/partials';

const MODULE_NAME = 'candidateProfileModule';


export default angular
    .module(MODULE_NAME, [
        candidateProfileServices,
        candidateProfileControllers,
        candidateProfilePartials,
        candidateProfileDirectives,
        CandidateInterviewService,
        GeneralSettingsController,
        NotificationSettingsController,
        ThemeSettingsController,
        IssueTicketingController,
        IssueTicketingService,        
        allNotificationController,
        positionServices,
        CandidateSignupService,
        mailBoxController,
        settingsDirectives,
        settingsPartials
        ]);
        
    //.config(candidateInterviewRouteConfig);


 //export default  MODULE_NAME;
