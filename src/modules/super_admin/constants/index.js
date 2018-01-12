import angular from 'angular';

import { questionPopModal } from './question-popup.js';
import { companyCandidatesModal } from './company-candidates.js';
import { candidateProfileModal } from './candidate-profile.js';
import { ticketingSystemModal } from './ticketing-system.js';
import { clientPopupModal } from './client-popup.js';
import { userPopupModal } from './user-popup.js';
import { customPlanPopupModal } from './custom-plan-popup.js';
import { candidateCredentialsModal } from './candidate-credentials-popup.js';
import { blogPopupModal } from './blog-popup.js';


const MODULE_NAME = 'superAdminConstants';

angular
.module(MODULE_NAME, [])
.constant('questionPopModal', questionPopModal)
.constant('companyCandidatesModal', companyCandidatesModal)
.constant('candidateProfileModal', candidateProfileModal)
.constant('ticketingSystemModal', ticketingSystemModal)
.constant('clientPopupModal', clientPopupModal)
.constant('userPopupModal', userPopupModal)
.constant('customPlanPopupModal', customPlanPopupModal)
.constant('blogPopupModal', blogPopupModal)
.constant('candidateCredentialsModal', candidateCredentialsModal);


export default MODULE_NAME;