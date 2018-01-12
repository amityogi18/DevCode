import angular from 'angular';

import {PropsFilter} from './propsFilter.js';
import {removeHtmlTagsFilter} from './removeHtmlTagsFilter.js';
const MODULE_NAME = 'positionFilters';
angular
.module(MODULE_NAME, [])
.filter('propsFilter', ()=>PropsFilter.PropsFilterFactory)
.filter('removeHtmlTagsFilter',removeHtmlTagsFilter);

export default MODULE_NAME;
