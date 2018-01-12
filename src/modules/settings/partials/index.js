import angular from 'angular';

const MODULE_NAME = 'settingsPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./admin-company-info-directive.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./admin-payment-elements.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./company-logo.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./company-profile.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./dial-in.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./exit-video.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./exitVideoRecorder.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./landing-image.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./reporting.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./settings.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./social-media.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./terms-conditions.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./videoRecorder.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./welcome-video.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./admin-payment-success.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/admin-department-pop-up.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/admin-user-pop-up.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/email-template-pop-up.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/settings-add-custom-question.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/settings-add-new-template.jade');
require ('!ngtemplate-loader?module=settingsPartials&relativeTo=modules/!html-loader!jade-html-loader!./position-automation.jade');





export default MODULE_NAME;
