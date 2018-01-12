/*Importing all the required files */
import angular from 'angular';

import paymentDetailAccordian from './paymentDetailAccordian--component.js';
import cpuUsage from './cpuUsage--component.js';
import diskInputOutput from './diskInputOutput--component.js';
import diskUsage from './diskUsage--component.js';
import loadAverage from './loadAverage--component.js';
import memoryUsage from './memoryUsage--component.js';
import networkTraffic from './networkTraffic--component.js';
/*Getting componentsModule from appConfig modules and storing it into componentsModule variable */
const MODULE_NAME = 'superAdminComponents';

angular
.module(MODULE_NAME, [])
.component('paymentDetailAccordian', paymentDetailAccordian)
.component('cpuUsage', cpuUsage)
.component('diskInputOutput', diskInputOutput)
.component('diskUsage', diskUsage)
.component('loadAverage', loadAverage)
.component('memoryUsage', memoryUsage)
.component('networkTraffic', networkTraffic);

export default MODULE_NAME;


