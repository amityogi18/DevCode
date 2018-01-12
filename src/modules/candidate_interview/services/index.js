import angular from 'angular';

import {CandidateInterviewService} from './candidateInterview--service';
import {candidateQuestionService} from './candidateQuestion--service';
import {CandidateCertificateService} from './candidateCertificate--service';
import {PracticeTestQuestionService} from './practiceTestQuestion--service';


const MODULE_NAME = 'candidateInterviewServices';

 angular
.module(MODULE_NAME, [])
.service('CandidateInterviewService', CandidateInterviewService)
.service('candidateQuestionService', candidateQuestionService)
.service('CandidateCertificateService', CandidateCertificateService)
.service('PracticeTestQuestionService', PracticeTestQuestionService);

export default MODULE_NAME;