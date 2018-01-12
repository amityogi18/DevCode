import angular from 'angular';
import { contactPopModal } from './contact.js';

const MODULE_NAME = 'conferenceConstants';

angular
    .module(MODULE_NAME, [])
.constant('contactPopModal', contactPopModal);

export default MODULE_NAME;