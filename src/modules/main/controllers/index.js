import angular from 'angular';


import {AppController} from './main--controller';
import {GrowlerController} from './growler--controller';
import {FeedbackFormController} from './feedbackForm--controller';
import {SideBarHelpController} from './sideBarHelp--controller';
import {HelpController} from './blockHelp--controller';
import {headerNotificationController} from './headerNotification--controller';
import {AppHeaderController} from './appHeader--controller';
import {ShareUrlController} from './shareUrl--controller';
import {NestedTableController} from './nestedTable--controller';
import {GoogleLocationController} from './googleLocation--controller';

const MODULE_NAME = 'mainControllers';

angular
    .module(MODULE_NAME, [])
    .controller('AppController', AppController)
    .controller('GrowlerController', GrowlerController)
    .controller('FeedbackFormController', FeedbackFormController)
    .controller('SideBarHelpController', SideBarHelpController)
    .controller('HelpController', HelpController)
    .controller('headerNotificationController', headerNotificationController)
    .controller('AppHeaderController', AppHeaderController)
    .controller('ShareUrlController', ShareUrlController)
    .controller('googleLocationController', GoogleLocationController)
    .controller('NestedTableController', NestedTableController);


export default MODULE_NAME;



