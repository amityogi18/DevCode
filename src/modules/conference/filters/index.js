import angular from 'angular';
import DateRange from './daterangeFilter';
import propsFilter from './propsFilter';

const MODULE_NAME = 'conferenceFilters';
angular
    .module(MODULE_NAME, [])

.filter('daterangeFilter', DateRange)
.filter('propsFilter', propsFilter);

export default MODULE_NAME;