import angular from 'angular';

import {candidateReviewService} from './candidate-review--services'

const MODULE_NAME = 'candidateReviewServices';


angular
.module(MODULE_NAME, [])
.service('candidateReviewService',candidateReviewService);

export default MODULE_NAME;