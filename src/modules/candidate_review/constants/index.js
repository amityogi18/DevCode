import angular from 'angular';

import { addCandidatePopupModal } from './add-candidate-popup--constant';
import { evaluatorPopupModal } from './evaluator-popup--constant';
import { profilePopupModal } from './profile-popup--constant';
import { ratingPopupModal } from './rating-popup--constant';
import { addEvaluatorPopupModal } from './add-evaluator-popup--constant';

const MODULE_NAME = 'candidateReviewComponents';

angular
.module(MODULE_NAME, [])
.constant('addCandidatePopupModal', addCandidatePopupModal)
.constant('evaluatorPopupModal', evaluatorPopupModal)
.constant('profilePopupModalReview', profilePopupModal)
.constant('ratingPopupModalReview', ratingPopupModal)
.constant('addEvaluatorPopupModal', addEvaluatorPopupModal);

export default MODULE_NAME;
