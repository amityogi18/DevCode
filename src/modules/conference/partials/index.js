import angular from 'angular';



const MODULE_NAME = 'conferencePartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./conference-heading.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/contact-popup.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./introduction1.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/call-via-internet.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/add-display-name.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/recording-help.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/control.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/share-link.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/screen-share.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/connect-to-video.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/meeting-link.jade');
require ('!ngtemplate-loader?module=conferencePartials&relativeTo=modules/!html-loader!jade-html-loader!./model/recommended-questions.jade');


export default MODULE_NAME;
