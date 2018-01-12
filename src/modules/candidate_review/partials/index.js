import angular from 'angular';

const MODULE_NAME = 'candidateReviewPartials';

angular
.module(MODULE_NAME, []);


//templates
require ('!ngtemplate-loader?module=candidateReviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./add-candidate-popup.jade');
require ('!ngtemplate-loader?module=candidateReviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./add-evaluator-popup-template.jade');
require ('!ngtemplate-loader?module=candidateReviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./evaluator-popup.jade');
require ('!ngtemplate-loader?module=candidateReviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./profile-popup.jade');
require ('!ngtemplate-loader?module=candidateReviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./rating-popup.jade');
require ('!ngtemplate-loader?module=candidateReviewPartials&relativeTo=modules/!html-loader!jade-html-loader!./admin-candidate-profile.jade');



export default MODULE_NAME;
