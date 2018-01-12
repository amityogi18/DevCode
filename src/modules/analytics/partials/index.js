import angular from 'angular';

const MODULE_NAME = 'analyticsPartials';

angular
.module(MODULE_NAME, []);


//templates

require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./appTypeChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./averageCompletionTimeChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidateOrganisationChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidateRatingChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidateStatusReportChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./departmentwiseReportChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./interviewActivityReport.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./interviewByMonthReportChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./recruiterwiseReportChart.jade');
require ('!ngtemplate-loader?module=analyticsPartials&relativeTo=modules/!html-loader!jade-html-loader!./invitationTrackingChart.jade');


export default MODULE_NAME;
