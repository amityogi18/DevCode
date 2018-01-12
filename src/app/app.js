
//import '../style/_styleCSS.scss';
//import '../style/application.scss';
//import './styles/index.scss';

//enable it only for development

import '../style/application.theme1.scss';

import 'jquery';
import angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-messages'
import 'oclazyload';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'bootstrap';
//import 'ng-table';
import 'ng-table/bundles/ng-table.min.js'
import 'ng-file-upload';
import uiselect from 'ui-select';
import 'angular-bootstrap-calendar';
import Chart from 'chart.js'
import 'angular-chart.js';
import moment from 'moment';
import 'angular-moment';
//import 'angular-typer';
//import 'angular-sanitize';
import 'textangular/dist/textAngular-sanitize';
import uiSelectModule from 'ui-select';
import 'textangular';
import 'angular-socialshare';
import 'angularjs-social-login';
import '../libs/typer';
//require ('../../bower_components/angular-ui-select/dist/select');
//import '../../node_modules/angular-ui-select/select';

//App 3rd party libs
//TODO:: Need to see depenendency of below files in Module so that we have to move on respective module in place of app level



//import '../libs/wow.min';
//import '../libs/edit-js';
//import '../libs/adapter';
//import '../libs/conference';
//import '../libs/EventEmitter';
//import '../libs/recording';
//import '../libs/hark';
import ngStorage from '../libs/storage.js';


//App files
import appConfig from './app.config';
import appRun from './app.run';
import {CONSTANTS, APP_CONSTANTS}  from './app.constants';


//App Modules
import mainModule from '../modules/main';


//global services
import analyticsServices from '../modules/analytics/services';
import positionServices from '../modules/position/services';

//import mediaRecorderService from '../modules/position/services/mediaRecorder';
//import {volumeMeterService} from '../modules/position/services/volumeMeter';
import {AdminDepartmentService} from '../modules/settings/services/admin-department--service.js';
import {CandidateProfileService} from '../modules/candidateProfile/services/candidateProfile--service';
import {InterviewService} from '../modules/position/services/interviews--service';

//routes
import analyticsRoute from '../modules/analytics/analytics.route';
import candidateInterviewRoute from '../modules/candidate_interview/candidateInterview.route';
import candidateReviewRoute from '../modules/candidate_review/candidateReview.route';
import candidateProfileRoute from '../modules/candidateProfile/candidateProfile.route';
import conferenceRoute from '../modules/conference/conference.route';
import dashboardRoute from '../modules/dashboard/dashboard.route';
import positionRoute from '../modules/position/position.route';
import settingsRoute from '../modules/settings/settings.route';
import signupRoute from '../modules/signup/signup.route';
import superAdminRoute from '../modules/super_admin/superadmin.route';




//App declaration
const app = angular.module('asm',
    [
        'ui.router',
        'ui.bootstrap',
         'ngTable',
        'pascalprecht.translate',
        'angularMoment',
        'ngFileUpload',
        uiSelectModule,
        'ui.select',
        'mwl.calendar',
        'chart.js',
        'typer',
        'ngSanitize',
        'oc.lazyLoad',
        'ngMaterial',
        'ngMessages',
        'ngStorage',
        'textAngular',
        '720kb.socialshare',
        'socialLogin',
        mainModule,
        analyticsServices,
        positionServices,
        
    ]);

export default app
    .config(appConfig)
    .run(appRun)
    .constant('Constants', CONSTANTS)
    .constant("APP_CONSTANTS", APP_CONSTANTS)
   // .service('mediaRecorderService', mediaRecorderService)
    //.service('volumeMeterService', volumeMeterService)
    .service('AdminDepartmentService', AdminDepartmentService)
    .service('CandidateProfileService', CandidateProfileService)
    .service('InterviewService', InterviewService)
    .config(analyticsRoute)
    .config(candidateInterviewRoute)
    .config(candidateReviewRoute)
    .config(candidateProfileRoute)
    .config(conferenceRoute)
    .config(dashboardRoute)
    .config(positionRoute)
    .config(settingsRoute)
    .config(signupRoute)
    .config(superAdminRoute)
    .config(function(socialProvider){
        socialProvider.setLinkedInKey("81or1zeer2fa44");
    });
