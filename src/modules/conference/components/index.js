import angular from 'angular';
import conferenceHeading from './conference-heading--component';


const MODULE_NAME = 'conferenceComponents';
angular
    .module(MODULE_NAME, [])
.component('conferenceHeading', conferenceHeading);

export default MODULE_NAME;
