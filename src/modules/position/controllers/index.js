import angular from 'angular';

import {positionController} from './position--controller.js';
import {addPositionController} from './addPosition--controller.js';
import {audioVideoAccordionController} from './audioVideoAccordion--controller.js';
import {candidateAccordionController} from './candidateAccordion--controller.js';
import {candidateEvaluatorAccordionController} from './candidateEvaluatorAccordion--controller.js';
import {interviewSettingsAccordionController} from './interviewSettingsAccordion--controller.js';
import {questionsListController} from './questionsList--controller.js';
import {scheduleAccordionController} from './scheduleAccordion--controller.js';
import {writtenInterviewAccordionController} from './writtenInterviewAccordion--controller.js';
import {liveNowInterviewAccordionController} from './liveNowCandidateAccordion--controller.js';
import {modalInstanceController} from './modalInstanceController.js';
import {audioTestAccordionController} from './audioTestAccordion--controller.js';
import {videoTestAccordionController} from './videoTestAccordion--controller.js';
import {connectionTestAccordionController} from './connectionTestAccordion--controller.js';
import {audioVideoQuestionPopupController} from './audioVideoQuestionPopup--controller.js';
import {writtenInterviewQuestionPopupController} from './writtenInterviewQuestionPopup--controller.js';
import {candidatePopupController} from './candidatePopup--controller.js';
import {candidateScheduleInterviewController} from './candidateScheduleInterview--controller.js';
import {viewPositionController} from './viewPosition--controller.js';
import {appliedCandidatesController} from './appliedCandidates--controller.js';
import {JobPortalController} from './jobPortal--controller.js';
import {addInterviewController} from './addInterview--controller.js';
import {applicationController} from './positionApplication--controller.js';
import {jobPortalDetailsController} from './jobPortalDetails--controller.js';
import {liveNowInterviewController} from './liveNowInterview--controller.js';
import {hiredCandidatesController} from './hiredCandidate--controller.js';



const MODULE_NAME = 'positionControllers';

angular
.module(MODULE_NAME, [])
.controller('positionController', positionController)
.controller('addPositionController', addPositionController)
.controller('audioVideoAccordionController', audioVideoAccordionController)
.controller('candidateAccordionController', candidateAccordionController)
.controller('candidateEvaluatorAccordionController', candidateEvaluatorAccordionController)
.controller('interviewSettingsAccordionController', interviewSettingsAccordionController)
.controller('questionsListController', questionsListController)
.controller('scheduleAccordionController', scheduleAccordionController)
.controller('writtenInterviewAccordionController', writtenInterviewAccordionController)
.controller('liveNowInterviewAccordionController', liveNowInterviewAccordionController)
.controller('modalInstanceController', modalInstanceController)
.controller('audioTestAccordionController', audioTestAccordionController)
.controller('videoTestAccordionController', videoTestAccordionController)
.controller('connectionTestAccordionController', connectionTestAccordionController)
.controller('audioVideoQuestionPopupController', audioVideoQuestionPopupController)
.controller('writtenInterviewQuestionPopupController', writtenInterviewQuestionPopupController)
.controller('candidatePopupController', candidatePopupController)
.controller('candidateScheduleInterviewController', candidateScheduleInterviewController)
.controller('viewPositionController', viewPositionController)
.controller('JobPortalController', JobPortalController)
.controller('addInterviewController', addInterviewController)
.controller('applicationController', applicationController)
.controller('appliedCandidatesController', appliedCandidatesController)
.controller('jobPortalDetailsController', jobPortalDetailsController)
.controller('liveNowInterviewController', liveNowInterviewController)
.controller('hiredCandidatesController', hiredCandidatesController);

export default MODULE_NAME;


