import angular from 'angular';

const MODULE_NAME = 'dashboardPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidateStatus.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./dashboard-notification.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./dashboardSuperAdmin.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./evaluatorDashboard.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./events.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./favoriteCandidates.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./introduction.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./introduction1.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./invitationTracking.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./positionDashboard.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./quickStastics.jade');
require ('!ngtemplate-loader?module=dashboardPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/events-popup.jade');

export default MODULE_NAME;
