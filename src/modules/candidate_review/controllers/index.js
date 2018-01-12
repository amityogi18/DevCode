import angular from 'angular';

import {CandidateReviewController} from './candidate-review--controller';
import {EvaluatorPopupController} from './evaluator-popup--controller';
import {ProfilePopupController} from './profile-popup--controller';
import {RatingPopupController} from './rating-popup--controller';
import {AddCandidatePopupController} from './add-candidate-popup--controller';
import {CandidateCompareController} from './candidate-compare--controller';
import {AddEvaluatorPopupController} from './add-evaluator-popup--controller';
import {adminCandidateProfileController} from './admin-candidate-profile--controller';

const MODULE_NAME = 'candidateReviewControllers';

angular
.module(MODULE_NAME, [])
.controller('CandidateReviewController', CandidateReviewController)
.controller('EvaluatorPopupController', EvaluatorPopupController)
.controller('ProfilePopupController', ProfilePopupController)
.controller('RatingPopupController', RatingPopupController)
.controller('AddCandidatePopupController', AddCandidatePopupController)
.controller('CandidateCompareController', CandidateCompareController)
.controller('AddEvaluatorPopupController', AddEvaluatorPopupController)
.controller('adminCandidateProfileController', adminCandidateProfileController);

export default MODULE_NAME;
