import angular from 'angular';

import {analyticsService} from './analytics--service.js';


const MODULE_NAME = 'analyticsServices';


 angular
.module(MODULE_NAME, [])
.service('analyticsService', analyticsService);

export default MODULE_NAME;


