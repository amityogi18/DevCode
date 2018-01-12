import angular from 'angular';

import {ConferenceController} from './conference--controller';
import {ConferenceScheduleController} from './conference-schedule--controller';
import {conferenceStartMeetController} from './conferenceStartMeet--controller';
import {conferenceMeetingController} from './conferenceMeeting--controller';
import {ConferenceWebrtcController} from './conference-webrtc--controller';
import {ParticipantController} from './participant--controller';
import {ChatController} from './chat--controller';
import {ConferenceHeadingController} from './conference-heading--controller';
import {ConferenceLoginController} from './conference-login--controller';
import {ConferencePrepareController} from './conference-prepare--controller';
import {ConferenceContactController} from './conference-contact--controller';
import {ConferenceDemoController} from './conference-demo--controller';
import {InterviewPrepareController} from './interview-prepare--controller';




const MODULE_NAME = 'conferenceControllers';

angular
    .module(MODULE_NAME, [])
    .controller('ConferenceController', ConferenceController)
    .controller('ConferenceScheduleController', ConferenceScheduleController)
    .controller('conferenceStartMeetController', conferenceStartMeetController)
    .controller('conferenceMeetingController', conferenceMeetingController)
    .controller('ConferenceWebrtcController', ConferenceWebrtcController)
    .controller('ParticipantController', ParticipantController)
    .controller('ChatController', ChatController)
    .controller('ConferenceHeadingController', ConferenceHeadingController)
    .controller('ConferenceLoginController', ConferenceLoginController)
    .controller('ConferencePrepareController', ConferencePrepareController)
    .controller('ConferenceContactController', ConferenceContactController)
    .controller('ConferenceDemoController', ConferenceDemoController)
    .controller('InterviewPrepareController', InterviewPrepareController);


export default MODULE_NAME;






