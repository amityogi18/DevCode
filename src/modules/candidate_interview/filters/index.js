import angular from 'angular';

import {secondsToDateTimeFilter} from './secondsToDateTime--filter.js';

const MODULE_NAME = 'candidateInterviewFilters';

angular
.module(MODULE_NAME, [])
.filter('secondsToDateTime', secondsToDateTimeFilter);

export default MODULE_NAME;