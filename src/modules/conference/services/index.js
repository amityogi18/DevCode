import angular from 'angular';

import {ConferenceService} from './conference--service.js';
import {ConferenceScheduleService} from './conference-schedule--service.js';
import {conferenceStartMeetService} from './conferenceStartMeet--service.js';
import {conferenceMeetingService} from './conferenceMeeting--service.js';
import {ConferenceWebrtcService} from './conference-webrtc--service.js';
import {ContactService} from './contact--service.js';
import {DemoService} from './demo--service.js';

const MODULE_NAME = 'conferenceServices';


 angular
    .module(MODULE_NAME, [])
    .service('ConferenceService', ConferenceService)
    .service('ConferenceScheduleService', ConferenceScheduleService)
    .service('conferenceStartMeetService', conferenceStartMeetService)
    .service('conferenceMeetingService', conferenceMeetingService)
    .service('ConferenceWebrtcService', ConferenceWebrtcService)
    .service('ContactService', ContactService)
    .service('DemoService', DemoService);



export default MODULE_NAME;


