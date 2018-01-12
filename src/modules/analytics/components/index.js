import angular from 'angular';

import candidateStatusReport from './candidateStatusReport--component';
import appType from './appType--component';
import candidateOrganisation from './candidateOrganisation--component';
import candidateRating from './candidateRating--component';
import interviewByMonthReport from './interviewByMonthReport--component';
import interviewActivityReport from './interviewActivityReport--component';
import averageCompletionTime from './averageCompletionTime--component';
import departmentwise from './departmentwiseReport--component';
import recruiterwiseReport from './recruiterwiseReport--component';
import invitationTrackingChart from './invitationTracking--component';

const MODULE_NAME = 'analyticsComponents';

angular
.module(MODULE_NAME, [])
.component('candidateStatusReport', candidateStatusReport)
.component('appType', appType)
.component('candidateOrganisation', candidateOrganisation)
.component('candidateRating', candidateRating)
.component('interviewByMonthReport', interviewByMonthReport)
.component('interviewActivityReport', interviewActivityReport)
.component('averageCompletionTime', averageCompletionTime)
.component('departmentwise', departmentwise)
.component('recruiterwiseReport', recruiterwiseReport)
.component('invitationTrackingChart', invitationTrackingChart);

export default MODULE_NAME;


