import angular from 'angular';

/*Importing all the required files */
import SidebarHelpComponent from './settingsSidebar--component.js';
import HelpComponent from './settingsBlock--component.js';
import HeaderNotificationComponent from './headerNotification--component.js';
import AppHeaderComponent from './appHeader--component.js';

/*Getting componentsModule from appConfig modules and storing it into componentsModule variable */
const MODULE_NAME = 'mainComponents';

/*Adding various components to the componentsModule*/
angular
.module(MODULE_NAME, [])
.component('sidebarHelpComponent', SidebarHelpComponent)
.component('helpComponent', HelpComponent)
.component('headerNotificationComponent', HeaderNotificationComponent)
.component('appHeaderComponent', AppHeaderComponent);


export default MODULE_NAME;
