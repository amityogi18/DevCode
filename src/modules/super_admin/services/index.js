import angular from 'angular';

import {ClientsService} from './clients--service.js';
import {companycandidateService} from './companyCandidate--service.js';
import {candidateprofilesaService} from './candidateProfile-sa--service.js';
import {UserRoleService} from './user-role--service.js';
import {PaymentDashboardService} from './payments-dashboard-service.js';
import {TicketingSystemSaService} from './ticketing-system--service.js';
import {QuestionBankService} from './question-bank--service.js';
import {SuperAdminService} from './super-admin--service.js';
import {SocialMediaService} from './social-media--service.js';
import {CandidateAppliedJobService} from './candidate-applied-job--service.js';
import {CandidateCredentialsService} from './candidate-credential--service.js';
import {BlogService} from './blog-super-admin--service.js';

const MODULE_NAME = 'superAdminServices';

angular
.module(MODULE_NAME, [])
.service('ClientsService', ClientsService)
.service('companycandidateService', companycandidateService)
.service('companycandidateService', companycandidateService)
.service('candidateprofilesaService', candidateprofilesaService)
.service('UserRoleService', UserRoleService)
.service('PaymentDashboardService', PaymentDashboardService)
.service('TicketingSystemSaService', TicketingSystemSaService)
.service('QuestionBankService', QuestionBankService)
.service('SuperAdminService', SuperAdminService)
.service('SocialMediaService', SocialMediaService)
.service('CandidateAppliedJobService', CandidateAppliedJobService)
.service('BlogService', BlogService)
.service('CandidateCredentialsService', CandidateCredentialsService);

export default MODULE_NAME;



