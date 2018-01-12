import angular from 'angular';

import {DashboardService} from './dashboard--service.js';
import {ReferEarnService} from './referEarn--service.js';
import {PositionDashboardService} from './positionDashboard--service.js';
import {QuickStasticsService} from './quickStastics--service.js';
import {FavoriteCandidatesService} from './favoriteCandidates--service.js';

const MODULE_NAME = 'dashboardServices';


 angular
.module(MODULE_NAME, [])
.service('DashboardService', DashboardService)
.service('ReferEarnService', ReferEarnService)
.service('PositionDashboardService', PositionDashboardService)
.service('QuickStasticsService', QuickStasticsService)
.service('FavoriteCandidatesService', FavoriteCandidatesService);

export default MODULE_NAME;