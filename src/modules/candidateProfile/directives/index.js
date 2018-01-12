import angular from 'angular';

import {fileModal} from './fileModal.js';

const MODULE_NAME = 'candidateProfileDirectives';
angular
.module(MODULE_NAME, [])
.directive('fileModal', fileModal);

export default MODULE_NAME;
