import angular from 'angular';

import {StarRating} from './star-rating.js';

const MODULE_NAME = 'candidateReviewDirectives';

angular
.module(MODULE_NAME, [])
.directive('starRating', () => new StarRating);

export default MODULE_NAME;
