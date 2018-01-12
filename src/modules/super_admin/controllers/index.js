import angular from 'angular';

import {SuperadminController} from './super-admin--controller.js';
import {ClientListingController} from './client-listing--controller.js';
import {ClientController} from './client--controller.js';
import {companycandidateController} from './companyCandidate--controller.js';
import {candidateprofilesaController} from './candidateProfile-sa--controller.js';
import {notificationSaController} from './notification-sa--controller.js';
import {UserRoleController} from './user-role--controller.js';
import {UserRoleListingController} from './user-role-listing--controller.js';
import {PaymentDashboardController} from './payment-dashboard--controller.js';
import {PaymentPlansSaController} from './payment-plan-super-admin--controller.js';
import {EditCustomPlanController} from './edit-custom-plan--controller.js';
import {paymentAccordionController} from './paymentAccordionController.js';
import {TicketingSystemSaController} from './ticketing-system--controller.js';
import {QuestionBankController} from './question-bank--controller.js';
import {EditQuestionBankController} from './edit-question-bank--controller.js';
import {cpuUsageController} from './cpuUsage-sa--controller.js';
import {diskInputOutputController} from './diskInputOutput-sa--controller.js';
import {diskUsageController} from './diskUsage-sa--controller.js';
import {loadAverageController} from './loadAverage-sa--controller.js';
import {memoryUsageController} from './memoryUsage-sa--controller.js';
import {networkTrafficController} from './networkTraffic-sa--controller.js';
import {SocialMediaController} from './social-media--controller.js';
import {editCandidateController} from './editCandidate--controller.js';
import {TechnicalStaticsController} from './technical-static--controller.js';
import {ThirdPartyIntegrationController} from './third-party--controller.js';
import {PositionReviewSaController} from './positionReview-sa--controller.js';
import {PositionReviewDescriptionSaController} from './position-review-description--controller.js';
import {CandidateAppliedJobController} from './candidate-applied-job--controller.js';
import {allJobPortalSaController} from './all-job-portals--controller.js';
import {CandidateAppliedJobDescriptionController} from './candidate-applied-job-description--controller.js';
import {CandidateCredentialsController} from './candidate-credentials--controller.js';
import {CandidateCredentialsListController} from './candidate-credentials-list--controller.js';
import {BlogController} from './blog-super-admin--controller.js';


const MODULE_NAME = 'superAdminControllers';

angular
.module(MODULE_NAME, [])
.controller('SuperadminController', SuperadminController)
.controller('ClientListingController', ClientListingController)
.controller('ClientController', ClientController)
.controller('companycandidateController', companycandidateController)
.controller('candidateprofilesaController', candidateprofilesaController)
.controller('notificationSaController', notificationSaController)
.controller('UserRoleController', UserRoleController)
.controller('UserRoleListingController', UserRoleListingController)
.controller('PaymentDashboardController', PaymentDashboardController)
.controller('PaymentPlansSaController', PaymentPlansSaController)
.controller('EditCustomPlanController', EditCustomPlanController)
.controller('paymentAccordionController', paymentAccordionController)
.controller('TicketingSystemSaController', TicketingSystemSaController)
.controller('QuestionBankController', QuestionBankController)
.controller('EditQuestionBankController', EditQuestionBankController)
.controller('cpuUsageController', cpuUsageController)
.controller('diskInputOutputController', diskInputOutputController)
.controller('diskUsageController', diskUsageController)
.controller('loadAverageController', loadAverageController)
.controller('memoryUsageController', memoryUsageController)
.controller('networkTrafficController', networkTrafficController)
.controller('SocialMediaController', SocialMediaController)
.controller('editCandidateController', editCandidateController)
.controller('TechnicalStaticsController', TechnicalStaticsController)
.controller('ThirdPartyIntegrationController', ThirdPartyIntegrationController)
.controller('PositionReviewSaController', PositionReviewSaController)
.controller('PositionReviewDescriptionSaController', PositionReviewDescriptionSaController)
.controller('CandidateAppliedJobController', CandidateAppliedJobController)
.controller('allJobPortalSaController', allJobPortalSaController)
.controller('CandidateAppliedJobDescriptionController', CandidateAppliedJobDescriptionController)
.controller('CandidateCredentialsController', CandidateCredentialsController)
.controller('BlogController', BlogController)
.controller('CandidateCredentialsListController', CandidateCredentialsListController);

export default MODULE_NAME;
