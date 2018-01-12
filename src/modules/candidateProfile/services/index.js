import angular from 'angular';

import {mediaRecorderService} from './mediaRecorder';
import {volumeMeterService} from './volumeMeter';
import {AssessmentService} from './assessment-service';
import {candidateProfilePublicService} from './candidateProfilePublic--service';
import {coverLetterService} from './coverLetter--service';
import {multipleApplyService} from './multipleApply--service';
import {CertificationTemplateService} from './certificationTemplate--service';
import {appliedjobListService} from './appliedJobList--service';
import {jobOpeningsService} from './jobOpenings--service';
import {jobDescriptionService} from './jobDescription--service';
import {favouriteJobDescriptionService} from './favouriteJobDescription--service';
//moved to app level
//import {CandidateProfileService} from './candidateProfile--service';
import {candidateCreateProfileService} from './candidateCreateProfile--service';
import {candidateEditProfileService} from './candidateEditProfile--service';
import {interviewRequestService} from './interviewRequest--service';
import {PracticeVideoQuestionService} from './practiceVideoQuestion--service';
import {mailBoxService} from './mail-box--service.js';

const MODULE_NAME = 'candidateProfileServices';


 angular
.module(MODULE_NAME, [])
.service('mediaRecorderService', mediaRecorderService)
.service('volumeMeterService', volumeMeterService)
.service('AssessmentService', AssessmentService)
.service('candidateProfilePublicService', candidateProfilePublicService)
.service('coverLetterService', coverLetterService)
.service('multipleApplyService', multipleApplyService)
.service('CertificationTemplateService', CertificationTemplateService)
//.service('CandidateProfileService', CandidateProfileService)
.service('candidateCreateProfileService', candidateCreateProfileService)
.service('candidateEditProfileService', candidateEditProfileService)
.service('interviewRequestService', interviewRequestService)
.service('PracticeVideoQuestionService', PracticeVideoQuestionService)
.service('appliedJobListService', appliedjobListService)
.service('jobOpeningsService', jobOpeningsService)
.service('jobDescriptionService', jobDescriptionService)
.service('favouriteJobDescriptionService', favouriteJobDescriptionService)
.service('mailBoxService', mailBoxService);

export default MODULE_NAME;