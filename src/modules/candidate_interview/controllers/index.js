import angular from 'angular';

import {audioResponseQuestionController} from './audioResponseQuestion--controller';
import {candidateCertificateController} from './candidateCertificate--controller';
import {candidateCertificateInstructionController} from './candidateCertificateInstruction--controller';
import {candidateCertificateQuestionController} from './candidateCertificateQuestion--controller';
import {candidateInterviewController} from './candidateInterview--controller';
import {candidateInterviewInstructionController} from './candidateInterviewInstruction--controller';
import {CandidateInterviewPrepareController} from './candidateInterviewPrepare--controller';
import {candidateInterviewProfileController} from './candidateInterviewProfile--controller';
import {candidateInterviewQuestionController} from './candidateInterviewQuestion--controller';
import {candidateQuestionController} from './candidateQuestion--controller';
import {CandidateWelcomeVideoController} from './candidateWelcomeVideoController--controller';
import {ExitVideoController} from './exitVideo--controller';
import {multipleChoiceQuestionController} from './multipleChoiceQuestion--controller';
import {multipleSelectQuestionController} from './multipleSelectQuestion--controller';
import {PracticeTestQuestionController} from './practiceTestQuestion--controller';
import {TestQuestionInstructionController} from './testQuestionInstruction--controller';
import {textResponseQuestionController} from './textResponseQuestion--controller';
import {videoResponseQuestionController} from './videoResponseQuestion--controller';













const MODULE_NAME = 'candidateInterviewControllers';

angular
.module(MODULE_NAME, [])
.controller('candidateInterviewController', candidateInterviewController)
.controller('candidateQuestionController', candidateQuestionController)
.controller('textResponseQuestionController', textResponseQuestionController)
.controller('videoResponseQuestionController', videoResponseQuestionController)
.controller('audioResponseQuestionController', audioResponseQuestionController)
.controller('multipleChoiceQuestionController', multipleChoiceQuestionController)
.controller('multipleSelectQuestionController', multipleSelectQuestionController)
.controller('candidateCertificateController', candidateCertificateController)
.controller('candidateCertificateInstructionController', candidateCertificateInstructionController)
.controller('candidateCertificateQuestionController', candidateCertificateQuestionController)
.controller('candidateInterviewProfileController', candidateInterviewProfileController)
.controller('candidateInterviewQuestionController', candidateInterviewQuestionController)
.controller('candidateInterviewInstructionController', candidateInterviewInstructionController)
.controller('CandidateWelcomeVideoController', CandidateWelcomeVideoController)
.controller('ExitVideoController', ExitVideoController)
.controller('PracticeTestQuestionController', PracticeTestQuestionController)
.controller('TestQuestionInstructionController', TestQuestionInstructionController)
.controller('CandidateInterviewPrepareController', CandidateInterviewPrepareController);

export default MODULE_NAME;

