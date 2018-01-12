import angular from 'angular';

import {positionService} from './position--service.js';
import {scheduleService} from './schedule--service.js';
import {checkPeripheralStatusService} from './checkPeripheralStatus';
import {mediaRecorderService} from './mediaRecorder';
import {volumeMeterService} from './volumeMeter';
import {InterviewService} from './interviews--service.js';
import {interviewSettingService} from './interviewSetting--service.js';
import {appliedCandidateService} from './appliedCandidate--service.js';

const MODULE_NAME = 'positionServices';
angular
.module(MODULE_NAME, [])
.service('positionService', positionService)
.service('scheduleService', scheduleService)
.service('checkPeripheralStatusService', checkPeripheralStatusService)
.service('mediaRecorderService', mediaRecorderService)
.service('volumeMeterService', volumeMeterService)
.service('InterviewService', InterviewService)
.service('interviewSettingService', interviewSettingService)
.service('appliedCandidateService', appliedCandidateService);

export default MODULE_NAME;


