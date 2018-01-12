import angular from 'angular';

import {eventsPopupModel} from './events-popup--constant';

const MODULE_NAME = 'dashboardConstants';

angular
.module(MODULE_NAME, [])
.constant('eventsPopupModel', eventsPopupModel);

export default MODULE_NAME;