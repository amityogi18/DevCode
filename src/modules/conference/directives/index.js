import angular from 'angular';
import {ngDraggable} from './ngDraggable.js';
import {ngChat} from './ngChat.js';

const MODULE_NAME = 'conferenceDirectives';
angular
    .module(MODULE_NAME, [])

.directive('ngDraggable', ngDraggable)
.directive('ngChat', ngChat);

export default MODULE_NAME;