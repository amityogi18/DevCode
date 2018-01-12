import angular from 'angular';

import {CandidateProfileController} from './candidateProfile--controller';
import {CertificationInstructionController} from './certificationInstruction--controller';
import {assessmentController} from './assessment--controller';
import {assessmentResultController} from './assessmentResult--controller';
import {assessmentConfirmSubmissionController} from './assessmentConfirmSubmission--controller';
import {assessmentTimeoutController} from './assessmentTimeout--controller';
import {testInstructionController} from './testInstruction--controller';
import {candidateProfilePublicController} from './candidateProfilePublic--controller';
import {warningModalController} from './warningModal--controller';
import {infoModalController} from './infoModal--controller';
import {addBackgroundMusicController} from './addBgMusicModal--controller';
import {coverLetterController} from './coverLetter--controller';
import {multipleApplyController} from './multipleApply--controller';
import {certificateTemplateController} from './certificateTemplate--controller';
import {manageProfileController} from './manageProfile--controller';
import {CandidateHomeController} from './candidateHome--controller';
import {interviewRequestController} from './interviewRequest--controller';
import {CertificateExitController} from './certificateExit--controller';
import {PracticeVideoController} from './practiceVideo--controller';
import {appliedJobListController} from './appliedJobList--controller';
import {jobOpeningsController} from './jobOpenings--controller';
import {jobDescriptionController} from './jobDescription--controller';
import {jobApplyController} from './jobApply--controller';
import {favouriteJobDescriptionController} from './favouriteJobDescription--controller';
import {mailBoxController} from './mail-box--controller.js';


const MODULE_NAME = 'candidateProfileControllers';

angular
.module(MODULE_NAME, [])
.controller('CandidateProfileController', CandidateProfileController)
.controller('CertificationInstructionController', CertificationInstructionController)
.controller('assessmentController', assessmentController)
.controller('assessmentResultController', assessmentResultController)
.controller('assessmentConfirmSubmissionController', assessmentConfirmSubmissionController)
.controller('assessmentTimeoutController', assessmentTimeoutController)
.controller('testInstructionController', testInstructionController)
.controller('candidateProfilePublicController', candidateProfilePublicController)
.controller('warningModalController', warningModalController)
.controller('infoModalController', infoModalController)
.controller('addBackgroundMusicController', addBackgroundMusicController)
.controller('coverLetterController', coverLetterController)
.controller('multipleApplyController', multipleApplyController)
.controller('certificateTemplateController', certificateTemplateController)
.controller('manageProfileController', manageProfileController)
.controller('CandidateHomeController', CandidateHomeController)
.controller('interviewRequestController', interviewRequestController)
.controller('CertificateExitController', CertificateExitController)
.controller('PracticeVideoController', PracticeVideoController)
.controller('appliedJobListController', appliedJobListController)
.controller('jobOpeningsController', jobOpeningsController)
.controller('jobApplyController', jobApplyController)
.controller('jobDescriptionController', jobDescriptionController)
.controller('favouriteJobDescriptionController', favouriteJobDescriptionController)
.controller('mailBoxController', mailBoxController);



export default MODULE_NAME;


