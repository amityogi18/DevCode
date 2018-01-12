import angular from 'angular';

import dashboradNotification from './dashborad-notification--component';
import events from './events--component';
import candidateStatus from './candidateStatus--component';
import quickStastics from './quickStastics--component';
import invitationTracking from './invitationTracking--component';
import favoriteCandidates from './favoriteCandidates--component';
import positionDashboard from './positionDashboard--component';
import evaluatorDashboard from './evaluatorDashboard--component';

const MODULE_NAME = 'dashboardComponents';

angular
.module(MODULE_NAME, [])
.component('dashboradNotification', dashboradNotification)
.component('events', events)
.component('candidateStatus', candidateStatus)
.component('quickStastics', quickStastics)
.component('invitationTracking', invitationTracking)
.component('favoriteCandidates', favoriteCandidates)
.component('positionDashboard', positionDashboard)
.component('evaluatorDashboard', evaluatorDashboard);

export default MODULE_NAME;
