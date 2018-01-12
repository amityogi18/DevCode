import angular from 'angular';

import {AssessmentHomeController} from './assessmentHome--controller';
import {CompanySignupController} from './companySignup--controller';
import {CompanyInfoController} from './companyInfo--controller';
import {TermsConditionsController} from './termsConditions--controller';
import {PrivacyPolicyController} from './privacyPolicy--controller';
import {CandidateSignupController} from './candidateSignup--controller';
import {CandidateConfirmationController} from './candidateConfirmation--controller';

const MODULE_NAME = 'signupControllers';

angular
.module(MODULE_NAME, [])
.controller('AssessmentHomeController', AssessmentHomeController)
.controller('CompanySignupController', CompanySignupController)
.controller('CompanyInfoController', CompanyInfoController)
.controller('TermsConditionsController', TermsConditionsController)
.controller('PrivacyPolicyController', PrivacyPolicyController)
.controller('CandidateSignupController', CandidateSignupController)
.controller('CandidateConfirmationController', CandidateConfirmationController);

export default MODULE_NAME;
