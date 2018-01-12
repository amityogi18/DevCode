//module styles import
//import './styles/index.scss';

import angular from 'angular';
import superAdminServices from './services';
import superAdminControllers from './controllers';
import superAdminComponents from './components';
import superAdminConstants from './constants';
import superAdminPartials from './partials';
//import superAdminRouteConfig from './superAdmin.route';


//other modules dependency
import IssueTicketingService from '../settings/services';
import interviewSettingService from '../position/services';
import positionService  from '../position/services';


const MODULE_NAME = 'superAdminModule';


export default angular
    .module(MODULE_NAME, [
        superAdminPartials,
        superAdminServices, 
        superAdminControllers,
        superAdminComponents,
        superAdminConstants,
        IssueTicketingService,
        positionService,
        interviewSettingService
        ]);
    //.config(superAdminRouteConfig);


 //export default  MODULE_NAME;
