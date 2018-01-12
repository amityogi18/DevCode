import angular from 'angular';

const MODULE_NAME = 'signupPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidate-confirmation.jade');
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidate-email-confirmation.jade');
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidate-signup.jade');
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./company-info.jade');
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./company-signup.jade');
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./email-confirmation.jade');
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/privacy-policy.jade');
require ('!ngtemplate-loader?module=signupPartials&relativeTo=modules/!html-loader!jade-html-loader!./modals/terms-conditions.jade');

export default MODULE_NAME;
