import angular from 'angular';

import {imageModal} from './imageModal.js';
import {fileModal} from './fileModal.js';
import {videoRecorder} from './videoRecorder.js';
import {exitVideoRecorder} from './exitVideoRecorder.js';
import {paymentModal} from './paymentModal--directive.js';

const MODULE_NAME = 'settingsDirectives';

angular
.module(MODULE_NAME, [])
.directive('imageModal', imageModal)
.directive('fileModal', fileModal)
.directive('videoRecorder', videoRecorder)
.directive('exitVideoRecorder', exitVideoRecorder)
.directive('paymentModal', paymentModal);

export default MODULE_NAME;