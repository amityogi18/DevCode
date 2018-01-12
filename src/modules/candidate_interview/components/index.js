import angular from 'angular';

import audioResponseQuestion from './audioResponseQuestion--component';
import multipleChoiceQuestion from './multipleChoiceQuestion--component';
import multipleSelectQuestion from './multipleSelectQuestion--component';
import textResponseQuestion from './textResponseQuestion--component';
import videoResponseQuestion from './videoResponseQuestion--component';

const MODULE_NAME = 'candidateInterviewComponents';

angular
.module(MODULE_NAME, [])
.component('audioResponseQuestion', audioResponseQuestion)
.component('multipleChoiceQuestion', multipleChoiceQuestion)
.component('multipleSelectQuestion', multipleSelectQuestion)
.component('textResponseQuestion', textResponseQuestion)
.component('videoResponseQuestion', videoResponseQuestion);

export default MODULE_NAME;


