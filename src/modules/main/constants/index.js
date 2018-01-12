import angular from 'angular';

import {errorMessage} from './errorMessage--constants';
import {successMessage} from './successMessage--constants';

const MODULE_NAME = 'mainConstant';

angular
    .module(MODULE_NAME, [])
    .constant('errorMessage', errorMessage)
    .constant('successMessage', successMessage);


export default MODULE_NAME;
