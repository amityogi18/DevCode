import angular from 'angular';


import {asmModal} from './asm-modal--directive.js';
import {asmGrowler} from './growler--directive.js';
import {asmComponentLoader} from './component-loader--directive.js';
import {feedbackForm} from './feedback-form--directive.js';
import {shareInterviewUrl} from './share-url--directive.js';
import {placeAutocomplete} from './google-location--directive.js';
import {googleCalender} from './google-calender--directive.js';
import {countdownTimer} from './countdown-timer--directive.js';

const MODULE_NAME = 'mainDirectives';

angular
.module(MODULE_NAME, [])
.directive('asmModal', asmModal)
.directive('asmGrowler', asmGrowler)
.directive('asmComponentLoader', asmComponentLoader)
.directive('feedbackForm', feedbackForm)
.directive('shareInterviewUrl', shareInterviewUrl)
.directive('placeAutocomplete', placeAutocomplete)
.directive('googleCalender', googleCalender)
.directive('countdownTimer', countdownTimer);


export default MODULE_NAME;
