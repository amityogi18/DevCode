import angular from 'angular';

const MODULE_NAME = 'candidateInterviewPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=candidateInterviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./audio-response-question.jade');
require ('!ngtemplate-loader?module=candidateInterviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./candidate-slot-selection.jade');
require ('!ngtemplate-loader?module=candidateInterviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./multiple-choice-question.jade');
require ('!ngtemplate-loader?module=candidateInterviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./multiple-select-question.jade');
require ('!ngtemplate-loader?module=candidateInterviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./text-response-question.jade');
require ('!ngtemplate-loader?module=candidateInterviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./video-response-question.jade');



export default MODULE_NAME;
