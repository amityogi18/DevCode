import angular from 'angular';

import {analyticsController} from './analytics--controller.js';
import {appTypeController} from './appType--controller.js';
import {candidateOrganisationController} from './candidateOrganisation--controller.js';
import {candidateRatingController} from './candidateRating--controller.js';
import {candidateStatusReportController} from './candidateStatusReport--controller.js';
import {interviewActivityReportController} from './interviewActivityReport--controller.js';
import {interviewByMonthController} from './interviewByMonthReport--controller.js';
import {averageCompletionTimeController} from './averageCompletionTime--controller.js';
import {departmentwiseController} from './departmentwiseReport--controller.js';
import {recruiterwiseReportController} from './recruiterwiseReport--controller.js';
import {invitationTrackingController} from './invitationTracking--controller.js';


const MODULE_NAME = 'analyticsControllers';

angular
.module(MODULE_NAME, [])
.controller('analyticsController', analyticsController)
.controller('appTypeController', appTypeController)
.controller('candidateOrganisationController', candidateOrganisationController)
.controller('candidateRatingController', candidateRatingController)
.controller('candidateStatusReportController', candidateStatusReportController)
.controller('interviewActivityReportController', interviewActivityReportController)
.controller('interviewByMonthController', interviewByMonthController)
.controller('averageCompletionTimeController', averageCompletionTimeController)
.controller('departmentwiseController', departmentwiseController)
.controller('recruiterwiseReportController', recruiterwiseReportController)
.controller('invitationTrackingController', invitationTrackingController);


export default MODULE_NAME;




