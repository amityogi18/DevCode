import angular from 'angular';

import {termsConditionsModal} from './terms-conditions';
import {privacyPolicyModal} from './privacy-policy';

const MODULE_NAME = 'signupConstants';

angular
.module(MODULE_NAME, [])
.constant('termsConditionsModal', termsConditionsModal)
.constant('privacyPolicyModal', privacyPolicyModal);

export default MODULE_NAME;
