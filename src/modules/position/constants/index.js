import angular from 'angular';

import {videoModal} from './sampleVideos.js';
import {jobPortalModal} from './jobPortalDetails--constant.js';

const MODULE_NAME = 'positionConstants';

angular
.module(MODULE_NAME, [])
.constant('videoModal', videoModal)
.constant('jobPortalModal', jobPortalModal);

export default MODULE_NAME;