import angular from 'angular';

import {fileModal} from './fileModal.js';
import {modalPopup} from './modalPopup.js';
import {fileread} from './fileRead.js';

const MODULE_NAME = 'positionDirectives';
angular
.module(MODULE_NAME, [])
.directive('fileModal', fileModal)
.directive('modalPopup', modalPopup)
.directive('fileread',fileread);

export default MODULE_NAME;
