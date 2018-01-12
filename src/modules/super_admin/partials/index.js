import angular from 'angular';

const MODULE_NAME = 'superAdminPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./clients.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./cpuUsage.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./diskInputOutput.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./diskUsage.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./loadAverage.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./memoryUsage.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./networkTraffic.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./paymentAccordian.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./super-admin.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/client-popup.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/company-candidates.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/custom-plan-popup.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/question-popup.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/ticketing-system.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/user-popup.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/blog-popup.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/credential-popup.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/reject-comment.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./position-review-super-admin.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./position-review-description-super-admin.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./all-job-portals-super-admin.jade');
require ('!ngtemplate-loader?module=superAdminPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/reject-comment.jade');



export default MODULE_NAME;
