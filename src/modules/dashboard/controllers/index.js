import angular from 'angular';

import {DashboardController} from './dashboard--controller';
import {dashboradNotificationController} from './dashboard-notification--controller';
import {allNotificationController} from './all-notification--controller';
import {eventsController} from './events--controller';
import {candidateStatusController} from './candidateStatus--controller';
import {quickStasticsController} from './quickStastics--controller';
import {invitationTrackingController} from './invitationTracking--controller';
import {favoriteCandidatesController} from './favoriteCandidates--controller';
import {positionDashboardController} from './positionDashboard--controller';
import {evaluatorDashboardController} from './evaluatorDashboard--controller';
import {ReferEarnController} from './referEarn--controller';
import {EventsPopupController} from './eventsPopup--controller';
import {viewAllFavoriteController} from './viewAllFavorite--controller';
import {googleOutlookAuthController} from './googleOutlookAuth--controller';

const MODULE_NAME = 'dashboardControllers';

angular
.module(MODULE_NAME, [])
.controller('DashboardController', DashboardController)
.controller('eventsController', eventsController)
.controller('dashboradNotificationController', dashboradNotificationController)
.controller('allNotificationController', allNotificationController)
.controller('candidateStatusController', candidateStatusController)
.controller('quickStasticsController', quickStasticsController)
.controller('invitationTrackingController', invitationTrackingController)
.controller('favoriteCandidatesController', favoriteCandidatesController)
.controller('positionDashboardController', positionDashboardController)
.controller('evaluatorDashboardController', evaluatorDashboardController)
.controller('ReferEarnController', ReferEarnController)
.controller('EventsPopupController', EventsPopupController)
.controller('googleOutlookAuthController', googleOutlookAuthController)
.controller('viewAllFavoriteController', viewAllFavoriteController);

export default MODULE_NAME;