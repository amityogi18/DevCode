import angular from 'angular';



const MODULE_NAME = 'mainPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./app-header.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./block-help.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./component-loader.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./feedback-form.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./growler.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./header-notification.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./navigation.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./share-url.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./sidebar-help.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./place-autocomplete.jade');
require ('!ngtemplate-loader?module=mainPartials&relativeTo=modules/!html-loader!jade-html-loader!./google-calender.jade');
export default MODULE_NAME;
