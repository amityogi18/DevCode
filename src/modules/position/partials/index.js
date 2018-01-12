import angular from 'angular';

const MODULE_NAME = 'positionPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./audioTest-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./audioVideo-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidate-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./applied-candidates.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./add-interview.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidate-evaluator-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidate-popup-template.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./connectionTest-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./interviewSettings-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./live-candidate-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./peripheral-check.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./question-bank.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./questionsList-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./schedule-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./videoTest-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./writtenInterview-accordion.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./jobPortal.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./jobPortal-details.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./model/live-now.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./position-navbar.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./position-application.jade');
require ('!ngtemplate-loader?module=positionPartials&relativeTo=modules/!html-loader!jade-html-loader!./live-now-interview.jade');




export default MODULE_NAME;
