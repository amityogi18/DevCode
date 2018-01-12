import angular from 'angular';

import {CompanySignupService} from './companySignup--service';
import {CompanyInfoService} from './companyInfo--service';
import {CandidateSignupService} from './candidateSignup--service';



const MODULE_NAME = 'signupServices';

 angular
.module(MODULE_NAME, [])
.service('CompanySignupService', CompanySignupService)
.service('companyInfoService', CompanyInfoService)
.service('CandidateSignupService', CandidateSignupService);

export default MODULE_NAME;