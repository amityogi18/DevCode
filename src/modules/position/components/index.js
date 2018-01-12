/*Importing all the required files */
import angular from 'angular';

import AsmScheduleAccordion from './scheduleAccordion--component.js';
import AsmAudioVideoAccordion from './audioVideoAccordion--component.js';
import AsmCandidateEvaluatorAccordion from './candidateEvaluatorAccordion--component.js';
import AsmCandidateAccordion from './candidateAccordion--component.js';
import AsmInterviewSettingsAccordion from './interviewSettingsAccordion--component.js';
import AsmQuestionsListAccordion from './questionsListAccordion--component.js';
import AsmWrittenInterviewAccordion from './writtenInterviewAccordion--component.js';
import AsmAudioTestAccordion from './audioTestAccordion--component.js';
import AsmVideoTestAccordion from './videoTestAccordion--component.js';
import AsmConnectionTestAccordion from './connectionTestAccordion--component.js';
import AsmLiveNowInterviewAccordion from './liveAccordion--component.js';
import LiveNowInterview from './liveNow--component.js';

/*Getting componentsModule from appConfig modules and storing it into componentsModule variable */
const MODULE_NAME = 'positionComponents';

angular
.module(MODULE_NAME, [])
.component('asmScheduleAccordion', AsmScheduleAccordion)
.component('asmCandidateEvaluatorAccordion', AsmCandidateEvaluatorAccordion)
.component('asmAudioVideoAccordion', AsmAudioVideoAccordion)
.component('asmCandidateAccordion', AsmCandidateAccordion)
.component('asmInterviewSettingsAccordion', AsmInterviewSettingsAccordion)
.component('asmQuestionsListAccordion', AsmQuestionsListAccordion)
.component('asmWrittenInterviewAccordion', AsmWrittenInterviewAccordion)
.component('asmAudioTestAccordion', AsmAudioTestAccordion)
.component('asmVideoTestAccordion', AsmVideoTestAccordion)
.component('asmConnectionTestAccordion', AsmConnectionTestAccordion)
.component('asmLiveNowInterviewAccordion', AsmLiveNowInterviewAccordion)
.component('liveNowInterview', LiveNowInterview);

export default MODULE_NAME;
