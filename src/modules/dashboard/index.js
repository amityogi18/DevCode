//module styles import
//import './styles/index.scss';

import angular from 'angular';
import dashboardServices from './services';
import dashboardControllers from './controllers';
import dashboardComponents from './components';
import dashboardConstants from './constants';
import dashboardPartials from './partials';
//import dashboardRouteConfig from './dashboard.route';

//other modules dependency
import calendarService from '../settings/services';





const MODULE_NAME = 'dashboardModule';


export default angular
    .module(MODULE_NAME, [
        dashboardPartials,
        dashboardServices, 
        dashboardControllers,
        dashboardComponents,
        dashboardConstants,
        calendarService
        ]);
    //.config(dashboardRouteConfig);


 //export default  MODULE_NAME;
